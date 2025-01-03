const vscode = require('vscode');

let customCommand = ""; // Variável para armazenar o comando personalizado

function activate(context) {
	// Carrega o comando salvo do estado do workspace
	customCommand = context.workspaceState.get('customCommand', '');

	// Comando para executar o comando no terminal
	let executeCommand = vscode.commands.registerCommand('buttoncmd.runCommand', () => {
		if (!customCommand) {
			vscode.window.showWarningMessage("Nenhum comando foi definido. Use 'Definir Comando' primeiro.");
			return;
		}

		const terminal = vscode.window.createTerminal("Custom Command");
		terminal.show();
		terminal.sendText(customCommand);
		terminal.sendText("exit"); // Adiciona o comando para fechar o terminal após a execução
	});

	// Comando para definir o comando
	let setCommand = vscode.commands.registerCommand('buttoncmd.setCommand', async () => {
		const input = await vscode.window.showInputBox({
			placeHolder: "Digite o comando que deseja executar",
			prompt: "Por exemplo: npm run start",
		});

		if (input) {
			customCommand = input;
			context.workspaceState.update('customCommand', customCommand);
			vscode.window.showInformationMessage(`Comando definido: ${customCommand}`);
		} else {
			vscode.window.showWarningMessage("Nenhum comando foi definido.");
		}
	});

	// Adiciona os comandos às subscriptions
	context.subscriptions.push(executeCommand, setCommand);
}

function deactivate() { }

module.exports = {
	activate,
	deactivate
};
