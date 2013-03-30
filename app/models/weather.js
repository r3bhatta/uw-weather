/**
 * Service for retrieving the data from the external api, parsing the data, and returning it.
 */
var request = require('./request'),
    configs = require('./../../config'),
    w = require('winston'),
    redis = require('./redis').getClient();

var WeatherModel = function() {
    return this;
};

/**
 * Request the weather information from the API.
 *
 * @param {Object} req The request parameters.
 * @param {Object} res The response object to send the data.
 * @param {function} callback The callback to call when the request is complete.
 */
WeatherModel.prototype.get = function(req, res, callback) {
    var url = 'http://api.uwaterloo.ca/public/v1/?key=' + configs.weatherKey + '&service=weather&output=json';
    redis.get(url, function(err, value) {
        if (err) {
            w.error(err);
        } else if (!value) {
            request.get(url, {}, function(err, data) {
                if (err) {
                    w.error(err);
                } else {
                    w.info('Redis set key for: ' + url);
                    redis.set(url, JSON.stringify(data));
                    redis.expire(url, WeatherModel.EXPIRY_PERIOD_);
                    callback(data);
                }
            });
        } else {
            w.info('Redis get key for: ' + url);
            redis.ttl(url, function(err, time) {
                w.info('Time before expire: ' + time);  
            });
            callback(JSON.parse(value));
        }
    });
};

WeatherModel.EXPIRY_PERIOD_ = 900;

module.exports = WeatherModel;

