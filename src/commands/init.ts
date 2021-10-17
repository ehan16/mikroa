import type { Arguments, CommandBuilder } from 'yargs';
import inquirer from 'inquirer';
import {
  directoryExists,
  createDirectory,
  createFile,
  generateApiGateway,
} from '../templates/default/default.template';
import {
  showTitle,
  showWarning,
  showGenerate,
  showError,
} from '../utils/logger.util';
import { initGit } from '../utils/git.util';
import {
  formatFiles,
  initPackageJson,
  installPackage,
} from '../utils/npm.util';

type Options = {
  name: string | undefined;
};

export const command = 'init <name>';
export const aliases: string[] = ['i', 'initialize'];
export const desc =
  'Init <name> project folder with the config file and api gateway';

export const builder: CommandBuilder<Options, Options> = (yargs) =>
  yargs.options({
    name: { type: 'string' },
  });

export const handler = async (argv: Arguments<Options>) => {
  const { name } = argv;
  const dirName = name?.toLowerCase();

  if (/[^A-Za-z0-9-]+/.test(String(dirName)) || /\s/.test(String(dirName))) {
    showError('invalid name');
    process.exit();
  }

  showTitle();
  const message = `Initializing ${dirName} project!`;
  console.log(message);

  // 1. Create the project directory
  await createDirectory(`/${dirName}`);

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
    if (directoryExists(`/${dirName}/.git`)) {
      showWarning('the git repository already exists');
    } else {
      showGenerate('git file');
      await initGit(`/${dirName || ''}`);
    }
  }

  // 4. Generate the config file and package.json and cache file
  await Promise.all([
    initPackageJson(`/${dirName}`),
    createFile(`/${dirName}`, 'config.json', '{}'),
    createFile(`/${dirName}`, 'cache.json', '{}'),
  ]);

  // 5. Generate the api gateway
  await generateApiGateway(`/${dirName}`, dirName ?? '');

  // 6. format the files
  await installPackage(`/${dirName}`, 'prettier');
  await formatFiles(`/${dirName}`);
};
