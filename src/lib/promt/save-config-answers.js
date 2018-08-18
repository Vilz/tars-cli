import fs from 'fs';
import { CONFIG } from '../constants';

/**
 * Save answers from promt to local tars-config
 * @param  {Object} answers Answers from fs-promts
 */
export default async function saveConfigAnswers(answers) {
    const cwd = process.cwd();
    const originalConfig = await import(`${cwd}/tars-config.js`);
    const templaterName = answers.templater;
    let newConfig = Object.assign({}, originalConfig);

    // Set useNotify option
    newConfig.notifyConfig.useNotify = answers.useNotify;

    newConfig = Object.assign(newConfig, {
        templater: templaterName ? templaterName.toLowerCase() : originalConfig.templater,
        cssPreprocessor: answers.preprocessor ? answers.preprocessor.toLowerCase() : originalConfig.cssPreprocessor,
        staticPrefix: `${answers.staticFolderName}/`,
        useImagesForDisplayWithDpi: answers.useImagesForDisplayWithDpi,
        fs: {
            staticFolderName: answers.staticFolderName,
            imagesFolderName: answers.imagesFolderName,
            componentsFolderName: answers.componentsFolderName,
            pagesFolderName: answers.pagesFolderName,
        }
    });

    newConfig.js = Object.assign(
        newConfig.js,
        {
            workflow: CONFIG.js.workflow[answers.jsWorkflow],
            useBabel: answers.useBabel,
            lint: answers.useLint
        }
    );

    newConfig.css = Object.assign(
        newConfig.css,
        {
            workflow: CONFIG.css.workflow[answers.cssWorkflow]
        }
    );

    const newConfigFileContent = `module.exports = ${JSON.stringify(newConfig, null, 4)};`;

    fs.writeFileSync(`${cwd}/tars-config.js`, newConfigFileContent);
}
