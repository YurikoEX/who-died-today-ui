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

interface IPersonEntry {
    name: string;
    pictureUrl?: string;
    details?: IDetails;
}

interface typedScope {
    deadType: deadType;
    graveyard: IPersonEntry[];
    selectDeadType: (type:deadType)=>void;
    alerts:any;
}

angular.module('deadViewer').controller('DeadCtrl',($scope,socketService, $interval)=>{
    var typedScope:typedScope = $scope;
    typedScope.deadType = deadType.Celeb;
    typedScope.graveyard = [{name:'James Horner'},{name:'Dick Van Patten'}];
    typedScope.selectDeadType = function(type){
        typedScope.deadType = type;
    };
    $interval( () => {
        console.log('calling socket');
        socketService.emit(
            'comm.ui-service.request.dead-fetcher-proxy.dead',
            deadType.Celeb,
            (err,result:IPersonEntry) => {
                console.log('results returned');
                if(err){
                    typedScope.alerts = [ { type: 'danger', msg: err }];
                }
                else {
                    var add = true;
                    for(var i = 0; i< typedScope.graveyard.length;i++){
                        if(typedScope.graveyard[i].name === result.name){
                            add=false;
                        }
                    }

                    if(add){
                        typedScope.graveyard.push(angular.copy(result));
                    }
                }
            });
    }, 5000 );

});
