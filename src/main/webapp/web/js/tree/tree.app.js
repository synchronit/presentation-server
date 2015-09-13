    var myTree = angular.module("myTree", ["treeControl", "ui.bootstrap", "template/tabs/tab.html", "template/tabs/tabset.html", "formSelectedService"])
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
                    .controller('Classic', function($scope, $http, formSelectedService) 
                    {
//				            $scope.treedata=createSubTree(3, 4, ""); // replaced by load_forms() call (see below)
							
				            $scope.showSelected = function(node) {
				                $scope.selectedNode = node;
//				                console.log($scope);

//								console.log(node.children.length);
								console.log(node.isForm());
//								console.log("===========");

				                if (node.isForm())
				                {
				                	console.log("is a Form");
									formSelectedService.setFormSelected(node);
				                }
				            };
							$scope.load_forms = function()
							{
							    $http.get("http://tomcat.synchronit.com/appbase-webconsole/json?command=show%20forms")
							    .success(function(response) {$scope.treedata = parse_forms_response(response);});
				
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

							$scope.load_forms();	// This replaced the original "createSubTree(...)" call
											            
				        }) 
            ;
