		<!-- Multiple Reference data is rendered within a fieldset -->
		<br/>
		<fieldset id="{{data.label}}-multi-ref-fieldset" style="border: 1px solid grey; border-radius: 10px; padding: 15px; padding-top: 10px; margin-top: 5px; width: auto; display: inline-block; float: left; "> 

			<legend style="font-size: 12px; text-decoration: none; margin: 0px; border: 0px; padding-left: 5px; padding-right: 5px; width: auto; font-weight: bold; color: grey;">
				{{data.label}} 
				( {{data.refMin}} .. 
					<span ng-if="data.refMax != 0">{{data.refMax}}</span>
					<span ng-if="data.refMax == 0">many</span>
				)
			</legend> 

			<div id="{{data.label}}-multi-ref-div" ui-grid="gridOptions[data.label]" ui-grid-edit ui-grid-resize-columns ui-grid-auto-resize resizeable-grid class="myGrid" class="resizable" ></div>

		</fieldset>
		
