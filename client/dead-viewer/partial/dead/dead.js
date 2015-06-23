/// <reference path="../../../../typings/angularjs/angular.d.ts" />
angular.module('deadViewer').controller('DeadCtrl', function ($scope, socketService, $interval) {
    $scope.deadType = 'celeb';
    $scope.graveyard = [{ name: 'James Horner' }, { name: 'Dick Van Patten' }];
    $scope.selectDeadType = function (type) {
        $scope.deadType = type;
    };
    $interval(function () {
        console.log('calling socket');
        socketService.emit('comm.dead-fetcher.request.dead-worker.dead', { deadType: $scope.deadType }, function (err, results) {
            console.log('results returned');
            if (err) {
                $scope.alerts = [{ type: 'danger', msg: err }];
            }
            else {
                if (!_.any($scope.graveyard, function (person) {
                    return person.name === results.name;
                })) {
                    $scope.graveyard.push(angular.copy(results));
                }
            }
        });
    }, 5000);
});
//# sourceMappingURL=dead.js.map