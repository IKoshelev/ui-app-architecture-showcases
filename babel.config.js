process.env.NODE_ENV = 'test';

module.exports = function (api) {
    // https://babeljs.io/docs/en/config-files#apicache
    // api.cache(true);

    return {
        presets: [
            '@babel/preset-react',
            '@babel/preset-typescript',
            '@babel/preset-env'
        ],
        plugins: [
            ['@babel/plugin-proposal-decorators', { legacy: true }],
            ['@babel/plugin-proposal-class-properties', { loose: true }],
            ['@babel/plugin-proposal-optional-chaining', { loose: true }],
            '@babel/plugin-proposal-nullish-coalescing-operator',
            '@babel/plugin-proposal-object-rest-spread',
            '@babel/plugin-syntax-dynamic-import',
            ["babel-plugin-rewire"]
            ['inline-react-svg', { ignorePattern: /^(.(?!\.Component\.svg$))+$/ }]
        ]
    };
};