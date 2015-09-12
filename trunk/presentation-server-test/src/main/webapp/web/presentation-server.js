
var wholeApp = angular.module('wholeApp',['myTree', 'myAccordion', 'form_content']);

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
	var tree = [];
	var tree_data = [];
	var form_name_prev = " ";
    for (var i=0; i < response.resultSet.rows.length; i++)
    {
    	if (response.resultSet.rows[i][0] != form_name_prev)  // A different form (or the first one)
    	{
    		if (form_name_prev != " ")  // It is not the first one => we must create the FORM node and attach the children
    		{
		        tree.push({ "label" : form_name_prev, "id" : "id ", "i": i, "isForm" : function() { return true; }, "children": tree_data});
		        tree_data = [];
			}
	        form_name_prev = response.resultSet.rows[i][0];
	    }
	    // It is a leaf node (Form_DATA)
        tree_data.push({ "label" : response.resultSet.rows[i][2], "id" : "type "+response.resultSet.rows[i][3], "i": i, "isForm" : function() { return false; }, "children": [] });
    }

    tree.push({ "label" : form_name_prev, "id" : "id ", "i": i, "children": tree_data }); // Agrega el ultimo Form con los datos de tree_data

	return tree;
}


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


