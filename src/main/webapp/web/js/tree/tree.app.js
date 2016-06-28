
    var myTree = angular.module("myTree", ["treeControl", "ui.bootstrap", "template/tabs/tab.html", "template/tabs/tabset.html", "broadcastService", "FQLService" ])
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
                    .controller('Classic', function($scope, $http, $timeout, broadcastService, FQLService) 
                    {							
				            $scope.showSelected = function(node) {
				                $scope.selectedNode = node;

				                if (node.isForm())
				                {
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
									$scope.load_forms();
				            	}
				            }
				            
							$scope.afterShowForms = function (response, stmt, params)
							{
						    	$scope.treedata = parse_forms_response(response);
						    	broadcastService.setFormsTree($scope.treedata);
							}
											            
							$scope.load_forms = function()
							{
								FQLService.executeFQL("SHOW FORMS", $scope.afterShowForms );
				
								if ($scope.auto_refresh)
								{
								    setTimeout(function(){ $scope.load_forms() }, 3000);	// Refreshes tree content
								}

							}

							$scope.load_forms();	// This replaced the original "createSubTree(...)" call

				        }) 
            ;
