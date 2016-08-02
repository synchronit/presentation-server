<!-- Native data is rendered directly -->
<div style="float:left; clear: both; width: 100%; margin-top: 10px;">
    <div style="float: left; width: 30%; margin-top: 5px; display: inline">
        {{data.label}}
    </div>

    <div ng-switch="data.type" style="margin-top: 5px; display: inline;">
        <div ng-switch-when="BOOLEAN"><input type="checkbox" ng-model="data.value"></div> 
        <div ng-switch-when="NUMBER"> <input type="number"   ng-model="data.value"></div>
        <div ng-switch-when="IMAGE"> 
            <input type='file' id="{{data.label}}" ng-model='data.value' class="hidden" base-sixty-four-input>
            <img img-id="{{data.label}}" ng-src="{{onInputLoad(data.value)}}" src="images/no-img.jpg" alt="{{data.value.filename}}" 
                title="{{data.value.filename}}" ng-click="clickImg(data.label)" ng-model="data.value" class="img-thumbnail">
        </div>
        <div ng-switch-default>       
            <input type="text"     ng-model="data.value">
        </div> 
    </div>
</div>
