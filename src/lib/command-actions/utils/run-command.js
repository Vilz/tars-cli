import path from 'path';
import spawn from 'win-spawn';
import tarsUtils from '../../utils';

/**
 * Run command in different env
 * @param  {String} commandName     Name of the command
 * @param  {Array}  commandOptions  Options for task
 */
export default function runCommand(commandName, commandOptions) {

    if (commandName === 'gulp') {
        commandName = path.resolve(process.env.npmRoot + '.bin/gulp');
    }

    tarsUtils.spinner.stop(true);
    spawn(commandName, commandOptions, { stdio: 'inherit' });
}
