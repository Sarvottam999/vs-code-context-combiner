# Context Combiner

A VS Code extension that allows you to easily select multiple files from your workspace and combine them into a single formatted output. Perfect for sharing code context with AI assistants, code reviews, or documentation.

## Features

✨ **Easy File Selection**
- Browse your workspace files in a tree structure
- Select multiple files with checkboxes
- Folders are collapsible and remember their state

📋 **Multiple Output Options**
- Copy combined content directly to clipboard
- Save as a `.txt` file in your workspace
- Real-time preview of combined content

🎯 **Smart File Filtering**
- Automatically excludes `node_modules`, `.git`, and other build folders
- Supports all text-based file formats
- Clean, organized file tree view

💾 **State Persistence**
- Remembers which folders you had expanded
- State persists when closing and reopening the panel

## Installation

### From VSIX File

1. Download the `.vsix` file
2. Open VS Code
3. Press `Ctrl+Shift+P` (or `Cmd+Shift+P` on Mac)
4. Type: `Extensions: Install from VSIX...`
5. Select the downloaded `.vsix` file
6. Reload VS Code when prompted

### From Source
```bash
# Clone or download the extension
cd context-combiner

# Install dependencies
npm install

# Package the extension
npm install -g @vscode/vsce
vsce package

# Install the generated .vsix file in VS Code
```

## Usage

### Basic Usage

1. **Open the Extension**
   - Click the Context Combiner icon in the Activity Bar (left sidebar)
   - Or use Command Palette: `View: Show Context Combiner`

2. **Select Files**
   - Browse through your project files
   - Click folders to expand/collapse them
   - Check the boxes next to files you want to include

3. **View Preview**
   - Selected files will appear in the preview pane below
   - See exactly what will be copied or saved

4. **Export**
   - Click **"📋 Copy Combined Content"** to copy to clipboard
   - Click **"💾 Save as .txt"** to save to your workspace

### Quick Actions

- **Select All** - Check all files at once
- **Deselect All** - Uncheck all files
- **Refresh** - Reload the file list

## Output Format

Combined files are formatted as:
```
--- path/to/file1.js ---
[file content]

--- path/to/file2.py ---
[file content]
```

This format is clear, readable, and works great with AI assistants like Claude, ChatGPT, etc.

## Use Cases

### 🤖 AI Assistance
Share multiple files with AI assistants for:
- Code reviews
- Bug analysis
- Feature implementation help
- Refactoring suggestions

### 📝 Documentation
- Create code examples for documentation
- Generate project overviews
- Share code snippets with team

### 🔍 Code Review
- Prepare code for review
- Share related files in one go
- Include context from multiple files

### 📊 Analysis
- Combine logs for analysis
- Gather configuration files
- Collect related code modules

## Supported File Types

The extension automatically detects text files including:

**Programming Languages:**
- JavaScript, TypeScript, Python, Java, C/C++, C#, PHP, Ruby, Go, Rust, Swift, Kotlin, Dart

**Web Development:**
- HTML, CSS, SCSS, SASS, Vue, Svelte, JSX, TSX

**Configuration & Data:**
- JSON, YAML, XML, TOML, INI, SQL

**Documentation:**
- Markdown, Text files

**And many more!**

## Configuration

Currently, the extension works out of the box with sensible defaults. The following folders are automatically excluded:

- `node_modules`
- `.git`
- `dist`
- `build`
- `.vscode`
- `out`

## Tips & Tricks

### 💡 Keyboard Navigation
- Use Tab to navigate between elements
- Space/Enter to toggle checkboxes

### 📁 Working with Large Projects
- Expand only the folders you need
- Use Select All for quick bulk operations
- The extension remembers your folder state

### 🎯 Best Practices
- Review the preview before copying/saving
- Use descriptive file selections for specific tasks
- Keep combined output under AI context limits

## Troubleshooting

### Extension not showing files?
- Make sure you have a folder/workspace open in VS Code
- Try clicking the refresh button
- Check if files exist outside excluded folders

### Folders not staying open?
- Make sure you're using the latest version
- The state persists within the same VS Code session

### Copy button disabled?
- Ensure at least one file is selected
- Wait for all files to load (check the preview info)

## Roadmap

Planned features for future releases:

- [ ] Search/filter files by name
- [ ] Custom output format templates
- [ ] Token/character count for AI limits
- [ ] Save selection presets
- [ ] Select entire folders with one click
- [ ] Custom exclude patterns
- [ ] Export to different formats (Markdown, JSON)

## Contributing

Found a bug or have a feature request? Feel free to:
- Open an issue
- Submit a pull request
- Share your feedback

## Release Notes

### 0.0.1 (Initial Release)

- ✨ Browse and select files from workspace
- 📋 Copy combined content to clipboard
- 💾 Save combined content as .txt file
- 🎯 Real-time preview
- 💾 Persistent folder state
- 🌳 Collapsible folder tree view
- 🔄 Refresh functionality

## License

MIT License - see LICENSE file for details

## Credits

Created with ❤️ for developers who work with AI assistants and need to share code context efficiently.

---

**Enjoy combining your code!** 🚀

If you find this extension helpful, consider sharing it with your team!