<div ng-controller="ModalDemoCtrl">
    <script type="text/ng-template" id="myModalContent.html">
        <div class="modal-header">
            <h4 class="modal-title">Multiple results ({{myData.length}}) fulfill this criteria. Please choose a case from the list below.</h3>
        </div>
        <div class="modal-body">
        </div>

		<div ui-grid="{ data: myData }" class="myGrid"></div>

        <div class="modal-footer">
<!--        <button class="btn btn-primary" type="button" ng-click="ok()">OK</button>  -->
            <button class="btn btn-warning" type="button" ng-click="cancel()">Cancel</button>
        </div>

    </script>

<!--
    <button type="button" class="btn btn-default" ng-click="console.log(1234); open()">Open me!</button>
    <button type="button" class="btn btn-default" ng-click="open('lg')">Large modal</button>
    <button type="button" class="btn btn-default" ng-click="open('sm')">Small modal</button>
    <button type="button" class="btn btn-default" ng-click="toggleAnimation()">Toggle Animation ({{ animationsEnabled }})</button>
    <div ng-show="selected">Selection from a modal: {{ selected }}</div>
-->

</div>
