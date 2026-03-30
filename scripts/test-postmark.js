#!/usr/bin/env node

// Simple test script for Postmark email functionality
// Run with: node scripts/test-postmark.js

const POSTMARK_SERVER_TOKEN = process.env.POSTMARK_SERVER_TOKEN;
const MAIL_FROM = process.env.MAIL_FROM;
const TEST_EMAIL = process.env.TEST_EMAIL || 'test@example.com';

if (!POSTMARK_SERVER_TOKEN || !MAIL_FROM) {
  console.error('❌ Missing required environment variables:');
  console.error('   POSTMARK_SERVER_TOKEN:', POSTMARK_SERVER_TOKEN ? '✅' : '❌');
  console.error('   MAIL_FROM:', MAIL_FROM ? '✅' : '❌');
  process.exit(1);
}

async function testPostmark() {
  console.log('🧪 Testing Postmark email functionality...');
  console.log('   From:', MAIL_FROM);
  console.log('   To:', TEST_EMAIL);
  console.log('   Token:', POSTMARK_SERVER_TOKEN.substring(0, 8) + '...');
  
  try {
    const res = await fetch('https://api.postmarkapp.com/email', {
      method: 'POST',
      headers: {
        'X-Postmark-Server-Token': POSTMARK_SERVER_TOKEN,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        From: MAIL_FROM,
        To: TEST_EMAIL,
        Subject: 'Test from Allowance Guard',
        HtmlBody: '<p>Hello from Postmark ✅</p><p>This is a test email from Allowance Guard.</p>',
        MessageStream: 'outbound'
      })
    });

    if (!res.ok) {
      const error = await res.json().catch(() => ({}));
      console.error('❌ Postmark API error:', error.Message || `HTTP ${res.status}`);
      return false;
    }

    const result = await res.json();
    console.log('✅ Email sent successfully!');
    console.log('   Message ID:', result.MessageID);
    console.log('   Submitted at:', result.SubmittedAt);
    return true;
  } catch (error) {
    console.error('❌ Network error:', error.message);
    return false;
  }
}

testPostmark().then(success => {
  process.exit(success ? 0 : 1);
});
