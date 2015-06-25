/// <reference path="../../../../typings/angularjs/angular.d.ts" />

enum deadType {
    Celeb,
    Musician,
    Sports
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

interface typedScope {
    deadType:deadType;
    graveyard:personEntry[];
    selectDeadType: any;
    alerts: any;
}

angular.module('deadViewer').controller('DeadCtrl',($scope,socketService, $interval)=>{
    var typedScope = $scope;
    $scope.deadType = deadType.Celeb;
    $scope.graveyard:personEntry[] = [{name:'James Horner'},{name:'Dick Van Patten'}];
    $scope.selectDeadType = function(type){
        $scope.deadType = type;
    };
    $interval( () => {
        console.log('calling socket');
        socketService.emit(
            'comm.dead-fetcher.request.dead-worker.dead',
            $scope.deadType,
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
