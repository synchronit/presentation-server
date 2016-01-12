
    var form_content = angular.module("form_content", ['broadcastService', 'ui.grid', 'ui.grid.autoResize', 'ui.select' ]);

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
								$scope.defineContextMenu($scope, elem, attrs);
							}  
				}
	});

	form_content.controller
    	( 'formSelectedController', 
    		['$scope', '$http', 'broadcastService', function($scope, $http, broadcastService) 
    			{

				    $scope.formSelected = {};
					$scope.gridOptions  = {};
				    $scope.referenceValues = {};
									
				    $scope.$on('newFormSelected', function() 
				    {
						$scope.formSelected     = broadcastService.getFormSelected();
						$scope.gridOptions      = $scope.generateGridOptions($scope.formSelected);

						$scope.loadReferenceValues($scope.formSelected);
					});    	
					
					$scope.generateGridOptions = function (formSelected)
					{
						var gridOptions = {};
						var data        = formSelected.children;
						
						for (var i=0; i<data.length; i++)
						{
							var d = data[i];
							if (d.isReference() && d.refMax != 1)
							{
								// console.log("Multiple reference found: "+d.label);

								var options = { };
								options.enableColumnMenus     = false;
								options.enableCellSelection   = true;
								options.enableCellEditOnFocus = true;

								options.columnDefs = $scope.getMultirefColumnDefs( d.label, formSelected );

								// Gets the Data to initialize the Grid, representing the columns (and rows) of a multiple reference
								options.data = $scope.getEmptyDataRow( d.label, formSelected );

								var refMin = $scope.getMinRefs(d.label);						
								while (options.data.length < refMin) 
								{
									options.data.push( $scope.getEmptyDataRow(d.label, formSelected) );
								}

								gridOptions[d.label] = options;
							}
						}
						
						return gridOptions;
					}

					$scope.ctrlDefaults = {
										refAs          : "text",
										refAsText      : function() { return (this.refAs == "text");       },
										refAsDropDown  : function() { return (this.refAs == "drop-down");  },
										refAsTextArea  : function() { return (this.refAs == "text-area");  }
									  };
					
//				    $scope.selectedItem = $scope.optionValues[0];

					$scope.getSingleReferences = function(formSelected)
					{
						var singleReferences = [];
						for (var i=0; i<formSelected.children.length; i++)
						{
							var dat = formSelected.children[i];
							if (dat.isReference() && dat.refMax == 1)
							{
								singleReferences.push(dat);
							}
						}
						return singleReferences;
					}

					$scope.loadReferenceValues = function(formSelected)
					{
						var references = $scope.getSingleReferences(formSelected);
						
						for (var i=0; i<references.length; i++)
						{
							var fqlStmt = "Get "  + references[i].refForm;
							$scope.executeFQL(fqlStmt, $scope.afterLoadReferences, {reference: references[i]} );
						}
					}

					$scope.afterLoadReferences = function(response, stmt, params)
					{
						var options = [];
						if ($scope.fqlResultOK(response))
						{
							var returnedRows = response.resultSet.rows;
							var columnIndex  = $scope.getColumnIndex(response.resultSet.headers, params.reference.refLabel);
							for (var i=0; i<returnedRows.length; i++)
							{
								var value = returnedRows[i][columnIndex];
console.log(value);
								options.push({ id: value, name: value });
							}
						}
						$scope.referenceValues[params.reference.refLabel] = options;
					}

					$scope.getColumnIndex = function(headers, label)
					{
						var columnIndex = null;
						for (var i=0; i<headers.length; i++)
						{
							if (headers[i].label == label)
							{
								columnIndex = i;
							}
						}
						return columnIndex;
					}

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
							{
								dataValueList += comma + $scope.getQuotedValue(data[i].type, data[i].value);
							}
							else
							{
								if (data[i].refMax == 1)
								{	// Ref. simple
									dataValueList += comma + "( "  + $scope.getDataValueList(data[i].children, "") + " )";
								}
								else
								{	// Ref. multiple
									dataValueList += comma + "( "  + $scope.getValuesFromMultipleReference(data[i]) + " )";
								}
							}
							comma = ', ';
						}
// console.log("getDataValueList Returns : "+dataValueList);						
						return dataValueList;
					}

					$scope.getValuesFromMultipleReference = function (multiRef)
					{
						var values   = "";
						var comma    = "";
						var dataRows = $scope.gridOptions[ multiRef.label ].data;
						for (var i=0; i<dataRows.length; i++)
						{
							values += comma + "(" + $scope.getValuesFromRow(dataRows[i], multiRef) + ")";
							comma = ', ';
						}
// console.log(values);						
						return values;
					}

					$scope.getValuesFromRow = function (dataRow, multiRef)
					{
						var values = "";
						var comma = "";
						for (var i=0; i<multiRef.children.length; i++)
						{
// console.log("Agregando valor de: "+multiRef.children[i].refLabel);
							values += comma + dataRow[ multiRef.children[i].refLabel ];
							comma = ', ';
						}
						return values;
					}

					$scope.getDataWithList = function(data, firstAnd) 
					{
						var dataWithList = "";
						var and          = firstAnd;
						for (var i=0; i<data.length; i++)
						{
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
					
					$scope.executeFQL = function(stmt, callback, params)
					{
// console.log("Executing FQL: "+stmt);
					
					    $http.get("http://tomcat.synchronit.com/appbase-webconsole/json?command="+stmt)
					    .success(function(response) {callback(response, stmt, params);});
					    
					}

					$scope.afterExecuteFQL = function(response, stmt, params)
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

									//**********************************************************************
									// ... note ... after broadcasting this message (from broadcastService), 
									// it continues at multi-select.js listening to: 
									//
									//   $scope.$on('multipleResults', function() 
									//
									// and then, it follows again here, on "multipleResultsRowSelected"
									// (once the option has been selected)
									//**********************************************************************
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

					/* After selecting a case from multiple results, it comes here ...   */
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
					
					$scope.getRefMultiple = function (label, formSelected)
					{
						var refMultiple = [];				

						for (var i=0; i < formSelected.children.length; i++)
						{
							if ( formSelected.children[i].label == label )
							{
								refMultiple = formSelected.children[i];
							}
						}
						return refMultiple;				
					}

					$scope.getMultirefColumnDefs = function( label, formSelected )
					{
						var columnDefs = [];
						
						var refMultiple = $scope.getRefMultiple(label, formSelected);
				
				  		for (var i=0; i < refMultiple.children.length; i++)
				  		{
							columnDefs.push( { field : refMultiple.children[i].refLabel, resizable: true } );
				  		}

						// Delete Row Icon
						// '<button class="btn primary" ng-click="grid.appScope.deleteRow(\''+label+'\', row)">Delete</button>'
						var cellTemplateHTML  = "<nav class='nav_small'><span style='margin-top: -5px'><a style='font-size: 1em;' class='icon-delete' ng-click='grid.appScope.deleteRow(";
						    cellTemplateHTML += '"'+label+'"';	// "columnLabel"
						    cellTemplateHTML += ", row)' title='Delete row'></a></span></nav>";
						columnDefs.push({ name: 'DeleteRow', displayName: ' ', cellTemplate: cellTemplateHTML, width: 45, cellClass: 'deleteRowIcon', enableCellEdit: false });

						return columnDefs;
				
					}

					$scope.getEmptyDataRow = function( label, formSelected )
					{
						var data        = [];
						var refMultiple = $scope.getRefMultiple(label, formSelected);
				  		var rowData     = {} ;

				  		for (var i=0; i < refMultiple.children.length; i++)
				  		{
				  			rowData[ refMultiple.children[i].refLabel ] = ' ';
				  		}

						data.push( rowData );
				
						return data;
				
				/***************************************************				
						return [
								    {
								        "firstName": "Cox",
								        "lastName": "Carney",
								        "company": "Enormo",
								        "employed": true
								    },
								    {
								        "firstName": "Lorene",
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
				****************************************************/				
				
					}

					$scope.getMinRefs = function (label)
					{
						return $scope.getLimitRefs(label).min;
					}

					$scope.getMaxRefs = function (label)
					{
						return $scope.getLimitRefs(label).max;
					}

					$scope.getLimitRefs = function (label, minMax)
					{
						var formSelected = $scope.formSelected;
						var limits = {};
						for (var i=0; i<formSelected.children.length; i++)
						{
							if (formSelected.children[i].label == label)
							{
								limits.min = formSelected.children[i].refMin;
								limits.max = formSelected.children[i].refMax;
							}
						}
						return limits;
					}

					$scope.addRow = function(label) 
					{
//						console.log("add row : "+label+" to a list of "+$scope.gridOptions[label].data.length);

						var refMax = $scope.getMaxRefs(label);						
						if ($scope.gridOptions[label].data.length < refMax || refMax == 0) // 0 means "no limit" 
						{
							$scope.gridOptions[label].data.push($scope.getEmptyDataRow(label, $scope.formSelected));
						}
						else
						{
							msgError("Max. number of rows ("+refMax+") already reached.");
						}
					}

					$scope.deleteRow = function(label, row) 
					{
						var refMin = $scope.getMinRefs(label);						
						if ($scope.gridOptions[label].data.length > refMin) 
						{
							var index = $scope.gridOptions[label].data.indexOf(row.entity);
							$scope.gridOptions[label].data.splice(index, 1);
						}
						else
						{
							msgError("Min. number of rows ("+refMin+") already reached.");
						}
					};				

					$scope.activateResize = function($scope, elem, attrs)
					{
						setTimeout(function(){ $("#"+attrs.id).resizable(); }, 500); 
						setTimeout(function(){ $("#"+attrs.id).resizable(); }, 3000); // PCs lentas ... 
//						$("#"+attrs.id).resizable( {alsoResize: "#grid_TBD"} ).find('.resizable'); 
					}
					
					$scope.defineContextMenu = function($scope, elem, attrs)
					{
					    /**************************************************
					     * Context-Menu with Sub-Menu
					     **************************************************/
					    $.contextMenu({
					        selector: '.singleReferenceFieldset', 
					        callback: function(key, options) 
					        {
					            var m = "clicked: " + key;
								$scope.ctrlDefaults.refAs = key;

								/*
									** TODO: review the source of this JQuery plugin, to see if $scope can be kept **
									$scope is being lost because this is NOT an AngularJS plugin
									therefore, we call $apply()
								*/

								$scope.$apply();

					        },
					        items: 
					        {
					            "fold1": 
					            {
					                "name": "UI Controls", 
					                "items": 
					                {
			                            "text"     : {"name": "text"},
			                            "drop-down": {"name": "drop-down"},
			                            "text-area": {"name": "text-area"}
					                }
					            }
					        }
					    });
					}
				
		    	}
		    ]
		)
    ;

