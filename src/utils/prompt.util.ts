import inquirer from 'inquirer';

export type OptionsAnswer = {
  language: string;
  orm: string;
  framework: string;
};

export async function promptForOptions() {
  const questions = [];

  questions.push({
    type: 'list',
    name: 'language',
    message: 'Please choose which language would you like to use',
    choices: ['javascript', 'typescript'],
  });

  questions.push({
    type: 'list',
    name: 'orm',
    message: 'Please choose which orm to use',
    choices: ['mongoose', 'prisma'],
  });

  questions.push({
    type: 'list',
    name: 'framework',
    message: 'Please choose a backend framework to use',
    choices: ['express', 'fastify', 'koa.js'],
  });

  const answers = await inquirer.prompt(questions);
  return answers;
}

export async function promptForDependencies() {
  const questions = [];

  questions.push({
    type: 'confirm',
    name: 'dependencies',
    message: 'Install all the dependencies?',
    default: true,
  });

  const answers = await inquirer.prompt(questions);
  return answers as { dependencies: boolean };
}
