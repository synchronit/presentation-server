$(function() {

	$('input, textarea').placeholder({customClass:'my-placeholder'});

});

var wholeApp = angular.module('wholeApp',['myTree', 'myAccordion', 'form_content', 'modalWindow', 'broadcastService' ]);

/****************************
	var dynControllers = angular.module('dynControllers',[]);
	dynControllers.controller( 'dynControllersController', 
	    		['$scope', function($scope) 
	    			{
						$scope.generateController = function(controllerName)
						{
	alert("it works!");
	//						eval("var app-"+controllerName+" = angular.module('app-multi-"+controllerName+"', ['ngTouch', 'ui.grid'])");
	//						eval("app-"+controllerName+".controller('multiCtrl-"+controllerName+"', ['$scope', '$http', function ($scope, $http) {"+
	//						     "$scope.gridOptions-multi = {};"+						 
	//							 "$scope.gridOptions-multi.columnDefs.push({name: '"+controllerName+"'});"
	//							);
	
						}
					}
				]);
****************************/


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



wholeApp.controller('wholeAppController', ['$scope', '$http', 'broadcastService', function($scope, $http, broadcastService) 
{
	$scope.actualSelection = 'CRUD';
	
	$scope.newForm = function()
	{
		$scope.actualSelection = 'NEW_FORM';
	}

	$scope.deleteForm = function()
	{
		var formName = broadcastService.getFormSelected().label;
		if (formName != '')
		{
			$scope.executeFQL("DELETE FORM "+formName, $scope.afterDeleteForm, {formName: formName} );
		}
		else
		{
			msgError("Please select the Form to be deleted and then press again the trash icon.");
		}
	}

	$scope.afterDeleteForm = function(response, stmt, params)
	{
		// TODO: Look at form_content (and this same source file) and refactor to a common place
		if (response.code > 99 && response.code < 200)
		{
			broadcastService.setFormSelected(null);
			msgInfo("Form "+params.formName+" has been successfully deleted.");
		}
		else
		{
			msgError("ERROR when executing: <code>"+stmt+"</code> ("+response.message+")");
		}
	}

    $scope.$on('newFormSelected', function() 
    {
		$scope.actualSelection = 'CRUD';
	});    	

//
// TODO: REFACTOR ... in 	form_content.controller (form_content.app.js) the same function is defined 
//                    and   also in this same file, in newFormController ... 
//       IDEA ... to upgrade the function to be used only from this controller (wholeAppController) and
//                call it as $parent.executeFQL from the child ones ... 
//
	$scope.executeFQL = function(stmt, callback, params)
	{	
	    $http.get("http://dev.synchronit.com/appbase-webconsole/json?command="+stmt)
	    .success(function(response) {callback(response, stmt, params);});	    
	}
					
}]);

var entityMap = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': '&quot;',
    "'": '&#39;',
    "/": '&#x2F;'
};
function escapeHtml(string) {		    	
    return String(string).replace(/[&<>"'\/]/g, function (s) {
        return entityMap[s];
    });
}
var nonSpace = /\S/;
function trimIndent(content) {
    var lines = content.split("\n");
    var begin = 0;
    var end = lines.length-1;
    while ((nonSpace.exec(lines[begin]) == null) && (begin < lines.length))
        begin = begin + 1;
    while ((nonSpace.exec(lines[end]) == null) && end >= begin)
        end = end - 1;
    var ident = nonSpace.exec(lines[begin]).index;
    var formatted = "";
    for (var i = begin; i <= end; i++) {
        formatted = formatted + lines[i].slice(ident-1) + ((i < end)?"\n":"");
    }
    return formatted;
}
	            
function createSubTree(level, width, prefix) {
    if (level > 0) {
        var res = [];
        for (var i=1; i <= width; i++)
            res.push({ "label" : "Node " + prefix + i, "id" : "id"+prefix + i, "i": i, "children": createSubTree(level-1, width, prefix + i +".") });
        return res;
    }
    else
        return [];
}

/********************************************************************
Given the REPONSE from the request, this functions generates a tree
where each node has the following information:

#	id          - the FQL ID
	label       - the data label
	refLabel    - the data label of the referenced data	
	refForm     - the form being referenced 
	i           - a unique index in the whole tree, indicating the order of creation
	nodeType    - "Form" | "Reference" | "Data"
	isForm      - boolean function, indicating if it is a Form      node or not
	isReference - boolean function, indicating if it is a Reference node or not
	isData      - boolean function, indicating if it is a Data      node or not 
	refMin      - min references allowed
	refMax      - max references allowed
	value       - the value shown in the UI
	children    - array with child nodes (data if it is a Form, refData if it is a reference, same structure always)
	
*********************************************************************/
function parse_forms_response(response)	
{
	var forms = [];
	var formData = [];
	var refData = [];
	var formNamePrev = " ";
	var previousLabel = " ";
	var previousRefForm = " ";
	var previousRefLabel = " ";
	var previousIndex = 0;
	var previousRefMin, previousRefMax;

	var setValue = function(dataType)
	{
		if (dataType == "BOOLEAN") 
			return false;
		else
			return '';		
	}
	
	var isFormFunction      = function() {  return this.type == "FORM";  }
	var isDataFunction      = function() {  return this.type != "FORM" && this.type != "REFERENCE";  }	
	var isReferenceFunction = function() {  return this.type == "REFERENCE";  }

    for (var i=0; i < response.resultSet.rows.length; i++)
    {
//           0     1    2      3       4    5       6        7      8    9 
//        Form    Ver Label   Type  Order  isRef  refForm  refdata min  max
//		["PERSON","1","SEX", "TEXT",  "3","true","GENDER","GENDER","0", "1"]

    	var formName     =  response.resultSet.rows[i][0];
    	var label        =  response.resultSet.rows[i][2];
    	var type         =  response.resultSet.rows[i][3];
    	var isReference  = (response.resultSet.rows[i][5] == "true");
    	var refForm      =  response.resultSet.rows[i][6];
    	var refLabel     =  response.resultSet.rows[i][7];
    	var refMin       =  response.resultSet.rows[i][8];
    	var refMax       =  response.resultSet.rows[i][9];
    	
    	var wasReference = false;
    
		// If it was in a Reference and (is not a reference any more OR is a different reference                        OR form) 
		if (previousRefLabel != " " &&  (!isReference                || isReference && (label != previousLabel || formName != formNamePrev) ))
		{
	        formData.push({ "label"    : previousLabel, 
	        				"type"     : "REFERENCE", 
	        				"refForm"  : previousRefForm,
	        				"refLabel" : previousRefLabel, 
	        				"i"        : previousIndex, 
	        				"value"    : setValue("REFERENCE"), 
	        				"refMin"   : previousRefMin, 
	        				"refMax"   : previousRefMax, 
	        				"children" : refData, 
	        				"isData"   : isDataFunction, "isForm": isFormFunction, "isReference": isReferenceFunction  });
			refData = [];
		}
		previousLabel     = ( isReference ? label    : " " );
		previousRefForm   = ( isReference ? refForm  : " " );
		previousRefLabel  = ( isReference ? refLabel : " " );
		previousRefMin    = refMin;
		previousRefMax    = refMax;
		previousIndex     = i;

    	if (formName != formNamePrev)  // A different form (or the first one)
    	{
    		if (formNamePrev != " ")  // It is not the first one => we must create the FORM node, attach the children and reset the collection
    		{
// console.log("2. loads a Form in the tree, with "+formData.length+" DATA children");
		        forms.push({ "label"    : formNamePrev, 
		         			 "type"     : "FORM", 
		         			 "refForm"  : null,
	        				 "refLabel" : null, 
		         			 "i"        : i, 
		         			 "value"    : setValue("FORM"), 
	        				 "refMin"   : null, 
	        				 "refMax"   : null, 
		         			 "children" : formData, 
	        				 "isData"   : isDataFunction, "isForm": isFormFunction, "isReference": isReferenceFunction  });
		        formData = [];
			}
	        formNamePrev = formName;
	    }
	    
	    // Pushes a child node, even a Reference (refData) or an Atomic Data (formData)
		if (isReference)
		{
			refData.push({ "label"    : label, 
						   "type"     : type,  
						   "refForm"  : refForm,
						   "refLabel" : refLabel, 
						   "i"        : i, 
						   "refMin"   : refMin, 
						   "refMax"   : refMax, 
						   "value"    : setValue("REFERENCE"), 
						   "children" : [],
	        			   "isData"   : isDataFunction, "isForm": isFormFunction, "isReference": isReferenceFunction  });
// console.log("3. loads a reference in the tree, it now has "+refData.length+" children");
		}
		else
		{
	        formData.push({ "label"    : label, 
	        				"type"     : type,  
	        				"refForm"  : refForm,
	        				"refLabel" : refLabel, 
	        				"i"        : i, 
	        				"refMin"   : refMin, 
	        				"refMax"   : refMax, 
	        				"value"    : setValue(type), 
	        				"children" : [],
	        				"isData"   : isDataFunction, "isForm": isFormFunction, "isReference": isReferenceFunction  });
// console.log("4. loads a data in the tree, it now has "+formData.length+" children");
		}
    }

	if (refData.length > 0) // Checks if there are pending dataReferences to be loaded
	{
// console.log("5. loads a Data in the tree, with "+refData.length+" REF children");
        formData.push({ "label"    : previousLabel, 
        				"type"     : "REFERENCE",  
        				"refForm"  : refForm,
        				"refLabel" : refLabel, 
        				"i"        : previousIndex, 
        				"refMin"   : previousRefMin, 
        				"refMax"   : previousRefMax, 
        				"value"    : setValue("REFERENCE"), 
        				"children" : refData,
        				"isData"   : isDataFunction, "isForm": isFormFunction, "isReference": isReferenceFunction  });
// console.log("6. loads a data in the tree, it now has "+formData.length+" children");
	}
	// Adds the last form 
    forms.push({ "label"    : formNamePrev, 
    			 "type"     : "FORM",
    			 "refForm"  : null,
        		 "refLabel" : null, 
    			 "i"        : i, 
				 "refMin"   : null, 
				 "refMax"   : null, 
    			 "value"    : setValue("FORM"), 
    			 "children" : formData,
   				 "isData"   : isDataFunction, "isForm": isFormFunction, "isReference": isReferenceFunction  });
// console.log("7. loads a Form in the tree, with "+formData.length+" children");

// ******************* SHOWS THE LOADED TREE STRUCTURE **************
//   console.log(forms);
// ******************************************************************

	return forms;
}

/**********************************  REQUEST RESPONSE EXAMPLE *******

 {
 	"code":100,
 	"message":"3 forms found.",
 	"resultSet":
	{
		"headers":
		[
			{"label":"FormName","type":"TEXT","referencedData":[]},
			{"label":"FormVersion","type":"NUMBER","referencedData":[]},
			{"label":"DataLabel","type":"TEXT","referencedData":[]},
			{"label":"DataType","type":"TEXT","referencedData":[]},
			{"label":"DataOrder","type":"NUMBER","referencedData":[]},
			{"label":"IsReference","type":"BOOLEAN","referencedData":[]},
			{"label":"FormReferenced","type":"TEXT","referencedData":[]},
			{"label":"DataReferenced","type":"TEXT","referencedData":[]},
			{"label":"Min","type":"NUMBER","referencedData":[]},
			{"label":"Max","type":"NUMBER","referencedData":[]}


		],
		"rows":
		[
			["MYTEST","1","MYNUM","NUMBER","0","false",null,null,null,null],
			["MYTEST","1","MYTEXT","TEXT","1","false",null,null,null,null],
			["MYTEST","1","MYBOOL","BOOLEAN","2","false",null,null,null,null],

			["GENDER","1","ID","NUMBER","0","false",null,null,null,null],
			["GENDER","1","GENDER","TEXT","1","false",null,null,null,null],
			
			["PERSON","1","ID",  "NUMBER","0","false",null,    null,   null,null],
			["PERSON","1","NAME","TEXT",  "1","false",null,    null,   null,null],
			["PERSON","1","SEX", "NUMBER","2","true","GENDER","ID",    "0", "1"],
			["PERSON","1","SEX", "TEXT",  "3","true","GENDER","GENDER","0", "1"]

		]
	},
	"debugInfo":[]
} 

{
	"code":100,
	"message":"1 cases returned.",
	"resultSet":
	{
		"headers":
		[
			{"label":"ID","type":"NUMBER"},
			{"label":"SEX","type":"TEXT"}
		],
		"rows":
		[
			["1","M"]
		]
	},
	"debugInfo":["select SEX.ID, SEX.SEX from SEX where SEX.SEX = 'M'"]
}

***********************************/

var webSocket;

$(function() {

	webSocket = new WebSocket('ws://'+window.location.host+'/presentation-server-test/wsocket');
	
	webSocket.onerror = function(event) {  
	  alert("Error in WebSocket call: " + event.data);
	};
	
	webSocket.onopen = function(event) { 
	  document.getElementById('messages').innerHTML 
	    = 'Connection established';
	};
	
	webSocket.onmessage = function(event) { 
	  document.getElementById('messages').innerHTML 
	    += '<br />' + event.data;
	};
});

function start_ws() {
  webSocket.send('hello');
  return false;
}

var fadeMessageThread;

function showNotification(msg)
{
	var delta = 50;
	
	var marginTop     = Number($("#notificationIcon").css("margin-top").replace("px", ""));
	var width         = Number($("#notificationIcon").css("width").replace("px", ""));
	var height        = Number($("#notificationIcon").css("height").replace("px", ""));
	var lineHeight    = Number($("#notificationIcon").css("line-height").replace("px", ""));

	$("#notificationMsg").html(msg);

	$("#notificationIcon").css("margin-top",  "-"+ (marginTop + delta) + "px");
	$("#notificationIcon").css("width",  (width  + delta)  + "px");
	$("#notificationIcon").css("height", (height + delta) + "px");
	$("#notificationIcon").css("line-height", (height + delta) + "px");
	$("#notificationIcon").css("opacity", "0.1");	


	$("#msgFooter").show();

	$("#notificationIcon").animate(
		{
			height    : (height+"px"), 
			width     : (width+"px"), 
			marginTop : (marginTop+"px"),
			lineHeight: (lineHeight+"px"),
			opacity   : 0.7
		}, 700);

	msgFadeOut(4000);	
}

function msgFadeOut(delay)
{
	fadeMessageThread = setTimeout(function() {$("#msgFooter").fadeOut(700)}, delay);
}

function msgInfo(msg)
{
	$("#msgFooter").removeClass( "msgFooterERROR" ).removeClass( "msgFooterWARNING" ).addClass( "msgFooterOK" );
	$("#notificationIcon").removeClass("icon-delete").removeClass("icon-attention").addClass("icon-ok");
	showNotification(msg);
}

function msgError(msg)
{
	console.log(msg);
	$("#msgFooter").removeClass( "msgFooterOK" ).removeClass( "msgFooterWARNING" ).addClass( "msgFooterERROR" );
	$("#notificationIcon").removeClass("icon-ok").removeClass("icon-attention").addClass("icon-delete");
	showNotification(msg);
}

function msgWarning(msg)
{
	$("#msgFooter").removeClass( "msgFooterOK" ).removeClass( "msgFooterERROR" ).addClass( "msgFooterWARNING" );
	$("#notificationIcon").removeClass("icon-ok").removeClass("icon-delete").addClass("icon-attention");
	showNotification(msg);
}

leftPanelOpened = true;
toggleLefPane = function()
{
	if (leftPanelOpened)
	{
		$("#leftDiv").animate({ width: "0%", opacity: 0 }, 500 );
		$("#contentDiv").animate({ width: "100%", "padding-left": "10%" }, 500 );
	}
	else
	{
		$("#leftDiv").animate({ width: "30%", opacity: 1 }, 500 );
		$("#contentDiv").animate({ width: "70%", "padding-left": "0%" }, 500 );
	}
	leftPanelOpened = !leftPanelOpened;
}


