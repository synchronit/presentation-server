<!DOCTYPE html>
<html lang="en">
  <head>

    <!-- Google fonts -->
    <link href="css/fonts-lato.css" rel="stylesheet" type="text/css">

    <!-- Styles -->
    <link href="css/accordion/v-accordion-panel.css" rel="stylesheet">
    <link href="css/accordion/v-accordion.css"       rel="stylesheet">

    <!-- Scripts -->
    <script src="js/angular/angular.1.4.0.min.js"></script> 

    <script src="js/angular/angular.animate.1.4.0.min.js"></script>
    <script src="js/accordion/v-accordion.js"></script>
    <script src="js/accordion/accordion.app.js"></script>

    <script src="js/jquery/jquery.2.0.3.js"></script>
    <script src="js/bootstrap/bootstrap.3.1.1.js"></script>
    <script src="js/bootstrap/ui-bootstrap-tpls.0.11.2.js"></script>
    <script src="js/prettify/prettify.1.0.1.js"></script>

    <link  href="css/bootstrap/bootstrap.3.1.1.css" rel="stylesheet" type="text/css">
    <link  href="css/prettify/prettify-style.css"  rel="stylesheet" type="text/css">

    <script src="js/tree/angular-tree-control.js"></script>
    <link rel="stylesheet" type="text/css" href="css/tree/tree-control.css">
    <link rel="stylesheet" type="text/css" href="css/tree/tree-control-attribute.css">
    <script src="js/tree/tree.app.js"></script>

    <link rel="stylesheet" type="text/css" href="css/presentation-server.css">
    <script src="js/presentation-server.js"></script>

    <script src="js/form_content.app.js"></script>

</head>

<body ng-app="wholeApp">

	<div class="header">
	    <div class="head-container">
	        <h1>Application Base</h1>
	        <h2>The Presentation Server Component</h2>
	        <span class="footer">v0.4</span>
	    </div>
	</div>

	<div>
		<div style="float: left">
			<!-- this page includes also the Tree (tree.app.jsp) -->
			<jsp:include page="accordion.app.jsp" />
		</div>
		<div id="contentDiv" style="float: left;">
			<jsp:include page="form_content.app.jsp" />
		</div>
	</div>
	
</body>
</html>
