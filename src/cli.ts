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
  .epilogue(
    'for more information, visit our GitHub repository at https://github.com/ehan16/mikroa#readme'
  ).argv;
