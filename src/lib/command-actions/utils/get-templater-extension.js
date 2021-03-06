/**
 * Set templates extension
 * @param {string} templater Templater
 * @return {string} Templater extension
 */
export default function getTemplaterExtension(templater) {
    switch (templater) {
        case 'handelbars':
        case 'handlebars':
        case 'hdb':
        case 'hb':
            return 'html';
        case 'pug':
        default:
            return 'pug';
    }
}
