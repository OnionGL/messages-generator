// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');
const fs = require('fs');

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {


	const ru = 'ru'
	const en = 'en'
	const tr = 'tr'

	let disposable = vscode.commands.registerCommand('Messages-generator', function () {

		const keyForMessages = { prompt: 'Введите ключ для messages' }

		const prompts = [
            { prompt: `Введите значение messages.${ru}` },
            { prompt: `Введите значение messages.${en}` },
            { prompt: `Введите значение messages.${tr}` }
        ];

        const filePaths = [
            `messages.${ru}`,
            `messages.${en}`,
            `messages.${tr}`
        ];

		const findFiles = (name) => {
			return vscode.workspace.findFiles('**/' + name, '')
		}

		const addToFile = (path , content) => {
			fs.readFile(path, 'utf-8' , (err , data) => {
				if(err){
					vscode.window.showInformationMessage(`Ошибка: ${err}`);
				} else {
					try {
						let jsonData = data.split('=');
						if (jsonData.includes(content.split('=')[0])) {
							vscode.window.showInformationMessage(`Такой ключ существует`);
						} else {
							if(content) {
								fs.appendFile(path, content, (err) => {
									if (err) {
										vscode.window.showInformationMessage(`Ошибка: ${err}`);
									} else {
										vscode.window.showInformationMessage(`Messages успешно добавлено!`);
									}
								});
							} else {
								vscode.window.showInformationMessage(`Ошибка: Сообщение небыло прочитано`);
							}
						}
					} catch (error) {
						console.error('Error parsing JSON data:', error);
					}
				}
			})
		}

		vscode.window.showInputBox(keyForMessages).then(key => {
			const handleInputBox = (index , newKey) => {
				vscode.window.showInputBox(prompts[index]).then(messages => {
					const addMessages = `\n${newKey ? newKey : key}=${messages}`;
					findFiles(filePaths[index]).then(url => {
						if(addMessages){
							addToFile(url[0].fsPath , addMessages)
						}
					});
					if (index < prompts.length - 1) {
						handleInputBox(index + 1, key);
					}
				});
			};
			handleInputBox(0);
		})

	});


	context.subscriptions.push(disposable);
}

function deactivate() {}

module.exports = {
	activate,
	deactivate
}
