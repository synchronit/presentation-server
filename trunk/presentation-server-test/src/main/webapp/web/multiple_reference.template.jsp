		<!-- Single Reference data is rendered within a fieldset -->
		<fieldset style="border: 1px solid grey; border-radius: 10px; padding: 15px; padding-top: 10px; margin-top: 5px; width: auto;"> 

/*
 *
 *		<div ui-grid="gridOptions" class="myGrid" ui-grid-selection ></div>
 *
 */

			<legend style="font-size: 12px; text-decoration: none; margin: 0px; border: 0px; padding-left: 5px; padding-right: 5px; width: auto; font-weight: bold; color: grey;">
				{{data.label}} 
				( {{data.refMin}} .. 
					<span ng-if="data.refMax != 0">{{data.refMax}}</span>
					<span ng-if="data.refMax == 0">many</span>
				)
			</legend> 

			<div ng-repeat="ref in data.children">
		  		<div style="float: left; width: 30%; margin-top: 5px;"> <!--  -->
					{{ref.refLabel}}
				</div>

				<div ng-switch="ref.type" style="margin-top: 5px;"> <!--   -->
					<div ng-switch-when="BOOLEAN"><input type="checkbox" ng-model="ref.value"></div> 
					<div ng-switch-when="NUMBER"> <input type="number"   ng-model="ref.value"></div> 
					<div ng-switch-default>       <input type="text"     ng-model="ref.value"></div> 
				</div>
			</div>
		</fieldset>
		
