

import inquirer from 'inquirer';
import chalk from 'chalk';
import tarsUtils from '../utils';

/**
 * Ask about custom flags
 * @param  {Object} answers     Answers from promt
 * @param  {Function} callback  Function to start after promt
 */
export default function customFlagsPromt(answers, callback) {
    tarsUtils.spinner.stop(true);

    inquirer.prompt([
        {
            type: 'input',
            name: 'customFlags',
            message: 'Input custom flags with space separator without any quotes:'
        }
    ]).then(flagsAnswers => {
        answers.customFlags = flagsAnswers.customFlags.split(' ');
        tarsUtils.tarsSay(`Used custom flags: ${chalk.bold.cyan(answers.customFlags.join(', '))}`);
        callback(answers);
    });
};
