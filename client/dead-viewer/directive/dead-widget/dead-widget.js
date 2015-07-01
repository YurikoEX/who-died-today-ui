angular.module('deadViewer').directive('deadWidget', function() {
	return {
		restrict: 'E',
		replace: true,
		scope: {
            stream: '='
        },
		templateUrl: 'dead-viewer/directive/dead-widget/dead-widget.html',
		link: function(scope, element, attrs, fn) {


		}
	};
});
