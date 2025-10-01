# Donation System Setup Guide

## Overview
The Allowance Guard donation system is now configured with your Ethereum address and ENS name.

## Configuration Details

### ✅ Current Configuration
- **Donation Address**: `0xD434Bfa9cbD22281709d58872dAeb0Badcf17614`
- **ENS Name**: `allowanceguard.eth`
- **Tip Flow**: Enabled
- **Status**: ✅ Configured and tested

### 🔧 Environment Variables Required

#### Required Variables
```bash
NEXT_PUBLIC_DONATION_ADDRESS=0xD434Bfa9cbD22281709d58872dAeb0Badcf17614
```

#### Optional Variables
```bash
NEXT_PUBLIC_DONATION_ENS=allowanceguard.eth
NEXT_PUBLIC_ENABLE_TIP_FLOW=true
NEXT_PUBLIC_DONATION_LINK_GITCOIN=https://gitcoin.co/grants/your-grant
NEXT_PUBLIC_DONATION_LINK_GIVETH=https://giveth.io/project/your-project
```

## 🚀 Deployment Steps

### 1. Production Environment
Add the environment variables to your hosting platform:

**Vercel:**
```bash
vercel env add NEXT_PUBLIC_DONATION_ADDRESS
# Enter: 0xD434Bfa9cbD22281709d58872dAeb0Badcf17614
```

**Netlify:**
- Go to Site Settings → Environment Variables
- Add `NEXT_PUBLIC_DONATION_ADDRESS` = `0xD434Bfa9cbD22281709d58872dAeb0Badcf17614`

**Railway:**
- Go to Variables tab
- Add `NEXT_PUBLIC_DONATION_ADDRESS` = `0xD434Bfa9cbD22281709d58872dAeb0Badcf17614`

### 2. Verify Configuration
After deployment, visit: https://www.allowanceguard.com/donate

**Expected Result:**
- ✅ Professional donation interface
- ✅ Preset amounts (0.001, 0.005, 0.01, 0.05 ETH)
- ✅ Custom amount input
- ✅ Wallet connection integration
- ✅ ENS support for allowanceguard.eth

## 🎯 Features Enabled

### Donation Interface
- **Preset Amounts**: 0.001, 0.005, 0.01, 0.05 ETH
- **Custom Amounts**: User-defined donation amounts
- **Wallet Integration**: Connect wallet to send donations
- **Transaction Tracking**: Real-time transaction status

### ENS Support
- **Primary Name**: allowanceguard.eth
- **Address Resolution**: Automatically resolves to your donation address
- **Professional Branding**: Clean, memorable donation address

### Tip Flow Integration
- **Batch Revoke Tips**: Optional tips during bulk operations
- **User Preferences**: Remember tip settings
- **Analytics**: Track donation patterns

## 🔒 Security Considerations

1. **Address Verification**: Double-check the donation address is correct
2. **Test First**: Send a small test donation to verify
3. **Monitor**: Set up alerts for incoming donations
4. **Backup**: Ensure you have access to the donation wallet

## 📊 Analytics

The donation system includes built-in analytics:
- Donation frequency and amounts
- User engagement metrics
- Transaction success rates
- Tip flow usage statistics

## 🆘 Troubleshooting

### "Donation System Not Configured"
- Check that `NEXT_PUBLIC_DONATION_ADDRESS` is set
- Verify the address format is correct (42 characters, starts with 0x)
- Restart the application after adding environment variables

### Invalid Address Format
- Ensure the address is exactly 42 characters
- Must start with "0x"
- Use checksummed format if possible

### ENS Not Resolving
- Verify `allowanceguard.eth` points to your address
- Check ENS resolver configuration
- Allow time for DNS propagation

## 📞 Support

If you encounter issues:
1. Check the browser console for errors
2. Verify environment variables are set correctly
3. Test with a small donation amount first
4. Contact support with specific error messages

---

**Status**: ✅ Configured and ready for production deployment
**Last Updated**: $(date)
