import { importJSON } from '../../utils';

export default class Scheme {
    constructor(schemeFilePath, newComponentName, templater, cssPreprocessor) {
        Object.assign(this, {schemeFilePath, newComponentName, templater, cssPreprocessor});
    }

    parseScheme = (schemeConfig) => {
        const {newComponentName, templater, cssPreprocessor} = this;

        return new Promise(resolve => {
            const stringifiedConfig = JSON.stringify(schemeConfig);

            const processedConfig = stringifiedConfig
                .replace(/__componentName__/g, newComponentName)
                .replace(/__templateExtension__/g, templater)
                .replace(/__cssExtension__/g, cssPreprocessor);

            const processedConfigObject = JSON.parse(processedConfig);
            resolve(processedConfigObject);
        });
    }

    loadSchemeFile = () => {
        let { schemeFilePath } = this;

        return new Promise((resolve, reject) => {

            if (schemeFilePath.indexOf('.json') === -1) {
                schemeFilePath += '.json';
            }

            try {
                resolve(importJSON(schemeFilePath));
            } catch (error) {
                reject(error);
            }
        });
    }
}
