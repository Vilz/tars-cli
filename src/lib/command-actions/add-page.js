import fs from 'fs';
import mkdirp from 'mkdirp';
import chalk from 'chalk';
import tarsUtils from '../utils';
import fsExtra from 'fs-extra';
import getTemplaterExtension from './utils/get-templater-extension';

/**
 * Create page in markup directory
 * @param  {String} pageName   The name of new page
 * @param  {Object} opts       Options
 */
export default async function addPage(pageName, opts) {
    const cwd = process.cwd();
    const tarsConfig = await tarsUtils.tarsConfig;
    const templater = tarsConfig.templater.toLowerCase();
    const pagesFolderPatch = `${cwd}/markup/${tarsConfig.fs.pagesFolderName}`;
    let extension = getTemplaterExtension(templater);
    // Path to new page. Includes page name
    let npd = `${pagesFolderPatch}/${pageName}`;

    // Check extension in pageName
    if (pageName.indexOf('.') === -1) {
        npd += '.' + extension;
    } else {
        extension = pageName.split('.').pop();
    }

    console.log('\n');

    fs.stat(npd, (fsErr, stats) => {
        if (stats != null) {
            return tarsUtils.tarsSay(chalk.red('Page "' + pageName + '" already exists.\n'), true);
        }

        if (opts.empty) {
            if (!fs.existsSync(pagesFolderPatch)) {
                mkdirp.sync(pagesFolderPatch);
            }
            fs.closeSync(fs.openSync(npd, 'w'));
            tarsUtils.tarsSay(chalk.green('Page "' + pageName + '" has been added to markup/pages.\n'), true);
        } else {
            fsExtra.copy(cwd + '/markup/pages/_template.' + extension, npd, error => {

                if (error) {
                    tarsUtils.tarsSay(chalk.red('"_template.' + extension + '" does not exist in the "markup/pages" directory.'));
                    tarsUtils.tarsSay('This file is used as template for new page.');
                    tarsUtils.tarsSay('Create this file or run the command ' + chalk.cyan('"tars add-page <pageName> -e"') + ' to create empty page.\n', true);
                    return;
                }

                tarsUtils.tarsSay(chalk.green('Page "' + pageName + '" has been added to markup/pages.\n'), true);
            });
        }
    });

    tarsUtils.spinner.stop(true);
}
