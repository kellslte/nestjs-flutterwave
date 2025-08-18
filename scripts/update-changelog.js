#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Get the package.json path
const packageJsonPath = path.join(__dirname, '..', 'package.json');
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

// Get current version
const currentVersion = packageJson.version;

// Get the changelog path
const changelogPath = path.join(__dirname, '..', 'CHANGELOG.md');

// Read existing changelog
let changelogContent = '';
if (fs.existsSync(changelogPath)) {
  changelogContent = fs.readFileSync(changelogPath, 'utf8');
}

// Get commit messages since last tag
let commitMessages = '';
try {
  // Get the last tag
  const lastTag = execSync('git describe --tags --abbrev=0', { encoding: 'utf8' }).trim();
  // Get commit messages since last tag
  commitMessages = execSync(`git log ${lastTag}..HEAD --pretty=format:"%s"`, { encoding: 'utf8' });
} catch (error) {
  // If no tags exist, get all commit messages
  commitMessages = execSync('git log --pretty=format:"%s"', { encoding: 'utf8' });
}

// Parse commit messages and categorize them
const commitLines = commitMessages.split('\n').filter(line => line.trim());
const categorizedCommits = {
  features: [],
  fixes: [],
  breaking: [],
  docs: [],
  style: [],
  refactor: [],
  perf: [],
  test: [],
  chore: [],
  other: []
};

commitLines.forEach(commit => {
  const lowerCommit = commit.toLowerCase();
  
  if (lowerCommit.includes('breaking change') || lowerCommit.includes('!')) {
    categorizedCommits.breaking.push(commit);
  } else if (lowerCommit.startsWith('feat:') || lowerCommit.startsWith('feat(')) {
    categorizedCommits.features.push(commit);
  } else if (lowerCommit.startsWith('fix:') || lowerCommit.startsWith('fix(')) {
    categorizedCommits.fixes.push(commit);
  } else if (lowerCommit.startsWith('docs:') || lowerCommit.startsWith('docs(')) {
    categorizedCommits.docs.push(commit);
  } else if (lowerCommit.startsWith('style:') || lowerCommit.startsWith('style(')) {
    categorizedCommits.style.push(commit);
  } else if (lowerCommit.startsWith('refactor:') || lowerCommit.startsWith('refactor(')) {
    categorizedCommits.refactor.push(commit);
  } else if (lowerCommit.startsWith('perf:') || lowerCommit.startsWith('perf(')) {
    categorizedCommits.perf.push(commit);
  } else if (lowerCommit.startsWith('test:') || lowerCommit.startsWith('test(')) {
    categorizedCommits.test.push(commit);
  } else if (lowerCommit.startsWith('chore:') || lowerCommit.startsWith('chore(')) {
    categorizedCommits.chore.push(commit);
  } else {
    categorizedCommits.other.push(commit);
  }
});

// Generate changelog entry
const today = new Date().toISOString().split('T')[0];
let changelogEntry = `## [${currentVersion}] - ${today}\n\n`;

// Add breaking changes first
if (categorizedCommits.breaking.length > 0) {
  changelogEntry += '### ⚠️ BREAKING CHANGES\n\n';
  categorizedCommits.breaking.forEach(commit => {
    changelogEntry += `- ${commit}\n`;
  });
  changelogEntry += '\n';
}

// Add new features
if (categorizedCommits.features.length > 0) {
  changelogEntry += '### ✨ Features\n\n';
  categorizedCommits.features.forEach(commit => {
    changelogEntry += `- ${commit}\n`;
  });
  changelogEntry += '\n';
}

// Add bug fixes
if (categorizedCommits.fixes.length > 0) {
  changelogEntry += '### 🐛 Bug Fixes\n\n';
  categorizedCommits.fixes.forEach(commit => {
    changelogEntry += `- ${commit}\n`;
  });
  changelogEntry += '\n';
}

// Add other changes
const otherCategories = ['docs', 'style', 'refactor', 'perf', 'test', 'chore', 'other'];
otherCategories.forEach(category => {
  if (categorizedCommits[category].length > 0) {
    const categoryTitle = category.charAt(0).toUpperCase() + category.slice(1);
    changelogEntry += `### ${getCategoryEmoji(category)} ${categoryTitle}\n\n`;
    categorizedCommits[category].forEach(commit => {
      changelogEntry += `- ${commit}\n`;
    });
    changelogEntry += '\n';
  }
});

// Add commit count summary
const totalCommits = commitLines.length;
changelogEntry += `**Total Changes:** ${totalCommits} commits\n\n`;

// Add the new entry to the changelog
const newChangelogContent = changelogEntry + changelogContent;

// Write the updated changelog
fs.writeFileSync(changelogPath, newChangelogContent);

console.log(`Changelog updated for version ${currentVersion}`);
console.log(`\nChanges summary:`);
console.log(`- Breaking changes: ${categorizedCommits.breaking.length}`);
console.log(`- Features: ${categorizedCommits.features.length}`);
console.log(`- Bug fixes: ${categorizedCommits.fixes.length}`);
console.log(`- Other changes: ${otherCategories.reduce((sum, cat) => sum + categorizedCommits[cat].length, 0)}`);
console.log(`- Total commits: ${totalCommits}`);

function getCategoryEmoji(category) {
  const emojis = {
    docs: '📚',
    style: '💄',
    refactor: '♻️',
    perf: '⚡',
    test: '🧪',
    chore: '🔧',
    other: '📝'
  };
  return emojis[category] || '📝';
}
