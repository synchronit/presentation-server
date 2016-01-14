<!DOCTYPE html>
<html lang="en">
  <head>

	<link rel="stylesheet" type="text/css" href="css/fontello/style.css">  

	<link rel="stylesheet" type="text/css" href="css/fontello/form-actions-embedded.css">

    <!-- Google fonts -->
    <link rel="stylesheet" type="text/css" href="css/fonts-lato.css" >

    <!-- Styles -->
    <link rel="stylesheet" type="text/css" href="css/accordion/v-accordion-panel.css" >
    <link rel="stylesheet" type="text/css" href="css/accordion/v-accordion.css">

	<link rel="stylesheet" type="text/css" href="css/form_content.toolbar.css">

	<link rel="stylesheet" type="text/css" href="css/ui-grid/ui-grid.min.css">

    <link rel="stylesheet" type="text/css" href="css/bootstrap/bootstrap.3.1.1.css" >
    <link rel="stylesheet" type="text/css" href="css/prettify/prettify-style.css" >

    <link rel="stylesheet" type="text/css" href="css/tree/tree-control.css">
    <link rel="stylesheet" type="text/css" href="css/tree/tree-control-attribute.css">
    <link rel="stylesheet" type="text/css" href="css/presentation-server.css">

    <link rel="stylesheet" type="text/css" href="css/resizable/resizable.css">
    <link rel="stylesheet" type="text/css" href="css/angular-ui/select.min.css">
    <link rel="stylesheet" type="text/css" href="css/angular-ui/jquery.contextMenu.min.css">
 
    <!-- Scripts -->
    <script src="js/angular/angular.1.4.0.min.js"></script> 
    <script src="js/angular/angular.animate.1.4.0.min.js"></script>

    <script src="js/broadcastService.js"></script>

    <script src="js/accordion/v-accordion.js"></script>
    <script src="js/accordion/accordion.app.js"></script>

    <script src="js/jquery/jquery-1.11.3.min.js"></script>
    <script src="js/jquery/jquery-ui.min.js"></script>
        
    <script src="js/bootstrap/bootstrap.3.1.1.js"></script>
    <script src="js/bootstrap/ui-bootstrap-tpls.0.11.2.js"></script>
    <script src="js/prettify/prettify.1.0.1.js"></script>

    <script src="js/multi-select.js"></script> 
    <script src="js/angular-ui/ui-bootstrap0.13.4.js"></script>
    <script src="js/angular-ui/ui-grid.min.js"></script>

    <script src="js/tree/angular-tree-control.js"></script>
    <script src="js/tree/tree.app.js"></script>

    <script src="js/angular-ui/select.min.js"></script>
    <script src="js/angular-ui/jquery.contextMenu.min.js"></script>
    <script src="js/angular-ui/jquery.ui.position.min.js"></script>

    <script src="js/presentation-server.js"></script>
    <script src="js/form_content.app.js"></script>

	<script>
		$(function()
		{
			$("#msgFooter").hide();
//			console.log("OK");

		});
		
	</script>

</head>

<body>

<div id="wholeApp" ng-app="wholeApp">

	<div class="header">
	    <div class="head-container">
	        <h1>Application Base</h1>
	        <h2>The Presentation Server Component</h2>
	        <span class="footer">v0.0.99</span>
	    </div>
	</div>

	<div>
	
		<span class="menu"><a class="icon-menu" onclick="toggleLefPane();" title="menu"></a></span>

		<div id="leftDiv" >
			<!-- this page includes also the Tree (tree.app.jsp) -->
			<jsp:include page="accordion.app.jsp" />
		</div>
		<div id="contentDiv">

			<jsp:include page="form_content.template.jsp" />

		</div>
	</div>

	<!-- multi-selection modal dialog -->
	<jsp:include page="multi-select.jsp" />

	<!-- The Message Footer -->
	<jsp:include page="footer.jsp" />

</div>
</body>
</html>
