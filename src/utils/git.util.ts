import inquirer from 'inquirer';
import execa from 'execa';
import { showError, showSuccess } from './logger.util';

export function askGithubCredentials() {
  const questions = [];

  questions.push({
    type: 'input',
    name: 'username',
    message: 'Enter your Github username or e-mail address:',
    validate(value: string) {
      if (value.trim().length) {
        return true;
      }
      return 'Please enter your username or e-mail address.';
    },
  });

  questions.push({
    type: 'password',
    name: 'password',
    message: 'Enter your password:',
    validate(value: string) {
      if (value.trim().length) {
        return true;
      }
      return 'Please enter your password.';
    },
  });

  return inquirer.prompt(questions);
}

export async function initGit() {
  const res = await execa('git', ['init'], {
    cwd: process.cwd(),
  });
  if (res.failed) {
    showError('Failed to initialize git');
  } else {
    showSuccess('Git initialized');
  }
}
