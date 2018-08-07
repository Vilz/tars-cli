import fs from 'fs';
import fsExtra from 'fs-extra';
import mkdirp from 'mkdirp';
import chalk from 'chalk';
import del from 'del';
import addComponentPromt from '../promt/add-component-promt';
import tarsUtils from '../utils';
import {
    ADD_COMPONENT,
} from '../constants';
import getTemplaterExtension from './utils/get-templater-extension';
import Scheme from './add-component/scheme';
import {
    generateBaseFiles,
    createAssetsFolder,
    createDataFolder,
    generateComponent,
} from './add-component/generate';

const cwd = process.cwd();

let newComponentName;

function actionsOnError(error, newComponentPath) {
    console.log('\n');
    del.sync(newComponentPath);
    tarsUtils.tarsSay(chalk.red('Something is gone wrong...'));
    tarsUtils.tarsSay('Please, repost the message and the stack trace of Error to developer tars.builder@gmail.com', true);
    console.error(error.stack);
}

function getNewComponentPath(componentsFolderName, customPath) {
    return `${cwd}/markup/${componentsFolderName}/${ customPath
        ? `${customPath}/${newComponentName}`
        : newComponentName
    }`;
}

function isComponentExist(newComponentPath) {
    // Create new component if component with newComponentName is not existed already
    try {
        fs.statSync(newComponentPath);
    } catch (error) {
        return false;
    }

    tarsUtils.tarsSay(chalk.red(`Component "${newComponentPath}" already exists.\n`), true);
    return true;
}

function successLog(componentsFolderName, customPath) {
    let newComponentPath = `markup/${componentsFolderName}`;

    if (customPath) {
        newComponentPath += `/${customPath}`;
    }

    tarsUtils.tarsSay(chalk.green(`Component "${newComponentName}" has been added to ${newComponentPath}.\n`), true);
}

function createCopyOfTemplate(componentsFolderName, newComponentPath, customPath) {
    fsExtra.copy(`${cwd}/markup/${componentsFolderName}/_template`, newComponentPath, error => {
        if (error) {
            tarsUtils.tarsSay(
                chalk.red(`_template component does not exist in the "markup/${componentsFolderName}" directory.`)
            );
            tarsUtils.tarsSay('This folder is used as template for new component.');
            tarsUtils.tarsSay(
                `Create template or run the command
                ${chalk.cyan('"tars add-component <componentName>"')}
                to create component with another options.\n`,
                true
            );
        } else {
            successLog(componentsFolderName, customPath);
        }
    });
}

function createComponentByScheme(state, newComponentPath, params = {}) {
    const {
        tarsConfig,
        templater,
        cssPreprocessor,
        componentsFolderName,
    } = state;
    const schemeFilePath = `${cwd}/markup/${tarsConfig.fs.componentsFolderName}/${params.schemeFile}`;
    const scheme = new Scheme(schemeFilePath, newComponentPath, templater, cssPreprocessor);

    Promise.resolve()
        .then(scheme.loadSchemeFile)
        .then(scheme.parseScheme)
        .then(componentScheme => generateComponent(newComponentPath, componentScheme))
        .then(() =>
            successLog(componentsFolderName, params.customPath)
        )
        .catch(error =>
            actionsOnError(error, newComponentPath)
        );
}

/**
 * Create component with structure based on command options
 * @param {Object} state All params
 * @param {Object} commandOptions Options, which is passed from CLI
 */
function createComponent(state, commandOptions) {
    const {
        componentsFolderName,
        extensions
    } = state;
    // Path to new component. Includes component name
    const newComponentPath = getNewComponentPath(componentsFolderName, commandOptions.customPath);

    if (isComponentExist(newComponentPath)) {
        return;
    }

    if (commandOptions.scheme) {
        if (commandOptions.scheme && typeof commandOptions.scheme === 'boolean') {
            commandOptions.scheme = '';
        }

        createComponentByScheme(
            state,
            newComponentPath, {
                schemeFile: commandOptions.scheme || 'default_component_scheme.json',
                customPath: commandOptions.customPath
            }
        );
        return;
    }

    if (commandOptions.template) {
        createCopyOfTemplate(componentsFolderName, newComponentPath, commandOptions.customPath);
        return;
    }

    mkdirp(newComponentPath, error => {
        if (error) {
            return actionsOnError(error, newComponentPath);
        }

        let generateStructure = true;

        try {
            if (commandOptions.empty) {
                generateStructure = false;
            }

            if (commandOptions.full && generateStructure) {
                generateBaseFiles(extensions, newComponentPath, newComponentName);
                createAssetsFolder(newComponentPath);
                createDataFolder(newComponentPath, newComponentName);
                generateStructure = false;
            }

            if (commandOptions.basic && generateStructure) {
                generateBaseFiles(extensions, newComponentPath, newComponentName);
            }

            if (commandOptions.assets && generateStructure) {
                createAssetsFolder(newComponentPath);
            }

            if (commandOptions.data && generateStructure) {
                createDataFolder(newComponentPath, newComponentName);
            }
        } catch (generationError) {
            return actionsOnError(generationError, newComponentPath);
        }

        successLog(componentsFolderName, commandOptions.customPath);
    });
}

/**
 * Create component with structure based on answers from promt
 * @param  {Object} state All params
 * @param  {Object} answers Answers from promt
 * @return {void}
 */
async function createComponentWithPromt(state, answers) {
    // FIXME: remove
    // console.log('\x1b[31m', answers, '\x1b[0m');
    const {
        componentsFolderName,
        extensions
    } = state;
    // Path to new component. Includes component name
    const newComponentPath = getNewComponentPath(componentsFolderName, answers.customPath);

    if (isComponentExist(newComponentPath)) {
        return;
    }

    if (answers.mode.indexOf(ADD_COMPONENT.scheme.title) > -1) {
        createComponentByScheme(
            state,
            newComponentPath, {
                schemeFile: answers.scheme,
                customPath: answers.customPath
            }
        );
        return;
    }

    if (answers.mode.indexOf(ADD_COMPONENT.template.title) > -1) {
        createCopyOfTemplate(componentsFolderName, newComponentPath);
        return successLog(componentsFolderName, answers.customPath);
    }

    mkdirp(newComponentPath, error => {
        if (error) {
            return actionsOnError(error, newComponentPath);
        }

        try {
            if (answers.mode.indexOf(ADD_COMPONENT.empty.title) > -1) {
                void 0;
            } else if (answers.mode.indexOf(ADD_COMPONENT.full.title) > -1) {
                generateBaseFiles(extensions, newComponentPath, newComponentName);
                createAssetsFolder(newComponentPath);
                createDataFolder(newComponentPath, newComponentName);
            } else {
                answers.mode.forEach(mode => {
                    console.log(mode);
                    switch (mode) {
                        case ADD_COMPONENT.assets.title:
                            createAssetsFolder(newComponentPath);
                            break;
                        case ADD_COMPONENT.data.title:
                            createDataFolder(newComponentPath, newComponentName);
                            break;
                        case ADD_COMPONENT.basic.title:
                        default:
                            generateBaseFiles(extensions, newComponentPath, newComponentName);
                            break;
                    }
                });
            }
        } catch (generationError) {
            return actionsOnError(generationError, newComponentPath);
        }

        return successLog(componentsFolderName, answers.customPath);
    });
}

/**
 * Create component in markup directory
 * @param  {String} componentName The name of new component
 * @param  {Object} options       Inquirer options
 */
export default async function addComponent(componentName, options) {
    const tarsConfig = await tarsUtils.tarsConfig,
        templater = tarsConfig.templater.toLowerCase(),
        cssPreprocessor = tarsConfig.cssPreprocessor.toLowerCase();

    const state = {
        tarsConfig,
        templater,
        cssPreprocessor,
        componentsFolderName: tarsConfig.fs.componentsFolderName || 'modules',
        extensions: {
            tpl: getTemplaterExtension(templater),
            css: cssPreprocessor === 'stylus' ? 'styl' : cssPreprocessor
        }
    };

    console.log('\n');

    const validateResult = tarsUtils.validateFolderName(componentName);

    // If componentName has depricated symbols, log the error
    if (typeof validateResult === 'string') {
        tarsUtils.tarsSay(chalk.red(validateResult + '\n'), true);
        return;
    }

    newComponentName = componentName;
    const commandOptions = Object.assign({}, options);

    if (tarsUtils.getUsedFlags(commandOptions).length) {
        createComponent(state, commandOptions);
    } else {
        addComponentPromt((answers) => createComponentWithPromt(state, answers));
    }
}
