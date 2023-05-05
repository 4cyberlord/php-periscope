const vscode = require('vscode');
const { platform } = require('process');
const { getComposerJsonPath } = require('./utils');

async function installPackage(packageName)
{
  const workspaceFolders = vscode.workspace.workspaceFolders;

  if (!workspaceFolders || workspaceFolders.length === 0)
  {
    throw new Error('No workspace folder found.');
  }

  // Check if composer.json exists and create one with the required permissions
  const composerJsonPath = getComposerJsonPath(workspaceFolders[0].uri.fsPath);
  try
  {
    await vscode.workspace.fs.stat(vscode.Uri.file(composerJsonPath));
  } catch (error)
  {
    await vscode.workspace.fs.writeFile(vscode.Uri.file(composerJsonPath), Buffer.from('{}'), {
      create: true,
      mode: 0o600,
      hideFromUser: true,
    });
  }

  const command = platform === 'win32' ? `composer require ${packageName}` : `composer require ${packageName}`;

  const options = { cwd: workspaceFolders[0].uri.fsPath };
  const shellExecution = new vscode.ShellExecution(command, options);

  const taskDefinition = {
    type: 'shell',
    command: command,
    options: options,
    problemMatcher: [],
  };
  const task = new vscode.Task(taskDefinition, vscode.TaskScope.Workspace, 'Install Package', 'php-periscope', shellExecution);
  await vscode.tasks.executeTask(task);
}

module.exports = {
  installPackage
};
