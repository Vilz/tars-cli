import chalk from 'chalk';
import os from 'os';
import fs from 'fs';
import {
    Spinner
} from 'cli-spinner';

const spinner = new Spinner('%s');

/**
 * Check operation system name
 * @return {Boolean} Is OS Windows or not
 */
function isWindows() {
    return (/^win/i).test(os.platform());
}

if (isWindows()) {
    spinner.setSpinnerString('|/-\\');
} else {
    spinner.setSpinnerString('⠋⠙⠹⠸⠼⠴⠦⠧⠇⠏');
}

/**
 * Helper function for spinner, just stop and start spinner
 */
spinner.restart = function restart() {
    this.stop(true);
    this.start();
};

export function importJSON(filePath, encoding = 'utf8') {
    if (!fs.existsSync(filePath)) {
        throw Error('Cannot find file');
    }
    return JSON.parse(fs.readFileSync(filePath, {
        encoding
    }));
}

export function writeFiles(path, files) {
    files.map(file => {
        try {
            fs.writeFileSync(
                `${path}/${file.name}`,
                file.content
            );
        } catch (error) {
            throw new Error(error);
        }
    });
}

export default {

    /**
     * Check that TARS inited in current directory.
     * @return {Object}
     */
    isTarsInited() {
        const cwd = process.cwd();

        try {
            importJSON(`${cwd}/tars.json`);
        } catch (error) {
            if (error.message !== 'Cannot find file') {
                this.tarsSay(chalk.red('There are some problems with your tars.json!\n'), true);
                console.error(error.stack);
                return {
                    inited: true,
                    error: true
                };
            }

            return {
                inited: false,
                error: false
            };
        }

        return {
            inited: true,
            error: false
        };
    },

    /**
     * Gets TARS-config from TARS in current directory.
     * @return {Promise<object>} tars-config
     */
    get tarsConfig() {
        const cwd = process.cwd(),
            initedStatus = this.isTarsInited();

        if (initedStatus.inited && !initedStatus.error) {
            return import(`${cwd}/tars-config`);
        }

        if (!initedStatus.error) {
            this.tarsNotInitedActions();
        }
        return false;
    },

    get tarsVersion() {
        return importJSON(`${process.env.cliRoot}/package.json`).version;
    },

    get tarsProjectVersion() {
        const cwd = process.cwd();

        if (this.isTarsInited().inited) {
            return importJSON(`${cwd}/tars.json`).version;
        }

        this.tarsNotInitedActions();
        return false;
    },

    /**
     * Output messages from TARS
     * @param  {String}  message Message to output
     * @param  {Boolean} stopSpinner or restart it
     */
    tarsSay(message, stopSpinner) {

        // Restart spinner after every message from TARS
        if (stopSpinner) {
            this.spinner.stop(true);
        } else {
            this.spinner.restart();
        }

        if (os.platform() === 'darwin') {
            console.log(chalk.bold.cyan('🅃 🄰 🅁 🅂 : ') + chalk.bold.white(message));
        } else {
            console.log(chalk.bold.cyan('[ TARS ]: ') + chalk.bold.white(message));
        }
    },

    /**
     * Actions, then TARS is not inited
     */
    tarsNotInitedActions() {
        console.log('\n');
        this.tarsSay(chalk.red('TARS is not inited.'));
        this.tarsSay(`Use ${chalk.bold.cyan('"tars init"')} to init TARS in current directory.\n`, true);
    },

    /**
     * Validate folder name
     * @param  {String}          value Recieved folder name
     * @return {String}          True or error text (not consistent, because of inquirer va)
     */
    validateFolderName(value) {
        const pass = /[?<>:*|"\\]/.test(value);

        if (!pass) {
            return true;
        }

        return 'Symbols \'?<>:*|"\\\' are not allowed. Please, enter a valid folder name!';
    },

    /**
     * Extract only used flags from inquirer options
     * @param  {Object} inquirerOptions options
     * @return {Array}
     */
    getUsedFlags(inquirerOptions) {
        return Object.keys(inquirerOptions).reduce((result, currentValue) => {
            if (currentValue.indexOf('_') !== 0 && currentValue !== 'options' &&
                currentValue !== 'commands' && currentValue !== 'parent') {
                result.push(currentValue);
            }

            return result;
        }, []);
    },

    spinner,

    /**
     * Determines is current platform windows.
     * @return {boolean}
     */
    isWindows
};
