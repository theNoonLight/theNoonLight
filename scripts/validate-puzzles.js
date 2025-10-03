#!/usr/bin/env node

/**
 * Puzzle validation script
 * Validates that all puzzles have the correct structure
 */

const fs = require('fs');
const path = require('path');

const PUZZLES_DIR = path.join(process.cwd(), "puzzles");

function validatePuzzles() {
  console.log('🔍 Validating puzzle structure...\n');
  
  if (!fs.existsSync(PUZZLES_DIR)) {
    console.log('❌ No puzzles directory found');
    return false;
  }

  const puzzleFolders = fs.readdirSync(PUZZLES_DIR, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name)
    .filter(name => !name.startsWith("."));

  if (puzzleFolders.length === 0) {
    console.log('ℹ️ No puzzle folders found');
    return true;
  }

  let validPuzzles = 0;
  const errors = [];

  for (const folder of puzzleFolders) {
    console.log(`📁 Checking ${folder}...`);
    
    const folderPath = path.join(PUZZLES_DIR, folder);
    const metaPath = path.join(folderPath, "meta.json");
    
    // Check meta.json exists
    if (!fs.existsSync(metaPath)) {
      errors.push(`${folder}: Missing meta.json`);
      continue;
    }

    // Check meta.json is valid JSON
    let meta;
    try {
      const metaContent = fs.readFileSync(metaPath, "utf-8");
      meta = JSON.parse(metaContent);
    } catch (error) {
      errors.push(`${folder}: Invalid meta.json - ${error.message}`);
      continue;
    }

    // Check required fields
    const requiredFields = ['title', 'answer_mode'];
    const missingFields = requiredFields.filter(field => !meta[field]);
    
    if (missingFields.length > 0) {
      errors.push(`${folder}: Missing required fields: ${missingFields.join(', ')}`);
      continue;
    }

    // Check answer mode specific fields
    if (meta.answer_mode === 'hash' && !meta.answer_plain) {
      errors.push(`${folder}: Missing answer_plain for hash mode`);
      continue;
    }
    
    if (meta.answer_mode === 'regex' && !meta.answer_regex) {
      errors.push(`${folder}: Missing answer_regex for regex mode`);
      continue;
    }

    // Check for zip file
    const files = fs.readdirSync(folderPath);
    const zipFile = files.find(f => f.toLowerCase().endsWith(".zip"));
    if (!zipFile) {
      errors.push(`${folder}: No .zip file found`);
      continue;
    }

    // Check zip file is not empty
    const zipPath = path.join(folderPath, zipFile);
    const stats = fs.statSync(zipPath);
    if (stats.size === 0) {
      errors.push(`${folder}: ${zipFile} is empty`);
      continue;
    }

    validPuzzles++;
    console.log(`  ✅ Valid (${zipFile}, ${stats.size} bytes)`);
  }

  console.log(`\n📊 Validation Results:`);
  console.log(`  ✅ Valid puzzles: ${validPuzzles}`);
  console.log(`  ❌ Errors: ${errors.length}`);

  if (errors.length > 0) {
    console.log(`\n⚠️ Issues found:`);
    errors.forEach(error => console.log(`  - ${error}`));
    return false;
  }

  console.log(`\n🎉 All puzzles are valid!`);
  return true;
}

// Run validation
const isValid = validatePuzzles();
process.exit(isValid ? 0 : 1);
