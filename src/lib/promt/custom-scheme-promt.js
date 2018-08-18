

import inquirer from 'inquirer';
import tarsUtils from '../utils';
import { ADD_COMPONENT } from '../constants';
import customPathPromt from './custom-path-promt';

/**
 * Ask about custom path
 * @param  {Object} answers     Answers from promt
 * @param  {Function} callback  Function to start after promt
 */
export default function customSchemePromt(answers, callback) {
    tarsUtils.spinner.stop(true);

    inquirer.prompt([
        {
            type: 'input',
            name: 'customSchemeFile',
            message: 'Input the name of scheme file for new component:',
            default: 'default_component_scheme.json'
        }
    ]).then(pathAnswers => {
        answers.scheme = pathAnswers.customSchemeFile;

        if (answers.mode.indexOf(ADD_COMPONENT.customPath.title) > -1) {
            return customPathPromt(answers, callback);
        }

        return callback(answers);
    });
};
