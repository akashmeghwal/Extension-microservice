const vscode = require('vscode');
const { initUI } = require('./src/ui');
const { 
  startServices, 
  stopServices, 
  restartServices, 
  handleTerminalClosed 
} = require('./src/terminalManager');

function activate(context) {
  // Initialize Status bar buttons
  initUI(context);

  // Register commands
  context.subscriptions.push(vscode.commands.registerCommand('microservices.startAll', async () => {
    await startServices();
  }));

  context.subscriptions.push(vscode.commands.registerCommand('microservices.stopAll', () => {
    stopServices();
  }));

  context.subscriptions.push(vscode.commands.registerCommand('microservices.restartServices', async () => {
    await restartServices();
  }));

  // Handle manual terminal closes
  vscode.window.onDidCloseTerminal((terminal) => {
    handleTerminalClosed(terminal);
  });
}

function deactivate() {
  stopServices();
}

module.exports = { activate, deactivate };
