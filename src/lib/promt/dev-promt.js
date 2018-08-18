

import inquirer from 'inquirer';
import customFlagsPromt from './custom-flags-promt';
import tarsUtils from '../utils';
import { DEV } from '../constants';
import generateChoices from './utils/generateChoices';

/**
 * Init promt for dev command
 * @param  {Function} callback Function to start after promt
 */
export default function devPromt(callback) {
    tarsUtils.spinner.stop(true);

    inquirer.prompt([
        {
            type: 'checkbox',
            name: 'mode',
            message: 'What mode would you like to use? Available multiple choice.',
            choices: generateChoices.generateForCheckboxList(DEV)
        }
    ]).then(devAnswers => {
        if (devAnswers.mode.indexOf(DEV.customFlags.title) > -1) {
            return customFlagsPromt(devAnswers, callback);
        }

        return callback(devAnswers);
    });
};
