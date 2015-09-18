
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
// console.log("getDataValueList: comes with "+data);						
						for (var i=0; i<data.length; i++)
						{
							dataValueList += (data[i].type == "TEXT")      ? comma + '"'+data[i].value+'"' : "";
							dataValueList += (data[i].type == "NUMBER")    ? comma +     data[i].value     : "";
							dataValueList += (data[i].type == "BOOLEAN")   ? comma +     data[i].value     : "";
							dataValueList += (data[i].type == "REFERENCE") ? $scope.getDataValueList(data[i].children, ', ')  : "";
							comma = ', ';
						}
// console.log("getDataValueList Returns : "+dataValueList);						
						return dataValueList;
					}

					$scope.fqlCreate = function()
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
							$scope.executeFQL(fqlStmt, $scope.afterExecuteFQL);
						}
					}
					
					$scope.getDataWithList = function(data, firstAnd) 
					{
						var dataWithList = "";
						var and         = firstAnd;
// console.log("getDataWithList: comes with "+data);						
						for (var i=0; i<data.length; i++)
						{
							if (data[i].value > "")
							{
								dataWithList += and + data[i].label + " = " + $scope.getEscapedValue(data[i].type, data[i].value);
	
//								dataWithList += (data[i].type == "REFERENCE") ? $scope.getDataWithList(data[i].children, ' and ')  : "";
	
								and = ' and ';
							}
						}
 console.log("getDataValueList Returns : "+dataWithList);						
						return dataWithList;
					}

					$scope.fqlGet = function()
					{
						var form = $scope.formSelected;
						data = form.children;

						if (!form.label || form.label == '')
						{
							alert("Please select a Form in order to enable this action");
						}
						else
						{
							var fqlStmt = "Get "+form.label+" with "+$scope.getDataWithList(data, " ");
// console.log(fqlStmt);							
							$scope.executeFQL(fqlStmt, $scope.afterGetData);
						}
					}
					
					$scope.executeFQL = function(stmt, callback)
					{
// console.log("Executing FQL: "+stmt);
					
					    $http.get("http://tomcat.synchronit.com/appbase-webconsole/json?command="+stmt)
					    .success(function(response) {callback(response, stmt);});
					    
					}

					$scope.afterExecuteFQL = function(response, stmt)
					{
						showMsg("Result: "+response.code+"\nwhen executing: <code>"+stmt+"</code>");
					}
					
					$scope.afterGetData = function(response, stmt)
					{
						showMsg("Result: "+response.code+"\nwhen executing: <code>"+stmt+"</code>");

						var returnedRows = response.resultSet.rows;

						if (returnedRows.length > 0)  // TODO: Check cases of 0, 1 and MANY
						{
							var data     = $scope.formSelected.children;
							var headers  = response.resultSet.headers;
							var firstRow = response.resultSet.rows[0];
	
						    for (var i=0; i < data.length; i++)
						    {
						    	data[i].value = $scope.getTypedValue(headers[i].type, firstRow[i]);
							}
						}
						else
						{
						}
					}

					$scope.getEscapedValue = function (type, value)
					{
						var escapedValue = value;	// default

						if (type == "NUMBER")  typedValue = Number(value);
						if (type == "TEXT"  )  typedValue = '"'+value+'"';
						
						return escapedValue;
					}

					$scope.getTypedValue = function (type, value)
					{
						var typedValue = value; // default
						
						if (type == "NUMBER")  typedValue = Number(value);
						if (type == "BOOLEAN")
						{
							if (typeof value == "string")
							{
								typedValue = (value.toUpperCase().charAt(0) == "T"); // "T", "TRUE" or "T..." is true !!
							}
							if (typeof value == "number")
							{
								typedValue = (value > 0); // Any number greater than 0 is true !!
							}
						} 
						
						return typedValue;
					}
					
		    	}
		    ]
		)
    ;

