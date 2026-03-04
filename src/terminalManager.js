const vscode = require('vscode');
const fs = require('fs');
const path = require('path');
const { resolveParentPath, getServicesConfig } = require('./config');

let terminals = [];
let isRunning = false;

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function directoryExists(directoryPath) {
  if (!directoryPath) return false;
  try {
    return fs.existsSync(directoryPath) && fs.statSync(directoryPath).isDirectory();
  } catch (_) {
    return false;
  }
}

async function startServices(uiManager) {
  await vscode.window.withProgress({ location: vscode.ProgressLocation.Notification, title: 'Starting microservices...' }, async () => {
    const parent = await resolveParentPath();
    // Parent path might be null if user skipped it or didn't set it,
    // which is fine if services define their own absolute folders or don't need folders.
    const parentPathStr = parent ? parent.toString() : '';

    const services = getServicesConfig();

    if (!services || services.length === 0) {
      vscode.window.showWarningMessage('No microservices configured. Please add them in settings via "microservices.services".');
      return;
    }

    for (const svc of services) {
      // Resolve CWD
      let cwd = undefined;
      if (svc.folder) {
        if (path.isAbsolute(svc.folder)) {
          cwd = svc.folder;
        } else if (parentPathStr) {
          cwd = path.join(parentPathStr, svc.folder);
        }
      }

      if (cwd && !directoryExists(cwd)) {
        vscode.window.showWarningMessage(`Skipping ${svc.name || 'Unnamed'}: directory not found at ${cwd}`);
        continue;
      }

      const termOptions = { 
        name: svc.name || 'Microservice', 
        shellPath: svc.shellPath 
      };
      
      if (cwd) {
        termOptions.cwd = cwd;
      }

      let term;
      try {
        term = vscode.window.createTerminal(termOptions);
      } catch (e) {
        vscode.window.showWarningMessage(`Skipping terminal ${svc.name || 'Unnamed'}: ${e.message}`);
        continue;
      }

      term.show(true);
      if (svc.commands && Array.isArray(svc.commands)) {
        for (const command of svc.commands) {
          term.sendText(command, true);
          await sleep(150);
        }
      }

      terminals.push(term);
      await sleep(250);
    }

    isRunning = terminals.length > 0;
    
    if (isRunning) {
      vscode.window.showInformationMessage('Microservice terminals created.');
    } else {
      vscode.window.showInformationMessage('No microservice terminals were created (check configurations).');
    }
  });
}

function stopServices() {
  terminals.forEach(term => { try { term.dispose(); } catch (_) {} });
  terminals = [];
  isRunning = false;
  vscode.window.showInformationMessage("All microservices stopped.");
}

async function restartServices(uiManager) {
  stopServices();
  await sleep(500);
  await startServices(uiManager);
}

function handleTerminalClosed(terminal) {
  terminals = terminals.filter(t => t !== terminal);
  if (terminals.length === 0) {
    isRunning = false;
  }
}

function getIsRunning() {
  return isRunning;
}

module.exports = {
  startServices,
  stopServices,
  restartServices,
  handleTerminalClosed,
  getIsRunning
};
