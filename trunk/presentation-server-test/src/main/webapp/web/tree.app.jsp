<div ng-app="myTree">   
	<div class="row docs-body">
		<div class="col-md-9">
	
			<section id="classic" ng-controller="Classic">  
			
			    <div class="page-header">
			        <img src="images/reload-icon.png" width="30px" style="cursor:pointer" ng-click="load_forms()"/> Refresh Content
			    </div>
			    <div class="row">
			        <div class="col-md-6 show-grid">
			            <div class="panel panel-default" style="width:70%">
			                <div class="panel-body">
			                    <div class="example-caption">FORMS DEFINED:</div>
			                    <div save-content="classic-html">
			                        <treecontrol class="tree-classic"
			                                     tree-model="treedata"
			                                     on-selection="showSelected(node)">
			                            label: {{node.label}} ({{node.id}})
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
