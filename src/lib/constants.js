export const GENERAL_BUILD_OPTIONS = {
    'customFlags': {
        flag: '--customFlags',
        title: ' Custom flags'
    }
};

/**
 * Constats for build promt and processing
 * @type {Object}
 */
export const BUILD = {
    'release': {
        flag: '--release',
        title: ' Release mode'
    },
    'min': {
        flag: '--min',
        title: ' Minify files only'
    },
    ...GENERAL_BUILD_OPTIONS
};

export const DEV = {
    'livereload': {
        flag: '--lr',
        title: ' Start server for livereload'
    },
    'tunnel': {
        flag: '--tunnel',
        title: ' Start server for tunnel and livereload'
    },
    ...GENERAL_BUILD_OPTIONS
};

export const ADD_COMPONENT = {
    basic: {
        title: ' Basic files (js, html and stylies)'
    },
    assets: {
        title: ' Assets dir'
    },
    data: {
        title: ' Data dir'
    },
    full: {
        title: ' Full pack (all available folders and files)'
    },
    empty: {
        title: ' Just empty folder, without files'
    },
    template: {
        title: ' Make a copy of _template'
    },
    scheme: {
        title: ' Structure of new component is based on scheme file'
    },
    customPath: {
        title: ' Set path for new component (relative to component folder, without component name)'
    }
};

export const CONFIG = {
    js: {
        workflow: {
            'Concat (Just concatenation of JavaScript-files into one bundle)': 'concat',
            'Modular (Webpack will be used to resolve requires/imports between JavaScript-files)': 'modular'
        }
    },

    css: {
        workflow: {
            'Concat (Just concatenation of CSS-files into one bundle)': 'concat',
            'Manual (You import used style-files by yourself)': 'manual'
        }
    }
};

export const FS = {
    clearDir: {
        title: 'Clear current directory'
    },
    createDir: {
        title: 'Create new directory for project'
    },
    stopInit: {
        title: 'Stop init'
    }
};
