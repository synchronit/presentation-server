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
                callback({data: response}, stmt, params);
            },
            error: function (response) {
                callback({data: response}, stmt, params);
            }
        });

        /*var request = $http({
         method: "POST",
         url: "http://dev.synchronit.com/appbase-webconsole/json",
         headers: {
         'Content-Type': 'application/x-www-form-urlencoded'
         },
         data: {
         command: stmt
         }
         });
         request.success(
         function (response) {
         callback(response, stmt, params);
         }
         );*/

        /* $http.post("http://dev.synchronit.com/appbase-webconsole/json", {command: stmt})
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
