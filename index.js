///<reference path='./node_modules/ironworks/ironworks.d.ts' />
var ironworks = require('ironworks');
var path = require('path');
var _ = require('lodash');
var DeadFetcherProxy = require('./dead-fetcher-proxy');
/**
 * Create a class to handle your UI service
 */
var Main = (function () {
    /**
     * Constructor Function
     */
    function Main() {
        if (_.isUndefined(process.env.VCAP_APP_PORT)) {
            process.env.VCAP_APP_PORT = 8081;
        }
        if (_.isUndefined(process.env['VCAP_SERVICES_test1'])) {
            process.env['VCAP_SERVICES_test1'] = JSON.stringify({
                "user-provided": [
                    {
                        "credentials": {
                            "iw": "true",
                            "serviceName": "dead-fetcher",
                            "protocol": "http",
                            "host": "localhost",
                            "port": 8082,
                            "route": "",
                            "token": "qwer32r123rewr213r"
                        },
                        "label": "user-provided",
                        "name": "dead-fetcher",
                        "syslog_drain_url": "",
                        "tags": []
                    }
                ]
            });
        }
        /**
         * This is the main service for ironworks
         * @type {"ironworks".service.Service}
         */
        this.service = new ironworks.service.Service('ui-service');
    }
    /**
     * Init method is used to start the application
     */
    Main.prototype.init = function () {
        var _this = this;
        /**
         * Local Worker
         */
        this.service.use(new DeadFetcherProxy());
        /**
         * Start injecting the functionality you want in your service in the form of workers
         */
        this.service.use(new ironworks.workers.HttpWorker({
            apiUri: 'api',
            rootSitePagePath: 'index.html',
            hapi: {
                connections: {
                    routes: {
                        files: {
                            relativeTo: path.resolve('./client/dist')
                        }
                    }
                }
            }
        }));
        /**
         * SocketWorker gives the ability for your service to communicate through websockets
         */
        this.service.use(new ironworks.workers.SocketWorker());
        /**
         * Cloud Foundry custom user provided services can be auto-wired up to your communication system. Zero work required!
         */
        this.service.use(new ironworks.workers.CfClientWorker({ vcapServices: 'VCAP_SERVICES_test1' }));
        /**
         * LogWorker follows the 12 factor logging standard of STDOUT/STDERR
         */
        this.service.use(new ironworks.workers.LogWorker());
        /**
         * Throw service level errors
         */
        this.service.info('error', function (e) {
            throw e;
        });
        /**
         * Log when ready
         */
        this.service.info('ready', function (iw) {
            _this.service.comm.tell('SERVICE READY');
        });
        /**
         * Call the start event to start the service and enter the running state
         */
        this.service.start(new ironworks.collection.Collection('service-collection'), function (e) {
            _this.service.comm.tell('SERVICE START');
        });
    };
    return Main;
})();
/**
 * Start the Service
 */
var x = new Main();
x.init();
//# sourceMappingURL=index.js.map