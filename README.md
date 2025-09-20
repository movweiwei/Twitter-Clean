# X Clean

A Chrome extension that cleans up the X/Twitter interface by hiding unwanted elements and providing customizable layout options.

## Features

### Hide Elements
- **Hide Grok**: Remove Grok AI assistant from the interface
- **Hide Premium Sign-up**: Remove premium subscription prompts
- **Hide Subscribe Message**: Remove subscription-related messages
- **Hide Verified Orgs**: Remove verified organization promotions
- **Hide Other**: Remove miscellaneous promotional elements

### Hide Navigation
- **Hide Explore**: Remove the Explore tab from navigation
- **Hide Notifications**: Remove the Notifications tab from navigation
- **Hide Messages**: Remove the Messages tab from navigation
- **Hide Communities**: Remove the Communities tab from navigation
- **Hide Bookmarks**: Remove the Bookmarks tab from navigation

### Hide Notices
- **Hide Muted Account Notices**: Remove notices about muted accounts
- **Hide Right Column**: Remove the entire right sidebar column

### Layout Settings
- **Larger Post Area**: Expand the main content area for better readability
- **Custom Width**: Set custom width for the main content area (400-1200px)
- **Right Sidebar Spacing**: Adjust padding for the right sidebar
- **Padding Width**: Customize the padding width (0-100px)

### Additional Features
- **Link Replacement**: Automatically convert copied x.com links to twitter.com links

## Installation

1. Download or clone this repository
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode" in the top right corner
4. Click "Load unpacked" and select the extension folder
5. The extension will be installed and ready to use

## Usage

1. Click the X Clean extension icon in your browser toolbar
2. Configure your preferences using the checkboxes and input fields
3. Click "Save" to apply your settings
4. Refresh any open X/Twitter tabs to see the changes

## Settings

The extension provides a comprehensive settings page accessible through:
- Right-click the extension icon → Options
- Or navigate to `chrome://extensions/` → X Clean → Extension options

### Settings Categories

1. **Hide Elements**: Control visibility of promotional and unwanted elements
2. **Hide Navigation**: Customize which navigation tabs are visible
3. **Hide Notices**: Remove various notification and notice elements
4. **Layout Settings**: Adjust the visual layout and spacing

## Permissions

The extension requires the following permissions:
- **Storage**: To save your preferences
- **Clipboard Write**: To modify copied links
- **Tabs**: To reload tabs after settings changes

## Host Permissions

The extension works on:
- `https://x.com/*`
- `https://twitter.com/*`

## Development

### Project Structure
```
x-clean/
├── manifest.json          # Extension manifest
├── content/
│   └── content.js         # Main content script
├── popup/
│   ├── popup.html         # Popup interface
│   ├── popup.css          # Popup styles
│   └── popup.js           # Popup functionality
├── options/
│   └── options.js         # Options page functionality
├── _locales/              # Internationalization
│   ├── en/               # English
│   ├── zh_TW/            # Traditional Chinese
│   ├── zh_CN/            # Simplified Chinese
│   └── ja/               # Japanese
└── icons/                # Extension icons
```

### Building

No build process required. The extension can be loaded directly as an unpacked extension.

## License

MIT

## Support

If you encounter any issues or have feature requests, please open an issue on the GitHub repository.

## Changelog

### Version 1.0.0
- Initial release
- Hide various X/Twitter elements
- Customizable layout options
- Multi-language support
- Link replacement functionality
