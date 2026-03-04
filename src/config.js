const vscode = require('vscode');

async function resolveParentPath() {
  const cfg = vscode.workspace.getConfiguration('microservices');
  let configured = cfg.get('parentPath') || '';
  const remember = cfg.get('rememberParentPath') || false;

  if (configured && configured.trim() !== '') return configured;

  const wf = vscode.workspace.workspaceFolders && vscode.workspace.workspaceFolders[0];
  if (wf && wf.uri && wf.uri.fsPath) return wf.uri.fsPath;

  const input = await vscode.window.showInputBox({
    prompt: 'Enter absolute path to parent folder that contains microservices (Optional)',
    placeHolder: 'e.g. C:\\Projects\\my-services or /home/user/my-services',
    ignoreFocusOut: true
  });

  if (!input) return null;
  const trimmed = input.trim();

  if (remember) {
    try {
      const target = vscode.workspace.workspaceFolders && vscode.workspace.workspaceFolders.length > 0
        ? vscode.ConfigurationTarget.Workspace
        : vscode.ConfigurationTarget.Global;
      await cfg.update('parentPath', trimmed, target);
      vscode.window.showInformationMessage(`Saved microservices.parentPath to ${target === vscode.ConfigurationTarget.Global ? 'global' : 'workspace'} settings.`);
    } catch (err) {
      console.error('Could not save setting', err);
    }
  }

  return trimmed;
}

function getServicesConfig() {
  const services = vscode.workspace.getConfiguration('microservices').get('services') || [];
  return services;
}

module.exports = {
  resolveParentPath,
  getServicesConfig
};
