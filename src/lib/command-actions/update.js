import chalk from 'chalk';
import runCommand from './utils/run-command';
import { execSync } from 'child_process';
import tarsUtils from '../utils';

/**
 * Just updates tars-cli dependencies and tars-cli itself
 */
export default function update() {
    tarsUtils.spinner.start();
    tarsUtils.tarsSay(chalk.underline('TARS-CLI update has been started!'));
    tarsUtils.tarsSay('Make a cup of tea/coffee, while it is working :)');
    execSync('npm cache clean');
    runCommand('npm', ['update', '-g', 'tars-cli']);
}
