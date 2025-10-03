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
  
  // Allow both the secret key and a special GitHub Actions key
  const isAuthorized = key === SECRET || key === process.env.GITHUB_SYNC_KEY;
  
  if (!key || !isAuthorized) {
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
  let errors = 0;
  const results: string[] = [];

  console.log(`Found ${puzzleFolders.length} puzzle folders:`, puzzleFolders);

  for (const folder of puzzleFolders) {
    const folderPath = path.join(PUZZLES_DIR, folder);
    const metaPath = path.join(folderPath, "meta.json");
    
    // Check if meta.json exists
    if (!fs.existsSync(metaPath)) {
      const msg = `Skipping ${folder}: no meta.json found`;
      console.log(msg);
      results.push(msg);
      errors++;
      continue;
    }

    // Read and parse meta.json
    let meta: PuzzleMeta;
    try {
      const metaContent = fs.readFileSync(metaPath, "utf-8");
      meta = JSON.parse(metaContent) as PuzzleMeta;
    } catch (error) {
      const msg = `Skipping ${folder}: invalid meta.json - ${error}`;
      console.log(msg);
      results.push(msg);
      errors++;
      continue;
    }

    // Pick date: prefer meta.date_utc; if absent and folder is ISO date, use folder
    const date_utc: string | null =
      (typeof meta.date_utc === "string" && isIsoDate(meta.date_utc)) ? meta.date_utc
      : (isIsoDate(folder) ? folder : null);

    if (!date_utc) {
      const msg = `Skipping ${folder}: no valid date found`;
      console.log(msg);
      results.push(msg);
      errors++;
      continue;
    }

    // Find a .zip file in this folder
    const files = fs.readdirSync(folderPath);
    const zipFile = files.find(f => f.toLowerCase().endsWith(".zip"));
    if (!zipFile) {
      const msg = `Skipping ${folder}: no .zip file found`;
      console.log(msg);
      results.push(msg);
      errors++;
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
        const msg = `Failed to upload ${storage_path}: ${uploadError.message}`;
        console.log(msg);
        results.push(msg);
        errors++;
        continue;
      }
      uploads++;
      results.push(`✅ Uploaded ${storage_path}`);
    } catch (error) {
      const msg = `Failed to read zip file ${zipPath}: ${error}`;
      console.log(msg);
      results.push(msg);
      errors++;
      continue;
    }

    // Compute answer based on mode
    const mode: "hash" | "regex" = (meta.answer_mode === "regex") ? "regex" : "hash";
    let answer_hash: string | null = null;
    let answer_regex: string | null = null;

    if (mode === "hash") {
      const plain = (meta.answer_plain ?? "").toString();
      if (!plain) {
        const msg = `Skipping ${folder}: no answer_plain for hash mode`;
        console.log(msg);
        results.push(msg);
        errors++;
        continue;
      }
      answer_hash = sha256(norm(plain));
    } else {
      if (!meta.answer_regex) {
        const msg = `Skipping ${folder}: no answer_regex for regex mode`;
        console.log(msg);
        results.push(msg);
        errors++;
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
      const msg = `Failed to upsert puzzle ${folder}: ${upErr.message}`;
      console.log(msg);
      results.push(msg);
      errors++;
    } else {
      upserts++;
      results.push(`✅ Upserted puzzle ${folder} (${meta.title})`);
    }
  }

  const summary = {
    ok: true,
    total: puzzleFolders.length,
    upserts,
    uploads,
    errors,
    results
  };

  console.log('Sync completed:', summary);
  return NextResponse.json(summary);
}
