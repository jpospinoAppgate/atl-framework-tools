const axios = require('axios');

module.exports.callGetService = (options, path, callback) => {

    const instance = axios.create(options);

    instance.get(path).then((response) => {
        return callback(null, response);
    });
};