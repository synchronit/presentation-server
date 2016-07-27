<%-- 
    Document   : importer.template
    Created on : Jul 14, 2016, 1:38:42 PM
    Author     : jvega
--%>
<link rel="stylesheet" type="text/css" href="css/importer/csv_importer.css" >
<div id="importer" ng-controller="importerController">
       <!-- The New Form Toolbar -->
        <jsp:include page="importer.toolbar.jsp"/>
        <br/>         
       <div class="container-fluid">
        <h1>Loading CSV</h1>
        <div class="panel panel-default">
            <div class="panel-heading">
                <h2>Import file:</h2>
            </div>
            <div class="panel-body">

                <div>
                    <div class="row">
                        <div class="col-lg-6 col-md-6 col-sm-6 col-xs-12">
                            <input id="csv_file_input" type="file" accept=".csv" />
                        </div>
                        <div class="col-lg-6 col-md-6 col-sm-6 col-xs-12 text-right">
                            <a id="see_source_btn" class="btn btn-primary" role="button" data-toggle="collapse" href="#div_file_content" aria-expanded="false" aria-controls="div_file_content">See source file content &nbsp;<span class=" glyphicon glyphicon-chevron-down"></span></a>
                        </div>
                    </div>
                    <br />

                    <div id="div_file_content" class="collapse">
                        <textarea id="file_content" class="form-control" style="min-height:100px"></textarea>
                    </div>

                    <br>

                </div>


                <div class="panel panel-default">
                     
                   <div class="panel-heading form-group">
                        <h3>Mapping</h3>
                        <div class="row clearfix">
                            <div class="col-lg-6 col-md-6">

                                <label>Select FORM to send data:</label>
                                <select class="form-control form-control" style='max-width:300px;' id="form_names">
                                                <option id="0">Select...</option>
                                                </select><br>
                                                            
                            <label>Write a name for this mapping.</label><br>
                            <input id="mapNameText" type="text" class="form-control" style='max-width:300px;' required/><br>
                        
     
                                <br>
                                <input id="first_row_checker" type="checkbox" text="" /> <span> Is first row columns names?</span>

                            </div>
                            <div class="col-lg-6 col-md-6">
                                    <label>Select a saved mapping for this FORM</label>
                                    <select class="form-control form-control" style='max-width:300px;' id="mapping_names">
                                        <option id="0">Select mapping</option>
                                    </select>
                                    <br><br>
                                    <div id="savingExistingMapping" class="hidden">
                                           <label class="text-danger">Do want to save this modifications to this mapping?</label><br>
                                           <input type="checkbox"><span class="text-danger">Yes, save this modifications.</span>
                                    </div>
                            </div>
                           
                        </div><br>
                        <div>
                            <button id="send_data_btn" class="btn btn-primary">Send Data to App Base</button>
                        </div>
                        
                    </div>
                        <div id="divBadRowsFilter" class="info-div info-danger bg-danger hidden">
                            <button id="closeBadRowsDiv" type="button" class="close" aria-hidden="true">&times;</button>
                             <label>Ups, It looks like some rows failed.</label><br>
                             <input type="checkbox" id="checkBadRowsFilter"/> <span> See failed rows only!</span>
                        </div>
                    <div id="table_container" class="panel-body">
                       <table id="table_mapping" class="table">
                            <thead>

                            </thead>
                            <tbody>

                            </tbody>

                        </table>

                    </div>



                </div>
            </div>
           

        </div>
    </div>


    <div class="modal fade" id="modal-progress">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                    <h4 class="modal-title">Sending data to AppBase</h4>
                </div>
                <div class="modal-body">
                    <progress id="sendingProgress" class="form-control" ng-non-bindable></progress>
                    <div id="saving-trace">
                        <div style="margin:10px ">
                            <span id="currentItem"></span>&nbsp;&nbsp;<span id="currentFailure" class="text-danger"></span>
                        </div>
                        <button id="btn-expand" class="btn btn-default btn-circle" type="button" data-toggle="collapse" data-target="#stackTraceContiner" aria-expanded="false" aria-controls="stackTraceContiner">
                        <span class="glyphicon glyphicon-chevron-down"></span>
                        </button>
                        <div class="collapse" id="stackTraceContiner">
                            <div class="well">
                                <ul id="stackTrace">

                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
                </div>
            </div>
        </div>
    </div>
</div>
        
        <!--importer stuff-->
<script src="js/importer/papaparse.min.js"></script>
<script src="js/importer/mocks.js"></script>
<script src="js/importer/appBaseService.js"></script>
<script src="js/importer/csv_importer.js"></script>
     <!--importer stuff-->
