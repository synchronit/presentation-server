/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

wholeApp.controller('importerController', ['$scope', '$http', function ($scope, $http)
    {
            
                $.appBaseService.getMappings(function(result){$.savedMappings = result;});
                //datos parseados a JSON
                var formObject = null;
                $.json_array = [];
                //function parser del texto CSV a un objeto JSON
                var parseCSVtoJSON = function(content) {
                    $.json_array = Papa.parse(content, {
                        dynamicTyping: true,
                        header: false
                    });
                };

                //llena la tabla del mapping
                var seedTableData = function() {
                    $("table#table_mapping tbody").children().remove();
                    $("table#table_mapping thead").children().remove();
                    $('select#form_names option:selected').removeAttr('selected');

                    if ($.json_array.length == 0) {
                        parseCSVtoJSON();
                    }

                    var counter = rowCount();
                    //if(rowCount() < 10) {counter = rowCount();}

                    var a = 0;

                    for (i = a; i < counter; i++) {
                        var rowData = $('<tr></tr>');
                        rowData.attr('data-index', i.toString());
                        var del_button = $('<td><a style="cursor:pointer" data-toggle="tooltip" data-placement="left" data-index="' + i.toString() + '" title="Delete this Row"><span class="glyphicon glyphicon-remove text-danger"><span></a></td>');
                        del_button.children('a').on('click', function(e) {
                            var data_index = $(this).attr('data-index');
                            var row_index = $('table#table_mapping tr[data-index="' + data_index.toString() + '"]').index();
                            $('table#table_mapping tr[data-index="' + data_index.toString() + '"]').remove();
                            $.json_array.data.splice(row_index, 1);
                        });
                        del_button.appendTo(rowData);
                        for (var k = 0; k < columnCount(); k++) {
                            $('<td>' + $.json_array.data[i][k] + '</td>').appendTo(rowData);
                        }
                        $("table#table_mapping tbody").append(rowData);
                    }
                };

                //event handler para el select form
                $('select#form_names').on('change', function() {
                    var selectElement = this;
                    var selectedValue = selectElement.options[selectElement.selectedIndex].value;
                    $.appBaseService.getForms(function(result) {
                        formObject = result[selectedValue];
                        $.selectedForm = formObject;
                        seedHeadingMaps();
                    });

                    if($.savedMappings.length == 0 ){
                        loadMappings(updateMappingSelect, selectedValue);
                    }else{
                        updateMappingSelect(selectedValue);    
                    }   

                });

                //event handler para el select maping
                 var updateMappingSelect = function(formName){
                    var drop_forms = document.getElementById('mapping_names');
                    $(drop_forms).find('option').remove().end().append('<option>loading mappings...</option>').end();

                    var filtered = $.savedMappings.filter(function(item) {return item.formName == formName});
                    if (filtered.length == 0) {
                        $(drop_forms).find('option').text('Not mapping found for '+formName);
                    }else{
                        $(drop_forms).find('option').text('Select mapping');
                    }
                    for (item in filtered) {
                        var option = document.createElement('option');
                        option.text = filtered[item].sourceName;
                        drop_forms.add(option);

                    }
                }

                //event handler para cuando el usuario edita el texto
                $("#file_content").on("input", function(event) {
                    parseCSVtoJSON.applyAsync([], seedTableData);
                });

                var seedHeadingMaps = function() {
                    if (formObject == null) {
                        return;
                    }
                    var columnProperties = formObject.properties;
                    //clean datatable
                    $("table#table_mapping thead").children().remove();
                    var row = $('<tr></tr>');
                    var emptycell = $('<th></th>');
                    emptycell.appendTo(row);
                    var count = columnCount();
                    for (var j = 0; j < count; j++) {
                        var headingCell = $('<th></th>');
                        var select = $('<select></select>', {
                            id: "select_" + j.toString(),
                            'class': 'form-control form_columns'
                        });
                        var ignore = $('<option>ignore</option>', {
                            'data-value': 'ignore'
                        });
                        ignore.appendTo(select);
                        for (var k = 0; k < columnProperties.length; k++) {
                            var option = $('<option>' + columnProperties[k].name + '</option>');
                            option.attr('data-name', columnProperties[k].name);
                            option.attr('data-order', columnProperties[k].order);
                            option.attr('data-type', columnProperties[k].type);
                            option.attr('data-isReference', columnProperties[k].isReference);
                            if (columnProperties[k].isReference == "true") {
                                option.attr('data-formReferenced', columnProperties[k].formReferenced);
                                option.attr('data-dataReferenced', columnProperties[k].dataReferenced);
                            }
                            option.appendTo(select);
                        }
                        select.appendTo(headingCell);
                        headingCell.appendTo(row);
                    }
                    $('table#table_mapping thead').append(row);
                };

                var columnCount = function() {
                    if ($.json_array != null) {
                        if ($.json_array.data != null) {
                            var max;
                            max = Math.max.apply(null, $.json_array.data.map(function(item) {
                                return item.length
                            }));
                            return max;
                        } else {
                            return 0;
                        }
                    } else {
                        return 0;
                    }
                };

                var rowCount = function() {
                    if ($.json_array != null) {
                        return $.json_array.data.length;
                    } else {
                        return 0;
                    }
                };

                //carga fichero y contenido en el textarea
                $('#csv_file_input').bind('change', function(event) {
                    var input = event.target;

                    var reader = new FileReader();
                    reader.onload = function() {
                        var text = reader.result.split(' ').filter(function(n) {
                            return n
                        }).join(' ');
                        var content = document.getElementById('file_content');
                        content.value = text;
                        parseCSVtoJSON.applyAsync([text], seedTableData);
                    }
                    reader.readAsText(input.files[0]);
                    $.mappingObj.fileType = input.files[0].type;

                });

                //busca los datos desde el appbase
                $.appBaseService.getForms(function(result) {
                    var keys = Object.keys(result);
                    keys.forEach(function(key) {
                        var drop_forms = document.getElementById('form_names');
                        var option = document.createElement('option');
                        option.text = key;
                        drop_forms.add(option);
                    });
                });

                var loadMappings = function(callback, params){
                        $.appBaseService.getMappings(function(result){
                        $.savedMappings = result;
                        callback(params);
                    });
            };
            
            
            $('#see_source_btn').on('click', function() {
                if (!$('#div_file_content').hasClass('in')) {
                    $(this).children('span').removeClass('glyphicon-chevron-down');
                    $(this).children('span').addClass('glyphicon-chevron-up');
                } else {
                    $(this).children('span').removeClass('glyphicon-chevron-up');
                    $(this).children('span').addClass('glyphicon-chevron-down');
                }
            });

            $('#btn-expand').on('click', function() {
                if (!$('#stackTraceContiner').hasClass('in')) {
                    $(this).children('span').removeClass('glyphicon-chevron-down');
                    $(this).children('span').addClass('glyphicon-chevron-up');
                } else {
                    $(this).children('span').removeClass('glyphicon-chevron-up');
                    $(this).children('span').addClass('glyphicon-chevron-down');
                }
            });

            $('#send_data_btn').on('click', function() {
                prepData();
            });



        };

        var prepData = function() {
            //opening modal
            $('#modal-progress').modal('show');
            $('#currentItem').html('');
            $('#stackTrace').html('');

            $.mappingObj.formName = $('select#form_names').children('option:selected').val();
            $.mappingObj.isFirstColumnHeading = $('#first_row_checker').is(':checked');
            $.mappingObj.sourceName = $('#mapNameText').val();
            var selectedOptions = $('select.form_columns').children('option:selected');
            $.mappingObj.mappingProperties = [];
            if (selectedOptions.length > 0) {
                //pushing selected columns
                selectedOptions.each(function(item) {
                    var fileColumn = {
                        colStart: 0,
                        colEnd: 0,
                        index: 0,
                        isIgnored: false
                    };
                    var formColumn = {
                        name: '',
                        type: '',
                        order: 0,
                        isReference: false,
                        reference: {
                            formName: '',
                            fieldName: ''
                        }
                    };
                    var map = {
                        fileColumn: fileColumn,
                        formColumn: formColumn
                    };
                    var counting = 0;

                    map.fileColumn.index = item;
                    if ($(this).val() != 'ignore') {
                        map.formColumn.name = $(this).attr('data-name');
                        map.formColumn.type = $(this).attr('data-type');
                        map.formColumn.order = $(this).attr('data-order');
                        map.formColumn.isReference = $(this).attr('data-isreference') == 'true';
                        if (map.formColumn.isReference) {
                            map.formColumn.reference.formName = $(this).attr('data-formreferenced');
                            map.formColumn.reference.fieldName = $(this).attr('data-datareferenced');
                        }
                        $.mappingObj.mappingProperties.push(map);
                        counting++;
                    }


                });

                //pushing missing data-columns
                var mapped = $.mappingObj.mappingProperties.map(function(item) {
                    return item.formColumn.name
                });
                var nonMapProperties = $.selectedForm.properties.filter(function(item) {
                    return !mapped.includes(item.name);
                });

                $(nonMapProperties).each(function(i) {
                    var fileColumn = {
                        colStart: 0,
                        colEnd: 0,
                        index: 0,
                        isIgnored: true
                    };
                    var formColumn = {
                        name: nonMapProperties[i].name,
                        type: nonMapProperties[i].type,
                        order: nonMapProperties[i].order,
                        isReference: nonMapProperties[i].isReference == "true",
                        reference: {
                            formName: '',
                            fieldName: ''
                        }
                    };
                    if (nonMapProperties[i].isReference == "true") {
                        formColumn.reference.formName = nonMapProperties[i].formReferenced;
                        formColumn.reference.fieldName = nonMapProperties[i].dataReferenced;
                    }
                    var map = {
                        fileColumn: fileColumn,
                        formColumn: formColumn
                    };
                    $.mappingObj.mappingProperties.push(map);

                });



                var total = $.json_array.data.length + 1;
                var progressValue = 0;
                $('#sendingProgress').attr('max', total);
                $('#sendingProgress').attr('value', progressValue);

                /**Aqui tener en cuenta que no se puede guardar dos mapping con el mismo identificador
                 * contemplar este caso y notificar el usuario
                 */
                var current = 1;
                $('#currentItem').html(current + ' of ' + total);

                $.appBaseService.saveMapping($.mappingObj, function(endCallbackData) {
                    if (endCallbackData != undefined && endCallbackData != null) {
                        if (endCallbackData.code == 300) {
                            alert(endCallbackData.message);
                            var errorSpan = '<span style="color:red;">Error: </span>'
                            $('#currentItem').html(errorSpan + endCallbackData.message);
                            return;
                        } else {

                            if (endCallbackData.stackTrace != undefined) {
                                for (var i in endCallbackData.stackTrace) {
                                    var litem = '<li>' + endCallbackData.stackTrace[i] + '</li>'
                                    $('#stackTrace').append(litem);
                                }
                            }

                            $('#sendingProgress').attr('value', ++progressValue);
                            $.appBaseService.saveFormData($.mappingObj, $.json_array.data, function(data) {

                                $('#sendingProgress').attr('value', ++progressValue);
                                current++;
                                $('#currentItem').html(current + ' of ' + total);
                                var litem = '<li>' + data.message + '</li>'
                                $('#stackTrace').append(litem);
                            }, function() {
                                //alert('listo!');
                            });
                        }
                    }
                    /**  Revisar en el appBaseService que la funcion endCallback siempre devuelva un objeto
                                        con un codigo y un mesaje para que pueda ser empleado como forma de validacion en el cliente  */

                    /** Aqui hay que validar el codigo de retorno del callback y mostrar el mensaje adecuadamente en la pantalla
                     * Revisar que funcione bien el progressbar con respecto a lo que esta sucediendo en el service
                     */

                });

            } else {
                alert('Ups, seems like you haven\'t choosed any Form to map');
                return;
            }

       
    }]);