
///<reference path='./node_modules/ironworks/ironworks.d.ts' />

import ironworks = require('ironworks');

interface IStreamRequest {
    limit: number;
    offset?: number;
}

interface IStream {
    id: number;
    game: string;
    viewers: number;
    preview: string;
    displayName: string;
    logo: string;
    statusMessage: string;
    url: string;
    followers: number;
    views: number;
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
        this.respond<IStreamRequest, IStream[]>('dead', (req, cb) => {
            console.log("calling external service");
            instance.request<IStreamRequest, IStream[]>('comm.twitch-service.request.twitch-worker.get-streams', req, (e, res) => {
                cb(e, res);
            });
        });
        cb(null);
    }
}

export = DeadFetcherProxy;
