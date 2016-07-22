const env = process.env.MIX_ENV === 'prod' ? 'production' : 'development';
const Webpack = require('webpack');

const plugins = {
    production: [
        new Webpack.optimize.UglifyJsPlugin({
            exclude: /\.phoenix\.js/i,
            compress: {warnings: false}
        })
    ],
    development: []
};

module.exports = {
    entry: {
        component: './web/static/js/containers/index.js'
    },
    output: {
        path: './priv/static/server/js',
        filename: 'app.js',
        library: 'app',
        libraryTarget: 'commonjs2'
    },
    module: {
        loaders: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel',
                query: {
                    plugins: ['transform-decorators-legacy', 'transform-class-properties'],
                    presets: ['react', 'es2015', 'stage-2']
                }
            }
        ]
    },
    resolve: {
        extensions: ['', '.js'],
        modulesDirectories: ['node_modules', __dirname + '/web/static/js']
    },
    plugins: [
        // Important to keep React file size down
        new Webpack.DefinePlugin({
            'process.env': {
                'NODE_ENV': JSON.stringify(env)
            }
        })
    ].concat(plugins[env])
};
