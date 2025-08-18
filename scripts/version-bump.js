#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Get the package.json path
const packageJsonPath = path.join(__dirname, '..', 'package.json');
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

// Get current version
const currentVersion = packageJson.version;
const [major, minor, patch] = currentVersion.split('.').map(Number);

// Get commit messages since last tag
let commitMessages = '';
try {
  // Get the last tag
  const lastTag = execSync('git describe --tags --abbrev=0', { encoding: 'utf8' }).trim();
  // Get commit messages since last tag
  commitMessages = execSync(`git log ${lastTag}..HEAD --oneline`, { encoding: 'utf8' });
} catch (error) {
  // If no tags exist, get all commit messages
  commitMessages = execSync('git log --oneline', { encoding: 'utf8' });
}

// Analyze commit messages to determine version bump type
let bumpType = 'patch'; // default to patch

const commitLines = commitMessages.split('\n').filter(line => line.trim());
const hasBreakingChanges = commitLines.some(line => 
  line.includes('BREAKING CHANGE') || 
  line.includes('breaking change') ||
  line.includes('!') ||
  line.includes('feat!') ||
  line.includes('fix!')
);

const hasFeatures = commitLines.some(line => 
  line.includes('feat:') || 
  line.includes('feat(') ||
  line.includes('feature:')
);

if (hasBreakingChanges) {
  bumpType = 'major';
} else if (hasFeatures) {
  bumpType = 'minor';
}

// Calculate new version
let newMajor = major;
let newMinor = minor;
let newPatch = patch;

switch (bumpType) {
  case 'major':
    newMajor = major + 1;
    newMinor = 0;
    newPatch = 0;
    break;
  case 'minor':
    newMinor = minor + 1;
    newPatch = 0;
    break;
  case 'patch':
    newPatch = patch + 1;
    break;
}

const newVersion = `${newMajor}.${newMinor}.${newPatch}`;

// Update package.json
packageJson.version = newVersion;
fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2) + '\n');

console.log(`Version bumped from ${currentVersion} to ${newVersion} (${bumpType})`);
console.log(`\nCommit analysis:`);
console.log(`- Total commits: ${commitLines.length}`);
console.log(`- Breaking changes: ${hasBreakingChanges ? 'Yes' : 'No'}`);
console.log(`- New features: ${hasFeatures ? 'Yes' : 'No'}`);
console.log(`- Bump type: ${bumpType}`);

// Output the new version for use in other scripts
process.stdout.write(newVersion);
