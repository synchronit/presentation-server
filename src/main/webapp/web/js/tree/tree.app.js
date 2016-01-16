    var myTree = angular.module("myTree", ["treeControl", "ui.bootstrap", "template/tabs/tab.html", "template/tabs/tabset.html", "broadcastService"])
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
                    .controller('Classic', function($scope, $http, $timeout, broadcastService) 
                    {
//				            $scope.treedata=createSubTree(3, 4, ""); // replaced by load_forms() call (see below)
							
				            $scope.showSelected = function(node) {
				                $scope.selectedNode = node;
//				                console.log($scope);
//
//								console.log(node.children.length);
//								console.log(node.isForm());
//								console.log("===========");

				                if (node.isForm())
				                {
//				                	console.log("is a Form");
									broadcastService.setFormSelected(node);
				                }
				            };
				            
				            $scope.auto_refresh = false;
				            
				            $scope.toggle_refresh = function()
				            {
				            	$scope.auto_refresh = !$scope.auto_refresh;
				            	var imgURL = ($scope.auto_refresh) ? "images/on.png" : "images/off.png";
				            	$("#auto_refresh_btn").attr("src", imgURL);
				            	if ($scope.auto_refresh)
				            	{

////////////////////////////////	$("#auto_refresh_txt").html("refreshing ...");
////////////////////////////////	$("#auto_refresh_txt").css("color", "green");

									$scope.load_forms();
				            	}
				            	else
				            	{
////////////////////////////////	$("#auto_refresh_txt").html("(not refreshing)");
////////////////////////////////	$("#auto_refresh_txt").css("color", "grey");
								}
				            }
				            
							$scope.load_forms = function()
							{
//								console.log("Requesting form data ...");
							
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

								if ($scope.auto_refresh)
								{
								    setTimeout(function(){ $scope.load_forms() }, 3000);	// Refreshes tree content
								}

							}

							$scope.load_forms();	// This replaced the original "createSubTree(...)" call
											            
				        }) 
            ;
