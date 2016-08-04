
		<nav class="nav" style="float: right;">
			<span><a style="font-size: 2em;" ng-href="{{hash}}" class="icon-get"        ng-click="fqlGet();"    title="Search Cases matching the values entered"></a></span>
			<span><a style="font-size: 2em;" ng-href="{{hash}}" class="icon-create"     ng-click="fqlCreate();" title="Create a New Case"></a></span>
                        <span><a style="font-size: 2em;" ng-href="{{hash}}" class="icon-update"     ng-click="fqlModify()" title="Modify Case"></a></span>
			<span><a style="font-size: 2em;" ng-href="{{hash}}" class="icon-delete"></a></span>
			<span><a style="font-size: 2em;" ng-href="{{hash}}" class="icon-marquee"    ng-click="clearForm();" title="Clear screen values"></a></span>
			<span><a style="font-size: 2em;" ng-href="{{hash}}" class="icon-chart-bar"  ng-click="graphics();"  title="Graphics"></a></span>
			<span><a style="font-size: 2em;" ng-href="{{hash}}" class="icon-upload"     ng-click="importer();"  title="Import Data"></a></span>
		</nav>
