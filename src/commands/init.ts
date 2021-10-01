import type { Arguments, CommandBuilder } from 'yargs';
import inquirer from 'inquirer';
import {
  directoryExists,
  createDirectory,
  createFile,
  generateApiGateway,
} from '../templates/default/default.template';
import { showTitle, showWarning, showGenerate } from '../utils/logger.util';
import { initGit } from '../utils/git.util';
import { initPackageJson } from '../utils/npm.util';

type Options = {
  name: string | undefined;
};

export const command: string = 'init <name>';
export const aliases: string[] = ['i', 'initialize'];
export const desc: string =
  'Init <name> project folder with the config file and api getway';

export const builder: CommandBuilder<Options, Options> = (yargs) =>
  yargs.options({
    name: { type: 'string' },
  });

export const handler = async (argv: Arguments<Options>) => {
  const { name } = argv;
  const message = `Initializing ${name} project!`;
  console.log(message);

  showTitle();

  // 1. Create the project directory
  await createDirectory(`/${name}`);

  // 2. Initialize git folder
  const questions = [];
  questions.push({
    type: 'confirm',
    name: 'git',
    message: 'Initialize a git folder?',
    default: false,
  });

  const answers = await inquirer.prompt(questions);

  if (answers.git) {
    if (directoryExists(`/${name}/.git`)) {
      showWarning('the git repository already exists');
    } else {
      showGenerate('Creating git file');
      await initGit(`/${name || ''}`);
    }
  }

  // 4. Generate the config file and package.json
  await Promise.all([
    initPackageJson(`/${name}`),
    createFile(`/${name}`, 'config.json', '{}'),
  ]);

  // 5. Generate the api gateway
  await generateApiGateway(`/${name}`, name ?? '');

  // 6. Generate cache file
  createFile(`/${name}`, '.cache', '');
};
