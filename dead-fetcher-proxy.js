///<reference path='./node_modules/ironworks/ironworks.d.ts' />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var ironworks = require('ironworks');
var deadType;
(function (deadType) {
    deadType[deadType["Celeb"] = 0] = "Celeb";
    deadType[deadType["Musician"] = 1] = "Musician";
    deadType[deadType["Sports"] = 2] = "Sports";
})(deadType || (deadType = {}));
var DeadFetcherProxy = (function (_super) {
    __extends(DeadFetcherProxy, _super);
    function DeadFetcherProxy(opts) {
        _super.call(this, [
            'iw-cf-client'
        ], {
            id: ironworks.helpers.idHelper.newId(),
            name: 'dead-fetcher-proxy'
        });
        var defOpts = {};
        this.opts = this.opts.beAdoptedBy(defOpts, 'worker');
        this.opts.merge(opts);
    }
    DeadFetcherProxy.prototype.init = function (comm, whoService, cb) {
        this.setComm(comm, whoService);
        var instance = this;
        this.respond('dead', function (req, cb) {
            console.log("calling external service");
            instance.request('comm.dead-fetcher.request.dead-worker.dead', req, function (e, res) {
                cb(e, res);
            });
        });
        cb(null);
    };
    return DeadFetcherProxy;
})(ironworks.workers.Worker);
module.exports = DeadFetcherProxy;
//# sourceMappingURL=dead-fetcher-proxy.js.map