		<!-- Single Reference data is rendered within a fieldset -->
		<fieldset style="border: 1px solid grey; border-radius: 10px; padding: 15px; padding-top: 10px; margin-top: 5px; width: auto;"> 

			<legend style="font-size: 12px; text-decoration: none; margin: 0px; border: 0px; padding-left: 5px; padding-right: 5px; width: auto; font-weight: bold; color: grey;">
				{{data.label}} 
				( {{data.refMin}} .. 
					<span ng-if="data.refMax != 0">{{data.refMax}}</span>
					<span ng-if="data.refMax == 0">many</span>
				)
			</legend> 

			<div ng-app="appMultiRef"  id="{{data.label}}-multi-ref-app">

			<script>

				var appMultiRef = angular.module('appMultiRef', ['ui.grid']);
				appMultiRef.controller("appMultiRefController", 
				function ($scope) 
				{
				  $scope.myData = [
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
					$scope.gridOptionsMultiRef = {};
					$scope.gridOptionsMultiRef.data = [ {"name": "Fernando", "gender": "M", "company": "Synchronit"} ];
				});

/*
console.log(document.getElementById('dynControllers'));
console.log(angular.element(document.getElementById('dynControllers')));
console.log(angular.element(document.getElementById('dynControllers')).scope);
console.log(angular.element(document.getElementById('dynControllers')).scope());

					angular.element(document.getElementById('dynControllers')).scope().genDynController("DD22");
*/			
	
  			</script>

				<div id="{{data.label}}-multi-ref-ctrl"  ng-controller="appMultiRefController">

					<div ui-grid="{ data: myData, enableColumnMenus: false }"  class="myGrid" ></div>

				</div>
			</div>
			
		</fieldset>
		
