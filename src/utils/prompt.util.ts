import inquirer from 'inquirer';

export async function promptForOptions() {
  const questions = [];

  questions.push({
    type: 'list',
    name: 'language',
    message: 'Please choose which language would you like to use',
    choices: ['JavaScript', 'TypeScript'],
  });

  questions.push({
    type: 'list',
    name: 'orm',
    message: 'Please choose which orm to use',
    choices: ['Mongoose', 'Sequelize', 'Prisma'],
  });

  questions.push({
    type: 'list',
    name: 'framework',
    message: 'Please choose a backend framework to use',
    choices: ['Express', 'Fastify', 'Koa.js'],
  });

  const answers = await inquirer.prompt(questions);
  return answers;
}