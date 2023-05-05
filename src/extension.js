const vscode = require('vscode');
const { searchPackages } = require('./api/packagist-api');
const { installPackage } = require('./functions/php/install');
async function searchPackagesCommand()
{
	const query = await vscode.window.showInputBox({ placeHolder: "Enter a package name to search for", ignoreFocusOut: true });
	if (!query)
	{
		return;
	}

	try
	{
		const packages = await searchPackages(query);

		const selectPackage = await vscode.window.showQuickPick(packages, { placeHolder: `Search results for ${query}` });

		if (selectPackage)
		{
			await installPackage(selectPackage.label);
			vscode.window.showInformationMessage(`You selected ${selectPackage.label}`)
		}
	} catch (error)
	{
		vscode.window.showErrorMessage(error.message);
	}

}

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context)
{
	console.log('Congratulations, your extension "php-periscope" is now active!');
	let disposable = vscode.commands.registerCommand('php-periscope.searchPackages', searchPackagesCommand);
	context.subscriptions.push(disposable);
}

function deactivate() { }

module.exports = {
	activate,
	deactivate
};