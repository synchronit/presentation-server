angular.module('broadcastService', []).factory('broadcastService', function($rootScope){

	var service  = {};
	
	service.formSelected = {label: ''};

	/***************************************************/
	/**** A FORM IS SELECTED ON THE LEFT-SIDE TREE *****/
	service.getFormSelected = function()
	{
		return service.formSelected;
	}
	
	service.setFormSelected = function(formSelected)
	{
		service.formSelected = formSelected;
		$rootScope.$broadcast("newFormSelected");
	}


	/******************************************************/
	/***** MULTIPLE RESULTS ARE RETURNED FROM A QUERY *****/
	service.response = { };

	service.getResponse = function()
	{
		return service.response;
	}
	
	service.setResponse = function(response)
	{
		service.response = response;
		$rootScope.$broadcast("multipleResults");
console.log("M2!");
	}
	
	
	/*******************************************************/
	/***** A ROW HAS BEEN CHOSEN FROM MULTIPLE RESULTS *****/
	service.rowSelected = -1;
	service.rowSelectedResponse = { };

	service.getRowSelected = function()
	{
		return this.rowSelected;
	}
	service.getRowSelectedResponse = function()
	{
		return this.rowSelectedResponse;
	}
	
	
	service.setRowSelected = function(rowSelected, response)
	{
		this.rowSelected = rowSelected;
		this.rowSelectedResponse = response;
		$rootScope.$broadcast("multipleResultsRowSelected");
	}
	

	/***** END OF SERVICES ******/
	
	return service;

});
