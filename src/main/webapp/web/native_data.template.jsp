		<!-- Native data is rendered directly -->
		<div style="float:left; clear: both; width: 100%; margin-top: 10px;">
	  		<div style="float: left; width: 30%; margin-top: 5px; display: inline">
				{{data.label}}
			</div>
			
			<div ng-switch="data.type" style="margin-top: 5px; display: inline;">
				<div ng-switch-when="BOOLEAN"><input type="checkbox" ng-model="data.value"></div> 
				<div ng-switch-when="NUMBER"> <input type="number"   ng-model="data.value"></div> 
				<div ng-switch-default>       <input type="text"     ng-model="data.value"></div> 
			</div>
		</div>
