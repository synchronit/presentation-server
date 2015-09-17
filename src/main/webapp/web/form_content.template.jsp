  <div ng-app="form_content" ng-controller="formSelectedController">

	<h3 class="formTitle">{{formSelected.label}}</h3>

	<!-- The Form Toolbar -->
	<jsp:include page="form_content.toolbar.jsp" />

	<div ng-repeat="data in formSelected.children">

		<!-- Native data is rendered directly -->
		<div  ng-if="!data.isReference" style="margin-left: 15px;">
		<div>
	  		<div style="float: left; width: 30%; margin-top: 5px;">
				{{data.label}}
			</div>
			
			<div ng-switch="data.type" style="margin-top: 5px;">
				<div ng-switch-when="BOOLEAN"><input type="checkbox" ng-model="data.value"></div> 
				<div ng-switch-when="NUMBER"> <input type="number"   ng-model="data.value"></div> 
				<div ng-switch-default>       <input type="text"     ng-model="data.value"></div> 
			</div>
		</div>
  		</div>

		<!-- Referenced data is rendered within a fieldset -->
		<div  ng-if="data.isReference">
			<fieldset style="border: 1px solid grey; border-radius: 10px; padding: 15px; padding-top: 10px; margin-top: 5px; width: auto;"> 

				<legend style="font-size: 12px; text-decoration: none; margin: 0px; border: 0px; padding-left: 5px; padding-right: 5px; width: auto; font-weight: bold; color: grey;">{{data.label}}</legend> 

				<div ng-repeat="ref in data.children">
			  		<div style="float: left; width: 30%; margin-top: 5px;"> <!--  -->
						{{ref.label}}
					</div>
	
					<div ng-switch="ref.type" style="margin-top: 5px;"> <!--   -->
						<div ng-switch-when="BOOLEAN"><input type="checkbox" ng-model="ref.value"></div> 
						<div ng-switch-when="NUMBER"> <input type="number"   ng-model="ref.value"></div> 
						<div ng-switch-default>       <input type="text"     ng-model="ref.value"></div> 
					</div>
				</div>
  			</fieldset>
		</div>
		
	</div>

  </div>

  