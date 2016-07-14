$.extend({
    indexImport: new function() {
        var self = this;

        self.initialize = function() {
            attachBehavior();
        };

        var attachBehavior = function() {
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


        }
    }
});


$(function() {
    $.indexImport.initialize();
})