angular.module('FQLService', []).factory('FQLService', function($rootScope, $http){

	var service  = {};
	
	service.executeFQL = function(stmt, callback, params)
	{	
	    $http.get("http://dev.synchronit.com/appbase-webconsole/json?command="+stmt)
	    .then(function(response) {callback(response, stmt, params);},
	    	  function(response) {callback(response, stmt, params);});	    
	}

	service.fqlResultOK = function(response)  
	{
		return (response.data.code > 99 && response.data.code < 200);
	}
	
	
	return service;

});
