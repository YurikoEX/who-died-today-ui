///<reference path='./node_modules/ironworks/ironworks.d.ts' />
import ironworks = require('ironworks');
import path = require('path');
import _ = require('lodash');

import service = ironworks.service;
import HttpWorker = ironworks.workers.HttpWorker;
import SocketWorker = ironworks.workers.SocketWorker;
import CfClientWorker = ironworks.workers.CfClientWorker;
import LogWorker = ironworks.workers.LogWorker;
import Collection = ironworks.collection.Collection;

import DeadFetcherProxy = require('./dead-fetcher-proxy');

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
         * Local Worker
         */
        this.service.use(new DeadFetcherProxy());


        /**
         * Start injecting the functionality you want in your service in the form of workers
         */
        this.service.use(new HttpWorker({
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
        this.service.use(new SocketWorker());

        /**
         * Cloud Foundry custom user provided services can be auto-wired up to your communication system. Zero work required!
         */
        this.service.use(new CfClientWorker());



        /**
         * LogWorker follows the 12 factor logging standard of STDOUT/STDERR
         */
        this.service.use(new LogWorker());

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
        this.service.start(new Collection('service-collection'),(e) => {
            this.service.comm.tell('SERVICE START');
        });

    }
}

/**
 * Start the Service
 */
var x =new Main();
x.init();
