$.extend({
    appBaseService: new function() {
        var appBaseUrl = 'http://dev.synchronit.com/appbase-webconsole/json';
        var self = this;
        self.HttpVerb = {
          POST: 'POST',
          GET: 'GET',
          PUT: 'PUT',
          DELETE: 'DELETE'
        };
        var formsArray = null;
        self.options = null;

        self.initialize = function(options) {
            if (options == null || options == undefined) {
                options = {
                    requestForm: false,
                    useMock: false
                }
            }
            self.options = options

            if (self.options.requestForm) {
                requestForms(options.requestFormCallback);
            }

            attachBehavior();
        };

        var attachBehavior = function() {

        };

        /** Metodo para guardar una definicion de maping la estructura del objeto de maping es la del ejemplo
         * Ejemplo
         * mappingObj = {
         *        sourceName: '',
         *        fileType: '',
         *        formName: '',
         *        isFirstColumnHeading: false,
         *        mappingProperties: [{
         *            fileColumn: {
         *                colStart: -1,
         *                colEnd: -1,
         *                index: -1,
         *                isIgnored: false
         *            },
         *            formColumn: {
         *                name: '',
         *                type: '',
         *                order: -1,
         *                isReference: false,
         *                reference:{
         *                    formName:'',
         *                    fieldName:'' 
         *                    }
         *            }
         *        }]
         *    }
         */
        self.saveMapping = function(mappingObj, endCallback) {

            /*************BEGIN FUNCTION**************/
            self.getFormData('MAPPING', null, function(resultSet) {

                if (!self.existDataInForm('SOURCE_NAME', mappingObj.sourceName, resultSet)) {
                    var mappingFormMap = getMappingFormMap();
                    var mappingFormRow = getMappingFormRow(mappingObj);
                    var savingMessagesArray = Array();
                    self.saveFormData(mappingFormMap, mappingFormRow, function(itemCallbackData) {
                        savingMessagesArray.push(itemCallbackData.message);

                    }, function(endCallbackData) {
                        if (endCallbackData.code == 200) {
                            var mappingPropertiesMap = getMappingPropertiesFormMap();
                            var mappingPropertiesArray = Array();
                            for (var index in mappingObj.mappingProperties) {
                                var mappingPropertiesRow = getMappingPropertiesRow(mappingObj.sourceName, mappingObj.mappingProperties[index])
                                mappingPropertiesArray.push(mappingPropertiesRow);
                            }

                            self.saveFormData(mappingPropertiesMap, mappingPropertiesArray, function(data) {

                                savingMessagesArray.push(data.message);

                            }, function(saveEndCallbackData) {
                                endCallback({
                                    code: 200,
                                    message: 'Mapping saved successfuly',
                                    stackTrace: savingMessagesArray
                                });
                            });
                        } else {
                            endCallback(endCallbackData);
                        }
                    });
                } else {
                    /**Tener en cuenta que cuando se encuentra un mapping con el mismo source que se hace.
                     * se le debe notificar el usuario o tambien devolver el mapping encontrado
                     */
                    endCallback({
                        code: 300,
                        message: 'Mapping with same name exist'
                    });
                }
            });


        }

        /** Este metodo permite hacer el store del maping siguiendo el esquema de ejemplo. No esta totalmente funcional pues hay 
         * 
         * 
         * ejemplo de objeto de maping
         *   maping = {
         *        sourceName: '',
         *        fileType: '',
         *        formName: '',
         *        isFirstColumnHeading: false,
         *        mappingProperties: [{
         *            fileColumn: {
         *                colStart: -1,
         *                colEnd: -1,
         *                index: -1,
         *                isIgnored: false
         *            },
         *            formColumn: {
         *                name: '',
         *                type: '',
         *                order: -1,
         *                isReference: false,
         *                reference:{
         *                    formName:'',
         *                     fieldName:''
         *                   }
         *            }
         *        }]
         *    }
         * --Ejemplo del dataArray 
         *  data = [
                 ["M"],
                 ["F"],
                 ["F"],
                 ["F"]
             ]
         *  ejemplo del callback
         *  object = {
                  current: item actual que se inserto, esto pensando en poder poner una barra de progreso,
                  total: total de elementos a almacenar
                    }
        */
        self.saveFormData = function(mappingObj, dataArray, callback, endCallback) {

            var isFirstColumnHeading = mappingObj.isFirstColumnHeading;
            var dataMapping = mappingObj.mappingProperties;
            var dataLength = dataArray.length;
            /**Obtengo del mapping cuales son las columnas que son multireferencia */
            var multiRefArr = findSameReferenceForm(dataMapping);
            var executed = isFirstColumnHeading == true ? 1 : 0;
            for (var i = isFirstColumnHeading == true ? 1 : 0; i < dataArray.length; i++) {
                var storeDataArray = Array();
                var dataRow = dataArray[i];

                for (var item in dataMapping) {
                    var mappingItem = dataMapping[item];
                    if (!mappingItem.fileColumn.isIgnored) {
                        /** Aqui tener en cuenta que en el array de maping pueden venir 2 items que sean parte de 
                         * la misma columna en el formulario debido a que esa columna es una referencia doble por lo
                         * que al crear el comando del objeto esa columna se crea asi: (,). En el algoritmo actual el mapping 
                         * y los datos vienen en indices separados eso implica que se tengan que unir y garantizar 
                         * que no se repitan en el ciclo cuando se itere hacia un indice superior.
                         * VARIANTES
                         * 1- Detectar cuales de los items en el maping son columnas referencias DOBLES. En el ciclo tener
                         * esta caracteristica en cuenta para agrupar esos items e ignorarlos en posteriores iteraciones
                         * 
                         */
                        var dataColumn = dataRow[mappingItem.fileColumn.index];

                        if (mappingItem.formColumn.isReference) {
                            /** Aqui si la columna es una referencia trato obtengo 
                             * si la columna actual esta en el arreglo de multireferencias */
                            var multiRefItem = Object.keys(multiRefArr).length > 0 ? multiRefArr[mappingItem.formColumn.name] : null;
                            var value = null;


                            if (multiRefItem != null && multiRefItem != undefined) {
                                /** Saber el indice que la columna actual ocupa en el arreglo de multireferencia determina
                                 * si ya se ha procesado o no
                                 */
                                var isFirst = multiRefItem.indexOf(multiRefItem.find(function(itemFind) {
                                    return mappingItem.formColumn.reference.fieldName === itemFind.formColumn.reference.fieldName;
                                })) == 0;

                                if (isFirst) {
                                    /**Luego si es la primera ves que se itera sobre estas referencias multiples se procesan */
                                    dataColumn = Array();
                                    dataTypes = Array();
                                    for (var multiItemIndex in multiRefItem) {
                                        dataColumn.push(dataRow[multiRefItem[multiItemIndex].fileColumn.index]);
                                        dataTypes.push(multiRefItem[multiItemIndex].formColumn.type);
                                    }
                                    value = getValueForReferenceColumn(mappingItem.formColumn.type, dataColumn);
                                }

                            }else{

                                value = getValueForReferenceColumn(mappingItem.formColumn.type, dataColumn);
                            }
                            if (value != null) {
                                storeDataArray.splice(mappingItem.formColumn.order, 0, value);
                            }


                        } else {
                            storeDataArray.splice(mappingItem.formColumn.order, 0, getStoreDataFormat(mappingItem.formColumn.type, dataColumn));
                        }

                    } else {
                        if (mappingItem.formColumn.isReference) {
                            var multiRefItem = Object.keys(multiRefArr).length > 0 ? multiRefArr[mappingItem.formColumn.name] : null;
                            var value = null;
                            if (multiRefItem != null && multiRefItem != undefined) {
                                /** Saber el indice que la columna actual ocupa en el arreglo de multireferencia determina
                                 * si ya se ha procesado o no
                                 */
                                var isFirst = multiRefItem.indexOf(multiRefItem.find(function(itemFind) {
                                    return mappingItem.formColumn.reference.fieldName === itemFind.formColumn.reference.fieldName;
                                })) == 0;

                                if (isFirst) {
                                    /**Luego si es la primera ves que se itera sobre estas referencias multiples se procesan */
                                    dataColumn = Array();
                                    dataTypes = Array();
                                    for (var multiItemIndex in multiRefItem) {
                                        dataColumn.push('');
                                        dataTypes.push(multiRefItem[multiItemIndex].formColumn.type);
                                    }
                                    value = getValueForReferenceColumn(mappingItem.formColumn.type, dataColumn);
                                }

                            } else {
                                value = getValueForReferenceColumn(mappingItem.formColumn.type, '');
                            }
                            if (value != null) {
                                storeDataArray.splice(mappingItem.formColumn.order, 0, value);
                            }

                        } else {
                            storeDataArray.splice(mappingItem.formColumn.order, 0, getStoreDataFormat(mappingItem.formColumn.type, ''));
                        }
                    }
                }

                var formQuery = storeDataArray.join(',');
                var rowKey = i;
                if (self.options.useMock) {
                    if (callback != undefined && callback != null) {
                         
                        setTimeout(function(key) {
                                            executed++;
                                            var data = {
                                                current: i,
                                                total: dataLength,
                                                code: 100,
                                                message: 'Data saved succesfuly --MOCK--'+executed.toString(),
                                                rowKey: key
                                            };
                                            if(key==6||key==12){data.code = 300}
                                            callback(data); 
                                            if (executed == dataArray.length && (endCallback != undefined && endCallback != null)) {
                                                endCallback({
                                                    code: 200,
                                                    message: 'All items were saved successfuly'
                                                });
                                            }
                                        }, 50*rowKey, rowKey);
                    }
                    
                } else {
                    var command = 'Create New ' + mappingObj.formName + '(' + formQuery + ')';
                    self.serverRequest(self.HttpVerb.POST, command, function(result, key) {
                        executed++;
                        if (callback != undefined && callback != null) {
                            callback({
                                current: executed,
                                total: dataLength,
                                code: 100,
                                message: result.message,
                                rowKey: key
                            });
                        }
                        if (executed == dataArray.length && (endCallback != undefined && endCallback != null)) {
                            endCallback({
                                code: 200,
                                message: 'All items were saved successfuly'
                            });
                        }
                    }, function(jqXHR, textStatus, errorThrown, key) {
                        executed++;
                        if (executed == dataArray.length && (endCallback != undefined && endCallback != null)) {
                            endCallback({
                                code: 300,
                                message: errorThrown,
                                status: textStatus,
                                rowKey: key
                            });
                        }
                    }, rowKey);

                }
            }
        };

        /**Esta funcion permite construir la estructura para los campos que son referencia*/
        var getValueForReferenceColumn = function(dataType, dataColumn) {
            var value = '(';
            if (Array.isArray(dataColumn)) {
                for (var indexRef = 0; indexRef < dataColumn.length; indexRef++) {
                    value += indexRef > 0 ? ',' : '';
                    if (Array.isArray(dataType)) {
                        value += getStoreDataFormat(dataType[indexRef], dataColumn[indexRef]);
                    } else {
                        value += getStoreDataFormat(dataType, dataColumn[indexRef]);
                    }
                }
                value += ')';
            } else {
                value += getStoreDataFormat(dataType, dataColumn) + ')';
            }

            return value;
        }

        /**Esta funcion busca en el mapping si existe otra referencia al mismo form y devuelve
         * la posicion en el mapping que ocupa */
        var findSameReferenceForm = function(dataMapping) {
            var multiReferences = Array();
            var filterRef = dataMapping.filter(function(item) {
                return item.formColumn.isReference == true
            });

            for (var i = 0; i < filterRef.length - 1; i++) {

                for (var j = i + 1; j < filterRef.length; j++) {
                    if (filterRef[i].formColumn.name == filterRef[j].formColumn.name) {
                        var exist = multiReferences[filterRef[i].formColumn.name];
                        if (exist == undefined) {
                            multiReferences[filterRef[i].formColumn.name] = [filterRef[i], filterRef[j]];
                        } else {
                            multiReferences[filterRef[i].formColumn.name].push(filterRef[j]);
                        }
                    }
                }
            }
            return multiReferences;
        }

        var isReference = function(item) {
            if (item.formColumn.isReference)
                return true;
            return false;
        }

        /**Esta funcion busca en el appBase si existe el formulario,
         * y pasa al callback un objeto con la definicion del formulario
         * */
        self.getFormObj = function(formName, getFormCallback) {
            if (formsArray == null) {
                requestForms(function(formsArray) {
                    getFormCallback(formsArray[formName]);
                });
            } else {
                getFormCallback(formsArray[formName]);
            }
        };

        /**Esta funcion busca en el appBase todos los formularios,
         * y pasa al callback un objeto con la definicion de los formularios
         * obj = {
         * formName: '',
         * properties: [
         *      {
         * name:'',
         * type:'',
         * order: -1,
         * isReference: false,
         * formReferenced: '',
         * dataReferenced: ''
         *      }
         * ]
         * }
         */
        self.getForms = function(getFormsCallback) {

            if (formsArray == null || formsArray.length == 0) {
                requestForms(getFormsCallback);
            } else {
                getFormsCallback(formsArray);
            }
        }

        /**Este metodo ejecuta la consulta al appBase y devuelve en el callback
         * un arreglo con las definiciones de los formularios 
         */
        var requestForms = function(callback) {
            if (self.options.useMock) {
                parseFormRows(formsMock(), callback)
            } else {
                formsArray = Array();
                var command = 'SHOW FORMS';
                self.serverRequest(self.HttpVerb.GET,command, function(result) {
                    parseFormRows(result, callback)
                }, function() {

                });
            }
        };

        /**Este metodo realiza el parser del arreglo de formularios, construye un objeto
         * json y lo pasa en el callback
         */
        var parseFormRows = function(result, callback) {
            if (result.code != 100) {
                return;
            }

            var headers = result.resultSet.headers;
            var rows = result.resultSet.rows;
            if (rows.length > 0 || formsArray == null) {
                formsArray = Array();
            }
            for (var index in rows) {
                var formName = rows[index][0];
                var formObj = formsArray[formName];
                if (formObj == undefined) {
                    formsArray[formName] = {
                        formName: formName,
                        properties: [{
                            name: rows[index][2],
                            type: rows[index][3],
                            order: rows[index][4],
                            isReference: rows[index][5],
                            formReferenced: rows[index][6],
                            dataReferenced: rows[index][7]
                        }]
                    }
                } else {
                    formObj.properties.push({
                        name: rows[index][2],
                        type: rows[index][3],
                        order: rows[index][4],
                        isReference: rows[index][5],
                        formReferenced: rows[index][6],
                        dataReferenced: rows[index][7]
                    });
                }

            }

            if (callback != undefined) {
                callback(formsArray);
            }
        };

        /**Este metodo devuelve el formato para una propiedad a partir del tipo de dato */
        var getStoreDataFormat = function(dataType, value) {

            switch (dataType) {
                case 'TEXT':
                    return '"' + value + '"';
                case 'NUMBER':
                    return value == null ? 10000 : value;
                case 'BOOLEAN':
                    return value;
                case 'IMAGE':
                    return '"' + value + '"';
                case 'DATE':
                    return '"' + value + '"';
                default:
                    return '"' + value + '"';
            }
        };

        /**Este metodo consulta el appBase y devuelve los datos de un formulario 
         * filterPropertyArray = [{
         *      fieldName: 'TEXT',
         *      fieldValue: value,
         *      fieldType: 'TEXT, NUMBER, BOOLEAN'
         * }]
         */
        self.getFormData = function(formName, filterPropertyArray, callback, callbackData) {
            if (formName == undefined || formName == null) {
                return false;
            }

            if (self.options.useMock) {
                if (callback != undefined && callback != null) {
                    callback(formDataMock(formName), callbackData);
                    return;
                }
            } else {

                var command = 'GET ' + formName;

                if (filterPropertyArray != undefined && Array.isArray(filterPropertyArray)) {
                    command += ' with ';
                    for (var index in filterPropertyArray) {
                        if (index > 0) {
                            command += ' and ';
                        }
                        command += filterPropertyArray[index].fieldName + ' = ' + getStoreDataFormat(filterPropertyArray[index].fieldType, filterPropertyArray[index].fieldValue)
                    }
                }

                self.serverRequest(self.HttpVerb.GET,command, function(result, data) {
                    if (result.code == 100) {
                        var headers = result.resultSet.headers;
                        var rows = result.resultSet.rows;
                        if (callback != undefined && callback != null) {
                            callback(result.resultSet, data)
                        }
                    }
                }, function(error) {

                }, callbackData);
            }
        };

        /**Este metodo comprueba si en los datos de un formulario ya existe el dato especificado.
         * requiere para su funcionamiento que se pasen los datos del formulario
         */
        self.existDataInForm = function(columnName, columnData, formResult) {
            if (formResult == undefined || formResult == null) {
                return
            }
            var formHeaders = formResult.headers;
            var formRows = formResult.rows;
            var columnIndex = findColumnIndexInHeaders(formHeaders, columnName);

            if (columnIndex >= 0) {
                var index = 0;
                var found = false;
                while (index < formRows.length && !found) {
                    if (formRows[index][columnIndex] == columnData) {
                        found = true;
                        break;
                    }
                    index++;
                }

                return found;
            }
            return false;
        };

        /**Este metodo permite conocer el indice de una columna (x) de un formulario.
         * requiere para su funcionamiento la definicion del header de un formulario
         * */
        var findColumnIndexInHeaders = function(formHeaders, columnName) {
            if (formHeaders == undefined || formHeaders == null) {
                return;
            }

            var index = 0;
            var found = false;
            while (index < formHeaders.length && !found) {
                if (formHeaders[index].label == columnName) {
                    found = true;
                    break;
                }
                index++;
            }

            return found == true ? index : -1;
        };

        /**** Util for Mapping ****/
        /** Este metodo construye la estructura de Rows para el formulario de Mapping */
        var getMappingFormRow = function(mappingObj) {
            return [
                [mappingObj.sourceName, mappingObj.fileType, mappingObj.formName, mappingObj.isFirstColumnHeading]
            ];
        };

        /** Este metodo construye la estructura del objeto de mapping para el formulario de Mapping */
        var getMappingFormMap = function() {
            return {
                formName: 'MAPPING',
                isFirstColumnHeading: false,
                mappingProperties: [{
                    fileColumn: {
                        colStart: -1,
                        colEnd: -1,
                        index: 0,
                        isIgnored: false
                    },
                    formColumn: {
                        name: 'SOURCE_NAME',
                        type: 'TEXT',
                        order: 0,
                        isReference: false,
                        referenced: null
                    }
                }, {
                    fileColumn: {
                        colStart: -1,
                        colEnd: -1,
                        index: 1,
                        isIgnored: false
                    },
                    formColumn: {
                        name: 'FILE_TYPE',
                        type: 'TEXT',
                        order: 1,
                        isReference: false,
                        referenced: null
                    }
                }, {
                    fileColumn: {
                        colStart: -1,
                        colEnd: -1,
                        index: 2,
                        isIgnored: false
                    },
                    formColumn: {
                        name: 'FORM_NAME',
                        type: 'TEXT',
                        order: 2,
                        isReference: false,
                        referenced: null
                    }
                }, {
                    fileColumn: {
                        colStart: -1,
                        colEnd: -1,
                        index: 3,
                        isIgnored: false
                    },
                    formColumn: {
                        name: 'IS_FIRST_COL_HEAD',
                        type: 'BOOLEAN',
                        order: 3,
                        isReference: false,
                        referenced: null
                    }
                }]
            }
        };

        /** Este metodo construye la estructura del objeto de mapping para el formulario de MappingProperties */
        var getMappingPropertiesFormMap = function() {
            return {
                formName: 'MAPPING_PROPERTIES',
                isFirstColumnHeading: false,
                mappingProperties: [{
                    fileColumn: {
                        colStart: -1,
                        colEnd: -1,
                        index: 0,
                        isIgnored: false
                    },
                    formColumn: {
                        name: 'FILE_COL_START',
                        type: 'NUMBER',
                        order: 0,
                        isReference: false,
                        reference: null
                    }
                }, {
                    fileColumn: {
                        colStart: -1,
                        colEnd: -1,
                        index: 1,
                        isIgnored: false
                    },
                    formColumn: {
                        name: 'FILE_COL_END',
                        type: 'NUMBER',
                        order: 1,
                        isReference: false,
                        reference: null
                    }
                }, {
                    fileColumn: {
                        colStart: -1,
                        colEnd: -1,
                        index: 2,
                        isIgnored: false
                    },
                    formColumn: {
                        name: 'FILE_COL_INDEX',
                        type: 'NUMBER',
                        order: 2,
                        isReference: false,
                        reference: null
                    }
                }, {
                    fileColumn: {
                        colStart: -1,
                        colEnd: -1,
                        index: 3,
                        isIgnored: false
                    },
                    formColumn: {
                        name: 'FILE_COL_IGNORED',
                        type: 'BOOLEAN',
                        order: 3,
                        isReference: false,
                        reference: null
                    }
                }, {
                    fileColumn: {
                        colStart: -1,
                        colEnd: -1,
                        index: 4,
                        isIgnored: false
                    },
                    formColumn: {
                        name: 'FORM_COL_NAME',
                        type: 'TEXT',
                        order: 4,
                        isReference: false,
                        reference: null
                    }
                }, {
                    fileColumn: {
                        colStart: -1,
                        colEnd: -1,
                        index: 5,
                        isIgnored: false
                    },
                    formColumn: {
                        name: 'FORM_COL_TYPE',
                        type: 'TEXT',
                        order: 5,
                        isReference: false,
                        reference: null
                    }
                }, {
                    fileColumn: {
                        colStart: -1,
                        colEnd: -1,
                        index: 6,
                        isIgnored: false
                    },
                    formColumn: {
                        name: 'FORM_COL_ORDER',
                        type: 'NUMBER',
                        order: 6,
                        isReference: false,
                        reference: null
                    }
                }, {
                    fileColumn: {
                        colStart: -1,
                        colEnd: -1,
                        index: 7,
                        isIgnored: false
                    },
                    formColumn: {
                        name: 'IS_REFERENCE',
                        type: 'BOOLEAN',
                        order: 7,
                        isReference: false,
                        reference: null
                    }
                }, {
                    fileColumn: {
                        colStart: -1,
                        colEnd: -1,
                        index: 8,
                        isIgnored: false
                    },
                    formColumn: {
                        name: 'FORM_REFERENCED',
                        type: 'TEXT',
                        order: 8,
                        isReference: false,
                        reference: null
                    }
                }, {
                    fileColumn: {
                        colStart: -1,
                        colEnd: -1,
                        index: 9,
                        isIgnored: false
                    },
                    formColumn: {
                        name: 'DATA_REFERENCED',
                        type: 'TEXT',
                        order: 9,
                        isReference: false,
                        reference: null
                    }
                }, {
                    fileColumn: {
                        colStart: -1,
                        colEnd: -1,
                        index: 10,
                        isIgnored: false
                    },
                    formColumn: {
                        name: 'SOURCE_NAME',
                        type: 'TEXT',
                        order: 10,
                        isReference: true,
                        reference: {
                            formName: 'MAPPING',
                            fieldName: 'SOURCE_NAME'
                        }
                    }
                }]
            }
        };

        /** Este metodo construye la estructura de Rows para el formulario de MappingProperties */
        var getMappingPropertiesRow = function(mappingName, propertyObj) {

            return [
                propertyObj.fileColumn.colStart,
                propertyObj.fileColumn.colEnd,
                propertyObj.fileColumn.index,
                propertyObj.fileColumn.isIgnored,
                propertyObj.formColumn.name,
                propertyObj.formColumn.type,
                propertyObj.formColumn.order,
                propertyObj.formColumn.isReference,
                propertyObj.formColumn.reference != null ? propertyObj.formColumn.reference.formName : null,
                propertyObj.formColumn.reference != null ? propertyObj.formColumn.reference.fieldName : null,
                mappingName
            ];
        };

        /**Este metodo consulta todas las definiciones de mapping que se han guardado en el appBase */
        self.getMappings = function(callback) {
            self.getFormData('MAPPING', null, function(resultSet) {
                /*if (result.code != 100) {
                    return;
                }*/

                var headers = resultSet.headers;
                var rows = resultSet.rows;
                var mapingArray = Array();
                var counter = 0;
                for (var index in rows) {
                    //Aqui se puede consultar MAPPING_PROPERTIES para obtener las properties de cada definicion
                    var filterArray = [{
                        fieldName: 'MAPPING.SOURCE_NAME',
                        fieldValue: rows[index][0],
                        fieldType: 'TEXT'
                    }]
                    self.getFormData('MAPPING_PROPERTIES', filterArray, function(filterResult, data) {
                        counter++;
                        var mappingPropertiesResult = filterResult.rows;
                        var mappingObj = getMappingObj(data, filterResult.rows);

                        mapingArray.push(mappingObj);

                        if (counter == rows.length) {
                            if (callback != undefined && callback != null) {
                                callback(mapingArray);
                            }
                        }
                    }, rows[index]);
                }
            });
        };

        /** Esta funcion construye el objeto de mapping */
        var getMappingObj = function(mappingRow, mappingPropertyRows) {
            var mappingProperties = Array();
            for (var filterIndex in mappingPropertyRows) {
                var property = {
                    fileColumn: {
                        colStart: mappingPropertyRows[filterIndex][0],
                        colEnd: mappingPropertyRows[filterIndex][1],
                        index: mappingPropertyRows[filterIndex][2],
                        isIgnored: mappingPropertyRows[filterIndex][3],
                    },
                    formColumn: {
                        name: mappingPropertyRows[filterIndex][4],
                        type: mappingPropertyRows[filterIndex][5],
                        order: mappingPropertyRows[filterIndex][6],
                        isReference: mappingPropertyRows[filterIndex][7],
                        reference: {
                            formName: mappingPropertyRows[filterIndex][8],
                            fieldName: mappingPropertyRows[filterIndex][9]
                        }
                    }
                }

                mappingProperties.push(property);
            }

            var mappingObj = {
                sourceName: mappingRow[0],
                fileType: mappingRow[1],
                formName: mappingRow[2],
                isFirstColumnHeading: mappingRow[3],
                mappingProperties: mappingProperties
            }

            return mappingObj;
        }

        /**Este metodo dado el nombre o identificador de una definicion de maping obtiene toda la definicion*/
        self.getMapping = function(mappingName, callback) {
            var filterArray = [{
                fieldName: 'SOURCE_NAME',
                fieldValue: mappingName
            }]
            self.getFormData('MAPPING', filterArray, function(resultSet) {
                var headers = resultSet.headers;
                var rows = resultSet.rows;
                if (rows.length > 0) {
                    var filterArray = [{
                        fieldName: 'MAPPING.SOURCE_NAME',
                        fieldValue: rows[0][0],
                        fieldType: 'TEXT'
                    }];
                    self.getFormData('MAPPING_PROPERTIES', filterArray, function(filterResult) {
                        var mappingPropertiesResult = filterResult.rows;
                        var mappingObj = getMappingObj(rows[index], filterResult.rows);

                        if (callback != undefined && callback != null) {
                            callback(mappingObj);
                        }
                    });
                }
            });
        };
        
        self.compareMappings = function(mappingObject1, mappingObject2){
            if(mappingObject1 == undefined && mappingObject2 == undefined){
                throw new Error("Mapping must be defined");
            }
            
            
        }

        /** Este metodo es generico sirve para hacer las request al application base*/
        self.serverRequest = function(httpVerb, commandText, successCallback, errorCallback, callbackData) {
            $.ajax({
                type: (httpVerb == undefined || httpVerb == null)? 'GET' : httpVerb,
                url: appBaseUrl,
                cache: false,
                dataType: 'json',
                data: {
                    command: commandText
                },
                success: function(result) {
                    if (successCallback != undefined && successCallback != null) {
                        successCallback(result, callbackData)
                    }
                },
                error: function(jqXHR, textStatus, errorThrown) {
                    if (errorCallback != undefined && errorCallback != null) {
                        errorCallback(jqXHR, textStatus, errorThrown, callbackData)
                    }
                }
            });
        };
    }
});

$(function() {
    $.appBaseService.initialize({
        requestForm: true,
        useMock: true
    });
})