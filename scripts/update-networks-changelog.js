#!/usr/bin/env node

/**
 * Monthly Networks Changelog Update Script
 * 
 * This script helps maintain the networks roadmap by:
 * 1. Validating current data structure
 * 2. Providing a template for adding new networks
 * 3. Updating metadata timestamps
 * 
 * Usage: node scripts/update-networks-changelog.js
 */

const fs = require('fs');
const path = require('path');

const DATA_FILE = path.join(__dirname, '..', 'data', 'networks.json');

function readNetworksData() {
  try {
    const raw = fs.readFileSync(DATA_FILE, 'utf8');
    return JSON.parse(raw);
  } catch (error) {
    console.error('❌ Failed to read networks data:', error.message);
    process.exit(1);
  }
}

function writeNetworksData(data) {
  try {
    const formatted = JSON.stringify(data, null, 2);
    fs.writeFileSync(DATA_FILE, formatted, 'utf8');
    console.log('✅ Networks data updated successfully');
  } catch (error) {
    console.error('❌ Failed to write networks data:', error.message);
    process.exit(1);
  }
}

function updateMetadata(data) {
  const now = new Date();
  const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, now.getDate());
  
  data.metadata = {
    ...data.metadata,
    lastUpdated: now.toISOString().split('T')[0], // YYYY-MM-DD format
    nextReview: nextMonth.toISOString().split('T')[0]
  };
  
  return data;
}

function addChangelogEntry(data, newNetworks, version, notes) {
  const now = new Date();
  const newEntry = {
    date: now.toISOString().split('T')[0],
    added: newNetworks,
    notes: notes || `Added support for ${newNetworks.length} new network(s)`,
    version: version
  };
  
  // Add to beginning of changelog (most recent first)
  data.changelog.unshift(newEntry);
  
  // Keep only last 10 entries
  data.changelog = data.changelog.slice(0, 10);
  
  return data;
}

function validateDataStructure(data) {
  const required = ['supported', 'planned', 'changelog', 'metadata'];
  const missing = required.filter(field => !data[field]);
  
  if (missing.length > 0) {
    console.error('❌ Missing required fields:', missing.join(', '));
    return false;
  }
  
  console.log('✅ Data structure validation passed');
  return true;
}

function main() {
  console.log('🔄 Updating Networks Changelog...\n');
  
  // Read current data
  const data = readNetworksData();
  console.log('📖 Current data loaded');
  
  // Validate structure
  if (!validateDataStructure(data)) {
    process.exit(1);
  }
  
  // Update metadata
  const updatedData = updateMetadata(data);
  console.log('📅 Metadata updated');
  
  // Check for command line arguments for new networks
  const args = process.argv.slice(2);
  if (args.length >= 2) {
    const chainIds = args[0].split(',').map(id => parseInt(id.trim()));
    const version = args[1];
    const notes = args[2] || `Added support for networks: ${chainIds.join(', ')}`;
    
    console.log(`➕ Adding new networks: ${chainIds.join(', ')}`);
    console.log(`📝 Version: ${version}`);
    console.log(`📄 Notes: ${notes}`);
    
    addChangelogEntry(updatedData, chainIds, version, notes);
  } else {
    console.log('ℹ️  No new networks specified. Use: node scripts/update-networks-changelog.js "chainId1,chainId2" "version" "notes"');
  }
  
  // Write updated data
  writeNetworksData(updatedData);
  
  console.log('\n✅ Changelog update completed!');
  console.log(`📊 Supported networks: ${updatedData.supported.length}`);
  console.log(`📅 Planned networks: ${updatedData.planned.length}`);
  console.log(`📝 Changelog entries: ${updatedData.changelog.length}`);
  console.log(`🕒 Last updated: ${updatedData.metadata.lastUpdated}`);
  console.log(`⏭️  Next review: ${updatedData.metadata.nextReview}`);
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = {
  readNetworksData,
  writeNetworksData,
  updateMetadata,
  addChangelogEntry,
  validateDataStructure
};
