#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logStep(step, message) {
  log(`\n${step}`, 'cyan');
  log(message, 'bright');
}

function logSuccess(message) {
  log(`✅ ${message}`, 'green');
}

function logError(message) {
  log(`❌ ${message}`, 'red');
}

function logWarning(message) {
  log(`⚠️  ${message}`, 'yellow');
}

function logInfo(message) {
  log(`ℹ️  ${message}`, 'blue');
}

// Check if we're in a git repository
function checkGitRepo() {
  try {
    execSync('git rev-parse --git-dir', { stdio: 'ignore' });
    return true;
  } catch (error) {
    return false;
  }
}

// Check if there are uncommitted changes
function checkUncommittedChanges() {
  try {
    const status = execSync('git status --porcelain', { encoding: 'utf8' });
    return status.trim() !== '';
  } catch (error) {
    return false;
  }
}

// Get current branch
function getCurrentBranch() {
  try {
    return execSync('git branch --show-current', { encoding: 'utf8' }).trim();
  } catch (error) {
    return 'main';
  }
}

// Main release function
async function release() {
  log('🚀 Flutterwave NestJS Package Release Script', 'magenta');
  log('==============================================', 'magenta');

  // Check prerequisites
  logStep('1. Checking Prerequisites', 'Verifying environment...');

  if (!checkGitRepo()) {
    logError('Not in a git repository. Please run this script from a git repository.');
    process.exit(1);
  }

  if (checkUncommittedChanges()) {
    logWarning('You have uncommitted changes. Please commit or stash them before releasing.');
    const answer = await askQuestion('Continue anyway? (y/N): ');
    if (answer.toLowerCase() !== 'y') {
      logInfo('Release cancelled.');
      process.exit(0);
    }
  }

  const currentBranch = getCurrentBranch();
  if (currentBranch !== 'main' && currentBranch !== 'master') {
    logWarning(`You're on branch '${currentBranch}'. Consider switching to main/master for releases.`);
    const answer = await askQuestion('Continue on this branch? (y/N): ');
    if (answer.toLowerCase() !== 'y') {
      logInfo('Release cancelled.');
      process.exit(0);
    }
  }

  logSuccess('Prerequisites check passed');

  // Get release type
  logStep('2. Release Type', 'Selecting release type...');
  
  const releaseType = process.argv[2];
  if (!releaseType || !['patch', 'minor', 'major', 'auto'].includes(releaseType)) {
    logError('Invalid release type. Use: patch, minor, major, or auto');
    logInfo('Usage: npm run release:patch, npm run release:minor, npm run release:major, or npm run release:auto');
    process.exit(1);
  }

  logInfo(`Release type: ${releaseType}`);

  // Version bump
  logStep('3. Version Bump', 'Updating package version...');
  
  try {
    let newVersion;
    if (releaseType === 'auto') {
      newVersion = execSync('node scripts/version-bump.js', { encoding: 'utf8' }).trim();
    } else {
      execSync(`npm version ${releaseType} --no-git-tag-version`, { stdio: 'inherit' });
      const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
      newVersion = packageJson.version;
    }
    
    logSuccess(`Version bumped to ${newVersion}`);
  } catch (error) {
    logError('Version bump failed');
    console.error(error);
    process.exit(1);
  }

  // Update changelog
  logStep('4. Changelog Update', 'Generating changelog...');
  
  try {
    execSync('node scripts/update-changelog.js', { stdio: 'inherit' });
    logSuccess('Changelog updated');
  } catch (error) {
    logError('Changelog update failed');
    console.error(error);
    process.exit(1);
  }

  // Build package
  logStep('5. Build Package', 'Building the package...');
  
  try {
    execSync('npm run build', { stdio: 'inherit' });
    logSuccess('Package built successfully');
  } catch (error) {
    logError('Build failed');
    console.error(error);
    process.exit(1);
  }

  // Run tests
  logStep('6. Run Tests', 'Running test suite...');
  
  try {
    execSync('npm test', { stdio: 'inherit' });
    logSuccess('All tests passed');
  } catch (error) {
    logError('Tests failed');
    console.error(error);
    process.exit(1);
  }

  // Git operations
  logStep('7. Git Operations', 'Committing and tagging...');
  
  try {
    // Add all changes
    execSync('git add .', { stdio: 'inherit' });
    
    // Get the new version
    const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    const newVersion = packageJson.version;
    
    // Commit
    execSync(`git commit -m "chore: release version ${newVersion}"`, { stdio: 'inherit' });
    
    // Tag
    execSync(`git tag -a v${newVersion} -m "Release version ${newVersion}"`, { stdio: 'inherit' });
    
    logSuccess('Changes committed and tagged');
  } catch (error) {
    logError('Git operations failed');
    console.error(error);
    process.exit(1);
  }

  // Final summary
  logStep('8. Release Summary', 'Release completed successfully!');
  
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  const newVersion = packageJson.version;
  
  logSuccess(`Version ${newVersion} has been released`);
  logInfo('Next steps:');
  logInfo('1. Push changes: git push origin main');
  logInfo('2. Push tags: git push origin --tags');
  logInfo('3. Publish to npm: npm publish');
  logInfo('4. Create GitHub release with the generated changelog');
  
  log('\n🎉 Release process completed successfully!', 'green');
}

// Helper function to ask questions (simplified for now)
function askQuestion(question) {
  // In a real implementation, you might want to use a library like 'readline' or 'inquirer'
  // For now, we'll just return 'N' to be safe
  return 'N';
}

// Run the release script
if (require.main === module) {
  release().catch(error => {
    logError('Release failed with error:');
    console.error(error);
    process.exit(1);
  });
}

module.exports = { release };
