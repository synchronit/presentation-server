
    var form_content = angular.module("form_content", ['broadcastService'])
    	.controller
    	( 'formSelectedController', 
    		['$scope', '$http', 'broadcastService', function($scope, $http, broadcastService) 
    			{

				    $scope.formSelected = {};

				    $scope.$on('newFormSelected', function() 
				    {
						$scope.formSelected = broadcastService.getFormSelected();
					});    	

					$scope.fqlCreate = function()
					{
						var form = $scope.formSelected;
						data = form.children;

						if (!form.label || form.label == '')
						{
							msgWarning("Please select a Form in order to enable this action.");
						}
						else
						{
							var fqlStmt = "Create New "+form.label+" ( "+$scope.getDataValueList(data, "")+' ) ';
// console.log(fqlStmt);							
							$scope.executeFQL(fqlStmt, $scope.afterExecuteFQL);
						}
					}
					
					$scope.getDataValueList = function(data, firstComma) 
					{
						var dataValueList = "";
						var comma         = firstComma;
// console.log("getDataValueList: comes with "+data);						
						for (var i=0; i<data.length; i++)
						{
							if (data[i].type != "REFERENCE")
								dataValueList += comma + $scope.getQuotedValue(data[i].type, data[i].value);
							else
								dataValueList += comma + "( "  + $scope.getDataValueList(data[i].children, "") + " )";

							comma = ', ';
						}
// console.log("getDataValueList Returns : "+dataValueList);						
						return dataValueList;
					}

					$scope.getDataWithList = function(data, firstAnd) 
					{
						var dataWithList = "";
						var and          = firstAnd;
						for (var i=0; i<data.length; i++)
						{
// console.log("data["+i+"].value = "+data[i].value);						
// console.log("data["+i+"].type = "+data[i].type);						
							if (data[i].type != "REFERENCE")
							{
								if (data[i].value > "")
								{
									var refLabel = (data[i].refLabel) ? "." + data[i].refLabel : "";
									dataWithList += and + data[i].label + refLabel + " = " + $scope.getQuotedValue(data[i].type, data[i].value);
									and = ' and ';
								}
// console.log("dataWithList = "+dataWithList);						
							}
							else		
							{
								dataWithList += (data[i].type == "REFERENCE") ? $scope.getDataWithList(data[i].children, and )  : "";
								and = (dataWithList) ? " and " : "";
							}
						}
// console.log("getWithValueList Returns : "+dataWithList);						
						return dataWithList;
					}

					$scope.fqlGet = function()
					{
						var form = $scope.formSelected;
						data = form.children;

						if (!form.label || form.label == '')
						{
							msgWarning("Please select a Form in order to enable this action");
						}
						else
						{
							var fqlStmt = "Get "  + form.label;
							var withCondition = $scope.getDataWithList(data, " ");
							fqlStmt += (withCondition) ? " with " + withCondition : "";
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
						msgInfo("Result: "+response.code+"\nwhen executing: <code>"+stmt+"</code>");
					}
					
					$scope.afterGetData = function(response, stmt)
					{
// console.log(stmt);
						if ($scope.fqlResultOK(response))
						{
// console.log(response);
							var returnedRows = response.resultSet.rows;
	
							if (returnedRows.length > 0) 
							{

								msgInfo("Result: "+response.code+"\nwhen executing: <code>"+stmt+"</code> ("+response.resultSet.rows.length+" cases retrieved)");
	
								if (returnedRows.length > 1)
								{
									// Multiple cases found ...
									broadcastService.setResponse(response);
									// ... note ... after broadcasting this message (from broadcastService), 
									// it continues at multi-select.js listening to: 
									//   $scope.$on('multipleResults', function() 
									// and then, it follows again here, on "multipleResultsRowSelected"
									// (once the option has been selected)
/********
									response.resultSet.headers[2].label = "OWNERID";
									response.resultSet.headers[3].label = "OWNERNAME";
									response.resultSet.headers[4].label = "OWNERSEX";
									console.log(response.resultSet.headers[2].label);
									console.log(response.resultSet.headers[3].label);
									console.log(response.resultSet.headers[4].label);
*********/
								}
								else
								{
									// Only one case found => shows it
									$scope.loadGetResultData(response);
								}
							}
							else
							{
								// No case found
								msgError("Result: "+response.code+"\nwhen executing: <code>"+stmt+"</code> ("+response.resultSet.rows.length+" cases retrieved)");
							}
						}
						else
						{
							msgError("ERROR: "+response.message);
						}
					}

					$scope.$on('multipleResultsRowSelected', function() 
					{
						var rowSelected = broadcastService.getRowSelected();		
						var response    = broadcastService.getRowSelectedResponse();
//console.log("Getting row nr. "+rowSelected+" from ...");
//console.log(response);
						$scope.loadGetResultData(response, rowSelected);
					});    	

					$scope.loadGetResultData = function(response, rownumber, children, startPos)
					{
						// Loads defaults
						var rownum = (rownumber) ? rownumber : 0;
						var data   = (children)  ? children  : $scope.formSelected.children;
						var index  = (startPos)  ? startPos  : 0;

						var headers = response.resultSet.headers;
						var dataRow = response.resultSet.rows[ rownum ];

					    for (var i=0; i < data.length; i++)
					    {
					    	if (data[i].type != "REFERENCE")
					    	{
						    	data[i].value = $scope.getTypedValue(data[i].type, dataRow[index]);
						    	index++;
						    }
						    else
						    {
						    	$scope.loadGetResultData(response, rownum, data[i].children, index);
						    	index += data[i].children.length;
						    }
						}
					}

					$scope.getQuotedValue = function (type, value)
					{
						var quotedValue = value;	// default

						if (type == "TEXT" && value )  quotedValue = '"'+value+'"';  // if value is empty or null, instead of "" we return an empty value

						return quotedValue;
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
					
					$scope.fqlResultOK = function(response)  // 100 ... 199 => OK
					{
						return (response.code > 99 && response.code < 200);
					}
					
					$scope.clearForm = function(data)
					{
						if (!data) { data = $scope.formSelected.children; }
						for (var i=0; i<data.length; i++)
						{
							if (data[i].type != "REFERENCE")
							{
								data[i].value = "";
							}
							else
							{
								$scope.clearForm(data[i].children);
							}
						}
					}
		    	}
		    ]
		)
    ;

