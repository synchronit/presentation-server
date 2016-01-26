  <div id="new_form" ng-controller="newFormController">

	<!-- The New Form Toolbar -->
	<jsp:include page="new_form.toolbar.jsp" />
	<input type="text" id="formName" ng-model="newFormName" class="newFormTitle" placeholder="Enter new form title here" size=30/>

	<div style="display: block; float: left; padding-top: 15px; width: 70%;">

		<div style="float:left; width: 100%; clear: both; margin-top: 10px;">
	  		<div style="float: left; width: 30%; margin-top: 5px; display: inline">
				Label
			</div>
			
			<div style="float: left; margin-top: 5px; display: inline;">
				<input type="text"     ng-model="newLabel"> 
			</div>

		</div>

		<div style="float:left; width: 100%; clear: both; margin-top: 10px;">
	  		<div style="float: left; width: 30%; margin-top: 5px; display: inline">
				Type
			</div>
			
			<div style="float: left; margin-top: 5px; display: inline;">
			    <select ng-model="newType" class="dropDown"
			      ng-options="option for option in dataTypes track by option">
			    </select>
			</div>

		</div>

		<div style="float:left; width: 100%; clear: both; margin-top: 10px;">
	  		<div style="float: left; width: 30%; margin-top: 5px; display: inline">
				Mandatory (not null)
			</div>
			
			<div style="float: left; margin-top: 5px; display: inline;">
				<input type="checkbox"     ng-model="notNull"> 
			</div>

		</div>

		<div style="float:left; width: 100%; clear: both; margin-top: 10px;">
	  		<div style="float: left; width: 30%; margin-top: 5px; display: inline">
				Unique
			</div>
			
			<div style="float: left; margin-top: 5px; display: inline;">
				<input type="checkbox"     ng-model="unique"> 
			</div>

		</div>

	</div>

	<div style="display: block; float: left; width: 25%; padding-top: 15px;">
		<select id="definedData" size=15 style="width: 100%;">
			<option ng-repeat="formData in newFormData">{{formData.label}}</option>
		</select>
	</div>
	
	<div id="createFormStmt" class="createFormStmt">
		CREATE FORM {{newFormName}} 
		(
			<span ng-repeat="formData in newFormData">
				<span ng-if="!$first">,</span>
				{{formData.label}} {{formData.type}}
				<span ng-if="formData.notNull"> NOT NULL </span>
				<span ng-if="formData.unique" > UNIQUE   </span>
			</span>			
		)
	</div>
	
  </div>

  