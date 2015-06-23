/// <reference path="../../../../typings/angularjs/angular.d.ts" />

interface deadType {
    deadType:string;
}

interface IDetails {
    cod: string;
    timestamp: number;
    location: string;
}

interface personEntry {
    name: string;
    pictureUrl: string;
    details: IDetails;
}

angular.module('deadViewer').controller('DeadCtrl',($scope,socketService, $interval)=>{
    $scope.deadType = 'celeb';
    $scope.graveyard:personEntry[] = [{name:'James Horner'},{name:'Dick Van Patten'}];
    $scope.selectDeadType = function(type){
        $scope.deadType = type;
    };
    $interval( () => {
        console.log('calling socket');
        socketService.emit(
            'comm.dead-fetcher.request.dead-worker.dead',
            <deadType>{deadType:$scope.deadType},
            (err,results:personEntry) => {
                console.log('results returned');
                if(err){
                    $scope.alerts = [ { type: 'danger', msg: err }];
                }
                else {
                    if(!_.any($scope.graveyard,function(person){
                        return person.name === results.name;
                    })){
                        $scope.graveyard.push(angular.copy(results));
                    }
                }
            });
    }, 5000 );

});
