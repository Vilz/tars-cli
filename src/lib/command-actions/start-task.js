

import chalk from 'chalk';
import runCommand from './utils/run-command';
import tarsUtils from '../utils';

/**
 * Start build task in gulp
 * @param  {String} taskName Task name to start
 * @param  {Object} options  Build options from commander
 */
export default function startTask(taskName, options) {
    let commandOptions = [taskName];

    console.log('\n');
    tarsUtils.spinner.start();
    tarsUtils.tarsSay(chalk.underline(`"${taskName}" task has been started!`) + '\n');

    if (options.flags) {
        commandOptions = commandOptions.concat(options.flags.split(' '));
        tarsUtils.tarsSay(`Used flags: ${chalk.bold.cyan(options.flags)}`);
    }

    tarsUtils.tarsSay('Please wait for a moment, while I\'m preparing builder for working...\n');

    runCommand('gulp', commandOptions);
};
