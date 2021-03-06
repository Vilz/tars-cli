import commentJson from 'comment-json';

export default function updatePluginsConfig(downloadedPluginsConfigString, currentPluginsConfigString, tarsConfig, currentTarsVersion) {
    let parsedPluginsConfig = {};
    const parsedDownloadedPluginsConfig = commentJson.parse(downloadedPluginsConfigString);
    const browserSyncConfig = tarsConfig.browserSyncConfig;

    if (currentTarsVersion < '1.8.0' && browserSyncConfig && tarsConfig.autoprefixerConfig) {
        parsedPluginsConfig = {
            browserSync: {
                server: {
                    baseDir: browserSyncConfig.baseDir
                },
                port: browserSyncConfig.port,
                open: browserSyncConfig.open,
                browser: browserSyncConfig.browser,
                startPath: browserSyncConfig.startUrl,
                notify: browserSyncConfig.useNotifyInBrowser,
                injectChanges: browserSyncConfig.injectChanges
            },
            autoprefixerConfig: tarsConfig.autoprefixerConfig,
            browserSyncConfig: undefined // eslint-disable-line no-undefined
        };
    } else {
        parsedPluginsConfig = commentJson.parse(currentPluginsConfigString);
    }

    if (currentTarsVersion < '1.9.0') {
        parsedPluginsConfig['gulp-minify-html'] = undefined; // eslint-disable-line no-undefined
    }

    parsedPluginsConfig = Object.assign(
        parsedDownloadedPluginsConfig,
        parsedPluginsConfig
    );

    return commentJson.stringify(parsedPluginsConfig, null, 4);
}


