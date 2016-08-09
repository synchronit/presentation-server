form_content.controller
        ('formSelectedController',
                ['$scope', '$http', 'broadcastService', 'FQLService', function ($scope, $http, broadcastService, FQLService)
                    {
                        $scope.formSelected = {};
                        $scope.gridOptions = {};
                        $scope.referenceValues = {};

                        $scope.$on('newFormSelected', function ()
                        {
                            $scope.formSelected = broadcastService.getFormSelected();
                            $scope.gridOptions = $scope.generateGridOptions($scope.formSelected);
                            $scope.resizableElements();
                            $scope.loadReferenceValues($scope.formSelected);
                        });

                        $scope.generateGridOptions = function (formSelected)
                        {
                            var gridOptions = {};
                            var data = formSelected.children;

                            for (var i = 0; i < data.length; i++)
                            {
                                var d = data[i];
                                if (d.isReference() && d.refMax != 1)
                                {
                                    // console.log("Multiple reference found: "+d.label);

                                    var options = {};
                                    options.enableColumnMenus = false;
                                    options.enableCellSelection = true;
                                    options.enableCellEditOnFocus = true;

                                    options.columnDefs = $scope.getMultirefColumnDefs(d.label, formSelected);

                                    // Gets the Data to initialize the Grid, representing the columns (and rows) of a multiple reference
                                    options.data = $scope.getEmptyDataRow(d.label, formSelected);

                                    var refMin = $scope.getMinRefs(d.label);
                                    while (options.data.length < refMin)
                                    {
                                        options.data.push($scope.getEmptyDataRow(d.label, formSelected));
                                    }

                                    gridOptions[d.label] = options;
                                }
                            }

                            return gridOptions;
                        }

                        $scope.ctrlDefaults = {
                            refAs: "text",
                            refAsText: function () {
                                return (this.refAs == "text");
                            },
                            refAsDropDown: function () {
                                return (this.refAs == "drop-down");
                            },
                            refAsTextArea: function () {
                                return (this.refAs == "text-area");
                            }
                        };

                        $scope.selectedOption = {};

                        $scope.getSingleReferences = function (formSelected)
                        {
                            var singleReferences = [];
                            for (var i = 0; i < formSelected.children.length; i++)
                            {
                                var dat = formSelected.children[i];
                                if (dat.isReference() && dat.refMax == 1)
                                {
                                    singleReferences.push(dat);
                                }
                            }
                            return singleReferences;
                        }

                        $scope.loadReferenceValues = function (formSelected)
                        {
                            var references = $scope.getSingleReferences(formSelected);

                            for (var i = 0; i < references.length; i++)
                            {
                                var fqlStmt = "Get " + references[i].refForm;
                                FQLService.executeFQL(fqlStmt, $scope.afterLoadReferences, {reference: references[i]});
                            }
                        }

                        $scope.afterLoadReferences = function (response, stmt, params)
                        {
                            var alreadyThere = function (value, options)
                            {
                                var alreadyThere = false;
                                for (var i = 0; i < options.length; i++)
                                {
                                    alreadyThere = alreadyThere || (options[i] == value);
                                }
                                return alreadyThere;
                            }

                            if (FQLService.fqlResultOK(response))
                            {
                                var returnedRows = response.data.resultSet.rows;

                                for (var c = 0; c < params.reference.children.length; c++)
                                {
                                    var options = [""];
                                    var columnIndex = $scope.getColumnIndex(response.data.resultSet.headers, params.reference.children[c].refLabel);
                                    for (var i = 0; i < returnedRows.length; i++)
                                    {
                                        var value = returnedRows[i][columnIndex];
                                        if (!alreadyThere(value, options))
                                        {
                                            options.push(value);
                                        }
                                    }
                                    $scope.referenceValues[params.reference.refForm + ":" + params.reference.children[c].refLabel] = options;
                                }
                            }

                        }

                        $scope.getColumnIndex = function (headers, label)
                        {
                            var columnIndex = null;
                            for (var i = 0; i < headers.length; i++)
                            {
                                if (headers[i].label == label)
                                {
                                    columnIndex = i;
                                }
                            }
                            return columnIndex;
                        }

                        $scope.modifyWithList = function (data) {
                            var dataValueList = "";
                            var and = ' and ';

                            dataValueList += data[0].label + "=" + $scope.getQuotedValue(data[0].type, data[0].value);
                            dataValueList += and;
                            dataValueList += data[1].label + "=" + $scope.getQuotedValue(data[1].type, data[1].value);

                            return dataValueList;
                        }

                        $scope.fqlModify = function () {
                            var form = $scope.formSelected;
                            data = form.children;

                            if (!form.label || form.label == '')
                            {//Aqui mejorar la validacion para que sea cuando no este un item selecionado
                                msgWarning("Please select a Form in order to enable this action.");
                            } else {
                                var modifyWithList = $scope.modifyWithList(data);
                                //Aquui esta faltando que en el data venga un identificador unico para el case
                                var fqlStmt = "Modify Case " + form.label + " (" + $scope.getLabelDataValueList(data, "") + ' ) with ' + modifyWithList;
                                FQLService.executePostFQL(fqlStmt, $scope.afterExecuteFQL);
                            }
                        }

                        $scope.fqlCreate = function ()
                        {
                            var form = $scope.formSelected;
                            data = form.children;

                            if (!form.label || form.label == '')
                            {
                                msgWarning("Please select a Form in order to enable this action.");
                            } else
                            {
                                var fqlStmt = "Create New " + form.label + " ( " + $scope.getDataValueList(data, "") + ' ) ';
// console.log(fqlStmt);							
                                FQLService.executePostFQL(fqlStmt, $scope.afterExecuteFQL);
                            }
                        }

                        $scope.getLabelDataValueList = function (data, firstComma)
                        {
                            var dataValueList = "";
                            var comma = firstComma;
// console.log("getDataValueList: comes with "+data);						
                            for (var i = 0; i < data.length; i++)
                            {
                                if (data[i].type != "REFERENCE")
                                {
                                    if (data[i].label == "Fql_Id" || data[i].label == "Fql_Version")
                                        continue;

                                    dataValueList += comma + data[i].label + "=" + $scope.getQuotedValue(data[i].type, data[i].value);
                                } else
                                {
                                    if (data[i].refMax == 1)
                                    {	// Ref. simple //aqui revisar los casos para el update
                                        dataValueList += comma + "( " + $scope.getDataValueList(data[i].children, "") + " )";
                                    } else
                                    {	// Ref. multiple
                                        dataValueList += comma + "( " + $scope.getValuesFromMultipleReference(data[i]) + " )";
                                    }
                                }
                                comma = ', ';
                            }
// console.log("getDataValueList Returns : "+dataValueList);						
                            return dataValueList;
                        }

                        $scope.getLabelDataList = function (data, firstComma)
                        {
                            var dataValueList = "";
                            var comma = firstComma;
// console.log("getDataValueList: comes with "+data);						
                            for (var i = 0; i < data.length; i++)
                            {
                                dataValueList += comma + data[i].label;
                                comma = ', ';
                            }
// console.log("getDataValueList Returns : "+dataValueList);						
                            return dataValueList;
                        }

                        $scope.getDataValueList = function (data, firstComma)
                        {
                            var dataValueList = "";
                            var comma = firstComma;
// console.log("getDataValueList: comes with "+data);						
                            for (var i = 0; i < data.length; i++)
                            {
                                if (data[i].type != "REFERENCE")
                                {
                                    if (data[i].label == "Fql_Id" || data[i].label == "Fql_Version")
                                        continue;
                                    dataValueList += comma + $scope.getQuotedValue(data[i].type, data[i].value);
                                } else
                                {
                                    if (data[i].refMax == 1)
                                    {	// Ref. simple
                                        dataValueList += comma + "( " + $scope.getDataValueList(data[i].children, "") + " )";
                                    } else
                                    {	// Ref. multiple
                                        dataValueList += comma + "( " + $scope.getValuesFromMultipleReference(data[i]) + " )";
                                    }
                                }
                                comma = ', ';
                            }
// console.log("getDataValueList Returns : "+dataValueList);						
                            return dataValueList;
                        }

                        $scope.getValuesFromMultipleReference = function (multiRef)
                        {
                            var values = "";
                            var comma = "";
                            var dataRows = $scope.gridOptions[ multiRef.label ].data;
                            for (var i = 0; i < dataRows.length; i++)
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
                            for (var i = 0; i < multiRef.children.length; i++)
                            {
// console.log("Agregando valor de: "+multiRef.children[i].refLabel);
                                values += comma + dataRow[ multiRef.children[i].refLabel ];
                                comma = ', ';
                            }
                            return values;
                        }

                        $scope.getDataWithList = function (data, firstAnd)
                        {
                            var dataWithList = "";
                            var and = firstAnd;
                            for (var i = 0; i < data.length; i++)
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
                                } else
                                {
                                    dataWithList += (data[i].type == "REFERENCE") ? $scope.getDataWithList(data[i].children, and) : "";
                                    and = (dataWithList) ? " and " : "";
                                }
                            }
// console.log("getWithValueList Returns : "+dataWithList);						
                            return dataWithList;
                        }

                        $scope.fqlGet = function ()
                        {
                            var form = $scope.formSelected;
                            data = form.children;

                            if (!form.label || form.label == '')
                            {
                                msgWarning("Please select a Form in order to enable this action");
                            } else
                            {
                                /**TODO: Aqui se puede hacer un Get case MyForm (Fql_Id, A, B, C, Fql_Version)*/
                                var fqlStmt = "Get " + form.label + "(" + $scope.getLabelDataList(data, " ") + ")";
                                //var fqlStmt = "Get " + form.label;
                                var withCondition = $scope.getDataWithList(data, " ");
                                fqlStmt += (withCondition) ? " with " + withCondition : "";
// console.log(fqlStmt);							
                                FQLService.executeFQL(fqlStmt, $scope.afterGetData);
                            }
                        }

                        $scope.afterExecuteFQL = function (response, stmt, params)
                        {
                            if (FQLService.fqlResultOK(response))
                            {
                                msgInfo("Result: " + response.data.code + "\nwhen executing: <code>" + stmt + "</code>");
                            } else
                            {
                                msgError("ERROR: " + response.data.message);
                            }
                        }

                        $scope.afterGetData = function (response, stmt)
                        {
// console.log(stmt);
                            if (FQLService.fqlResultOK(response))
                            {
// console.log(response);
                                var returnedRows = response.data.resultSet.rows;

                                if (returnedRows.length > 0)
                                {

                                    msgInfo("Result: " + response.data.code + "\nwhen executing: <code>" + stmt + "</code> (" + response.data.resultSet.rows.length + " cases retrieved)");

                                    if (returnedRows.length > 1)
                                    {
                                        // Multiple cases found ...
// console.log("M1!");
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
                                    } else
                                    {
                                        // Only one case found => shows it
                                        $scope.loadGetResultData(response);
                                    }
                                } else
                                {
                                    // No case found
                                    msgError("Result: " + response.data.code + "\nwhen executing: <code>" + stmt + "</code> (" + response.data.resultSet.rows.length + " cases retrieved)");
                                }
                            } else
                            {
                                msgError("ERROR: " + response.data.message);
                            }
                        }

                        /* After selecting a case from multiple results, it comes here ...   */
                        $scope.$on('multipleResultsRowSelected', function ()
                        {
                            var rowSelected = broadcastService.getRowSelected();
                            var response = broadcastService.getRowSelectedResponse();
//console.log("Getting row nr. "+rowSelected+" from ...");
//console.log(response);
                            $scope.loadGetResultData(response, rowSelected);
                        });

                        $scope.loadGetResultData = function (response, rownumber, children, startPos)
                        {
                            // Loads defaults
                            var rownum = (rownumber) ? rownumber : 0;
                            var data = (children) ? children : $scope.formSelected.children;
                            var index = (startPos) ? startPos : 0;

                            var headers = response.data.resultSet.headers;
                            var dataRow = response.data.resultSet.rows[ rownum ];

                            for (var i = 0; i < data.length; i++)
                            {
                                if (data[i].type != "REFERENCE")
                                {
                                    data[i].value = $scope.getTypedValue(data[i].type, dataRow[index]);
                                    index++;
                                } else
                                {
                                    $scope.loadGetResultData(response, rownum, data[i].children, index);
                                    index += data[i].children.length;
                                }
                            }
                        }

                        $scope.getQuotedValue = function (type, value)
                        {
                            var quotedValue = value;	// default

                            if (type == "TEXT" && value)
                                quotedValue = '"' + value.toString().replace(/\"/g, '\\"') + '"';  // if value is empty or null, instead of "" we return an empty value
                            if (type == "IMAGE")//Aqui hacer el parser del objeto del input. Puede factorizarce si se pone en el modelo solo el codigo en base 64
                                quotedValue = '"' + 'data:' + value.filetype + ';base64,' + value.base64 + '"';

                            return quotedValue;
                        }

                        $scope.getTypedValue = function (type, value)
                        {
                            var typedValue = value; // default

                            if (type == "NUMBER")
                                typedValue = Number(value);
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

                            if (type == "IMAGE" && (value === null || value === '')) {
                                typedValue = 'images/image_file.png'
                            }

                            return typedValue;
                        }

                        $scope.clearForm = function (data)
                        {
                            if (!data) {
                                data = $scope.formSelected.children;
                            }
                            for (var i = 0; i < data.length; i++)
                            {
                                if (data[i].type != "REFERENCE")
                                {
                                    data[i].value = "";
                                } else
                                {
                                    $scope.clearForm(data[i].children);
                                }
                            }
                        }

                        $scope.getRefMultiple = function (label, formSelected)
                        {
                            var refMultiple = [];

                            for (var i = 0; i < formSelected.children.length; i++)
                            {
                                if (formSelected.children[i].label == label)
                                {
                                    refMultiple = formSelected.children[i];
                                }
                            }
                            return refMultiple;
                        }

                        $scope.getMultirefColumnDefs = function (label, formSelected)
                        {
                            var columnDefs = [];

                            var refMultiple = $scope.getRefMultiple(label, formSelected);

                            for (var i = 0; i < refMultiple.children.length; i++)
                            {
                                columnDefs.push({field: refMultiple.children[i].refLabel, resizable: true});
                            }

                            // Delete Row Icon
                            // '<button class="btn primary" ng-click="grid.appScope.deleteRow(\''+label+'\', row)">Delete</button>'
                            var cellTemplateHTML = "<nav class='nav_small'><span style='margin-top: -5px'><a style='font-size: 1em;' class='icon-delete' ng-click='grid.appScope.deleteRow(";
                            cellTemplateHTML += '"' + label + '"';	// "columnLabel"
                            cellTemplateHTML += ", row)' title='Delete row'></a></span></nav>";
                            columnDefs.push({name: 'DeleteRow', displayName: ' ', cellTemplate: cellTemplateHTML, width: 45, cellClass: 'deleteRowIcon', enableCellEdit: false});

                            return columnDefs;

                        }

                        $scope.getEmptyDataRow = function (label, formSelected)
                        {
                            var data = [];
                            var refMultiple = $scope.getRefMultiple(label, formSelected);
                            var rowData = {};

                            for (var i = 0; i < refMultiple.children.length; i++)
                            {
                                rowData[ refMultiple.children[i].refLabel ] = ' ';
                            }

                            data.push(rowData);

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
                            for (var i = 0; i < formSelected.children.length; i++)
                            {
                                if (formSelected.children[i].label == label)
                                {
                                    limits.min = formSelected.children[i].refMin;
                                    limits.max = formSelected.children[i].refMax;
                                }
                            }
                            return limits;
                        }

                        $scope.addRow = function (label)
                        {
//						console.log("add row : "+label+" to a list of "+$scope.gridOptions[label].data.length);

                            var refMax = $scope.getMaxRefs(label);
                            if ($scope.gridOptions[label].data.length < refMax || refMax == 0) // 0 means "no limit" 
                            {
                                $scope.gridOptions[label].data.push($scope.getEmptyDataRow(label, $scope.formSelected));
                            } else
                            {
                                msgError("Max. number of rows (" + refMax + ") already reached.");
                            }
                        }

                        $scope.deleteRow = function (label, row)
                        {
                            var refMin = $scope.getMinRefs(label);
                            if ($scope.gridOptions[label].data.length > refMin)
                            {
                                var index = $scope.gridOptions[label].data.indexOf(row.entity);
                                $scope.gridOptions[label].data.splice(index, 1);
                            } else
                            {
                                msgError("Min. number of rows (" + refMin + ") already reached.");
                            }
                        };

                        $scope.activateResize = function ($scope, elem, attrs)
                        {
                            setTimeout(function () {
                                $("#" + attrs.id).resizable();
                            }, 500);
                            setTimeout(function () {
                                $("#" + attrs.id).resizable();
                            }, 3000); // PCs lentas ... 
//						$("#"+attrs.id).resizable( {alsoResize: "#grid_TBD"} ).find('.resizable'); 
                        }

                        $scope.defineContextMenu = function ($scope, elem, attrs)
                        {
                            /**************************************************
                             * Context-Menu with Sub-Menu
                             **************************************************/
                            $.contextMenu({
                                selector: '.singleReferenceFieldset',
                                callback: function (key, options)
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
                                                                    "text": {"name": "text"},
                                                                    "drop-down": {"name": "drop-down"},
                                                                    "text-area": {"name": "text-area"}
                                                                }
                                                    }
                                        }
                            });
                        }

                        $scope.onInputLoad = function (o, elemId) {
                            if (angular.isObject(o)) {
                                var keys = Object.keys(o);
                                if (keys.indexOf('filename') >= 0) {
                                    o = 'data:' + o.filetype + ';base64,' + o.base64;
                                    $scope.setImageRatio(o, elemId);
                                }
//console.info(this.userAvatar); 
                            } else {
                                if (o === '') {
                                    o = "images/no-img.jpg";
                                }
                                var elem = $('img[img-id=' + elemId + ']')
                                $scope.resizableElements(elem);

                            }
                            return o;
                        }

                        $scope.setImageRatio = function (base64Code, elementId) {
                            var elem = $('img[img-id=' + elementId + ']');
                            var img = new Image();
                            img.src = base64Code;
                            var maxWidth = 280; // Max width for the image
                            var maxHeight = 248;    // Max height for the image
                            var ratio = 0;  // Used for aspect ratio
                            var width = img.width;    // Current image width
                            var height = img.height;  // Current image height

                            // Check if the current width is larger than the max
                            if (width > maxWidth) {
                                ratio = maxWidth / width;   // get ratio for scaling image
                                $(elem).css("width", maxWidth); // Set new width
                                $(elem).parent().css("width", maxWidth)
                                $(elem).css("height", height * ratio);  // Scale height based on ratio
                                $(elem).parent().css("height", height * ratio);
                                height = height * ratio;    // Reset height to match scaled image
                                width = width * ratio;    // Reset width to match scaled image
                            }

                            // Check if current height is larger than max
                            if (height > maxHeight) {
                                ratio = maxHeight / height; // get ratio for scaling image
                                $(elem).css("height", maxHeight);   // Set new height
                                $(elem).parent().css("height", maxHeight);
                                $(elem).css("width", width * ratio);    // Scale width based on ratio
                                $(elem).parent().css("width", width * ratio);
                                width = width * ratio;    // Reset width to match scaled image
                                height = height * ratio;    // Reset height to match scaled image
                            }
                        }

                        $scope.clickImg = function (label) {
                            $('#' + label).click();
                        }

                        $scope.resizableElements = function (element) {
                            if (element != undefined && $(element).resizable("instance") != undefined) {
                                $(element).resizable("destroy");
                                $(element).css("width", 280);
                                $(element).css("height", 248);
                            }
                            setTimeout(function () {
                                if (element == undefined) {
                                    element = 'img[img-id]';
                                }

                                $(element).resizable();
                            }, 500);
                        }

                        /**
                         * TODO: this needs to be reconsidered, after having more knowledge about Angular
                         *
                         * Problem is a race condition between the broadcast and the controller not yet build.
                         * When we move from a form data-entry to create a new form and come back to another 
                         * form data-entry, the data is not rendered, because the event was broadcasted 
                         * before the controller has completed. This means the event was not catched by the controller
                         * and therefore, no data has been loaded to be rendered. 
                         *
                         * Probably a major re-factoring may solve this. Among other things, using a single App.
                         * Consider also using different URLs for different parts of the App and also, 
                         * points 3 and 4 of this link: https://leftshift.io/8-tips-for-angular-js-beginners/
                         * (about using factory and also providers during app initizalization)
                         *
                         * But ... this is postponed, because it might well be, that is totally different in Angular 2.0
                         *
                         */
                        $scope.formSelected = broadcastService.getFormSelected();
                        if ($scope.formSelected.label != '')
                        {
                            $scope.gridOptions = $scope.generateGridOptions($scope.formSelected);
                            $scope.loadReferenceValues($scope.formSelected);
                        }
                        /** END OF INTERIM SOLUTION **
                         ** (explicitly checks for a selected form, in case the event was missed) 
                         **/

                    }
                ]
                )
        ;
