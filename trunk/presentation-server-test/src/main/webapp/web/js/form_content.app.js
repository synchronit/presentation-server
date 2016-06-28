
    var form_content = angular.module("form_content", ['broadcastService', 'FQLService', 'ui.grid', 'ui.grid.autoResize', 'ui.select' ]);

    form_content.directive('resizeableGrid', function() 
	{
		return  { 
					link: 	function($scope, elem, attrs) 
							{ 
								$scope.activateResize($scope, elem, attrs);
							}  
				}
	});

    form_content.directive('contextMenu', function() 
	{
		return  { 
					link: 	function($scope, elem, attrs) 
							{ 
								if ($scope.actualSelection != "NEW_FORM" )
								{
									$scope.defineContextMenu($scope, elem, attrs);
								}
							}  
				}
	});


