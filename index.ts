///<reference path='./node_modules/ironworks/ironworks.d.ts' />
import ironworks = require('ironworks');
import path = require('path');
import _ = require('lodash');

import service = ironworks.service;

/**
 * Create a class to handle your UI service
 */
class Main {

    /**
     * This is the main iw service
     */
    public service:service.IService;

    /**
     * Constructor Function
     */
    constructor(){

        if (_.isUndefined(process.env.VCAP_APP_PORT)) {
            process.env.VCAP_APP_PORT = 8081;
        }

        if (_.isUndefined(process.env['VCAP_SERVICES'])) {
            process.env['VCAP_SERVICES'] = JSON.stringify(
                {
                    "user-provided": [
                        {
                            "credentials": {
                                "iw": "true",
                                "serviceName": "my-other-service",
                                "protocol": "http",
                                "host": "localhost",
                                "port": 8082,
                                "route": "",
                                "token": "qwer32r123rewr213r"
                            },
                            "label": "user-provided",
                            "name": "my-other-service",
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
    public init(){

        /**
         * Start injecting the functionality you want in your service in the form of workers
         */
        this.service.inject((service,addWorker)=>{

            /**
             * Add a HttpWorker to bind to the port and give the ability to serve RESTful services and static files
             */
            addWorker(new ironworks.workers.HttpWorker(service.comm,service.who(),{
                apiUri:'api',
                rootSitePagePath:'index.html',
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
            addWorker(new ironworks.workers.SocketWorker(service.comm,service.who()));

            /**
             * Cloud Foundry custom user provided services can be auto-wired up to your communication system. Zero work required!
             */
            addWorker(new ironworks.workers.CfClientWorker(service.comm,service.who()));

            /**
             * LogWorker follows the 12 factor logging standard of STDOUT/STDERR
             */
            addWorker(new ironworks.workers.LogWorker(service.comm, service.who()));
        });

        /**
         * Throw service level errors
         */
        this.service.info('error', (e) => {
            throw e;
        });

        /**
         * Log when ready
         */
        this.service.info('ready', (iw) => {
            this.service.comm.tell('SERVICE READY');
        });

        /**
         * Call the start event to start the service and enter the running state
         */
        this.service.start(new ironworks.collection.Collection('service-collection'),(e) => {
            this.service.comm.tell('SERVICE START');
        });

    }
}

/**
 * Start the Service
 */
var x =new Main();
x.init();
