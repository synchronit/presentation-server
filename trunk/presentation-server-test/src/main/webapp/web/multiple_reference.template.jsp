		<!-- Multiple Reference data is rendered within a fieldset -->
		<fieldset style="border: 1px solid grey; border-radius: 10px; padding: 15px; padding-top: 10px; margin-top: 5px; width: auto;"> 

			<legend style="font-size: 12px; text-decoration: none; margin: 0px; border: 0px; padding-left: 5px; padding-right: 5px; width: auto; font-weight: bold; color: grey;">
				{{data.label}} 
				( {{data.refMin}} .. 
					<span ng-if="data.refMax != 0">{{data.refMax}}</span>
					<span ng-if="data.refMax == 0">many</span>
				)
			</legend> 

			<div ng-app="appMultiRef"  id="{{data.label}}-multi-ref-app" >

				<script>
				
					var appMultiRef = angular.module('appMultiRef', ['ui.grid', 'broadcastService']);
					appMultiRef.controller("appMultiRefController", 
					function ($scope, broadcastService) 
					{
						$scope.gridOptions = { };
						$scope.gridOptions.enableColumnMenus     = false;
						$scope.gridOptions.enableCellSelection   = true;
						$scope.gridOptions.enableCellEditOnFocus = true;

						$scope.gridOptions.columnDefs = broadcastService.getMultirefColumnDefs( $scope.$parent.data.label );


						// Gets the Data to initialize the Grid, representing the columns (and rows) of a multiple reference
						$scope.gridOptions.data = broadcastService.getMultirefData( $scope.$parent.data.label );
											
					});
		
	  			</script>
	
				<div id="{{data.label}}-multi-ref-ctrl"  ng-controller="appMultiRefController">

					<div ui-grid="gridOptions" ui-grid-edit ui-grid-resize-columns class="myGrid" ></div>

				</div>
			</div>
			
		</fieldset>
		
