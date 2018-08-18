import fs from 'fs';
import mkdirp from 'mkdirp';
import {
    writeFiles
} from '../../utils';

/**
 * Generate base files for component. Js, Html and Css file
 * @param {Object} extensions All files extensions
 * @param {String} newComponentPath Path to new component
 * @param {String} newComponentName Compomemt name
 */
export function generateBaseFiles(extensions, newComponentPath, newComponentName) {
    const newComponentFolder = `${newComponentPath}/${newComponentName}`;

    fs.appendFileSync(`${newComponentFolder}.${extensions.css}`, '\n');
    fs.appendFileSync(`${newComponentFolder}.js`, '\n');
    fs.appendFileSync(`${newComponentFolder}.${extensions.tpl}`, '\n');

    if (extensions.tpl === 'pug') {
        fs.writeFileSync(
            `${newComponentFolder}.${extensions.tpl}`,
            `mixin ${newComponentName}(data)\n    .${newComponentName}`
        );
    }
}

/**
 * Create folder for assets
 * @param {String} newComponentPath Path to new component
 */
export function createAssetsFolder(newComponentPath) {
    fs.mkdirSync(newComponentPath + '/assets');
}

/**
 * Create folder for data
 * @param {String} newComponentPath Path to new component
 * @param {String} newComponentName Compomemt name
 */
export function createDataFolder(newComponentPath, newComponentName) {
    let processedComponentName = newComponentName;

    if (processedComponentName.indexOf('-') > -1) {
        processedComponentName = '\'' + processedComponentName + '\'';
    }

    let dataFileContent = `var data = {${processedComponentName}: {}};`;

    fs.mkdirSync(newComponentPath + '/data');
    fs.appendFileSync(newComponentPath + '/data/data.js', '\n');

    fs.writeFileSync(
        newComponentPath + '/data/data.js',
        dataFileContent
    );
}

export function processFolders(path, folders) {
    folders.map(folder => {
        const folderPath = `${path}/${folder.name}`;
        const folderFiles = folder.files;
        const folderFolders = folder.folders;

        mkdirp.sync(folderPath);

        if (folderFiles && folderFiles.length) {
            writeFiles(folderPath, folderFiles);
        }

        if (folderFolders && folderFolders.length) {
            processFolders(folderPath, folderFolders);
        }
    });
}

export function generateComponent(newComponentPath, scheme) {
    return new Promise((resolve, reject) => {
        const initialFolders = scheme.folders;
        const initialFiles = scheme.files;

        mkdirp(newComponentPath, error => {
            if (error) {
                return reject(error);
            }

            try {
                if (initialFiles && initialFiles.length) {
                    writeFiles(newComponentPath, initialFiles);
                }

                if (initialFolders && initialFolders.length) {
                    processFolders(newComponentPath, initialFolders);
                }
            } catch (generationError) {
                return reject(generationError);
            }

            resolve();
        });
    });
}
