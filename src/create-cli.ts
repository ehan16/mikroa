import yargs from 'yargs';
import { showError } from './utils/logger.util';

function buildLocalCommands(): void {
  yargs
    .alias('v', 'version')
    .usage('Usage: mikroa <command> [options]')
    .demandCommand(1, 'Pass --help to see all available commands and options.')
    .help('h')
    .alias('h', 'help');

  yargs
    .command(
      ['init [dir]', 'initialize', 'i'],
      'Initialize the Mikroa project directory',
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      () => {},
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      () => {}
    )
    .example('mikroa init my-project', 'Initialize `my-project` directory');

  yargs
    .command(['generate [microservice]', 'gen'], 'Generate a new microservice')
    .example(
      'mikroa generate my-microservice',
      'Generate a new microservice `my-microservice`'
    );

  yargs
    .command(['start'], 'Start development server')
    .example('mikroa start', 'Start development server');

  yargs
    .command(['build'], 'Build a Mikroa project')
    .example('mikroa build', 'Build a Mikroa project');

  yargs
    .command(
      ['migrate'],
      'Migrate all the models in the configuration file to the database'
    )
    .example(
      'mikroa migrate',
      'Read the configuration file and migrate all the models to the database'
    );
}

function getVersionInfo(): string {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { version } = require(`../package.json`);
  return `Mikroa CLI version: ${version}`;
}

export function createCli() {
  buildLocalCommands();

  try {
    yargs.version(
      'version',
      'Show the version of the Mikroa CLI',
      getVersionInfo()
    );
  } catch (e) {
    showError('An unexpected error has ocurred');
  }
}
