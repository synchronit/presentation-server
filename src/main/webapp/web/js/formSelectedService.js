angular.module('formSelectedService', []).factory('formSelectedService', function($rootScope){

	var service  = {};
	service.formSelected = {label: ''};

	service.getFormSelected = function()
	{
		return this.formSelected;
	}
	
	service.setFormSelected = function(formSelected)
	{
		this.formSelected = formSelected;
		$rootScope.$broadcast("newFormSelected");
	}
	
	return service;

});
