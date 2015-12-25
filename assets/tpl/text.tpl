<div class="field-group {#required}required{/required}" data-type="text">

    <div class="preview">
        <label class="label-field-title">
            <span class="field-title" id="field-title-label">{title}</span>
        </label>
        {#required}<span class="field-required-star"> *</span>{/required}
        <span class="field-help" id="field-help-label">{help}</span>
        <input type="text" class="form-control input-sm" disabled />
    </div>

    <div class="controls">
        <button type="button" class="edit btn btn-default btn-circle">
            <i class="glyphicon glyphicon-pencil"></i>
        </button>
        <button type="button" class="delete btn btn-default btn-circle">
            <i class="glyphicon glyphicon-trash"></i>
        </button>
    </div>

    <div class="settings">
                        
        <div class="form-horizontal">

            <div class="form-group form-group-sm">
                <label for="field-title" class="col-sm-3 control-label">Question Title</label>
                <div class="col-sm-9">
                    <input type="text" class="form-control" id="field-title" data-bind="#field-title-label" value="{title}" />
                </div>
            </div>

            <div class="form-group form-group-sm">
                <label for="field-help" class="col-sm-3 control-label">Help Text</label>
                <div class="col-sm-9">
                    <input type="text" class="form-control" id="field-help" data-bind="#field-help-label" value="{help}" />
                </div>
            </div>

            <div class="form-group form-group-sm">
                <div class="col-sm-3">
                    <label class="checkbox-inline">
                        <input type="checkbox" class="field-required" data-bind=".field-required-star">&nbsp;<b>Required</b>
                    </label>
                </div>
                <!--<label for="qn-type" class="col-sm-1 control-label">Type</label>
                <div class="col-sm-2">
                    <select id="qn-type" class="form-control input-sm" disabled>
                        <option>Text</option>
                    </select>
                </div>-->
                <label for="qn-size" class="col-sm-1 control-label">Size</label>
                <div class="col-sm-3">
                    <select id="qn-size" class="form-control input-sm">
                        <option>Large</option>
                        <option>Meduim</option>
                        <option>Small</option>
                    </select>
                </div>
                <label for="qn-style" class="col-sm-1 control-label">Style</label>
                <div class="col-sm-3">
                    <select id="qn-style" class="form-control input-sm">
                        <option>Inline</option>
                        <option>Block</option>
                    </select>
                </div>
            </div>

            <!--
            <div class="panel-group" id="accordion">

                <div class="panel panel-default">

                    <div class="panel-heading">
                         <h4 class="panel-title">
                            <a class="accordion-toggle" data-toggle="collapse" data-parent="#accordion" href="#validation">&nbsp;Advanced Settings</a>
                        </h4>
                    </div>

                    <div id="validation" class="panel-collapse collapse">
                    
                        <div class="panel-body">
                    
                            <div class="form-vertical">

                                <div class="form-group col-sm-12">
                                    <label><input type="checkbox" id="val-field" class="control-label" />&nbsp;Data Validation</label>
                                </div>

                                <div class="form-group col-sm-4">
                                    <select id="val-condition" class="form-control">
                                        <option>Contains</option>
                                        <option>Regular Expression</option>
                                    </select>
                                </div>

                                <div class="form-group col-sm-8">
                                    <input type="text" class="form-control" id="val-term" placeholder="Enter validation term" />
                                </div>

                                <div class="form-group col-sm-12">
                                    <input type="text" class="form-control" id="val-error" placeholder="Add customer error message" />
                                </div>

                            </div>

                        </div>

                    </div>

                </div>

            </div>
            -->

        </div>

    </div>

</div>