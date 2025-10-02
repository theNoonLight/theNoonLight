import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import crypto from "crypto";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import fs from "fs";
import path from "path";

const BUCKET = "puzzles";
const SECRET = process.env.SYNC_SECRET_KEY!;
const PUZZLES_DIR = path.join(process.cwd(), "puzzles");

const sha256 = (s:string) => crypto.createHash("sha256").update(s).digest("hex");
const norm = (s:string) => s.normalize("NFKC").trim().toLowerCase().replace(/\s+/g, " ");
const isIsoDate = (s:string) => /^\d{4}-\d{2}-\d{2}$/.test(s);

interface PuzzleMeta {
  date_utc?: string;
  title?: string;
  summary?: string;
  answer_mode?: "hash" | "regex";
  answer_plain?: string;
  answer_regex?: string;
  published?: boolean;
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const key = url.searchParams.get("key");
  if (!key || key !== SECRET) {
    return NextResponse.json({ ok:false, error:"unauthorized" }, { status: 401 });
  }

  const sAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  // Check if puzzles directory exists
  if (!fs.existsSync(PUZZLES_DIR)) {
    return NextResponse.json({ ok:false, error:"puzzles directory not found" }, { status: 404 });
  }

  // Read local puzzle folders
  const puzzleFolders = fs.readdirSync(PUZZLES_DIR, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name)
    .filter(name => !name.startsWith("."));

  let upserts = 0;
  let uploads = 0;

  for (const folder of puzzleFolders) {
    const folderPath = path.join(PUZZLES_DIR, folder);
    const metaPath = path.join(folderPath, "meta.json");
    
    // Check if meta.json exists
    if (!fs.existsSync(metaPath)) {
      console.log(`Skipping ${folder}: no meta.json found`);
      continue;
    }

    // Read and parse meta.json
    let meta: PuzzleMeta;
    try {
      const metaContent = fs.readFileSync(metaPath, "utf-8");
      meta = JSON.parse(metaContent) as PuzzleMeta;
    } catch {
      console.log(`Skipping ${folder}: invalid meta.json`);
      continue;
    }

    // Pick date: prefer meta.date_utc; if absent and folder is ISO date, use folder
    const date_utc: string | null =
      (typeof meta.date_utc === "string" && isIsoDate(meta.date_utc)) ? meta.date_utc
      : (isIsoDate(folder) ? folder : null);

    if (!date_utc) {
      console.log(`Skipping ${folder}: no valid date found`);
      continue;
    }

    // Find a .zip file in this folder
    const files = fs.readdirSync(folderPath);
    const zipFile = files.find(f => f.toLowerCase().endsWith(".zip"));
    if (!zipFile) {
      console.log(`Skipping ${folder}: no .zip file found`);
      continue;
    }

    const zipPath = path.join(folderPath, zipFile);
    const storage_path = `${folder}/${zipFile}`;

    // Upload zip file to Supabase storage
    try {
      const zipBuffer = fs.readFileSync(zipPath);
      const { error: uploadError } = await sAdmin.storage
        .from(BUCKET)
        .upload(storage_path, zipBuffer, {
          contentType: "application/zip",
          upsert: true
        });
      
      if (uploadError) {
        console.log(`Failed to upload ${storage_path}:`, uploadError.message);
        continue;
      }
      uploads++;
    } catch (error) {
      console.log(`Failed to read zip file ${zipPath}:`, error);
      continue;
    }

    // Compute answer based on mode
    const mode: "hash" | "regex" = (meta.answer_mode === "regex") ? "regex" : "hash";
    let answer_hash: string | null = null;
    let answer_regex: string | null = null;

    if (mode === "hash") {
      const plain = (meta.answer_plain ?? "").toString();
      if (!plain) {
        console.log(`Skipping ${folder}: no answer_plain for hash mode`);
        continue;
      }
      answer_hash = sha256(norm(plain));
    } else {
      if (!meta.answer_regex) {
        console.log(`Skipping ${folder}: no answer_regex for regex mode`);
        continue;
      }
      answer_regex = String(meta.answer_regex);
    }

    const payload = {
      date_utc,
      title: String(meta.title ?? "Untitled"),
      summary: meta.summary ? String(meta.summary) : null,
      storage_path,
      answer_mode: mode,
      answer_hash,
      answer_regex,
      published: Boolean(meta.published),
      // optional extras if you added columns later:
      // type: meta.type ?? null,
      // difficulty: meta.difficulty ?? null
    };

    const { error: upErr } = await supabaseAdmin
      .from("puzzles")
      .upsert(payload, { onConflict: "date_utc" });
    
    if (upErr) {
      console.log(`Failed to upsert puzzle ${folder}:`, upErr.message);
    } else {
      upserts++;
    }
  }

  return NextResponse.json({ ok:true, upserts, uploads });
}
