import chalk from 'chalk';
import tarsUtils from '../../utils';

/**
 * General part of command options processing
 * @param  {Object} commandOptions Options for command
 * @return {Array}                 Processed options for TARS task
 */
export default function generalOptionsProcessing(commandOptions) {
    let buildOptions = [];

    if (commandOptions.customFlags) {
        buildOptions = buildOptions.concat(commandOptions.customFlags.split(' '));
        tarsUtils.tarsSay(
            `${chalk.green('✓ Custom flags.')} Used custom flags: ${chalk.bold.cyan(commandOptions.customFlags)}`
        );
    } else {
        tarsUtils.tarsSay(chalk.grey('Custom flags. "--custom-flags" \'customFlags, with space separator\''));
    }

    return buildOptions;
}
