
<!-- TODO: refactor CSS display and JS functions for the different buttons, to be rendered by Angular in this template -->
		<nav class="nav newFormToolBar">		
			<span ng-if="!onLinkForms"><a id="datButton" ng-href="{{hash}}" class="icon-plus"   ng-click="newData()"          style="font-size: 2em;" title="Add the data defined to the Form"></a></span>
			<span ng-if="!onLinkForms"><a id="lnkButton" ng-href="{{hash}}" class="icon-link"   ng-click="toggleLinkForms();" style="font-size: 2em;" title="Include Data from another Form"></a></span>
			<span ng-if="!onLinkForms"><a id="delButton" ng-href="{{hash}}" class="icon-delete" ng-click="deleteData();"      style="font-size: 2em;" title="Remove the selected data from the Form"></a></span>
			<span ng-if="!onLinkForms"><a id="tecButton" ng-href="{{hash}}" class="icon-wrench" ng-click="techView();"        style="font-size: 2em;" title="Toggles Technical View (makes DB names visible)"></a></span>
			<span ng-if="!onLinkForms"><a id="runButton" ng-href="{{hash}}" class="icon-play"   ng-click="createForm();"      style="font-size: 2em;" title="RUN: creates the Form with the defined data"></a></span>

			<span ng-if="onLinkForms"><a id="delButton" ng-href="{{hash}}" class="icon-delete" ng-click="toggleLinkForms();"  style="font-size: 2em;" title="CANCEL: do not include this link"></a></span>
			<span ng-if="onLinkForms"><a id="refButton" ng-href="{{hash}}" class="icon-ok"     ng-click="newReference();"     style="font-size: 2em;" title="CONFIRM: include this reference to {{linkedForm.label}}."></a></span>
		</nav>
