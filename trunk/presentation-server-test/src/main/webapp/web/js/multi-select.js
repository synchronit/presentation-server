angular.module('modalWindow', ['ngAnimate', 'ui.bootstrap', 'ui.grid', 'ui.grid.selection', 'broadcastService']);
angular.module('modalWindow').controller('ModalDemoCtrl', function ($scope, $modal, $log ) {

  $scope.items = ['item1', 'item2', 'item3'];

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
      $log.info('Modal dismissed at: ' + new Date());
    });
  };

  $scope.toggleAnimation = function () {
    $scope.animationsEnabled = !$scope.animationsEnabled;
  };
  
});

// Please note that $modalInstance represents a modal window (instance) dependency.
// It is not the same as the $modal service used above.

angular.module('modalWindow').controller('ModalInstanceCtrl', function ($scope, $modalInstance, items, uiGridConstants, broadcastService) {

  $scope.items = items;
  $scope.selected = {
    item: $scope.items[0]
  };

  $scope.ok = function () {
    $modalInstance.close($scope.selected.item);
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
  
	$scope.gridOptions = { enableRowSelection: true, enableRowHeaderSelection: false };
    $scope.gridOptions.multiSelect = false;
    $scope.gridOptions.modifierKeysToMultiSelect = false;
//    $scope.gridOptions.noUnselect = true;
    $scope.gridOptions.onRegisterApi = function( gridApi ) {
      $scope.gridApi = gridApi;
    };

    $scope.gridOptions.enableRowSelection = true;

	/***************************
	$scope.myData = 
	[
	    {
	        "firstName": "Cox",
	        "lastName": "Carney",
	        "company": "Enormo",
	        "employed": true
	    },
	    {
	        "firstName": "Lorraine",
	        "lastName": "Wise",
	        "company": "Comveyer",
	        "employed": false
	    },
	    {
	        "firstName": "Nancy",
	        "lastName": "Waters",
	        "company": "Fuelton",
	        "employed": false
	    }
	];
	***************************/

	/************************************************
	 * Loads the response on the table to be shown
	 ************************************************/

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
	  			rowData[response.resultSet.headers[h].label] = response.resultSet.rows[r][h];
	  		}
	  		responseData.push(rowData);
	  	}
	
		return responseData;
	
	}  

	var response = broadcastService.getResponse();
		
	var responseData = $scope.parseResponse(response);
//console.log(responseData);
		
	$scope.myData = responseData;
  
});
