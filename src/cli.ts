#!/usr/bin/env node
/* eslint-disable no-unused-expressions */

import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

yargs(hideBin(process.argv))
  // Use the commands directory to scaffold.
  .commandDir('commands')
  // Enable strict mode.
  .strict()
  .usage('Usage: $0 <command> [options]')
  .demandCommand(1, 'Pass --help to see all available commands and options.')
  .help('h')
  .alias('h', 'help')
  .recommendCommands()
  .showHelpOnFail(false, 'Specify --help for available options')
  .example('$0 init my-project', 'Initialize `my-project` directory')
  .example(
    '$0 generate `my-microservice`',
    'Generate a new microservice `my-microservice`'
  )
  .example(
    '$0 generate',
    "Read root's config file and generate new microservices"
  )
  .example('$0 start', 'Start running all the existing microservices')
  .example('$0 build', 'Generate the corresponding Docker images')
  .example(
    '$0 migrate',
    'Read the microservice config file and migrate all the models to the database'
  )
  .epilogue(
    'for more information, visit our GitHub repository at https://github.com/ehan16/mikroa#readme'
  ).argv;
