    var myTree = angular.module("myTree", ["treeControl", "ui.bootstrap", "template/tabs/tab.html", "template/tabs/tabset.html"])
                    .factory("$savedContent", function() {
                        return [];
                    })
                    .directive("saveContent", function($savedContent) {
                        return {
                            restrict: "A",
                            compile: function($element, $attrs) {
                                var content = $element.html();
                                $savedContent[$attrs.saveContent] = content;
                            }
                        }
                    })
                    .directive("applyContent", function($savedContent) {
                        return {
                            restrict: "EAC",
                            compile: function($element, $attrs) {
                                return function($scope, $element, $attrs) {
                                    var content = $savedContent[$attrs.applyContent];
                                    var lang = $attrs.highlightLang;
                                    if (lang == "html")
                                        content = escapeHtml(content);
                                    content = trimIndent(content);
                                    var pre = prettyPrintOne(content, lang);
                                    $element.html(pre);
                                }
                            }
                        }
                    })
                    .directive("nav", function() {
                        return {
                            restrict: "A",
                            compile: function($element) {
                                var sections = $("section");
                            }
                        }
                    })
                    .controller('Classic', function($scope, $http) 
                    {
				            $scope.treedata=createSubTree(3, 4, "");
				            $scope.showSelected = function(sel) {
				                $scope.selectedNode = sel;
				            };
							$scope.load_forms = function()
							{
							    $http.get("http://tomcat.synchronit.com/appbase-webconsole/json?command=show%20forms")
							    .success(function(response) {$scope.treedata = render_forms_response(response);});
				
				/**  
				 *				$.ajax({
				 *				  url: "http://tomcat.synchronit.com/appbase-webconsole/json?command=show%20forms"
				 *				})
				 *				  .done(function( data ) {
				 *					  if(data.code == 100)
				 *					    $scope.$apply(function() {
				 *							$scope.treedata = render_forms_result();
				 *						});
				 *					  else
				 *					  	alert("Error when retrieving data: "+data.code);
				 *				  });
				**/
							}
				            
				        }) 
            ;

var wholeApp = angular.module('wholeApp',['myTree', 'myAccordion']);

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

function render_forms_response(response)	
{
	var tree = [];
	var tree_data = [];
	var form_name_prev = " ";
    for (var i=0; i < response.resultSet.rows.length; i++)
    {
    	if (response.resultSet.rows[i][0] != form_name_prev)  // A different form (or the first one)
    	{
    		if (form_name_prev != " ")  // It is not the first one => we must create the node and attach the children
    		{
		        tree.push({ "label" : form_name_prev, "id" : "id ", "i": i, "children": tree_data });
		        tree_data = [];
			}
	        form_name_prev = response.resultSet.rows[i][0];
	    }
        tree_data.push({ "label" : response.resultSet.rows[i][2], "id" : "type "+response.resultSet.rows[i][3], "i": i, "children": [] });
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
