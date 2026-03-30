# AllowanceGuard Browser Extension

A lightweight browser extension that protects your wallet from risky token approvals by providing real-time risk assessment and warnings.

## Features

- 🛡️ **Real-time Protection**: Monitors token approval transactions as they happen
- ⚠️ **Risk Assessment**: Integrates with AllowanceGuard API for comprehensive risk analysis
- 🎯 **Smart Detection**: Identifies ERC-20 and ERC-721 approval transactions
- 💡 **User-friendly Warnings**: Clear, actionable warnings with risk explanations
- 📊 **Statistics**: Track scans and warnings in the extension popup
- 🔧 **Configurable**: Adjustable risk thresholds and settings

## Installation

### Development Installation

1. Clone the repository and navigate to the extension directory:
   ```bash
   cd extension
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Build the extension:
   ```bash
   npm run build
   ```

4. Load the extension in Chrome/Edge:
   - Open `chrome://extensions/` (or `edge://extensions/`)
   - Enable "Developer mode"
   - Click "Load unpacked"
   - Select the `dist` folder

### Production Installation

1. Download the latest release from the [releases page](https://github.com/EazyAccessEA/Allowance-guard/releases)
2. Extract the ZIP file
3. Follow the same loading process as development installation

## Usage

### Basic Usage

1. **Install the extension** following the installation steps above
2. **Connect your wallet** on any DeFi website
3. **Attempt token approvals** - the extension will automatically analyze them
4. **Review warnings** if risky approvals are detected
5. **Check statistics** in the extension popup

### Testing

Use the included test wallet demo to verify functionality:

1. Open `demo/test-wallet.html` in your browser
2. Click "Connect Test Wallet"
3. Try different transaction buttons to see various risk levels
4. Observe the extension's warning system in action

## Development

### Project Structure

```
extension/
├── manifest.json          # Extension manifest (Manifest v3)
├── src/
│   ├── content.js         # Content script for transaction monitoring
│   ├── background.js      # Service worker for API communication
│   └── popup.js          # Popup UI logic
├── popup.html            # Extension popup UI
├── icons/                # Extension icons
├── demo/
│   └── test-wallet.html  # Test wallet simulation
├── dist/                 # Built extension files
└── package.json          # Build configuration
```

### Build Commands

- `npm run build` - Build the extension for production
- `npm run dev` - Build and watch for changes
- `npm run package` - Create a ZIP file for distribution
- `npm run test` - Run extension tests
- `npm run lint` - Lint extension code

### API Integration

The extension integrates with the AllowanceGuard API for risk assessment:

- **Endpoint**: `https://www.allowanceguard.com/api/risk/assess`
- **Method**: POST
- **Payload**: Wallet address, token address, spender address, chain ID
- **Response**: Risk level, issues, recommendations

### Permissions

The extension requires minimal permissions:

- `activeTab` - Access to current tab for transaction monitoring
- `storage` - Store user settings and statistics
- `scripting` - Inject content scripts
- `host_permissions` - Access to AllowanceGuard API

## Security

### Privacy

- **No data collection**: The extension only sends transaction data to AllowanceGuard API
- **Local storage**: User settings and statistics stored locally
- **Minimal permissions**: Only requests necessary browser permissions

### Security Features

- **Content Security Policy**: Strict CSP to prevent code injection
- **Input validation**: All API inputs are validated
- **Error handling**: Graceful fallbacks for API failures
- **Rate limiting**: Built-in protection against API abuse

## Troubleshooting

### Common Issues

1. **Extension not detecting transactions**
   - Ensure the extension is enabled
   - Check that the website is using standard wallet connection methods
   - Verify the wallet is properly connected

2. **API errors**
   - Check internet connection
   - Verify AllowanceGuard API is accessible
   - Check browser console for detailed error messages

3. **Warnings not showing**
   - Ensure risk threshold is set appropriately
   - Check that the transaction is actually a token approval
   - Verify the extension has proper permissions

### Debug Mode

Enable debug logging by:

1. Open extension popup
2. Right-click and select "Inspect"
3. Check console for detailed logs
4. Use browser developer tools to inspect content script behavior

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

### Development Guidelines

- Follow existing code style
- Add comments for complex logic
- Test on multiple websites
- Ensure compatibility with major wallets
- Update documentation as needed

## License

This project is licensed under the GPL-3.0 License - see the [LICENSE](LICENSE) file for details.

## Support

- **Documentation**: [AllowanceGuard Docs](https://www.allowanceguard.com/docs)
- **Issues**: [GitHub Issues](https://github.com/EazyAccessEA/Allowance-guard/issues)
- **Discord**: [AllowanceGuard Community](https://discord.gg/allowanceguard)

## Changelog

### v1.0.0
- Initial release
- Basic transaction monitoring
- Risk assessment integration
- Warning UI system
- Test wallet demo
- Extension popup with statistics
