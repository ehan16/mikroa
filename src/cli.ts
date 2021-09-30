#!/usr/bin/env node
/* eslint-disable no-unused-expressions */

import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

yargs(hideBin(process.argv))
  // Use the commands directory to scaffold.
  .commandDir('commands')
  // Enable strict mode.
  .strict()
  .usage('Usage: mikroa <command> [options]')
  .demandCommand(1, 'Pass --help to see all available commands and options.')
  .help('h')
  .alias('h', 'help')
  .recommendCommands()
  .example('mikroa init my-project', 'Initialize `my-project` directory')
  .example(
    'mikroa generate `my-microservice`',
    'Generate a new microservice `my-microservice`'
  )
  .example(
    'mikroa generate',
    "Read root's config file and generate new microservices"
  )
  .example('mikroa start', 'Start development server')
  .example('mikroa build', 'Build a Mikroa project')
  .example(
    'mikroa migrate',
    'Read the microservice config file and migrate all the models to the database'
  )
  .epilogue(
    'for more information, visit our GitHub repository at https://github.com/ehan16/mikroa#readme'
  ).argv;
