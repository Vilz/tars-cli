

import inquirer from 'inquirer';
import tarsUtils from '../utils';
import chalk from 'chalk';

/**
 * Ask about custom path
 * @param  {Object} answers     Answers from promt
 * @param  {Function} callback  Function to start after promt
 */
export default function customPathPromt(answers, callback) {
    tarsUtils.spinner.stop(true);

    const currentTarsVersion = tarsUtils.getTarsProjectVersion();

    if (currentTarsVersion < '1.8.0') {
        answers.customPath = '';
        tarsUtils.tarsSay(chalk.yellow('Custom path for component is not supported in TARS, which is used in current project!'));
        tarsUtils.tarsSay('Run "tars update-project" to get the latest version of TARS.');

        return callback(answers);
    }

    inquirer.prompt([
        {
            type: 'input',
            name: 'customPath',
            message: 'Input custom path without any quotes (Example: component1/component2):',
            validate: tarsUtils.validateFolderName
        }
    ]).then(pathAnswers => {
        answers.customPath = pathAnswers.customPath.replace(/\/$/, '') || '';
        callback(answers);
    });
};
