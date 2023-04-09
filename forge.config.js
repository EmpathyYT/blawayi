const path = require("path")

module.exports = {
    build: {
        extraResources: [
            {
                from: path.resolve(__dirname, 'storedData',),
                to: 'storage',
            },
        ],
    },
    packagerConfig: {
    },
    rebuildConfig: {},
    makers: [
        {
            name: '@electron-forge/maker-squirrel',
            config: {},
        },
        {
            name: '@electron-forge/maker-zip',
            platforms: ['darwin'],
        },
        {
            name: '@electron-forge/maker-deb',
            config: {},
        },
        {
            name: '@electron-forge/maker-rpm',
            config: {},
        },
    ],
};
