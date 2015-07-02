/// <reference path="../../../../typings/angularjs/angular.d.ts" />
import IStream = require('../../../../node_modules/iw-twitchy-interface/IStream');
import IStreamRequest = require('../../../../node_modules/iw-twitchy-interface/IStreamRequest');

interface typedScope {
    streams: IStream[];
    alerts:any;
}

angular.module('deadViewer').controller('DeadCtrl',($scope, socketService, $interval)=>{
    var typedScope:typedScope = $scope;
    var width = 400;
    var height = 300;

    //TODO: REMOVE - FOR UI TESTING ONLY
    var json = '[{"id":15114290608,"game":"Hearthstone: Heroes of Warcraft","viewers":13269,"preview":"http://static-cdn.jtvnw.net/previews-ttv/live_user_amazhs-{width}x{height}.jpg","displayName":"AmazHS","logo":"http://static-cdn.jtvnw.net/jtv_user_pictures/amazhs-profile_image-128bb4f9fe96c7ba-300x300.png","statusMessage":"â—„ATLCâ–º [REBROADCAST] Week 1, Day 1 - Nihilum vs Archon, Cloud 9 vs Value Town | $250,000 Archon Team League Championships","url":"http://www.twitch.tv/amazhs","followers":459391,"views":36400423},{"id":15117268896,"game":"DayZ","viewers":12521,"preview":"http://static-cdn.jtvnw.net/previews-ttv/live_user_goldglove-{width}x{height}.jpg","displayName":"GoldGlove","logo":"http://static-cdn.jtvnw.net/jtv_user_pictures/goldglove-profile_image-ebb22ee6cccace23-300x300.png","statusMessage":"Happy Humpday w/ Goldy  - Quest for 900k Followers!","url":"http://www.twitch.tv/goldglove","followers":856775,"views":29950780},{"id":15116915568,"game":"Hearthstone: Heroes of Warcraft","viewers":11340,"preview":"http://static-cdn.jtvnw.net/previews-ttv/live_user_nl_kripp-{width}x{height}.jpg","displayName":"nl_Kripp","logo":"http://static-cdn.jtvnw.net/jtv_user_pictures/nl_kripp-profile_image-294722d79072f28f-300x300.png","statusMessage":"TSM Kripp Plays The Brawls! Short Streams Continue :( Kripp Shirts! http://www.designbyhumans.com/shop/Kripp/ (â—•â€¿â—•âœ¿)(â—•â€¿â—•âœ¿)","url":"http://www.twitch.tv/nl_kripp","followers":545821,"views":117234663},{"id":15110962768,"game":"World of Warcraft: Warlords of Draenor","viewers":9491,"preview":"http://static-cdn.jtvnw.net/previews-ttv/live_user_sodapoppin-{width}x{height}.jpg","displayName":"sodapoppin","logo":"http://static-cdn.jtvnw.net/jtv_user_pictures/sodapoppin-profile_image-10049b6200f90c14-300x300.png"},{"id":15117266928,"game":"League of Legends","viewers":8766,"preview":"http://static-cdn.jtvnw.net/previews-ttv/live_user_streamdogordox-{width}x{height}.jpg","displayName":"streamdogORDOx","logo":"http://static-cdn.jtvnw.net/jtv_user_pictures/streamdogordox-profile_image-f1700bb5f64f5a1a-300x300.png","statusMessage":"GORDOX BRAZILIAN NEWBIE AND MUCA MURIÃ‡OCA DUO IS BACK ","url":"http://www.twitch.tv/streamdogordox","followers":151491,"views":9640927},{"id":15113200960,"game":"Counter-Strike: Global Offensive","viewers":8756,"preview":"http://static-cdn.jtvnw.net/previews-ttv/live_user_joshog-{width}x{height}.jpg","displayName":"JoshOG","logo":"http://static-cdn.jtvnw.net/jtv_user_pictures/joshog-profile_image-b0a3bcdb24239f3f-300x300.png","statusMessage":"Charity Day w/ JoshOG ~~ TWITTER GIVEAWAY: https://twitter.com/JoshOG/status/616154357487280128","url":"http://www.twitch.tv/joshog","followers":654000,"views":14574141},{"id":15113810768,"game":"League of Legends","viewers":8709,"preview":"http://static-cdn.jtvnw.net/previews-ttv/live_user_trick2g-{width}x{height}.jpg","displayName":"Trick2g","logo":"http://static-cdn.jtvnw.net/jtv_user_pictures/trick2g-profile_image-49f3cee5732742ee-300x300.jpeg","statusMessage":"2g Plat vs Diamond | Trick Specs Bronze 9k | Subwars | Gates","url":"http://www.twitch.tv/trick2g","followers":776057,"views":93159844},{"id":15112989808,"game":"Poker","viewers":7319,"preview":"http://static-cdn.jtvnw.net/previews-ttv/live_user_pokercentral-{width}x{height}.jpg","displayName":"PokerCentral","logo":"http://static-cdn.jtvnw.net/jtv_user_pictures/pokercentral-profile_image-32626bf9db60a9d3-300x300.png","statusMessage":"Super High Roller Cash Game - LIVE AT ARIA","url":"http://www.twitch.tv/pokercentral","followers":11820,"views":1904313}]';
    json = json.replace(/\{width}/g, width.toString()).replace(/\{height}/g, height.toString());
    typedScope.streams = JSON.parse(json);

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
                        results[i].preview = results[i].preview.replace("{width}", width.toString()).replace("{height}", height.toString());
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
