import inquirer from 'inquirer';
import { Octokit } from '@octokit/rest';
import { createBasicAuth } from '@octokit/auth-basic';
// import Configstore from 'configstore';
import { showWarning } from './logger.util';

type Credential = {
  username: string;
  password: string;
};

// export const conf = new Configstore('mikroa');
export let octokit: any;

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

export function getInstance() {
  return octokit;
}

// export function getStoredGithubToken() {
//   return conf.get('github.token');
// }

export async function getPersonalAccessToken(credentials: Credential) {
  const auth = createBasicAuth({
    username: credentials.username,
    password: credentials.password,
    async on2Fa() {
      return '';
    },
    token: {
      scopes: ['user', 'public_repo', 'repo', 'repo:status'],
      note: 'mikroa, the command-line tool for initalizing microservices projects',
    },
  });

  try {
    const res = await auth();

    console.log(res);
    // if (res.token) {
    //   conf.set('github.token', res.token);
    //   return res.token;
    // } else {
    //   throw new Error("GitHub token was not found in the response");
    // }
  } catch (err) {
    console.log(err);
  }
}
