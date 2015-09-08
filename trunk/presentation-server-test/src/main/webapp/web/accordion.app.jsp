  <div ng-app="myAccordion">

<!--<div ng-cloak class="u-wideWrapper u-paddingHm u-paddingTl" ng-controller="MainController">-->
    <div ng-cloak class="u-paddingHm u-paddingTl" ng-controller="MainController">

      <div class="Grid Grid--gutters md-Grid--20">
        <div class="Grid-cell">

          <v-accordion class="vAccordion--default" control="accordionA" onexpand="expandCallback(index)" oncollapse="collapseCallback(index)">

            <v-pane ng-repeat="pane in panes" expanded="$first">
              <v-pane-header id="pane0{{$index}}-header" aria-controls="pane0{{$index}}-content">
                <h5>{{ pane.header }}</h5>
              </v-pane-header>

              <v-pane-content id="pane0{{$index}}-content" aria-labelledby="pane0{{$index}}-header">


                      <div ng-switch on="pane.header">
                        <div ng-switch-when="Forms">

						<!-- The TREE with all Forms -->
						<jsp:include page="tree.app.jsp" />

                        </div>

                        <div ng-switch-when="Web Sockets">
							<input type="button" value="start web-socket communication" onClick="start_ws()" />
							<div id="messages"></div>
						</div>
                        
                        <div ng-switch-default>{{ pane.content }}</div>
					  </div> <!-- SWITCH -->

				<!-- Original Code before including the Tree
                <p>{{ pane.content }}</p>
				-->

                <v-accordion ng-if="pane.subpanes">
                  <v-pane ng-repeat="subpane in pane.subpanes" expanded="$first">
                    <v-pane-header id="pane1{{$index}}-header" aria-controls="pane1{{$index}}-content">
                      <h5>{{ subpane.header }}</h5>
                    </v-pane-header>
                    <v-pane-content id="pane1{{$index}}-content" aria-labelledby="pane1{{$index}}-header">
                      <p>{{ subpane.content }}</p>
                    </v-pane-content>
                  </v-pane>
                </v-accordion>
              </v-pane-content>
            </v-pane>

          </v-accordion>
         </div>
	    </div>
	</div>
  </div>
