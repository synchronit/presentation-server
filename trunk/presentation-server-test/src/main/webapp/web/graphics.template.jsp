  <div id="graphics" ng-controller="graphicsController">

	<div ng-if="actualSelection == 'GRAPHICS'">

		<select ng-model="graphicSelected" class="dropDown" style="display: inline; margin-top: 30px">
			<option value="NEW">-- define a new Chart --</option>
			<option value="Cash Flow">Credits vs. Debits</option>
		</select>
		
		<!-- The New Form Toolbar -->
		<jsp:include page="graphics.toolbar.jsp"/>
		<br/>
	
		<ol class="chart-legend" style="float: left;">
			<li ng-repeat="col in colBars"><span id="colBar_{{$index}}" style="background-color: {{col.color}}; border: 2px solid {{col.color}}; cursor: pointer;" ng-click="toggleColBar($index)"></span>{{col.text}}</li>
		</ol>
		
		<canvas id="line" class="chart chart-bar" chart-data="data" chart-colours="barColors"
		  chart-labels="labels" chart-series="series"
		  chart-click="onClick" >
		</canvas> 

	</div>

	<div ng-if="$parent.actualSelection == 'CHART_EDIT'">

		<select ng-model="graphicSelected" class="dropDown" style="display: inline; margin-top: 30px">
			<option value="NEW">-- define a new Chart --</option>
			<option value="Cash Flow">Cash Flow</option>
		</select>
		
		<!-- The New Form Toolbar -->
		<jsp:include page="chart_edit.toolbar.jsp"/>
		<br/>

		<div style="margin-top: 10px">
		
			<div style="float: left; margin-bottom: 10px; width: 100%; margin-top: 10px; font-weight: bold;">
				<div style="float: left; text-align: right;">Chart Name : </div>
				<div style="float: left"><input type="text" value="Cash Flow"></div>
	
				<div style="float: left; width: 20%; text-align: right; ">Chart Type : </div>
				<div style="float: left; clear: right; "> <span class="icon-chart-bar"> </span> Bar Chart</div>
			</div>
						
			<div style="clear: left; overflow: auto; height: {{barsDefinitions}}; border: 3px inset #f0f0f0; ">
				<div ng-repeat="colBar in colBars" style="white-space: nowrap; ">

					<div colorpicker ng-model="colBar.color" class="chartEditColorpicker" style="background-color: {{colBar.color}}; "> bar color</div>

					<div style="float: left; font-family: monospace; border-bottom: 1px solid #CCC; padding-bottom: 5px;">
						<div style="float: left; width: 20%; text-align: right; clear: left; margin-top: 15px;">TEXT : </div>
						<div style="margin-top: 15px;"><input type="text" ng-model="colBar.text" style="font-family: 'Courier New', Courier, monospace; "></div>
			
						<div style="float: left; width: 20%; text-align: right; clear: left; margin-top: 5px;">GET : </div>
						<div style="margin-top: 5px;"><input type="text" ng-model="colBar.get" style="width: 500px;font-family: 'Courier New', Courier, monospace; "></div>
			
						<div style="float: left; width: 20%; text-align: right; clear: left; margin-top: 5px;">X : </div>
						<div style="float: left; margin-top: 5px;"><input type="text" ng-model="colBar.x" style="font-family: 'Courier New', Courier, monospace; "></div>
			
						<div style="float: left; margin-top: 5px; margin-left: 5%;">Y : </div>
						<div style="margin-top: 5px;"><input type="text" ng-model="colBar.y" style="font-family: 'Courier New', Courier, monospace; "></div>
					</div>
				</div>
			</div>
		</div>
	
	</div>

  </div>
