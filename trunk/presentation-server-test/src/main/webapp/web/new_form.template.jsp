  <div id="new_form" ng-controller="newFormController">

	<!-- The New Form Toolbar -->
	<jsp:include page="new_form.toolbar.jsp" />
	<br/>
	<input type="text" id="formName" ng-model="newFormName" class="newFormTitle" placeholder="[enter new form title here]" size=30/>

	<div ng-show="onLinkForms"  class="formRef">
		<span class="formSubTitle">Include Data from another Form as <input type="text" ng-model="newReferenceName" class="newReferenceName" placeholder="[enter a name for this reference]" size=30 /></span>
		<br/>
		<br/>
		Please choose the Form to include data from: 
		
		<select  ng-model="linkedForm" ng-change="linkedFormChanged()"  class="dropDown"
		     data-ng-options="form as form.label for form in formsTree track by form.label">
		</select>

		<br/>

		<fieldset class="singleReferenceFieldset" context-menu style="width: 60%; float: left;"> 
			<legend class="newReferenceFieldset">Data from {{linkedForm.label}} to be included: </legend> 

			<div style="border: 3px solid #ffffff; border-raius: 10px; padding: 10px; overflow: auto; height: 130px; width: 40%; margin-left: 5%;">
				<div ng-repeat="(dataLabel, dataSelected) in linkedFormData" style="clear: both; font-size: 1em;">
			  		<div class="formDataLeft" style="width: 15%; vertical-align: middle; margin-top: 0px;">
			  			<input type="checkbox" ng-model="linkedFormData[dataLabel]">
			  		</div>
			  		<div class="formDataRight" style="vertical-align: middle;">{{dataLabel}}</div>
			  	</div>
			</div>
		</fieldset>
		
		<div style="display: inline; font-size: 1em; float: left; border: 1px solid grey; border-radius: 10px; margin-top: 15px; width:39%; margin-left: 1%; padding: 7px; ">
			<div style="clear: both;">
				<div style="width: 40%; float: left;">Minimum</div>
				<div style="width: 60%; float: left;"><input type="number" ng-model="refMinimum" size="7" style="width: 90%" /></div>
			</div>
			<div style="clear: both; padding-top: 5px;">
				<div style="width: 40%; float: left;">Maximum</div>
				<div style="width: 60%; float: left;"><input type="number" ng-model="refMaximum" size="7" style="width: 90%" /></div>
			</div>
			<div style="clear: both;">
				<div style="width: 40%; float: left;">Non-Unique</div>
				<div style="width: 60%; float: left;"><input type="radio" name="refUnique" ng-model="refUnique"></div>
			</div>
			<div style="clear: both;">
				<div style="width: 40%; float: left;">Unique</div>
				<div style="width: 60%; float: left;"><input type="radio" name="refUnique" ng-model="refUnique"></div>
			</div>
			<div style="clear: both;">
				<div style="width: 40%; float: left;">Totally Unique</div>
				<div style="width: 60%; float: left;"><input type="radio" name="refUnique" ng-model="refUnique"></div>
			</div>
		</div>
		
	</div>

	<div ng-show="!onLinkForms" class="formData">
		<span class="formSubTitle">Define a new data in the Form:</span>
		<div style="display: block; float: left; padding-top: 15px; width: 70%;">
			<div class="formData">
		  		<div class="formDataLeft">Label</div>
				<div class="formDataRight"><input type="text" id="newDataLabel" ng-model="newLabel"></div>
			</div>
	
			<div class="formData">
				<div class="formDataLeft">Type</div>
				<div class="formDataRight">
					<select ng-model="newType" class="dropDown"
				      ng-options="option for option in dataTypes track by option">
				    </select>
				</div>
			</div>
	
			<div class="formData">
		  		<div class="formDataLeft">Mandatory (not null)</div>
				<div class="formDataRight"><input type="checkbox"     ng-model="notNull"></div>
			</div>
	
			<div class="formData">
		  		<div class="formDataLeft">Unique</div>
				<div class="formDataRight"><input type="checkbox"     ng-model="unique"></div>
			</div>
			
		</div>
	
		<div style="display: block; float: left; width: 25%; margin-top: -60px;">
			Data already defined:<br/>
			<select id="definedData" size=15 style="width: 100%;">
				<option ng-repeat="formData in newFormData">{{formData.label}}</option>
			</select>
		</div>
	</div>
		
	<div class="createFormStmt">
		<div class="collapseTab" onclick="$('#createFormStmt').slideToggle('slow');">
			<span style="font-size: 9px; font-weight: bold; ">FQL</span>
		</div>

		<div id="createFormStmt" style="padding: 6px;">
			CREATE FORM {{newFormName}} 
			(
				<span ng-repeat="formData in newFormData">
					<span ng-if="!$first">,</span>

					<span ng-if="formData.type != 'REFERENCE'">
						{{formData.label}} {{formData.type}}
						<span ng-if="formData.notNull"> NOT NULL </span>
						<span ng-if="formData.unique" > UNIQUE   </span>
					</span>

					<span ng-if="formData.type == 'REFERENCE'">
						{{formData.label}} REFERENCES {{formData.min}}..{{formData.max}} 
						{{formData.referenceForm}}.( {{ formData.refData.join() }} )
					</span>
				</span>			
			)
		</div>
	</div>
	
  </div>

  