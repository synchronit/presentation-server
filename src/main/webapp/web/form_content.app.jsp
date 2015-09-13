  <div ng-app="form_content" ng-controller="formSelectedController">

	<h3 style="formTitle">{{formSelected.label}}</h3>

	<div ng-repeat="data in formSelected.children">
		<div style="float: left; clear: left; width: 30%">
			{{data.label}}
		</div>
		<div ng-switch="data.id" style="float: left;">
			<span ng-switch-when="type BOOLEAN"><input type="checkbox"></span> 
			<span ng-switch-when="type NUMBER"><input type="number"></span> 
			<span ng-switch-default><input type="text"></span> 
		</div>
	</div>

  </div>
