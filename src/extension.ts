import orval from 'orval';
import { dirname, join, relative } from 'path';
import * as vscode from 'vscode';
import { window } from 'vscode';

export function activate(context: vscode.ExtensionContext) {
  const generate = vscode.commands.registerCommand(
    'extension.generate',
    async () => {
      const files = await vscode.workspace.findFiles('**/{orval.config.js}');
      const paths = files.map(({ path }) =>
        dirname(relative(vscode.workspace.rootPath || '', path)),
      );

      if (paths.length === 1) {
        orval(
          join(vscode.workspace.rootPath || '', paths[0], './orval.config.js'),
        );
        return;
      }

      const item = await window.showQuickPick(paths, {
        placeHolder: 'select a orval config',
      });

      if (item) {
        orval(join(vscode.workspace.rootPath || '', item, './orval.config.js'));
      }
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

  context.subscriptions.push(generateAll);
}

export function deactivate() {}
