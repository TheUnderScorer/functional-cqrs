#!/usr/bin/env node
import chalk from 'chalk';
import { getCommandsDir } from 'laborious';
import yargs from 'yargs';

import { log } from './utils';

const header = chalk.blue(`
$$$$$$$$\\                  $$\\                  $$$$$$\\  $$\\ $$\\
\\__$$  __|                 $$ |                $$  __$$\\ $$ |\\__|
   $$ | $$$$$$\\   $$$$$$\\  $$ | $$$$$$$\\       $$ /  \\__|$$ |$$\\
   $$ |$$  __$$\\ $$  __$$\\ $$ |$$  _____|      $$ |      $$ |$$ |
   $$ |$$ /  $$ |$$ /  $$ |$$ |\\$$$$$$\\        $$ |      $$ |$$ |
   $$ |$$ |  $$ |$$ |  $$ |$$ | \\____$$\\       $$ |  $$\\ $$ |$$ |
   $$ |\\$$$$$$  |\\$$$$$$  |$$ |$$$$$$$  |      \\$$$$$$  |$$ |$$ |
   \\__| \\______/  \\______/ \\__|\\_______/        \\______/ \\__|\\__|`);

const argv = yargs
  .commandDir('./')
  .commandDir(getCommandsDir())
  .recommendCommands()
  .alias('help', 'h')
  .fail((msg, err) => {
    const message = msg ? msg : err.message;
    log.error(chalk.redBright(message));
    process.exit();
  })
  .usage(header).argv;

// Show help if no command was used.
if (!argv._[0]) {
  yargs.showHelp();
}
