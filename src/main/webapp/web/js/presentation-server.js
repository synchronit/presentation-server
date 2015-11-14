
var wholeApp = angular.module('wholeApp',['myTree', 'myAccordion', 'form_content', 'modalWindow']);

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

function parse_forms_response(response)	
{
	var forms = [];
	var formData = [];
	var refData = [];
	var formNamePrev = " ";
	var previousReference = " ";
	var previousRefMin, previousRefMax;
	var setValue = function(dataType)
	{
		if (dataType == "BOOLEAN") 
			return false;
		else
			return '';		
	}
	
    for (var i=0; i < response.resultSet.rows.length; i++)
    {
    	var formName     = response.resultSet.rows[i][0];
    	var label        = response.resultSet.rows[i][2];
    	var type         = response.resultSet.rows[i][3];
    	var isReference  = (response.resultSet.rows[i][5] == "true");
    	var refLabel     = response.resultSet.rows[i][7];
    	var refMin       = response.resultSet.rows[i][8];
    	var refMax       = response.resultSet.rows[i][9];
    	
    	var wasReference = false;
    
		// If it was in a Reference and (is not a reference any more OR is a different reference                   OR form) 
		if (previousReference != " " && (!isReference                || isReference && (label != previousReference || formName != formNamePrev) ))
		{
// console.log("1. loads a Data in the tree, with "+refData.length+" REF children");
	        formData.push({ "label" : previousReference, "type" : "REFERENCE",  "isReference" : true,  "refLabel" : previousReference, "refMin" : previousRefMin, "refMax" : previousRefMax, "i": i, "isForm" : function() { return false; }, "value" : setValue("REFERENCE"), "children": refData });
			refData = [];
		}
		previousReference = ( isReference ? label : " " );
		previousRefMin    = refMin;
		previousRefMax    = refMax;

    	if (formName != formNamePrev)  // A different form (or the first one)
    	{
    		if (formNamePrev != " ")  // It is not the first one => we must create the FORM node, attach the children and reset the collection
    		{
// console.log("2. loads a Form in the tree, with "+formData.length+" DATA children");
		        forms.push({ "label" : formNamePrev, "id" : "id ", "i": i, "isForm" : function() { return true; }, "value" : setValue("FORM"), "children": formData});
		        formData = [];
			}
	        formNamePrev = formName;
	    }
	    
	    // Pushes a LEAF node, even a Reference (refData) or an Atomic Data (formData)
		if (isReference)
		{
			refData.push({ "label" : label, "type" : type,  "isReference" : true, "refLabel" : refLabel, "refMin" : refMin, "refMax" : refMax, "i": i, "isForm" : function() { return false; }, "value" : setValue("REFERENCE"), "children": [] });
// console.log("3. loads a reference in the tree, it now has "+refData.length+" children");
		}
		else
		{
	        formData.push({ "label" : label, "type" : type,  "isReference" : false, "refLabel" : refLabel, "refMin" : refMin, "refMax" : refMax, "i": i, "isForm" : function() { return false; },  "value" : setValue(type), "children": [] });
// console.log("4. loads a data in the tree, it now has "+formData.length+" children");
		}
    }

	if (refData.length > 0) // Checks if there are pending dataReferences to be loaded
	{
// console.log("5. loads a Data in the tree, with "+refData.length+" REF children");
        formData.push({ "label" : previousReference, "type" : "REFERENCE",  "isReference" : true, "refLabel" : refLabel, "refMin" : previousRefMin, "refMax" : previousRefMax, "i": i, "isForm" : function() { return false; }, "value" : setValue("REFERENCE"), "children": refData });
// console.log("6. loads a data in the tree, it now has "+formData.length+" children");
	}
    forms.push({ "label" : formNamePrev, "id" : "id ", "i": i, "isForm" : function() { return true; }, "value" : setValue("FORM"), "children": formData }); // Adds the last form 
// console.log("7. loads a Form in the tree, with "+formData.length+" children");

// *******************
//console.log(forms);
// *******************

	return forms;
}

/**********************************  REQUEST RESPONSE EXAMPLE *******

 {
 	"code":100,
 	"message":"4 forms found.",
 	"resultSet":
	{
		"headers":
		[
			{"label":"FormName","type":"TEXT"},
			{"label":"FormVersion","type":"NUMBER"},
			{"label":"DataLabel","type":"TEXT"},
			{"label":"DataType","type":"TEXT"},
			{"label":"DataOrder","type":"NUMBER"},
			{"label":"FormReferenced","type":"TEXT"},
			{"label":"DataReferenced","type":"TEXT"}
		],
		"rows":
		[
			["MYTEST","1","MYNUM","NUMBER","0",null],
			["MYTEST","1","MYTEXT","TEXT","1",null],
			["MYTEST","1","MYBOOL","BOOLEAN","2",null],
			
			["MYTEST2","1","A","NUMBER","0",null],
			["MYTEST2","1","B","TEXT","1",null],
			["MYTEST2","1","C","BOOLEAN","2",null],
			
			["SEX","1","ID","NUMBER","0",null],
			["SEX","1","SEX","TEXT","1",null],
			
			["PERSON","1","ID","NUMBER","0",null],
			["PERSON","1","NAME","TEXT","1",null],
			["PERSON","1","GENDER","REFERENCE","2","SEX", "ID"],
			["PERSON","1","GENDER","REFERENCE","3","SEX", "SEX"]

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
var webSocket = new WebSocket('ws://localhost:8080/presentation-server-test/wsocket');

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

