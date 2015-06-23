angular.module('whoDiedTodayUi', ['ui.bootstrap', 'ui.utils', 'ui.router', 'ngAnimate', 'deadViewer', 'socketModule']);

angular.module('whoDiedTodayUi').config(function($stateProvider, $urlRouterProvider) {

    /* Add New States Above */
    $urlRouterProvider.otherwise('/dead');

});

angular.module('whoDiedTodayUi').run(function($rootScope) {

    $rootScope.safeApply = function(fn) {
        var phase = $rootScope.$$phase;
        if (phase === '$apply' || phase === '$digest') {
            if (fn && (typeof(fn) === 'function')) {
                fn();
            }
        } else {
            this.$apply(fn);
        }
    };

});
