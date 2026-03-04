const vscode = require('vscode');

let startStatusBarItem;
let stopStatusBarItem;
let restartStatusBarItem;

function initUI(context) {
  // Start Button
  startStatusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 100);
  startStatusBarItem.text = "$(play) Start";
  startStatusBarItem.tooltip = "Start all microservices";
  startStatusBarItem.command = "microservices.startAll";
  startStatusBarItem.show();
  context.subscriptions.push(startStatusBarItem);

  // Stop Button
  stopStatusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 99);
  stopStatusBarItem.text = "$(stop) Stop";
  stopStatusBarItem.tooltip = "Stop all microservices";
  stopStatusBarItem.command = "microservices.stopAll";
  stopStatusBarItem.show();
  context.subscriptions.push(stopStatusBarItem);

  // Restart Button
  restartStatusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 98);
  restartStatusBarItem.text = "$(sync) Restart";
  restartStatusBarItem.tooltip = "Restart all microservices";
  restartStatusBarItem.command = "microservices.restartServices";
  restartStatusBarItem.show();
  context.subscriptions.push(restartStatusBarItem);
}

module.exports = {
  initUI
};
