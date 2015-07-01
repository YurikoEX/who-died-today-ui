/// <reference path="../../../../typings/angularjs/angular.d.ts" />
var deadType;
(function (deadType) {
    deadType[deadType["Celeb"] = 0] = "Celeb";
    deadType[deadType["Musician"] = 1] = "Musician";
    deadType[deadType["Sports"] = 2] = "Sports";
})(deadType || (deadType = {}));
angular.module('deadViewer').controller('DeadCtrl', function ($scope, socketService, $interval) {
    var typedScope = $scope;
    typedScope.deadType = deadType.Celeb;
    typedScope.graveyard = [{ name: 'James Horner' }, { name: 'Dick Van Patten' }];
    typedScope.selectDeadType = function (type) {
        typedScope.deadType = type;
    };
    $interval(function () {
        console.log('calling socket');
        socketService.emit('comm.ui-service.request.dead-fetcher-proxy.dead', deadType.Celeb, function (err, result) {
            console.log('results returned');
            if (err) {
                typedScope.alerts = [{ type: 'danger', msg: err }];
            }
            else {
                var add = true;
                for (var i = 0; i < typedScope.graveyard.length; i++) {
                    if (typedScope.graveyard[i].name === result.name) {
                        add = false;
                    }
                }
                if (add) {
                    typedScope.graveyard.push(angular.copy(result));
                }
            }
        });
    }, 5000);
});
//# sourceMappingURL=dead.js.map