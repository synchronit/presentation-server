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
					<select ng-model="ref.value" class="dropDown">
						<option ng-repeat="option in referenceValues[ref.refLabel]" ng-selected="option == ref.value" value="{{option}}" >
							{{option}}
						</option>
					</select>
				</div>
				
			</div>

		</fieldset>
