  <div ng-app="form_content" ng-controller="formSelectedController">

	<h3 class="formTitle">{{formSelected.label}}</h3>

	<!-- The Form Toolbar -->
	<jsp:include page="form_content.toolbar.jsp" />

	<div ng-repeat="data in formSelected.children">

		<div  ng-if="!data.isReference" style="margin-left: 15px;">
			<jsp:include page="native_data.template.jsp" />
		</div>
		
		<div  ng-if="data.isReference">
			<div  ng-if="data.refMax == 1">
				<jsp:include page="single_reference.template.jsp" />
			</div>
			<div  ng-if="data.refMax != 1">
				<jsp:include page="multiple_reference.template.jsp" />
			</div>
		</div>

	</div>

  </div>

  