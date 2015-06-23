angular.module('deadViewer', ['ui.bootstrap','ui.utils','ui.router','ngAnimate']);

angular.module('deadViewer').config(function($stateProvider) {

    $stateProvider.state('dead', {
        url: '/dead',
        templateUrl: 'dead-viewer/partial/dead/dead.html'
    });
    /* Add New States Above */

});

