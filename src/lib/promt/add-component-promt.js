import inquirer from 'inquirer';
import tarsUtils from '../utils';
import { ADD_COMPONENT } from '../constants';
import customPathPromt from './custom-path-promt';
import customSchemePromt from './custom-scheme-promt';
import generateChoices from './utils/generateChoices';

/**
 * Promt for component adding
 * @param  {Function} callback Function to start after promt
 */
export default function addComponentPromt(callback) {
    tarsUtils.spinner.stop(true);

    inquirer.prompt([
        {
            type: 'checkbox',
            name: 'mode',
            message: 'What files/dirs have to be in component? Available multiple choice.',
            choices: generateChoices.generateForCheckboxList(ADD_COMPONENT),
            pagination: true,
            pageSize: 12
        }
    ]).then(addComponentAnswers => {
        if (addComponentAnswers.mode.indexOf(ADD_COMPONENT.scheme.title) > -1) {
            return customSchemePromt(addComponentAnswers, callback);
        } else if (addComponentAnswers.mode.indexOf(ADD_COMPONENT.customPath.title) > -1) {
            return customPathPromt(addComponentAnswers, callback);
        } else {
            return callback(addComponentAnswers);
        }
    });
}
