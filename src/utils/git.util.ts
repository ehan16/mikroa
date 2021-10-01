import execa from 'execa';
import { copy } from '../templates/default/default.template';
import { showError, showSuccess } from './logger.util';

export async function initGit(path: string) {
  const res = await execa('git', ['init'], {
    cwd: `${process.cwd()}${path}`,
  });
  if (res.failed) {
    showError('Failed to initialize git');
  } else {
    showSuccess('Git initialized');
    await copy('/template/template.gitignore', `${path}/.gitignore`);
  }
}
