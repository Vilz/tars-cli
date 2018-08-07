

import chalk from 'chalk';
import runCommand from './utils/run-command';
import generalOptionsProcessing from './utils/general-options-processing';
import devPromt from '../promt/dev-promt';
import tarsUtils from '../utils';
import { DEV } from '../constants';
import updatesDuringBuildProcess from './utils/updates-during-build-process';

function extractBuildOptionsFromPromt(answers) {
    let buildOptions = [];

    answers.mode.forEach(mode => {
        switch (mode) {
            case DEV.livereload.title:
                buildOptions.push(DEV.livereload.flag);
                break;
            case DEV.tunnel.title:
                buildOptions.push(DEV.tunnel.flag);
                break;
            case DEV.customFlags.title:
                buildOptions = buildOptions.concat(answers.customFlags);
                break;
            default: {
                break;
            }
        }
    });

    if (buildOptions.indexOf(DEV.tunnel.flag) > -1 &&
        buildOptions.indexOf(DEV.livereload.flag) > -1) {
        buildOptions.splice(buildOptions.indexOf(DEV.livereload.flag), 1);
    }

    return buildOptions;
}

function extractBuildOptionsFromFlags(commandOptions) {
    let buildOptions = [];

    tarsUtils.tarsSay('Build options (active are green): ');

    if (commandOptions.tunnel) {
        buildOptions.push(DEV.tunnel.flag);
        tarsUtils.tarsSay(chalk.green('✓ Server for tunnel and livereload will be started.'));
    } else {
        tarsUtils.tarsSay(chalk.grey('Server for tunnel and livereload will be started "-t".'));
    }

    if ((commandOptions.lr || commandOptions.livereload) && !commandOptions.tunnel) {
        buildOptions.push(DEV.livereload.flag);
        tarsUtils.tarsSay(chalk.green('✓ Server for livereload will be started.'));
    } else {
        tarsUtils.tarsSay(chalk.grey('Server for livereload will be started "-l".'));
    }

    return buildOptions.concat(generalOptionsProcessing(commandOptions));
}

/**
 * Get options for dev task and start dev task in TARS
 * @param  {Object} answers Answers from promt
 * @param {Object} commandOptions Options
 */
function devInit(answers, commandOptions) {
    let buildOptions = answers ? extractBuildOptionsFromPromt(answers) : extractBuildOptionsFromFlags(commandOptions);

    buildOptions = ['dev'].concat(buildOptions);

    if (!answers) {
        console.log('\n');
        tarsUtils.tarsSay('Execute ' + chalk.bold.cyan('"tars dev --help"') + ', to see all avaliable options.');
        tarsUtils.tarsSay('You can use interactive mode via starting tars without any flags.');
    }

    updatesDuringBuildProcess();
    tarsUtils.tarsSay('Please wait for a moment, while I\'m preparing builder for working...\n');
    runCommand('gulp', buildOptions);
}

/**
 * Start dev task in gulp
 * @param  {Object} options Build options from commander
 */
export default function dev(options) {
    const commandOptions = Object.assign({}, options);

    console.log('\n');
    tarsUtils.spinner.start();
    tarsUtils.tarsSay(chalk.underline('Development task has been started!') + '\n');

    if (tarsUtils.getUsedFlags(commandOptions).length) {
        devInit(null, commandOptions);
    } else {
        tarsUtils.tarsSay('Welcome to the interactive mode.');
        tarsUtils.tarsSay('Please, answer some questions:');
        devPromt(devInit);
    }
}
