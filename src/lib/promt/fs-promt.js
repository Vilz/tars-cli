

import fs from 'fs';
import fsExtra from 'fs-extra';
import inquirer from 'inquirer';
import tarsUtils from '../utils';
import generateChoices from './utils/generateChoices';
import { FS } from '../constants';

/**
 * Init promt for config
 * @param  {Function} callback Function to start after promt
 */
export default function fsPromt(callback) {
    tarsUtils.spinner.stop(true);

    inquirer.prompt([
        {
            type: 'list',
            name: 'action',
            message: 'What would you like to do?',
            choices: generateChoices.generateForSimpleList(FS)
        }
    ]).then(fsPromtAnswers => {
        switch (fsPromtAnswers.action) {
            case FS.clearDir.title:
                inquirer.prompt([{
                    type: 'confirm',
                    name: 'clearDir',
                    message: `Are you sure, you want to clear dir: ${process.cwd()}`,
                    default: false
                }]).then(answers => {
                    if (answers.clearDir) {
                        fsExtra.removeSync('./*');
                        fsExtra.removeSync('./.*');
                        callback();
                        return;
                    }

                    process.stdout.write('^C\n');
                    return;
                });
                return;

            case FS.createDir.title:
                inquirer.prompt([{
                    type: 'input',
                    name: 'folderName',
                    message: 'Enter directory name',
                    default: () => 'awesome-project',
                    validate: tarsUtils.validateFolderName
                }]).then(answers => {
                    fs.mkdir(answers.folderName);
                    process.chdir(`./${answers.folderName}`);
                    callback();
                });
                break;

            case FS.stopInit.title:
            default:
                process.stdout.write('^C\n');
                return;
        }
    });
};
