

import Download from 'download';
import { exec } from 'child_process';
import extfs from 'extfs';
import del from 'del';
import fs from 'fs';
import chalk from 'chalk';
import runCommand from './utils/run-command';
import tarsUtils from '../utils';
import configPromt from '../promt/config-promt';
import fsPromt from '../promt/fs-promt';
import saveConfigAnswers from '../promt/save-config-answers';
import { importJSON } from '../utils';
let tarsZipUrl = 'https://github.com/tars/tars/archive/master.zip';
let commandOptions = {};

/**
 * Main init funciton, download all additional tasks.
 * @param  {Object} answers         Object with answers from promt
 */
async function mainInit(answers) {
    const cwd = process.cwd();

    tarsUtils.tarsSay('Please, wait for a moment, while magic is happening...');

    try {
        const downloadTars = await Download(tarsZipUrl, cwd, {
            mode: '755',
            extract: true,
            strip: 1
        })

        let commandToExec = 'npm i';

        if (answers) {
            saveConfigAnswers(answers);
        }

        const userPackages = importJSON(`${cwd}/user-package.json`);

        // Get version of TARS from tars.json
        // or package.json if tars.json does not exist
        try {
            process.env.tarsVersion = tarsUtils.tarsProjectVersion;
        } catch (error) {
            process.env.tarsVersion = tarsUtils.tarsVersion;
        }

        tarsUtils.tarsSay(`TARS version is: ${process.env.tarsVersion}`);

        del.sync([`${cwd}/package.json`, `${cwd}/user-package.json`, `${cwd}/_package.json`]);

        const packageJson = Object.assign(
            importJSON(`${process.env.cliRoot}/templates/package.json`),
            {
                name: answers.projectName,
                description: `${answers.projectName} project description`
            },
            userPackages
        );

        fs.writeFileSync('package.json', JSON.stringify(packageJson, null, 2) + '\n');
        tarsUtils.tarsSay('Local package.json has been created');

        const tarsConfig = await import(`${cwd}/tars-config.js`);

        if ((answers && answers.useBabel) || tarsConfig.useBabel) {
            commandToExec += ' && npm i babel-preset-es2015 --save';
        }

        exec(commandToExec, (error, stdout, stderr) => {
            if (error) {
                console.log(stderr);
                return;
            }

            let gulpInitCommandOptions = ['init', '--silent'];

            if (commandOptions.excludeCss) {
                gulpInitCommandOptions.push('--exclude-css');
            }

            if (commandOptions.excludeHtml) {
                gulpInitCommandOptions.push('--exclude-html');
            }

            tarsUtils.tarsSay('Local gulp and other dependencies has been installed');
            runCommand('gulp', gulpInitCommandOptions);
        });
    } catch (error) {
        tarsUtils.spinner.stop(true);
        throw error;
    }
}

/**
 * Start initialization
 */
function startInit() {
    const cwd = process.cwd();

    tarsUtils.tarsSay(chalk.underline('Initialization has been started!') + '\n');
    tarsUtils.tarsSay('I\'ll be inited in ' + chalk.cyan('"' + cwd + '"'));
    tarsUtils.tarsSay('TARS source will be downloaded from ' + chalk.cyan('"' + tarsZipUrl + '"'));

    if (!commandOptions.source) {
        tarsUtils.tarsSay('You can specify source url by using flag ' + chalk.cyan('"--source"') + ' or ' + chalk.cyan('"-s"'));
        tarsUtils.tarsSay('Example: ' + chalk.cyan('"tars init -s http://url.to.zip.with.tars"'));
        tarsUtils.tarsSay('Run command ' + chalk.cyan('"tars init --help"') + ' for more info.\n');
    }

    tarsUtils.tarsSay('I\'m going to install "gulp" localy and create local package.json');
    tarsUtils.tarsSay('You can modify package.json by using command ' + chalk.cyan('"npm init"') + ' or manually.');

    if (commandOptions.silent) {
        mainInit();
    } else {
        configPromt(mainInit);
    }
}

/**
 * Init TARS
 * @param  {Object} options Options of init
 */
export default function init(options) {
    const cwd = process.cwd();

    commandOptions = options;
    tarsUtils.spinner.start();

    if (options.source) {
        tarsZipUrl = options.source;
    }

    if (tarsUtils.isTarsInited().inited) {
        tarsUtils.tarsSay('TARS has been inited already!');
        tarsUtils.tarsSay('You can\'t init Tars in current directory again.', true);
        return;
    }

    console.log('\n');
    extfs.isEmpty(cwd, empty => {
        if (!empty) {
            tarsUtils.tarsSay(chalk.red(`Directory "${cwd}" is not empty.`), true);
            fsPromt(startInit);
        } else {
            startInit();
        }
    });
};
