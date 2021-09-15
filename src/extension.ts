import orval from 'orval';
import { dirname, join, relative } from 'path';
import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
  const generate = vscode.commands.registerCommand(
    'extension.generate',
    async () => {
      vscode.workspace.workspaceFolders?.forEach(async (folder) => {
        const files = await vscode.workspace.findFiles(
          '**/{orval.config}.{js,mjs,ts}',
        );
        const paths = files.map((file) => {
          const path = relative(folder.uri.path || '', file.path);
          return {
            path: path,
            dir: dirname(path),
          };
        });

        if (paths.length === 1) {
          orval(join(folder.uri.path || '', paths[0].path));
          return;
        }

        const item = await vscode.window.showQuickPick(
          paths.map(({ dir }) => dir),
          {
            placeHolder: 'select a orval config',
          },
        );

        const selectedPath = paths.find((path) => path.dir === item)?.path;

        if (selectedPath) {
          orval(join(folder.uri.path || '', selectedPath));
        }
      });
    },
  );

  const generateAll = vscode.commands.registerCommand(
    'extension.generateAll',
    () => {
      const files = vscode.workspace.findFiles('**/{orval.config}.{js,mjs,ts}');

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
