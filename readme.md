# Microservices Runner (VS Code Extension)

Start, Stop, and Restart all your microservices seamlessly via a single click using natively configurable VS Code terminals.

![Microservices Runner Buttons](https://raw.githubusercontent.com/your-repo/microservices-runner/main/assets/buttons.png)

## Features
- **Zero Hardcoded Paths**: Configure any service, any directory, and any shell command directly from your VS Code User Settings.
- **Dynamic Terminals**: Define customized scripts (e.g. `cmd.exe`, `wsl.exe`, `bash`, `pwsh`) and send sequential background commands (like activating a virtual environment and starting a server).
- **Status Bar Integration**: Provides three distinct buttons (`▶ Start`, `⏹ Stop`, `🔄 Restart`) directly on the VS Code status bar for quick interaction.
- **Hot Reloading Settings**: Changes to your microservices configuration apply instantly on the next "Start" without needing to reload the window.

## Installation

### 1. Build the `.vsix` package
Since this is a custom extension, you can package it using Docker (or natively if you have Node and `vsce` installed):

```bash
# In WSL or Linux, navigate to the extension folder:
cd /mnt/c/Users/miniOrange/Desktop/cursor-microservices

# Delete any old .vsix file if present
rm *.vsix

# Package using Docker
docker run --rm -v ${PWD}:/workspace -w /workspace node:20 bash -c "npm install -g vsce && vsce package"
```

### 2. Install the Extension
Once the `.vsix` file is generated, install it into your editor:

**For VS Code:**
```bash
code --install-extension microservices-runner-1.0.0.vsix
```

**For Cursor:**
```bash
cursor --install-extension microservices-runner-1.0.0.vsix
```

**For Antigravity:**
```bash
antigravity --install-extension microservices-runner-1.0.0.vsix
```
*(Make sure to provide the absolute path to the `.vsix` file if you are running this from another directory)*

---

## Configuration

To use the extension, you **must** configure your microservices in your `settings.json` (Workspace or Global User settings).

1. Open VS Code Settings (`Ctrl + ,` or `Cmd + ,`).
2. Click the specific **"Open Settings (JSON)"** icon at the top right.
3. Add your parent path (optional) and your `microservices.services` array:

### Example `settings.json` Configuration:

```json
{
  "microservices.parentPath": "C:\\Users\\miniOrange\\Projects\\MyCompany",
  "microservices.services": [
    {
      "name": "Backend API (Django)",
      "folder": "backend",
      "shellPath": "cmd.exe",
      "commands": [
        "call .\\venv\\Scripts\\activate.bat",
        "python manage.py runserver 0.0.0.0:8000"
      ]
    },
    {
      "name": "Frontend (React)",
      "folder": "frontend",
      "shellPath": "cmd.exe",
      "commands": [
        "npm start"
      ]
    },
    {
      "name": "Redis Container (WSL)",
      "shellPath": "wsl.exe",
      "commands": [
        "bash -ic 'sudo systemctl restart redis && docker start my-container; exec bash'"
      ]
    }
  ]
}
```

### Configuration Options
* `microservices.parentPath`: Absolute base path. If provided, relative `folder` definitions inside `services` will be resolved against this.
* `microservices.services`: Array of objects.
  * `name` (String): Display name of the terminal window.
  * `folder` (String): (Optional) Relative path to the app directory (resolves against `parentPath`). Can also be an absolute path.
  * `shellPath` (String): The shell executable to run (e.g. `cmd.exe`, `wsl.exe`, `pwsh.exe`, `/bin/bash`).
  * `commands` (Array of Strings): Commands to send into the terminal sequentially. The extension adds a small delay automatically to ensure scripts initialize properly (like activating a venv before spinning up `uvicorn`).

## Usage
Once configured, you will see three buttons on your bottom Status Bar:
- **▶ Start**: Reads your config and opens a terminal pane for each service, then runs exactly the commands you specified.
- **⏹ Stop**: Closes and garbage-collects all microservice terminals spawned by this extension.
- **🔄 Restart**: Stops all active services, then re-reads your latest `settings.json` configuration and starts them again. Useful when you update your environments.

Alternatively, you can trigger these actions from the Command Palette (`Ctrl + Shift + P` -> Search "Microservices: Start All").
