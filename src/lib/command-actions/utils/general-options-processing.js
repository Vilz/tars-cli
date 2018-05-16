

import chalk from 'chalk';
import tarsUtils from '../../utils';
import { GENERAL_BUILD_OPTIONS } from '../../constants';

/**
 * General part of command options processing
 * @param  {Object} commandOptions Options for command
 * @return {Array}                 Processed options for TARS task
 */
export default function generalOptionsProcessing(commandOptions) {
    let buildOptions = [];

    if (commandOptions.ie8) {
        buildOptions.push(GENERAL_BUILD_OPTIONS.ie8.flag);
        tarsUtils.tarsSay(chalk.green('✓ IE8 maintenance.'));
    } else {
        tarsUtils.tarsSay(chalk.grey('IE8 maintenance "--ie8".'));
    }

    if (commandOptions.ie9) {
        buildOptions.push(GENERAL_BUILD_OPTIONS.ie9.flag);
        tarsUtils.tarsSay(chalk.green('✓ IE9 maintenance.'));
    } else {
        tarsUtils.tarsSay(chalk.grey('IE9 maintenance "--ie9".'));
    }

    if (commandOptions.ie) {
        buildOptions.push(GENERAL_BUILD_OPTIONS.ie.flag);
        tarsUtils.tarsSay(chalk.green('✓ IE8 and IE9 maintenance.'));
    } else {
        tarsUtils.tarsSay(chalk.grey('IE8 and IE9 maintenance "--ie".'));
    }

    if (commandOptions.customFlags) {
        buildOptions = buildOptions.concat(commandOptions.customFlags.split(' '));
        tarsUtils.tarsSay(
            `${chalk.green('✓ Custom flags.')} Used custom flags: ${chalk.bold.cyan(commandOptions.customFlags)}`
        );
    } else {
        tarsUtils.tarsSay(chalk.grey('Custom flags. "--custom-flags" \'customFlags, with space separator\''));
    }

    return buildOptions;
};
