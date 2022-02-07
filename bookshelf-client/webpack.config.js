const webpack = require('webpack');
const Dotenv = require('dotenv-webpack');

module.exports = {
    plugins: [
        new Dotenv({path: './.env'})
    ],

    resolve: {
        fallback : { 
            "buffer": require.resolve("buffer/"),
        }
    } 
};