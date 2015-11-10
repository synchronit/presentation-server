angular.module('broadcastService', []).factory('broadcastService', function($rootScope){

	var service  = {};
	
	service.formSelected = {label: ''};

	//**** A FORM IS SELECTED ON THE LEFT-SIDE TREE *****//
	service.getFormSelected = function()
	{
		return this.formSelected;
	}
	
	service.setFormSelected = function(formSelected)
	{
		this.formSelected = formSelected;
		$rootScope.$broadcast("newFormSelected");
	}

	//***** MULTIPLE RESULTS ARE RETURNED FROM A QUERY *****//
	service.response = { };

	service.getResponse = function()
	{
		return this.response;
	}
	
	service.setResponse = function(response)
	{
		this.response = response;
		$rootScope.$broadcast("multipleResults");
	}
	
	
	//***** END OF SERVICES ******//
	
	return service;

});
