angular.module('modalWindow', ['ngAnimate', 'ui.bootstrap', 'ui.grid', 'ui.grid.selection', 'ui.grid.resizeColumns', 'ui.grid.edit', 'broadcastService']);
angular.module('modalWindow').controller('ModalDemoCtrl', function ($scope, $modal, $log ) {

  $scope.animationsEnabled = true;

  $scope.$on('multipleResults', function() 
  {
		$scope.open('lg');
  });    	
	
  $scope.open = function (size) {

    var modalInstance = $modal.open({
      animation: $scope.animationsEnabled,
      templateUrl: 'myModalContent.html',
      controller: 'ModalInstanceCtrl',
      size: size,
      resolve: {
        items: function () {
          return $scope.items;
        }
      }
    });

    modalInstance.result.then(function (selectedItem) {
      $scope.selected = selectedItem;
    }, function () {
//    $log.info('Modal dismissed at: ' + new Date());
    });
  };

  $scope.toggleAnimation = function () {
    $scope.animationsEnabled = !$scope.animationsEnabled;
  };
  
});

// Please note that $modalInstance represents a modal window (instance) dependency.
// It is not the same as the $modal service used above.

angular.module('modalWindow').controller('ModalInstanceCtrl', function ($scope, $modalInstance, uiGridConstants, broadcastService) {

	$scope.gridOptions = { enableRowSelection: true, enableRowHeaderSelection: false };

    $scope.gridOptions.multiSelect = false;
    $scope.gridOptions.modifierKeysToMultiSelect = false;
    $scope.gridOptions.noUnselect = true;
    $scope.gridOptions.onRegisterApi = function( gridApi ) {
		$scope.gridApi = gridApi;

		gridApi.selection.on.rowSelectionChanged
		( $scope, function(row)
			{
		//      console.log(row.entity);
		//		console.log(row.entity.internal_row_id);
				broadcastService.setRowSelected(row.entity.internal_row_id, $scope.response);		
				$scope.cancel();
			}
		);

    };

	$scope.ok = function () {
	    $modalInstance.close($scope.selected.item);
	};

	$scope.cancel = function () {
    	$modalInstance.dismiss('cancel');
	};

	/************************************************************************/
	/** Generates the label for the Grid, adding the reference path **/
  	$scope.generateLabel = function(response, h) 
  	{
		var result = response.resultSet.headers[h].label;
		if (response.resultSet.headers[h].referencedData.length > 0)
		{
			result += '_' + response.resultSet.headers[h].referencedData.join('_');
		}
		return result;
  	}
  	
	/******************************************************************(*********************/
	/** Generates the label to be displayed on the Grid header, without the reference path **/
  	$scope.generateDisplayLabel = function(response, h) 
  	{
		var result = '';
		if (response.resultSet.headers[h].referencedData.length == 0)
		{
			result = response.resultSet.headers[h].label;
		}
		else
		{
			var last = response.resultSet.headers[h].referencedData.length - 1;
			result  += response.resultSet.headers[h].referencedData[last];
		}
		return result;
  	}
  	

	/***************************************************************************
	 * Function to load the response on the table to be shown (used just below)
	 ***************************************************************************/

	$scope.parseResponse = function (response) {

	/*********
  	Example of response:
  	{"code":100,
  	 "message":"11 cases returned.",
  	 "resultSet":
  	 	{"headers":
  	 		[{"label":"ID","type":"NUMBER"},
  	 		 {"label":"NAME","type":"TEXT"},
  	 		 {"label":"SEX","type":"REFERENCE"}],
  	 	 "rows":
  	 	 	[
  	 	 		["1","FERNANDO","MASCULINO"],
  	 	 		["1","ALVARO","MASCULINO"],
  	 	 		["3","MARIA","FEMENINO"],
  	 	 		["1","JUAN","M"],
  	 	 		["100","JUAN 100","M"],
  	 	 		...
  	 	 		["3","MARIA","F"]
  	 	 	]
  	 	 },
  	 	 "debugInfo":["select PERSON.ID, PERSON.NAME, SEX.SEX from PERSON left outer join SEX on PERSON.SEX = SEX.FQL_ID"]}
	*********/

	  	var responseData = [];
	  	
	  	for (var r=0; r < response.resultSet.rows.length; r++)
	  	{
	  		var rowData = {};
	  		for (var h=0; h < response.resultSet.headers.length; h++)
	  		{
	  			rowData[ $scope.generateLabel(response, h) ] = response.resultSet.rows[r][h];
	  		}
	  		rowData["internal_row_id"] = r;	// Internal ID to keep track of the rows
	  		responseData.push(rowData);
	  	}
//console.log(responseData);	

		return responseData;
	
	}  

	$scope.response = broadcastService.getResponse();		
	var responseData = $scope.parseResponse($scope.response);
//  console.log(responseData);

	$scope.gridOptions.data = responseData;

	$scope.gridOptions.columnDefs = [];
	for (var h=0; h < $scope.response.resultSet.headers.length; h++)
	{
		$scope.gridOptions.columnDefs.push( { field:       $scope.generateLabel($scope.response, h), 
											  displayName: $scope.generateDisplayLabel($scope.response, h) } );
	}
	$scope.gridOptions.columnDefs.push( { name: "internal_row_id", visible: false } );
	    
});
