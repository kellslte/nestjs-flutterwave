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

// Check if files are staged
function getStagedFiles() {
  try {
    const output = execSync('git diff --cached --name-only --diff-filter=ACM', { encoding: 'utf8' });
    return output.split('\n').filter(file => file.trim() && file.endsWith('.ts'));
  } catch (error) {
    return [];
  }
}

// Run linting
function runLinting() {
  logStep('1. Linting', 'Running ESLint...');
  
  try {
    execSync('npm run lint', { stdio: 'inherit' });
    logSuccess('Linting passed');
    return true;
  } catch (error) {
    logError('Linting failed. Please fix the issues before committing.');
    return false;
  }
}

// Run formatting check
function runFormattingCheck() {
  logStep('2. Formatting', 'Checking code formatting...');
  
  try {
    // Check if files are properly formatted
    execSync('npx prettier --check "src/**/*.ts" "test/**/*.ts"', { stdio: 'inherit' });
    logSuccess('Code formatting is correct');
    return true;
  } catch (error) {
    logWarning('Code formatting issues detected. Running auto-format...');
    
    try {
      execSync('npm run format', { stdio: 'inherit' });
      
      // Check if formatting is now correct
      execSync('npx prettier --check "src/**/*.ts" "test/**/*.ts"', { stdio: 'inherit' });
      logSuccess('Code auto-formatted successfully');
      
      // Add the formatted files to staging
      const stagedFiles = getStagedFiles();
      if (stagedFiles.length > 0) {
        execSync(`git add ${stagedFiles.join(' ')}`, { stdio: 'inherit' });
        logInfo('Formatted files added to staging');
      }
      
      return true;
    } catch (formatError) {
      logError('Auto-formatting failed. Please format manually.');
      return false;
    }
  }
}

// Run type checking
function runTypeCheck() {
  logStep('3. Type Checking', 'Running TypeScript compiler...');
  
  try {
    execSync('npx tsc --noEmit', { stdio: 'inherit' });
    logSuccess('Type checking passed');
    return true;
  } catch (error) {
    logError('Type checking failed. Please fix the type errors before committing.');
    return false;
  }
}

// Run tests (only if test files are staged)
function runTests() {
  const stagedFiles = getStagedFiles();
  const hasTestFiles = stagedFiles.some(file => file.includes('test/') || file.includes('.spec.'));
  
  if (hasTestFiles) {
    logStep('4. Testing', 'Running tests for staged changes...');
    
    try {
      execSync('npm test', { stdio: 'inherit' });
      logSuccess('Tests passed');
      return true;
    } catch (error) {
      logError('Tests failed. Please fix the failing tests before committing.');
      return false;
    }
  } else {
    logStep('4. Testing', 'No test files staged, skipping tests...');
    logInfo('No test files in staged changes');
    return true;
  }
}

// Main pre-commit function
function preCommit() {
  log('🔍 Flutterwave NestJS Package Pre-commit Hook', 'magenta');
  log('==============================================', 'magenta');

  let allChecksPassed = true;

  // Run all checks
  allChecksPassed = runLinting() && allChecksPassed;
  allChecksPassed = runFormattingCheck() && allChecksPassed;
  allChecksPassed = runTypeCheck() && allChecksPassed;
  allChecksPassed = runTests() && allChecksPassed;

  // Final result
  if (allChecksPassed) {
    log('\n🎉 All pre-commit checks passed!', 'green');
    log('You can now commit your changes.', 'green');
    process.exit(0);
  } else {
    log('\n❌ Some pre-commit checks failed!', 'red');
    log('Please fix the issues above before committing.', 'red');
    log('You can run individual checks manually:', 'yellow');
    log('  npm run lint     - Run linting', 'yellow');
    log('  npm run format   - Format code', 'yellow');
    log('  npm run test     - Run tests', 'yellow');
    process.exit(1);
  }
}

// Run the pre-commit hook
if (require.main === module) {
  preCommit();
}

module.exports = { preCommit };
