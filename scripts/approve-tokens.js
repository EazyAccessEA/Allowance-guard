#!/usr/bin/env node

/**
 * Script to approve pending token submissions
 * This would typically be run by an admin after reviewing submissions
 */

const { Pool } = require('pg');

async function approveTokens() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL
  });

  try {
    console.log('🔍 Checking for pending token submissions...');
    
    // Get pending submissions
    const pendingResult = await pool.query(`
      SELECT id, chain_id, token_address, name, symbol, submitted_by 
      FROM token_submissions 
      WHERE status = 'pending'
      ORDER BY created_at DESC
    `);
    
    if (pendingResult.rows.length === 0) {
      console.log('✅ No pending submissions found');
      return;
    }
    
    console.log(`Found ${pendingResult.rows.length} pending submissions:`);
    pendingResult.rows.forEach((row, index) => {
      console.log(`${index + 1}. ${row.name} (${row.symbol}) - ${row.submitted_by}`);
    });
    
    // Approve all pending submissions and move to token_metadata
    for (const submission of pendingResult.rows) {
      console.log(`\n🔄 Processing ${submission.name}...`);
      
      // Start transaction
      await pool.query('BEGIN');
      
      try {
        // Insert into token_metadata
        await pool.query(`
          INSERT INTO token_metadata (
            chain_id, token_address, name, symbol, decimals, standard, 
            description, website, logo_url, verified
          )
          SELECT 
            chain_id, token_address, name, symbol, decimals, standard,
            description, website, logo_url, true
          FROM token_submissions 
          WHERE id = $1
          ON CONFLICT (chain_id, token_address) DO NOTHING
        `, [submission.id]);
        
        // Update submission status
        await pool.query(`
          UPDATE token_submissions 
          SET status = 'approved', updated_at = NOW()
          WHERE id = $1
        `, [submission.id]);
        
        await pool.query('COMMIT');
        console.log(`✅ ${submission.name} approved and added to token_metadata`);
        
      } catch (error) {
        await pool.query('ROLLBACK');
        console.error(`❌ Error processing ${submission.name}:`, error.message);
      }
    }
    
    console.log('\n🎉 Token approval process completed!');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await pool.end();
  }
}

// Run the script
approveTokens().catch(console.error);
