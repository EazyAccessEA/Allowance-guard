#!/usr/bin/env tsx

// Test script for Microsoft SMTP configuration
import { testSMTPConnection, sendMail } from '../src/lib/mailer'

// Load environment variables from .env.local
// Note: Next.js automatically loads .env.local, but for standalone scripts we need to handle it
const fs = require('fs')
const path = require('path')

// Simple env loader for .env.local
function loadEnvFile() {
  const envPath = path.join(__dirname, '..', '.env.local')
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8')
    envContent.split('\n').forEach((line: string) => {
      const [key, ...valueParts] = line.split('=')
      if (key && valueParts.length > 0) {
        const value = valueParts.join('=').trim()
        if (!process.env[key]) {
          process.env[key] = value
        }
      }
    })
  }
}

loadEnvFile()

async function testSMTP() {
  console.log('🧪 Testing Microsoft SMTP Configuration...\n')
  
  // Check environment variables
  console.log('📋 Environment Variables:')
  console.log(`SMTP_HOST: ${process.env.SMTP_HOST || 'Not set'}`)
  console.log(`SMTP_PORT: ${process.env.SMTP_PORT || 'Not set'}`)
  console.log(`SMTP_USER: ${process.env.SMTP_USER || 'Not set'}`)
  console.log(`SMTP_PASS: ${process.env.SMTP_PASS ? '***' + process.env.SMTP_PASS.slice(-4) : 'Not set'}`)
  console.log(`ALERTS_FROM_EMAIL: ${process.env.ALERTS_FROM_EMAIL || 'Not set'}`)
  console.log(`ALERTS_FROM_NAME: ${process.env.ALERTS_FROM_NAME || 'Not set'}\n`)
  
  // Test connection
  console.log('🔌 Testing SMTP Connection...')
  const connectionSuccess = await testSMTPConnection()
  
  if (!connectionSuccess) {
    console.log('❌ SMTP connection failed. Please check your configuration.')
    process.exit(1)
  }
  
  // Test sending email
  console.log('\n📧 Testing Email Send...')
  try {
    const testEmail = process.env.ALERTS_FROM_EMAIL || 'test@example.com'
    
    await sendMail(
      testEmail,
      'Allowance Guard SMTP Test',
      `
        <h1>🎉 SMTP Test Successful!</h1>
        <p>Your Microsoft SMTP configuration is working correctly.</p>
        <p><strong>Configuration Details:</strong></p>
        <ul>
          <li>Host: ${process.env.SMTP_HOST}</li>
          <li>Port: ${process.env.SMTP_PORT}</li>
          <li>User: ${process.env.SMTP_USER}</li>
          <li>From: ${process.env.ALERTS_FROM_EMAIL}</li>
        </ul>
        <p>This email was sent from your Allowance Guard application.</p>
      `,
      'Allowance Guard SMTP Test - Your Microsoft SMTP configuration is working correctly!'
    )
    
    console.log('✅ Test email sent successfully!')
    console.log(`📬 Check your inbox at: ${testEmail}`)
    
  } catch (error) {
    console.error('❌ Email send failed:', error)
    process.exit(1)
  }
  
  console.log('\n🎉 All tests passed! Your SMTP configuration is ready.')
}

// Run the test
testSMTP().catch(console.error)
