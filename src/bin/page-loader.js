#!/usr/bin/env node

import program from 'commander';

import { version } from '../../package.json';
import loader from '..';

const run = () => {
  program
    .description('Command-line tool for downloading pages from the Internet.')
    .version(version)
    .option('-o, --output [folder]', 'output folder', '.')
    .arguments('<url>')
    .action(async (url, argv) => {
      try {
        const file = await loader(url, argv.output);

        console.log(file);
      } catch (error) {
        console.error(error.message);
        process.exit(1);
      }
    })
    .parse(process.argv);
};

run();
