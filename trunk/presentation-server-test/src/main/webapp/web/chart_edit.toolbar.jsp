
		<nav class="nav graphicsToolBar">		
			<span><a id="datButton" ng-href="{{hash}}" class="icon-plus"   ng-click="newChart()"           style="font-size: 2em;" title="Make a new Chart"></a></span>
			<span><a id="delButton" ng-href="{{hash}}" class="icon-delete" ng-click="deleteChart();"       style="font-size: 2em;" title="Delete this Chart"></a></span>
			<span><a id="tecButton" ng-href="{{hash}}" class="icon-ok"     ng-click="saveEditChanges();"   style="font-size: 2em;" title="See / Modify Chart's definition"></a></span>
			<span><a id="runButton" ng-href="{{hash}}" class="icon-logout" ng-click="cancelEditChanges();" style="font-size: 2em;" title="Exit Chart's Module"></a></span>
		</nav>
