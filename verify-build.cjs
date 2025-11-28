#!/usr/bin/env node

/**
 * Build Verification Script
 * Verifies that the production build is correct and ready for deployment
 */

const fs = require('fs');
const path = require('path');

const DIST_DIR = path.join(__dirname, 'dist');
const MAX_BUNDLE_SIZE = 500 * 1024; // 500KB gzipped target
const MAX_CHUNK_SIZE = 200 * 1024; // 200KB per chunk

// ANSI color codes
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function formatBytes(bytes) {
  return `${(bytes / 1024).toFixed(2)} KB`;
}

function checkDistExists() {
  log('\n📦 Checking if dist directory exists...', 'cyan');
  if (!fs.existsSync(DIST_DIR)) {
    log('❌ dist directory not found. Run "npm run build" first.', 'red');
    return false;
  }
  log('✅ dist directory exists', 'green');
  return true;
}

function checkIndexHtml() {
  log('\n📄 Checking index.html...', 'cyan');
  const indexPath = path.join(DIST_DIR, 'index.html');
  
  if (!fs.existsSync(indexPath)) {
    log('❌ index.html not found', 'red');
    return false;
  }
  
  const content = fs.readFileSync(indexPath, 'utf-8');
  
  // Check for script tags
  if (!content.includes('<script')) {
    log('❌ No script tags found in index.html', 'red');
    return false;
  }
  
  // Check for CSS
  if (!content.includes('stylesheet') && !content.includes('<style')) {
    log('⚠️  No CSS found in index.html', 'yellow');
  }
  
  log('✅ index.html is valid', 'green');
  return true;
}

function checkAssets() {
  log('\n📁 Checking assets directory...', 'cyan');
  const assetsPath = path.join(DIST_DIR, 'assets');
  
  if (!fs.existsSync(assetsPath)) {
    log('❌ assets directory not found', 'red');
    return false;
  }
  
  const files = fs.readdirSync(assetsPath, { recursive: true });
  const jsFiles = files.filter(f => f.endsWith('.js'));
  const cssFiles = files.filter(f => f.endsWith('.css'));
  
  log(`   Found ${jsFiles.length} JavaScript files`, 'blue');
  log(`   Found ${cssFiles.length} CSS files`, 'blue');
  
  if (jsFiles.length === 0) {
    log('❌ No JavaScript files found', 'red');
    return false;
  }
  
  log('✅ Assets directory is valid', 'green');
  return true;
}

function analyzeBundleSize() {
  log('\n📊 Analyzing bundle sizes...', 'cyan');
  const assetsPath = path.join(DIST_DIR, 'assets');
  
  let totalSize = 0;
  let warnings = [];
  let errors = [];
  
  function getDirectorySize(dir) {
    const files = fs.readdirSync(dir, { withFileTypes: true });
    
    for (const file of files) {
      const filePath = path.join(dir, file.name);
      
      if (file.isDirectory()) {
        getDirectorySize(filePath);
      } else {
        const stats = fs.statSync(filePath);
        totalSize += stats.size;
        
        // Check individual file sizes
        if (file.name.endsWith('.js')) {
          if (stats.size > MAX_CHUNK_SIZE) {
            warnings.push(`   ⚠️  Large chunk: ${file.name} (${formatBytes(stats.size)})`);
          }
          log(`   ${file.name}: ${formatBytes(stats.size)}`, 'blue');
        }
      }
    }
  }
  
  getDirectorySize(assetsPath);
  
  log(`\n   Total bundle size: ${formatBytes(totalSize)}`, 'blue');
  
  // Note: This is uncompressed size, gzipped will be ~30% of this
  const estimatedGzipped = totalSize * 0.3;
  log(`   Estimated gzipped: ${formatBytes(estimatedGzipped)}`, 'blue');
  
  if (estimatedGzipped > MAX_BUNDLE_SIZE) {
    warnings.push(`   ⚠️  Bundle size exceeds target (${formatBytes(MAX_BUNDLE_SIZE)} gzipped)`);
  }
  
  if (warnings.length > 0) {
    log('\n⚠️  Warnings:', 'yellow');
    warnings.forEach(w => log(w, 'yellow'));
  }
  
  if (errors.length > 0) {
    log('\n❌ Errors:', 'red');
    errors.forEach(e => log(e, 'red'));
    return false;
  }
  
  log('✅ Bundle size analysis complete', 'green');
  return true;
}

function checkVendorChunks() {
  log('\n🔍 Checking vendor chunks...', 'cyan');
  const assetsPath = path.join(DIST_DIR, 'assets');
  
  const expectedChunks = [
    'react-vendor',
    'three-vendor',
    'ui-vendor',
  ];
  
  const files = fs.readdirSync(assetsPath, { recursive: true });
  const jsFiles = files.filter(f => f.endsWith('.js'));
  
  let foundChunks = [];
  
  for (const chunk of expectedChunks) {
    const found = jsFiles.some(f => f.includes(chunk));
    if (found) {
      log(`   ✅ Found ${chunk}`, 'green');
      foundChunks.push(chunk);
    } else {
      log(`   ⚠️  Missing ${chunk} (may be bundled differently)`, 'yellow');
    }
  }
  
  log(`\n   Found ${foundChunks.length}/${expectedChunks.length} expected vendor chunks`, 'blue');
  return true;
}

function checkSourceMaps() {
  log('\n🗺️  Checking source maps...', 'cyan');
  const assetsPath = path.join(DIST_DIR, 'assets');
  
  const files = fs.readdirSync(assetsPath, { recursive: true });
  const mapFiles = files.filter(f => f.endsWith('.map'));
  
  if (mapFiles.length === 0) {
    log('⚠️  No source maps found (debugging will be harder)', 'yellow');
  } else {
    log(`   Found ${mapFiles.length} source map files`, 'blue');
    log('✅ Source maps are present', 'green');
  }
  
  return true;
}

function checkEnvironmentConfig() {
  log('\n⚙️  Checking environment configuration...', 'cyan');
  
  const envExample = path.join(__dirname, '.env.example');
  const envProduction = path.join(__dirname, '.env.production');
  
  if (!fs.existsSync(envExample)) {
    log('⚠️  .env.example not found', 'yellow');
  } else {
    log('   ✅ .env.example exists', 'green');
  }
  
  if (!fs.existsSync(envProduction)) {
    log('⚠️  .env.production not found', 'yellow');
  } else {
    log('   ✅ .env.production exists', 'green');
  }
  
  return true;
}

function checkDeploymentConfigs() {
  log('\n🚀 Checking deployment configurations...', 'cyan');
  
  const configs = [
    { file: 'vercel.json', name: 'Vercel' },
    { file: 'netlify.toml', name: 'Netlify' },
  ];
  
  for (const config of configs) {
    const configPath = path.join(__dirname, config.file);
    if (fs.existsSync(configPath)) {
      log(`   ✅ ${config.name} config exists`, 'green');
    } else {
      log(`   ⚠️  ${config.name} config not found`, 'yellow');
    }
  }
  
  return true;
}

function printSummary(results) {
  log('\n' + '='.repeat(50), 'cyan');
  log('📋 BUILD VERIFICATION SUMMARY', 'cyan');
  log('='.repeat(50), 'cyan');
  
  const passed = results.filter(r => r.passed).length;
  const total = results.length;
  
  results.forEach(result => {
    const icon = result.passed ? '✅' : '❌';
    const color = result.passed ? 'green' : 'red';
    log(`${icon} ${result.name}`, color);
  });
  
  log('\n' + '='.repeat(50), 'cyan');
  log(`Result: ${passed}/${total} checks passed`, passed === total ? 'green' : 'red');
  log('='.repeat(50) + '\n', 'cyan');
  
  return passed === total;
}

// Main execution
async function main() {
  log('\n🔍 Starting build verification...', 'cyan');
  log('='.repeat(50) + '\n', 'cyan');
  
  const results = [
    { name: 'Dist directory exists', passed: checkDistExists() },
    { name: 'index.html is valid', passed: checkIndexHtml() },
    { name: 'Assets directory is valid', passed: checkAssets() },
    { name: 'Bundle size analysis', passed: analyzeBundleSize() },
    { name: 'Vendor chunks', passed: checkVendorChunks() },
    { name: 'Source maps', passed: checkSourceMaps() },
    { name: 'Environment config', passed: checkEnvironmentConfig() },
    { name: 'Deployment configs', passed: checkDeploymentConfigs() },
  ];
  
  const allPassed = printSummary(results);
  
  if (allPassed) {
    log('🎉 Build verification passed! Ready for deployment.', 'green');
    process.exit(0);
  } else {
    log('❌ Build verification failed. Please fix the issues above.', 'red');
    process.exit(1);
  }
}

main().catch(error => {
  log(`\n❌ Verification script error: ${error.message}`, 'red');
  process.exit(1);
});
