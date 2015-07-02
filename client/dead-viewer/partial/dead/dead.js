angular.module('deadViewer').controller('DeadCtrl', function ($scope, socketService, $interval) {
    var typedScope = $scope;
    typedScope.streams = [];
    var timer = 0;
    $interval(function () {
        console.log('calling socket');
        var streamRequest = { limit: 8 };
        socketService.emit('comm.twitch-service.request.twitch-worker.get-streams', streamRequest, function (err, results) {
            console.log('results returned');
            if (err) {
                typedScope.alerts = [{ type: 'danger', msg: err }];
            }
            else {
                for (var i = 0; i < results.length; i++) {
                    results[i].preview = results[i].preview.replace("{width}", "400").replace("{height}", "300");
                }
                typedScope.streams = results;
            }
        });
        timer = 1000 * 60;
    }, timer);
});
//# sourceMappingURL=dead.js.map