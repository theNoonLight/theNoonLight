#!/usr/bin/env node

/**
 * Build-time puzzle sync script
 * This runs during Vercel deployment to ensure puzzles are synced
 */

const { createClient } = require('@supabase/supabase-js');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

const BUCKET = "puzzles";
const PUZZLES_DIR = path.join(process.cwd(), "puzzles");

const sha256 = (s) => crypto.createHash("sha256").update(s).digest("hex");
const norm = (s) => s.normalize("NFKC").trim().toLowerCase().replace(/\s+/g, " ");
const isIsoDate = (s) => /^\d{4}-\d{2}-\d{2}$/.test(s);

async function syncPuzzles() {
  console.log('🔄 Starting puzzle sync...');
  
  // Debug environment variables
  console.log('Environment check:');
  console.log('- NEXT_PUBLIC_SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL ? 'Set' : 'Missing');
  console.log('- SUPABASE_SERVICE_ROLE_KEY:', process.env.SUPABASE_SERVICE_ROLE_KEY ? 'Set' : 'Missing');
  
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.error('❌ Missing required environment variables');
    process.exit(1);
  }
  
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );

  // Check if puzzles directory exists
  if (!fs.existsSync(PUZZLES_DIR)) {
    console.log('❌ No puzzles directory found');
    return;
  }

  // Read local puzzle folders
  const puzzleFolders = fs.readdirSync(PUZZLES_DIR, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name)
    .filter(name => !name.startsWith("."));

  if (puzzleFolders.length === 0) {
    console.log('ℹ️ No puzzle folders found');
    return;
  }

  console.log(`📁 Found ${puzzleFolders.length} puzzle folders`);

  let upserts = 0;
  let uploads = 0;
  const errors = [];

  for (const folder of puzzleFolders) {
    console.log(`\n📦 Processing ${folder}...`);
    
    const folderPath = path.join(PUZZLES_DIR, folder);
    const metaPath = path.join(folderPath, "meta.json");
    
    // Check if meta.json exists
    if (!fs.existsSync(metaPath)) {
      errors.push(`Skipping ${folder}: no meta.json found`);
      continue;
    }

    // Read and parse meta.json
    let meta;
    try {
      const metaContent = fs.readFileSync(metaPath, "utf-8");
      meta = JSON.parse(metaContent);
    } catch (error) {
      errors.push(`Skipping ${folder}: invalid meta.json - ${error.message}`);
      continue;
    }

    // Pick date: prefer meta.date_utc; if absent and folder is ISO date, use folder
    const date_utc =
      (typeof meta.date_utc === "string" && isIsoDate(meta.date_utc)) ? meta.date_utc
      : (isIsoDate(folder) ? folder : null);

    if (!date_utc) {
      errors.push(`Skipping ${folder}: no valid date found`);
      continue;
    }

    // Find a .zip file in this folder
    const files = fs.readdirSync(folderPath);
    const zipFile = files.find(f => f.toLowerCase().endsWith(".zip"));
    if (!zipFile) {
      errors.push(`Skipping ${folder}: no .zip file found`);
      continue;
    }

    const zipPath = path.join(folderPath, zipFile);
    const storage_path = `${folder}/${zipFile}`;

      // Upload zip file to Supabase storage
      try {
        console.log(`  📤 Uploading ${zipFile}...`);
        const zipBuffer = fs.readFileSync(zipPath);
        console.log(`  📦 File size: ${zipBuffer.length} bytes`);
        console.log(`  📍 Storage path: ${storage_path}`);
        
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from(BUCKET)
          .upload(storage_path, zipBuffer, {
            contentType: "application/zip",
            upsert: true
          });
        
        if (uploadError) {
          console.error(`  ❌ Upload error:`, uploadError);
          errors.push(`Failed to upload ${storage_path}: ${uploadError.message}`);
          continue;
        }
        uploads++;
        console.log(`  ✅ Uploaded ${zipFile} - Data:`, uploadData);
      } catch (error) {
        console.error(`  ❌ Upload exception:`, error);
        errors.push(`Failed to read zip file ${zipPath}: ${error.message}`);
        continue;
      }

    // Compute answer based on mode
    const mode = (meta.answer_mode === "regex") ? "regex" : "hash";
    let answer_hash = null;
    let answer_regex = null;

    if (mode === "hash") {
      const plain = (meta.answer_plain ?? "").toString();
      if (!plain) {
        errors.push(`Skipping ${folder}: no answer_plain for hash mode`);
        continue;
      }
      answer_hash = sha256(norm(plain));
    } else {
      if (!meta.answer_regex) {
        errors.push(`Skipping ${folder}: no answer_regex for regex mode`);
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
    };

      console.log(`  💾 Upserting puzzle data...`);
      console.log(`  📋 Payload:`, JSON.stringify(payload, null, 2));
      
      const { data: upsertData, error: upErr } = await supabase
        .from("puzzles")
        .upsert(payload, { onConflict: "date_utc" });
      
      if (upErr) {
        console.error(`  ❌ Upsert error:`, upErr);
        errors.push(`Failed to upsert puzzle ${folder}: ${upErr.message}`);
      } else {
        upserts++;
        console.log(`  ✅ Synced puzzle data - Result:`, upsertData);
      }
  }

  console.log(`\n🎉 Sync complete!`);
  console.log(`📊 Results: ${upserts} puzzles upserted, ${uploads} files uploaded`);
  
  if (errors.length > 0) {
    console.log(`\n⚠️ Errors encountered:`);
    errors.forEach(error => console.log(`  - ${error}`));
  }
}

// Run the sync
syncPuzzles().catch(console.error);
