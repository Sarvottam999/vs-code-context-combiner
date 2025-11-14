// Main extension file for Context Combiner
const vscode = require('vscode');
const fs = require('fs');
const path = require('path');

/**
 * Activates the extension when VS Code loads it
 */
function activate(context) {
    console.log('Context Combiner extension is now active');
    console.log('Extension URI:', context.extensionUri.toString());

    // Register the webview provider for our sidebar
    const provider = new ContextCombinerViewProvider(context.extensionUri);
    
    context.subscriptions.push(
        vscode.window.registerWebviewViewProvider('contextCombiner', provider)
    );

    // Register refresh command
    context.subscriptions.push(
        vscode.commands.registerCommand('context-combiner.refresh', () => {
            provider.refresh();
        })
    );
}

/**
 * Provider class that manages the webview sidebar
 */
class ContextCombinerViewProvider {
    constructor(extensionUri) {
        this._extensionUri = extensionUri;
        this._view = undefined;
    }

    /**
     * Called when the view is first shown or after being hidden
     */
    resolveWebviewView(webviewView, context, _token) {
        console.log('resolveWebviewView called - webview is being created');

        this._view = webviewView;

        // Configure webview settings
        webviewView.webview.options = {
            enableScripts: true, // Allow JavaScript in webview
            localResourceRoots: [this._extensionUri]
        };

        // Set the HTML content for the webview
        webviewView.webview.html = this._getHtmlForWebview(webviewView.webview);

        // Handle messages from the webview
        webviewView.webview.onDidReceiveMessage(async (data) => {
            console.log('Received message from webview:', data.type);
            switch (data.type) {
                case 'getFiles':
                    // Request to get all workspace files
                    await this._sendFileList();
                    break;
                case 'readFile':
                    // Request to read a specific file's content
                    await this._readFile(data.path);
                    break;
                case 'saveFile':
                    // Request to save combined content to a file
                    await this._saveFile(data.content);
                    break;
                case 'copyToClipboard':
                    // Copy content to clipboard
                    await vscode.env.clipboard.writeText(data.content);
                    vscode.window.showInformationMessage('Content copied to clipboard!');
                    break;
            }
        });

        // Send initial file list when view loads
        this._sendFileList();
    }

    /**
     * Refresh the file list
     */
    refresh() {
        this._sendFileList();
    }

    /**
     * Get all files in the workspace and send to webview
     */
    async _sendFileList() {
        console.log('_sendFileList called');
        if (!this._view) {
            console.log('No view available');
            return;
        }

        const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
        if (!workspaceFolder) {
            console.log('No workspace folder found');
            this._view.webview.postMessage({ 
                type: 'fileList', 
                files: [] 
            });
            return;
        }

        try {
            // Find all files, excluding common ignore patterns
            const files = await vscode.workspace.findFiles(
                '**/*', // Include all files
                '{**/node_modules/**,**/.git/**,**/dist/**,**/build/**,**/.vscode/**,**/out/**}' // Exclude patterns
            );
            console.log(`Found ${files.length} files`);

            // Convert URIs to relative paths and filter text files
            const fileList = files
                .map(uri => {
                    const relativePath = vscode.workspace.asRelativePath(uri);
                    return {
                        path: relativePath,
                        fullPath: uri.fsPath
                    };
                })
                .filter(file => this._isTextFile(file.path));

            // Send file list to webview
            this._view.webview.postMessage({ 
                type: 'fileList', 
                files: fileList 
            });
        } catch (error) {
            console.error('Error getting file list:', error);
            vscode.window.showErrorMessage('Failed to load files: ' + error.message);
        }
    }

    /**
     * Check if file is a text file (based on extension)
     */
    _isTextFile(filePath) {
        const textExtensions = [
            '.js', '.jsx', '.ts', '.tsx', '.json', '.html', '.css', '.scss', '.sass',
            '.md', '.txt', '.py', '.java', '.c', '.cpp', '.h', '.cs', '.php', '.rb',
            '.go', '.rs', '.swift', '.kt', '.dart', '.vue', '.svelte', '.xml', '.yaml',
            '.yml', '.toml', '.ini', '.cfg', '.conf', '.sh', '.bash', '.sql', '.r',
            '.m', '.scala', '.clj', '.ex', '.exs', '.erl', '.hs', '.lua', '.pl', '.pm'
        ];
        
        const ext = path.extname(filePath).toLowerCase();
        return textExtensions.includes(ext) || !ext; // Include files with no extension
    }

    /**
     * Read a specific file and send its content to webview
     */
    async _readFile(relativePath) {
        if (!this._view) return;

        try {
            const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
            if (!workspaceFolder) return;

            const fullPath = path.join(workspaceFolder.uri.fsPath, relativePath);
            const content = fs.readFileSync(fullPath, 'utf8');

            this._view.webview.postMessage({
                type: 'fileContent',
                path: relativePath,
                content: content
            });
        } catch (error) {
            console.error('Error reading file:', error);
            this._view.webview.postMessage({
                type: 'fileContent',
                path: relativePath,
                content: `[Error reading file: ${error.message}]`
            });
        }
    }

    /**
     * Save combined content to a file in workspace root
     */
    async _saveFile(content) {
        try {
            const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
            if (!workspaceFolder) {
                vscode.window.showErrorMessage('No workspace folder open');
                return;
            }

            // Generate filename with timestamp
            const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
            const fileName = `context_${timestamp}.txt`;
            const filePath = path.join(workspaceFolder.uri.fsPath, fileName);

            // Write file
            fs.writeFileSync(filePath, content, 'utf8');

            // Open the file in editor
            const doc = await vscode.workspace.openTextDocument(filePath);
            await vscode.window.showTextDocument(doc);

            vscode.window.showInformationMessage(`Saved to ${fileName}`);
        } catch (error) {
            console.error('Error saving file:', error);
            vscode.window.showErrorMessage('Failed to save file: ' + error.message);
        }
    }

    /**
     * Generate HTML content for the webview
     */
    _getHtmlForWebview(webview) {
        // Read the HTML file from disk
        const htmlPath = path.join(__dirname, 'webview.html');
        let html = fs.readFileSync(htmlPath, 'utf8');

        // Add CSP (Content Security Policy) for security
        const nonce = this._getNonce();
        html = html.replace('{{CSP_NONCE}}', nonce);

        return html;
    }

    /**
     * Generate a random nonce for CSP
     */
    _getNonce() {
        let text = '';
        const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        for (let i = 0; i < 32; i++) {
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        }
        return text;
    }
}

/**
 * Called when extension is deactivated
 */
function deactivate() {}

module.exports = {
    activate,
    deactivate
};