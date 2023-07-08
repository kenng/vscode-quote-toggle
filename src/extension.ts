import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('quote-toggle.toggleQuote', () => {
		vscode.window.showInformationMessage('Hello World from Quote Toggle!');
		const editor = vscode.window.activeTextEditor;
		if (!editor) {
			return;
		}

		const selections = editor.selections;
		const document = editor.document;

		editor.edit((editBuilder) => {
			selections.forEach((selection) => {
				const range = getRange(document, selection);
				const selectedText = document.getText(range);
				const toggledText = toggleQuotes(selectedText);

				editBuilder.replace(range, toggledText);
			});
		});
	});

	context.subscriptions.push(disposable);
}

function getRange(document: vscode.TextDocument, selection: vscode.Selection): vscode.Range {
	const startChar = selection.start.character;
	const endChar = selection.end.character;
	const cursorLine = selection.active.line;
	const lineText = document.lineAt(cursorLine).text;

	let quoteStart = startChar;
	let quoteEnd = endChar;

	for (let i = startChar; i >= 0; i--) {
		if (lineText[i] === "'" || lineText[i] === '"') {
			quoteStart = i;
			break;
		}
	}

	for (let i = endChar; i < lineText.length; i++) {
		if (lineText[i] === "'" || lineText[i] === '"') {
			quoteEnd = i + 1;
			break;
		}
	}

	const range = new vscode.Range(
		new vscode.Position(cursorLine, quoteStart),
		new vscode.Position(cursorLine, quoteEnd));
	return range;
}

function toggleQuotes(text: string) {
	const singleQuoteRegex = /'/g;
	const doubleQuoteRegex = /"/g;

	if (singleQuoteRegex.test(text)) {
		return text.replace(singleQuoteRegex, '"');
	} else if (doubleQuoteRegex.test(text)) {
		return text.replace(doubleQuoteRegex, "'");
	} else {
		return text;
	}
}

export function deactivate() { }
