
    var form_content = angular.module("form_content", ['formSelectedService'])
    	.controller( 'formSelectedController', ['$scope', 'formSelectedService', function($scope, formSelectedService) 
    	{
		    $scope.formSelected = {};
		    $scope.$on('newFormSelected', function() 
		    {
				$scope.formSelected = formSelectedService.getFormSelected();
			});    	
    	}])
    ;

