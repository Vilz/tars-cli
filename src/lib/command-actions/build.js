

import chalk from 'chalk';
import runCommand from './utils/run-command';
import generalOptionsProcessing from './utils/general-options-processing';
import buildPromt from '../promt/build-promt';
import tarsUtils from '../utils';
import { BUILD } from '../constants';
import updatesDuringBuildProcess from './utils/updates-during-build-process';

function extractBuildOptionsFromPromt(answers) {
    let buildOptions = [];

    answers.mode.forEach(mode => {
        switch (mode) {
            case BUILD.release.title:
                buildOptions.push(BUILD.release.flag);
                break;
            case BUILD.min.title:
                buildOptions.push(BUILD.min.flag);
                break;
            case BUILD.customFlags.title:
                buildOptions = buildOptions.concat(answers.customFlags);
                break;
            default:
                break;
        }
    });

    if (buildOptions.indexOf(BUILD.release.flag) !== -1 &&
        buildOptions.indexOf(BUILD.min.flag) !== -1) {
        buildOptions.splice(BUILD.min.flag, 1);
    }

    return buildOptions;
}

function extractBuildOptionsFromFlags(commandOptions) {
    let buildOptions = [];

    tarsUtils.tarsSay('Build options (active are green): ');

    if (commandOptions.release) {
        buildOptions.push(BUILD.release.flag);
        tarsUtils.tarsSay(chalk.green('✓ Release mode.'));
    } else {
        tarsUtils.tarsSay(chalk.grey('Release mode "-r".'));
    }

    if (commandOptions.min && !commandOptions.release) {
        buildOptions.push(BUILD.min.flag);
        tarsUtils.tarsSay(chalk.green('✓ Minify mode.'));
    } else {
        tarsUtils.tarsSay(chalk.grey('Minify mode "-m".'));
    }

    return buildOptions.concat(generalOptionsProcessing(commandOptions));
}

/**
 * Get options for build task and start build task in TARS
 * @param  {Object} answers Answers from promt
 * @param  {Object} commandOptions from inquirer
 */
function buildInit(answers, commandOptions) {
    const buildOptions = answers ? extractBuildOptionsFromPromt(answers) : extractBuildOptionsFromFlags(commandOptions);

    if (!answers) {
        console.log('\n');
        tarsUtils.tarsSay('Execute ' + chalk.bold.cyan('"tars build --help"') + ', to see all avaliable options.');
        tarsUtils.tarsSay('You can use interactive mode via starting tars without any flags.');
    }

    updatesDuringBuildProcess();
    tarsUtils.tarsSay('Please wait for a moment, while I\'m preparing builder for working...\n');
    runCommand('gulp', buildOptions);
}

/**
 * Start build task in gulp
 * @param  {Object} options Build options from commander
 */
export default function build(options) {
    const commandOptions = Object.assign({}, options);

    console.log('\n');
    tarsUtils.spinner.start();
    tarsUtils.tarsSay(chalk.underline('Build task has been started!') + '\n');

    if (tarsUtils.getUsedFlags(commandOptions).length) {
        buildInit(null, commandOptions);
    } else {
        tarsUtils.tarsSay('Welcome to the interactive mode.');
        tarsUtils.tarsSay('Please, answer some questions:');
        buildPromt(buildInit);
    }
}
