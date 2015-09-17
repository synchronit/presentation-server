
    var form_content = angular.module("form_content", ['formSelectedService'])
    	.controller
    	( 'formSelectedController', 
    		['$scope', '$http', 'formSelectedService', function($scope, $http, formSelectedService) 
    			{

				    $scope.formSelected = {};

				    $scope.$on('newFormSelected', function() 
				    {
						$scope.formSelected = formSelectedService.getFormSelected();
					});    	

					$scope.getDataValueList = function(data, firstComma) 
					{
						var dataValueList = "";
						var comma         = firstComma;
console.log("getDataValueList: comes with "+data);						
						for (var i=0; i<data.length; i++)
						{
							dataValueList += (data[i].type == "TEXT")      ? comma + '"'+data[i].value+'"' : "";
							dataValueList += (data[i].type == "NUMBER")    ? comma +     data[i].value     : "";
							dataValueList += (data[i].type == "BOOLEAN")   ? comma +     data[i].value     : "";
							dataValueList += (data[i].type == "REFERENCE") ? $scope.getDataValueList(data[i].children, ', ')  : "";
							comma = ', ';
						}
console.log("getDataValueList Returns : "+dataValueList);						
						return dataValueList;
					}

					$scope.createNew = function()
					{
						var form = $scope.formSelected;
						data = form.children;

						if (!form.label || form.label == '')
						{
							alert("Please select a Form in order to enable this action");
						}
						else
						{
							var fqlStmt = "Create New "+form.label+" ( "+$scope.getDataValueList(data, " ")+' ) ';
// console.log(fqlStmt);							
							$scope.executeFQL(fqlStmt);
						}
					}
					
					$scope.executeFQL = function(stmt)
					{
						console.log("Executing FQL: "+stmt);
					
					    $http.get("http://tomcat.synchronit.com/appbase-webconsole/json?command="+stmt)
					    .success(function(response) {$scope.afterExecuteFQL(response, stmt);});
					}

					$scope.afterExecuteFQL = function(response, stmt)
					{
						alert("Result: "+response.code+"\nwhen executing: "+stmt);
					}
					
		    	}
		    ]
		)
    ;

