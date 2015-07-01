/// <reference path="../../../../typings/angularjs/angular.d.ts" />
angular.module('deadViewer').controller('DeadCtrl', function ($scope, socketService, $interval) {
    var typedScope = $scope;
    typedScope.streams = [{
        "id": 15097482160,
        "game": "League of Legends",
        "viewers": 21889,
        "preview": "http://static-cdn.jtvnw.net/previews-ttv/live_user_tsm_theoddone-400x300.jpg",
        "displayName": "TSM_TheOddOne",
        "logo": "http://static-cdn.jtvnw.net/jtv_user_pictures/tsm_theoddone-profile_image-338e7c68c54f0574-300x300.png",
        "statusMessage": "TSM TheOddOne Ranked 5s Hype, FFXIV at 8PM PDT",
        "url": "http://www.twitch.tv/tsm_theoddone",
        "followers": 809389,
        "views": 183575215
    }];
    var timer = 0;
    $interval(function () {
        console.log('calling socket');
        var streamRequest = { limit: 6 };
        socketService.emit('comm.ui-service.request.dead-fetcher-proxy.dead', streamRequest, function (err, results) {
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