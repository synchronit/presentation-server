		<!-- Single Reference data is rendered within a fieldset -->
		<fieldset class="singleReferenceFieldset" context-menu > 

			<legend style="font-size: 12px; text-decoration: none; margin: 0px; border: 0px; padding-left: 5px; padding-right: 5px; width: auto; font-weight: bold; color: grey;">{{data.label}}</legend> 

			<div ng-repeat="ref in data.children">
		  		<div style="float: left; width: 30%; margin-top: 5px;"> 
					{{ref.refLabel}}
				</div>

				<div  ng-if="ctrlDefaults.refAsText()"      ng-switch="ref.type" style="margin-top: 5px;"> 
					<div ng-switch-when="BOOLEAN"><input type="checkbox" ng-model="ref.value"></div> 
					<div ng-switch-when="NUMBER"> <input type="number"   ng-model="ref.value"></div> 
					<div ng-switch-default>       <input type="text"     ng-model="ref.value"></div> 
				</div>

				<div  ng-if="ctrlDefaults.refAsTextArea()"  ng-switch="ref.type" style="margin-top: 5px;"> 
					<div ng-switch-when="BOOLEAN"><input type="checkbox" ng-model="ref.value"></div> 
					<div ng-switch-when="NUMBER"> <input type="number"   ng-model="ref.value"></div> 
					<div ng-switch-default>       <textarea              ng-model="ref.value"></textarea></div> 
				</div>
				
				<div  ng-if="ctrlDefaults.refAsDropDown()" style="margin-top: 0px; float: left; max-width: 70%; width: 50%;"> 
					<ui-select   ng-model="selectedItem" theme="selectize"> <!-- ng-model="{id: ref.value, name: ref.value}" -->
					    <ui-select-match>
					        <span ng-bind="$select.selected.name"></span>
					    </ui-select-match>
					    <ui-select-choices repeat="option in (referenceValues[ref.refLabel] | filter: $select.search) track by option.id">
					        <span ng-bind="option.name"></span>
					    </ui-select-choices>
					</ui-select>
				</div>

			</div>

		</fieldset>
