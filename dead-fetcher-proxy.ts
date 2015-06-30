
///<reference path='./node_modules/ironworks/ironworks.d.ts' />

import ironworks = require('ironworks');

enum deadType {
    Celeb,
    Musician,
    Sports
}

interface IDetails {
    cod: string;
    timestamp: number;
    location: string;
}

interface IPersonEntry {
    name: string;
    pictureUrl: string;
    details: IDetails;
}

interface IDeadFetcherProxyOpts {}

class DeadFetcherProxy extends ironworks.workers.Worker {
    constructor(opts?: IDeadFetcherProxyOpts) {
        super([
            'iw-cf-client'
        ], {
            id: ironworks.helpers.idHelper.newId(),
            name: 'dead-fetcher-proxy'
        });

        var defOpts: IDeadFetcherProxyOpts = { };
        this.opts = this.opts.beAdoptedBy<IDeadFetcherProxyOpts>(defOpts, 'worker');
        this.opts.merge(opts);
    }

    public init(comm, whoService, cb) {
        this.setComm(comm, whoService);
        var instance = this;
        this.respond<deadType, IPersonEntry>('dead', (req, cb) => {
            console.log("calling external service");
            instance.request<deadType, IPersonEntry>('comm.dead-fetcher.request.dead-worker.dead', req, (e, res) => {
                cb(e, res);
            });
        });
        cb(null);
    }
}

export = DeadFetcherProxy;
