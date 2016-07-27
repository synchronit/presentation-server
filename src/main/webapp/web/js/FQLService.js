angular.module('FQLService', []).factory('FQLService', function ($rootScope, $http) {

    var service = {};

    service.executeFQL = function (stmt, callback, params)
    {
        $http.get("http://dev.synchronit.com/appbase-webconsole/json?command=" + stmt)
                .then(function (response) {
                    callback(response, stmt, params);
                },
                        function (response) {
                            callback(response, stmt, params);
                        });
    }

    service.executePostFQL = function (stmt, callback, params) {

        $.ajax({
            type: 'POST',
            url: "http://dev.synchronit.com/appbase-webconsole/json",
            cache: false,
            data: {command: stmt},
            success: function (response) {
                callback(response, stmt, params);
            },
            error: function (response) {
                callback(response, stmt, params);
            }
        });

        /*var config = {
         headers: {
         'Content-Type': 'application/json;charset=utf-8;'
         }
         }
         var data = $.param({
         json: JSON.stringify({
         command: stmt
         })
         });
         
         $http.post("http://dev.synchronit.com/appbase-webconsole/json", data, config)
         .then(function (response) {
         callback(response, stmt, params);
         },
         function (response) {
         callback(response, stmt, params);
         });*/
    }

    service.fqlResultOK = function (response)
    {
        return (response.data.code > 99 && response.data.code < 200);
    }


    return service;

});
