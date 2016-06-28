

wholeApp.controller('newFormController', ['$scope', '$http', 'broadcastService', function($scope, $http, broadcastService) 
{

	if (!$scope.newFormName) 	$scope.newFormName = "";
	if (!$scope.newFormData)	$scope.newFormData = [];	

	if (!$scope.dataTypes)		$scope.dataTypes = ['Text', 'Number', 'Boolean'];
	if (!$scope.newType)		$scope.newType   =  'Text';
	
	$scope.getFormData = function (formName)
	{
		var formData = {};
		for (var i=0; i<$scope.formsTree.length; i++)
		{
			if ($scope.formsTree[i].label == formName)
			{
				for (var c=0; c<$scope.formsTree[i].children.length; c++)
				{
					var dataLabel = $scope.formsTree[i].children[c].label;
					formData[ dataLabel ] = false;
				}
			}
		}
		return formData;
	}	

	$scope.formsTree = broadcastService.getFormsTree();
	$scope.$on('newFormsTree', function() {$scope.formsTree = broadcastService.getFormsTree();})
	
	$scope.linkedForm = ($scope.formsTree.length > 0) ? $scope.formsTree[0] : null;

	$scope.linkedFormChanged = function()
	{
		$scope.linkedFormData = $scope.getFormData( $scope.linkedForm.label );
		$scope.refMinimum = 0;
		$scope.refMaximum = 1;
	}
	
	$scope.newData = function()
	{
		var newData = {
						label  : $scope.newLabel, 
						type   : $scope.newType,
						notNull: $scope.notNull,
						unique : $scope.unique
					  };
		
		$scope.newFormData.push( newData ); 
		
		$scope.newLabel = '';

		$("#newDataLabel").focus();

	}
	
	$scope.newReference = function()
	{
		if ($scope.newReferenceCheckOK())
		{
			var newData = {
							label         : $scope.newReferenceName, 
							referenceForm : $scope.linkedForm.label,
							type          : "REFERENCE",
							min           : $scope.refMinimum,
							max           : $scope.refMaximum,
							refData       : $scope.getRefData(),
							unique        : $scope.refUnique
						  };
	
			$scope.newFormData.push( newData ); 
			
			// Resets the UI 
			$scope.linkedForm = ($scope.formsTree.length > 0) ? $scope.formsTree[0] : null;
			$scope.linkedFormChanged();
			
			$scope.toggleLinkForms();
		}
	}

	$scope.newReferenceCheckOK = function()
	{
		checkOK = true;
		if ($scope.newReferenceName.trim().length == 0)
		{
			checkOK = false;
			$("#newReferenceName").css("border", "1px dashed red");
			$("#newReferenceName").effect("shake", {distance: 10}, 500, function() {$("#newReferenceName").css("border", "0px")});
		}
		return checkOK;
	}

	$scope.getRefData = function()
	{
		var dataReferenced = [];
		for (var data in $scope.linkedFormData)
		{
			if ($scope.linkedFormData[data])
			{
				dataReferenced.push(data);
			}
		}
		return dataReferenced;
	}
	
	$scope.toggleLinkForms = function()
	{
		$scope.onLinkForms = ($scope.onLinkForms) ? false : true;
		$scope.newReferenceName = "";
	}

	$scope.deleteData = function()
	{
		var dataLabel = $("#definedData").val();
		if (dataLabel) 
		{
			// Removes [dataLabel] from [newFormData]
			$scope.newFormData = jQuery.grep($scope.newFormData, function(formData) { return formData.label != dataLabel; });
		}		
	}
	
	$scope.createForm = function()
	{
		if ($scope.createFormCheckOK())
		{
			var createFormStmt = 'CREATE FORM '+$scope.newFormName+' ( '; 
			var comma = '';
			for (var i=0; i<$scope.newFormData.length; i++)
			{
				var formData = $scope.newFormData[i];
				if (formData.type != "REFERENCE")
				{
					createFormStmt += comma+formData.label+' '+formData.type;
					createFormStmt += (formData.notNull) ? ' NOT NULL ' : '';
					createFormStmt += (formData.unique ) ? ' UNIQUE '   : '';
				}
				else
				{
					createFormStmt += comma+formData.label+' REFERENCES ';
					var max = (formData.max) ? formData.max : "MANY";
					createFormStmt += (formData.min == 0 && formData.max == 1) ? '' : formData.min+'..'+max;
					createFormStmt += formData.referenceForm + '.( ' + formData.refData.join() + ' ) ';
				}
				comma = ', ';
			}
			createFormStmt += ')';
			$scope.executeFQL( createFormStmt, $scope.clearInputs );
		}
	}	
	
	$scope.createFormCheckOK = function()
	{
		checkOK = true;
		if ($scope.newFormName.trim().length == 0)
		{
			checkOK = false;
			$("#newFormName").css("border", "1px dashed red");
			$("#newFormName").effect("shake", {distance: 10}, 500, function() {$("#newFormName").css("border", "0px")});
		}
		return checkOK;
	}

//
// TODO: REFACTOR ... in 	form_content.controller (form_content.app.js) the same function is defined
//
	$scope.executeFQL = function(stmt, callback, params)
	{	
	    $http.get("http://dev.synchronit.com/appbase-webconsole/json?command="+stmt)
	    .success(function(response) {callback(response, stmt, params);});	    
	}

	$scope.clearInputs = function(response, stmt)
	{
		// TODO: Look at form_content and refactor to a common place
		if (response.code > 99 && response.code < 200)
		{
			msgInfo("Result: "+response.code+"\nwhen executing: <code>"+stmt+"</code>");
		}
		else
		{
			msgError("ERROR when executing: <code>"+stmt+"</code> ("+response.message+")");
		}

		$scope.newFormName = "";
		$scope.newFormData = [];	
	
		$scope.newType   =  'Text';
		$scope.notNull   = false;
		$scope.unique    = false;
	}
	
}]);


