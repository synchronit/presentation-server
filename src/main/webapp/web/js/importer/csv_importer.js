$.extend({
    json_array: [],
    savedMappings: [],
    selectedForm: null,
    mappingObj: {
        sourceName: '',
        fileType: '',
        formName: '',
        isFirstColumnHeading: false,
        mappingProperties: [{
            fileColumn: {
                colStart: -1,
                colEnd: -1,
                index: -1,
                isIgnored: false
            },
            formColumn: {
                name: '',
                type: '',
                order: -1,
                isReference: false,
                reference: {
                    formName: '',
                    fieldName: ''
                }
            }
        }]
    }
});

 Function.prototype.applyAsync = function(params, cb) {
            var function_context = this;
            setTimeout(function() {
                var val = function_context.apply(this, params);
                if (cb) cb(val);
            }, 0);
        };



