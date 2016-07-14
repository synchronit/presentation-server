<%-- 
    Document   : importer.template
    Created on : Jul 14, 2016, 1:38:42 PM
    Author     : jvega
--%>

<div id="importer" ng-controller="importerController">
       <!-- The New Form Toolbar -->
        <jsp:include page="importer.toolbar.jsp"/>
        <br/>         
        <div ng-include="importer.html">
          Hola desde importer.html
        </div>
</div>
