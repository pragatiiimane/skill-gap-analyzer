#!/usr/bin/env node

/**
 * Verify Project Setup
 * Checks if all requirements are met to run the project
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let error = false;

function check(condition, message) {
  const symbol = condition ? '✅' : '❌';
  console.log(`${symbol} ${message}`);
  if (!condition) error = true;
  return condition;
}

function checkFile(filePath, message) {
  const fullPath = path.join(__dirname, filePath);
  const exists = fs.existsSync(fullPath);
  check(exists, message);
  return exists;
}

console.log('\n========================================');
console.log('  Project Setup Verification');
console.log('========================================\n');

// Check Node.js version
try {
  const nodeVersion = execSync('node --version', { encoding: 'utf-8' }).trim();
  const majorVersion = parseInt(nodeVersion.slice(1).split('.')[0]);
  check(majorVersion >= 18, `Node.js version ${nodeVersion} (requires 18+)`);
} catch (err) {
  check(false, 'Node.js not installed');
}

// Check npm
try {
  const npmVersion = execSync('npm --version', { encoding: 'utf-8' }).trim();
  check(true, `npm version ${npmVersion}`);
} catch (err) {
  check(false, 'npm not installed');
}

console.log('\n--- Required Files ---');
checkFile('package.json', 'package.json exists');
checkFile('.env', '.env file configured');
checkFile('vite.config.ts', 'Vite configuration exists');
checkFile('tsconfig.json', 'TypeScript configuration exists');

console.log('\n--- VS Code Configuration ---');
checkFile('.vscode/launch.json', 'Debug configuration available');
checkFile('.vscode/tasks.json', 'Tasks configured');
checkFile('.vscode/settings.json', 'Editor settings configured');

console.log('\n--- Dependencies ---');
const nodeModulesExists = checkFile('node_modules', 'node_modules installed');

if (nodeModulesExists) {
  try {
    const pkg = JSON.parse(fs.readFileSync(path.join(__dirname, 'package.json'), 'utf-8'));
    const devDeps = Object.keys(pkg.devDependencies || {}).length;
    const deps = Object.keys(pkg.dependencies || {}).length;
    check(true, `${deps} production + ${devDeps} development dependencies`);
  } catch (err) {
    check(false, 'Failed to read dependencies');
  }
}

console.log('\n--- NPM Scripts ---');
try {
  const pkg = JSON.parse(fs.readFileSync(path.join(__dirname, 'package.json'), 'utf-8'));
  const scripts = Object.keys(pkg.scripts || {});
  check(scripts.includes('dev'), 'npm run dev (development server)');
  check(scripts.includes('build'), 'npm run build (production build)');
  check(scripts.includes('test'), 'npm test (unit tests)');
  check(scripts.includes('lint'), 'npm run lint (linting)');
} catch (err) {
  check(false, 'Failed to read npm scripts');
}

console.log('\n========================================');

if (error) {
  console.log('\n⚠️  Some checks failed. Run: npm install\n');
  process.exit(1);
} else {
  console.log('\n✨ All checks passed! Ready to code.\n');
  console.log('Quick start:\n');
  console.log('  npm run dev          Start development server');
  console.log('  npm run build        Build for production');
  console.log('  npm test             Run tests\n');
  process.exit(0);
}
