<div ng-app="myTree">   
	<div class="row docs-body">
		<div class="col-md-9">
	
			<section id="classic" ng-controller="Classic">  
			
           		<img id="auto_refresh_btn" ng-click="toggle_refresh();"  src="images/reload_grey_icon.png" style="cursor:pointer; height: 25px; margin-top:5px;">
           		<div id="auto_refresh_txt" style="display: inline; color: grey; vertical-align: bottom;">(not refreshing)</div>
<!--
			    <div class="page-header" style="height: 3px">
			        <img src="images/reload-icon.png" width="30px" style="cursor:pointer" ng-click="load_forms()"/> Refresh Content  
			    </div>
-->

			    <div class="row" style="margin-top: 10px">
			        <div class="col-md-6 show-grid">
			            <div class="panel panel-default" style="width:70%">
			                <div class="panel-body">
<!--		                    <div class="example-caption">FORMS DEFINED:</div>  -->
			                    <div save-content="classic-html">
			                        <treecontrol class="tree-classic"
			                                     tree-model="treedata"
			                                     on-selection="showSelected(node)">
			                            {{node.label}}
			                            <span ng-if="node.type > ' ' ">({{node.type}})</span>
			                        </treecontrol>
			                    </div>
			                </div>
			            </div>
			        </div>
			    </div>
								
			<!-- 
			    <div class="row">
			        <tabset>
			            <tab heading="Markup" >
			                <pre class="code" apply-content="classic-html" highlight-lang="html"></pre>
			            </tab>
			            <tab heading="JavaScript">
			                <pre class="code" apply-content="classic-js" highlight-lang="js"></pre>
			            </tab>
			        </tabset>
			    </div>
			-->
		
			</section>

		</div>
	</div>
</div>