import type { Arguments, CommandBuilder } from 'yargs';
import inquirer from 'inquirer';
import { showTitle, showWarning, showGenerate } from '../utils/logger.util';
import { directoryExists } from '../utils/checker.util';
import { initGit } from '../utils/git.util';
import { createFile } from '../templates/default/default.template';

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

  // 1. Ask git repository?
  const questions = [];
  questions.push({
    type: 'confirm',
    name: 'git',
    message: 'Initialize a git repository?',
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

  // 2. Receive the new directory name and generate it

  // 3. Generate the config file

  // 4. Generate the api gateway

  // 5. Generate cache file
  createFile(`/${name}`, '.cache', '');
};
