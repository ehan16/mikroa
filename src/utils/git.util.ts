import execa from 'execa';
import { SingleBar } from 'cli-progress';
import { createFile } from '../templates/default/default.template';
import { showError, showSuccess } from './logger.util';
import { gitignore } from '../templates/filesTemplate/basicSetup';

export async function initGit(path: string) {
  const progressBar = new SingleBar({
    format: `Git | {bar} | {percentage}% | {value}/{total}`,
    barCompleteChar: '\u2588',
    barIncompleteChar: '\u2591',
    hideCursor: true,
  });

  progressBar.start(20, 0);
  progressBar.update(4);

  const res = await execa('git', ['init'], {
    cwd: `${process.cwd()}${path}`,
  });

  progressBar.update(16);

  if (res.failed) {
    progressBar.stop();
    showError('Failed to initialize git');
  } else {
    progressBar.update(20);
    await createFile(path, '.gitignore', gitignore());
    progressBar.stop();
    showSuccess('Git initialized');
  }
}
