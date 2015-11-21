angular.module('broadcastService', []).factory('broadcastService', function($rootScope){

	var service  = {};
	
	service.formSelected = {label: ''};

	/***************************************************
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


	/******************************************************
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
	}
	
	
	/*******************************************************
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
	
	
	
	/*******************************************************
	/*****  MULTIPLE REFERENCES OF THE SELECTED FORM  *****/

	service.getMultirefColumnDefs = function( label )
	{
		var columnDefs = [];
		
		var formSelected = service.getFormSelected();
		
		/** REFACTORIZAR **/
		var refMultiple;

		for (var i=0; i < formSelected.children.length; i++)
		{
			if ( formSelected.children[i].label == label )
			{
				refMultiple = formSelected.children[i];
			}
		}

  		for (var i=0; i < refMultiple.children.length; i++)
  		{
			columnDefs.push( { field : refMultiple.children[i].refLabel, resizable: true } );
  		}

		return columnDefs;

	}

	service.getMultirefData = function( label )
	{
		var data = [];
		
		var formSelected = service.getFormSelected();
		
		/** REFACTORIZAR **/
		var refMultiple;

		for (var i=0; i < formSelected.children.length; i++)
		{
			if ( formSelected.children[i].label == label )
			{
				refMultiple = formSelected.children[i];
			}
		}
		
  		var rowData ={} ;
  		for (var i=0; i < refMultiple.children.length; i++)
  		{
  			rowData[ refMultiple.children[i].refLabel ] = ' ';
  		}
		data.push( rowData );

		return data;

/***************************************************				
		return [
				    {
				        "firstName": "Cox",
				        "lastName": "Carney",
				        "company": "Enormo",
				        "employed": true
				    },
				    {
				        "firstName": "Lorene",
				        "lastName": "Wise",
				        "company": "Comveyer",
				        "employed": false
				    },
				    {
				        "firstName": "Nancy",
				        "lastName": "Waters",
				        "company": "Fuelton",
				        "employed": false
				    }
				];
****************************************************/				

	}

	//***** END OF SERVICES ******//
	
	return service;

});
