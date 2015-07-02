/// <reference path="../../../../typings/angularjs/angular.d.ts" />
import IStream = require('../../../../node_modules/iw-twitchy-interface/IStream');
import IStreamRequest = require('../../../../node_modules/iw-twitchy-interface/IStreamRequest');

interface typedScope {
    streams: IStream[];
    alerts:any;
}

angular.module('deadViewer').controller('DeadCtrl',($scope, socketService, $interval)=>{
    var typedScope:typedScope = $scope;
    typedScope.streams = [];

    function update() {
        var streamRequest:IStreamRequest = {limit: 8};
        console.log('submitting socketcall');
        socketService.emit(
            'comm.twitch-service.request.twitch-worker.get-streams', streamRequest,
            (err, results:IStream[]) => {
                console.log('results returned');
                if (err) {
                    typedScope.alerts = [{type: 'danger', msg: err}];
                }
                else {

                    for (var i = 0; i < results.length; i++) {
                        results[i].preview = results[i].preview.replace("{width}", "400").replace("{height}", "300");
                    }

                    typedScope.streams = results;
                }
            }
        );
    }

    update();

    $interval(()=>{
        update();
    },1000*30);
});
