# PROMPTMAN

## Overview

Promptman is a Chrome extension designed to enhance your interaction with Claude AI (https://claude.ai). It provides features for monitoring conversations, saving chat content, managing prompts, and more.

## Features

1. **Conversation Monitoring**
   - Tracks the number of messages in a Claude conversation
   - Displays a badge on the extension icon showing the message count
   - Changes badge color based on conversation length (green, orange, red)

2. **Character Count**
   - Shows a real-time character count of the entire conversation
   - Displays as an overlay on the Claude interface

3. **Save Conversations**
   - Allows downloading the current conversation as a text file
   - Preserves conversation title and chat ID

4. **Prompt Management**
   - Create, edit, and delete custom prompts
   - Categorize prompts (Miscellaneous, Programming, Debate)
   - Export and import prompts as JSON files
   - Organize prompts in an accordion structure grouped by category

5. **Load Saved Conversations**
   - Open previously saved conversations in a new tab
   - Displays conversations with proper formatting and styling

## Installation

1. Download or clone this repository
2. Open Chrome and go to `chrome://extensions/`
3. Enable "Developer mode" in the top right corner
4. Click "Load unpacked" and select the directory containing the extension files

## Usage

- Click the extension icon to open the side panel
- Use the side panel to access various features:
  - Download current conversation
  - Manage prompts (create, edit, delete)
  - Import/export prompts
  - Load saved conversations
- The badge on the extension icon shows the current message count in your Claude conversation
- Press Ctrl+B (or Cmd+B on Mac) to quickly open the side panel

## File Structure

- `manifest.json`: Extension configuration
- `background.js`: Handles background tasks and communication between components
- `content.js`: Interacts with the Claude webpage, monitors conversations
- `sidebar.js`: Manages the extension's side panel functionality
- `conversation.js`: Handles display of saved conversations
- `storage.js`: Manages prompt storage operations (CRUD, import, export)
- `display.js`: Controls the display of prompts in the UI
- `form.js`: Handles form operations for adding and editing prompts

## Prompt Management

- **Create**: Add new prompts with title, description, content, and category
- **Read**: View prompts organized by category in an accordion structure
- **Update**: Edit existing prompts
- **Delete**: Remove individual prompts or all prompts
- **Import/Export**: Backup and restore prompts as JSON files

## Permissions

This extension requires permissions to access tabs, web requests, storage, and side panel. It also needs host permissions for https://claude.ai/*.

## TODO 

- [ ] Implement Light/Dark mode toggle for the extension interface
- [ ] Add support for multiple Claude conversations simultaneously
- [ ] Add support for icons with each prompt for better display
- [ ] Add a settings panel to show/hide various features
- [ ] Add keyboard shortcuts for common actions
- [ ] Implement a search function for saved prompts
- [ ] Create a user guide or documentation for advanced features
- [ ] Add support for multiple Claude conversations simultaneously
- [ ] Preserve code formating for saved conversations.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

If you encounter any issues or have questions, please open an issue on the GitHub repository.

---

Developed with ❤️ for Claude AI users