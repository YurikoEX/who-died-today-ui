/// <reference path="../../../../typings/angularjs/angular.d.ts" />

interface typedScope {
    streams: IStream[];
    alerts:any;
}

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

angular.module('deadViewer').controller('DeadCtrl',($scope,socketService, $interval)=>{
    var typedScope:typedScope = $scope;
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
    },
        {
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
        }
    ];
    var timer = 0;
    $interval( () => {
        console.log('calling socket');

        var streamRequest: IStreamRequest = {limit:6};

        socketService.emit(
            'comm.ui-service.request.dead-fetcher-proxy.dead', streamRequest,
            (err,results:IStream[]) => {
                console.log('results returned');
                if(err){
                    typedScope.alerts = [{ type: 'danger', msg: err }];
                }
                else {

                    for(var i=0; i < results.length; i++){
                        results[i].preview = results[i].preview.replace("{width}", "400").replace("{height}", "300");
                    }

                    typedScope.streams = results;
                }
            });
        timer = 1000 * 60;
    }, timer);

});

