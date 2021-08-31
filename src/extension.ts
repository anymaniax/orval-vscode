import orval from 'orval';
import { dirname, join, relative } from 'path';
import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
  const generate = vscode.commands.registerCommand(
    'extension.generate',
    async () => {
      vscode.workspace.workspaceFolders?.forEach(async (folder) => {
        const files = await vscode.workspace.findFiles('**/{orval.config.js}');
        const paths = files.map(({ path }) =>
          dirname(relative(folder.uri.path || '', path)),
        );

        if (paths.length === 1) {
          orval(join(folder.uri.path || '', paths[0], './orval.config.js'));
          return;
        }

        const item = await vscode.window.showQuickPick(paths, {
          placeHolder: 'select a orval config',
        });

        if (item) {
          orval(join(folder.uri.path || '', item, './orval.config.js'));
        }
      });
    },
  );

  const generateAll = vscode.commands.registerCommand(
    'extension.generateAll',
    () => {
      const files = vscode.workspace.findFiles('**/{orval.config.js}');

      files.then((uris) => {
        uris.forEach((uri) => {
          orval(uri.path);
        });
      });
    },
  );

  context.subscriptions.push(generate);
  context.subscriptions.push(generateAll);
}
