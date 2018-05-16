import chalk from 'chalk';
import tarsUtils from '../utils';
import Download from 'download';
import Utils, { importJSON } from '../utils'

/**
 * Get version of tars-cli
 */
export default function getVersion() {
    console.log('\n');
    const {
        tarsVersion,
        tarsProjectVersion
    } = Utils;
    tarsUtils.tarsSay(`TARS-CLI version: "${chalk.cyan.bold(tarsVersion)}"\n`, true);
    tarsUtils.tarsSay(`TARS version: "${chalk.cyan.bold(tarsProjectVersion || 'Uninstalled')}"`, true);

    (async () => {
        try {
            const lastPackageJson = await Download('https://raw.githubusercontent.com/tars/tars-cli/master/package.json')
            const latestTarsCliVersion = JSON.parse(lastPackageJson).version;

            if (tarsVersion < latestTarsCliVersion) {
                tarsUtils.tarsSay(
                    `Update available for TARS-CLI! New version is: "${chalk.cyan.bold(latestTarsCliVersion)}"`,
                    true
                );
                tarsUtils.tarsSay(
                    `Run the command "${chalk.cyan.bold('tars update')}" to update TARS-CLI. \n`,
                    true
                );
            }
        } catch (error) {
            console.error('Can\'t fetch latest version from server')
        }
    })()
};
