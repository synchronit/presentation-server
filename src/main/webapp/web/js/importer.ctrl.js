/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

wholeApp.controller('importerController', ['$scope', '$http','broadcastService', function ($scope, $http,$broadcastService)
    {           
                           
                $.appBaseService.getMappings(function(result){$.savedMappings = result;});
                //datos parseados a JSON
                var formObject = null;
                $.json_array = [];

                //revisa si hay algun FORM seleccionado en el PS
                var selectedFormPS = $broadcastService.getFormSelected()["label"];
                //function parser del texto CSV a un objeto JSON
                var parseCSVtoJSON = function(content) {
                    $.json_array = Papa.parse(content, {
                        dynamicTyping: true,
                        header: false
                    });
                };

                //loadmappings
                 var loadMappings = function(callback, params){
                    if($.appBaseService.options.useMock){
                        $.savedMappings = mockingsMock();
                        callback(params);
                    }else{
                        $.appBaseService.getMappings(function(result){
                        $.savedMappings = result;
                        if(callback!=undefined){callback(params);}                   
                        });     
                    }
                };

                //llena la tabla del mapping
                var seedTableData = function() {
                    $("table#table_mapping").colResizable({disable:true});
                    $("table#table_mapping tbody").children().remove();
                    $("table#table_mapping thead").children().remove();
                    //$('select#form_names option:selected').removeAttr('selected');

                    if($('select#form_names option:selected').val()!="Select..."){
                        $.appBaseService.getForms(function(result) {
                            formObject = result[$('select#form_names option:selected').val()];
                            $.selectedForm = formObject;
                            seedHeadingMaps();
                            isUsingExistingMap=false;
                            searchMappings($('select#form_names option:selected').val());
                        });
                    }

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
                            $('table#table_mapping tr[data-index="' + data_index.toString() + '"]').tooltip('destroy');
                            $('table#table_mapping tr[data-index="' + data_index.toString() + '"]').remove();
                            $.json_array.data.splice(row_index, 1);
                        });
                        del_button.appendTo(rowData);
                        for (var k = 0; k < columnCount(); k++) {
                            $('<td>' + $.json_array.data[i][k] + '</td>').appendTo(rowData);
                        }
                        $("table#table_mapping tbody").append(rowData);
                    }
                    $("table#table_mapping").colResizable({resizeMode:'overflow'});
                    //fixTableWidths();
                };

                //event handler para el select form
                $('select#form_names').on('change', function() {
                    var selectElement = this;
                    var selectedValue = selectElement.options[selectElement.selectedIndex].value;
                    $.appBaseService.getForms(function(result) {
                        formObject = result[selectedValue];
                        $.selectedForm = formObject;
                        seedHeadingMaps();
                        isUsingExistingMap=false;
                    });
                    searchMappings(selectedValue);
                    removeBadRowsStyles();
                });

                var searchMappings = function(selectedValue){
                    if($.savedMappings.length == 0 ){
                        loadMappings(updateMappingSelect, selectedValue);
                    }else{
                        updateMappingSelect(selectedValue);    
                    }   
                };

                $('select#mapping_names').on('change', function(){
                    var selectElement = this;
                    var selectedValue = selectElement.options[selectElement.selectedIndex].value;
                    if(selectedValue=='Select mapping'){
                        $('table#table_mapping select').each(function(index, elem) {$(this).val('ignore')});
                        isUsingExistingMap=false;
                    }else{
                        loadExistingMapping(selectedValue);
                        isUsingExistingMap=true;
                    }
                    $('div#savingExistingMapping').addClass('hidden');
                    removeBadRowsStyles();
                  });


                //cuando el usuario edita los select
                var registerSelectChange = function(){
                     $('table#table_mapping select').on('change', function(){
                        if(isUsingExistingMap){
                            isUsingExistingMapEdited = true;
                            $('div#savingExistingMapping').removeClass('hidden');
                        }
                    });
                };

                //arreglar los width de columnas o cabeceras
                var fixTableWidths = function() {
                    $($('table tbody tr td')[0]).css('width', 30);
                    /*var headings = $($('table#table_mapping thead tr')[0]).children('th');
                    var columns = $($('table#table_mapping tbody tr')[0]).children('td');

                    for (var i = 0 ; i < headings.length ; i++) {
                        var headWidth = headings[i].offsetWidth;
                        var colWidth = columns[i].offsetWidth;
                        if (headWidth>colWidth){
                            $(columns[i]).css('width', headWidth);

                        }else{
                            $(headings[i]).css('width', colWidth);
                        }
                    }*/
                }; 
                

                //event handler para el select mapping
                 var updateMappingSelect = function(formName){
                    var drop_forms = document.getElementById('mapping_names');
                    $(drop_forms).find('option').remove().end().append('<option>loading mappings...</option>');

                    var filtered = $.savedMappings.filter(function(item) {return item.formName == formName});
                    $(drop_forms).find('option').text('Select mapping');
                    for (item in filtered) {
                        var option = document.createElement('option');
                        option.text = filtered[item].sourceName;
                        drop_forms.add(option);
                    }
                };

                 var loadExistingMapping = function(selectedMapping){
                    var map = $.savedMappings.filter(function(item) {return item.sourceName==selectedMapping?true: false})[0];
                    var props = map.mappingProperties; 
                    $('table#table_mapping select').val('ignore');
                    var selectCount = $('table#table_mapping select').length;
                    if(selectCount>0){
                        for(item in props){
                            if(props[item].fileColumn.isIgnored!="true"){
                                var index = props[item].fileColumn.index;
                                var column = props[item].formColumn.name; 
                                if(selectCount>index){
                                    var select = $('table#table_mapping select')[index];
                                    if(select){
                                        $(select).val(column);
                                    }
                                }       
                            }                      
                        }
                    }
                    
                };

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
                    registerSelectChange();
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
                    removeBadRowsStyles();
                });

                var removeBadRowsStyles = function(){
                    $('#divBadRowsFilter').addClass('hidden');
                    $('table#table_mapping tr.danger').removeClass('danger');
                    $('table#table_mapping tr.success').removeClass('success');
                };

                //busca los datos desde el appbase
                $.appBaseService.getForms(function(result) {
                    var keys = Object.keys(result);
                    var selectedFormPS = $broadcastService.getFormSelected()["label"];
                    var drop_forms = document.getElementById('form_names');
                    keys.forEach(function(key) {
                        var option = document.createElement('option');
                        option.text = key;
                        drop_forms.add(option);
                    });
                    if(selectedFormPS!="" && selectedFormPS!=null && selectedFormPS!=undefined){
                        $(drop_forms).val(selectedFormPS);
                        searchMappings(selectedFormPS);
                    }
                });

       
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
                $('#divBadRowsFilter').addClass('hidden');
                saveDataToAppBase();
            });

            $('button#closeBadRowsDiv').on('click', function(){
                $('#divBadRowsFilter').addClass('hidden');
            });


        var hasValueNewMapText = function(){
            return ($('input#mapNameText').val()=='')? false : true ;
        };

        var saveDataToAppBase = function(){
            removeBadRowsStyles();
            if(hasColumnMapped()){

                    //logica para cuando cree su propio mapping
                    //si el textbox tiene valor, guardar el mapping sino, guardar solo los datos. 
                    if($('input#mapNameText').val()==""){
                        prepMapping();
                        importData(); 
                         if(isUsingExistingMap && isUsingExistingMapEdited && $('input#saveEditedMapping').is(':checked')){
                           //actualizacion del mapping usado
                         }                       
                    }else{
                        //checkeo si el mapping ya existe
                         if(!checkExistingMap($('input#mapNameText').val())){
                             //preparar y guardar mapping
                            //y luego enviar los datos 
                                prepMapping();
                                saveMapping();
                                importData();
                           }else{
                               alert('Ups, looks like there is already a saved Map with this name: '+$('input#mapNameText').val()+". Please try a diferent name." );
                           }
                    }
             
            }else{
                alert('Ups, seems like you haven\'t map any column. Please choose at least one column to map before importing!');
            }
        };

        var prepMapping = function(){
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
                    if ($(this).html() != 'ignore') {
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
            }else{
                alert('Ups, seems like you haven\'t map any column. Please choose at least one column to map before importing!');
            }
        };

        var saveMapping = function(){
            //aqui va el savemapping;
               /**Aqui tener en cuenta que no se puede guardar dos mapping con el mismo identificador
                 * contemplar este caso y notificar el usuario
                 * ** que hacer si falla el savemapping
                 */
          $.appBaseService.saveMapping($.mappingObj, function(endCallbackData) {
                if (endCallbackData != undefined && endCallbackData != null) {
                    if (endCallbackData.code == 300) {
                        var errorSpan = '<li class="text-danger">Error:' + 'Mapping couldn\'t be saved.';
                        $('#stackTrace').append(errorSpan + endCallbackData.message + '</li>');
                        $('#stackTrace').scrollTop($('#stackTrace')[0].scrollHeight);
                        return;
                    } else {
                     if (endCallbackData.stackTrace != undefined) {
                            for (var i in endCallbackData.stackTrace) {
                                var litem = '<li class="text-success">' + endCallbackData.stackTrace[i] + '</li>'
                                $('#stackTrace').append(litem);
                                $('#stackTrace').scrollTop($('#stackTrace')[0].scrollHeight);
                            }
                        }
                        //actualizando los mappings y los select
                        loadMappings(function(){
                            updateMappingSelect($('select#form_names').val());
                            $('select#mapping_names').val($.mappingObj.sourceName);
                            $('input#mapNameText').val('');
                        });
                        
                     }
                }
                
                });
        };

        var isUsingExistingMap = false;

        var isUsingExistingMapEdited = false;

        var hasColumnMapped = function(){
            var notMappedColumnCount = $('select.form_columns').children('option:selected').filter(function(i, e){if($(this).html()==="ignore"){return true}else{return false}}).length;
            if(columnCount()==notMappedColumnCount){return false}else{return true}
        }

        var importData = function(){
            //envio de datos con callbacks a la UI. 

            //opening modal
            $('#modal-progress').modal('show');
            $('#currentItem').html('');
            $('#stackTrace').html('');

            var total = $.json_array.data.length;
            var progressValue = 0;
            var failureCount = 0;
            $('#stackTrace').children().remove();
            $('#sendingProgress').attr('max', total);
            $('#sendingProgress').attr('value', progressValue);

                $.appBaseService.saveFormData($.mappingObj, $.json_array.data, function(data) {
                    if(data.code == 300){
                        $('tr[data-index='+data.rowKey+']').addClass('danger').attr('title', 'Error: '+data.message).attr('data-toggle', 'tooltip').attr('data-placement', 'bottom');
                        $('tr[data-index='+data.rowKey+']').tooltip({container:'body'});
                        failureCount++;
                        $('#currentFailure').html('('+failureCount + " failures)");
                    }else{
                         $('tr[data-index='+data.rowKey+']').addClass('success');
                    }
                    $('#sendingProgress').attr('value', ++progressValue).end();
                    $('#currentItem').html(progressValue + ' of ' + total);
                    var litem = data.code==300? '<li class="text-danger">' + data.message + '</li>' :'<li class="text-success">' + data.message + '</li>';
                    $('#stackTrace').append(litem);
                    $('#stackTrace').scrollTop($('#stackTrace')[0].scrollHeight);
                    
                }, function() {
                    var badrows = $('tr.danger'); 
                    if(badrows.length>0){
                        $('#divBadRowsFilter').removeClass('hidden').addClass('show');
                        $('#checkBadRowsFilter').on('change', function(){
                            var $this = $(this);
                            if ($this.is(':checked')) {
                                $("tbody tr:not(.danger)").addClass('hidden');
                            } else {
                                $("tbody tr:not(.danger)").removeClass('hidden');
                                }
                        })
                    }
                });
         };

        var checkExistingMap = function(mapName){
           return $.savedMappings.filter(function(item){return item.sourceName==mapName? true: false}).length==0? false: true;
        };      
       
    }]);

  