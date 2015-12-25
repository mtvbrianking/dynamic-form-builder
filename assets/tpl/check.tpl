<div class="field-group {#required}required{/required}" data-type="check">

    <div class="preview">
        <label class="label-field-title">
            <span class="field-title" id="field-title-label">{title}</span>
        </label>
        {#required}<span class="field-required-star"> *</span>{/required}
        <span class="field-help" id="field-help-label">{help}</span>
        <div class="options" data-type="check-option">
            <label class="checkbox-inline option">
                <input type="checkbox" class="option-1" disabled />
                <span class="option-label">Option 1</span>
            </label>
            <label class="checkbox-inline option">
                <input type="checkbox" class="option-2" disabled />
                <span class="option-label">Option 2</span>
            </label>
        </div>
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

            <div class="form-group">
                <label for="field-title" class="col-sm-3 control-label">Question Title</label>
                <div class="col-sm-8">
                    <input type="text" class="form-control" id="field-title" data-bind="#field-title-label" value="{title}" />
                </div>
            </div>

            <div class="form-group">
                <label for="field-help" class="col-sm-3 control-label">Help Text</label>
                <div class="col-sm-8">
                    <input type="text" class="form-control" id="field-help" data-bind="#field-help-label" value="{help}" />
                </div>
            </div>

            <div class="form-group">
                <label for="qn-type" class="col-sm-3 control-label">Question Type</label>
                <div class="col-sm-3">
                    <select id="qn-type" class="form-control input-normal" disabled>
                        <option>Check Boxes</option>
                    </select>
                </div>
                <div class="col-sm-offset-3 col-sm-3">
                    <label class="checkbox-inline">
                        <input type="checkbox" class="field-required" data-bind=".field-required-star" {#required}checked{/required} />&nbsp;
                        <b>Required</b>
                    </label>
                </div>
            </div>

            <ul class="options-settings col-sm-offset-3" data-type="check-option-setting">
                
                <!-- Checkbox options' settings will be loaded here -->

            </ul>

            <div class="form-group">
                <div class="col-sm-offset-6">
                    <button class="btn btn-default add-option">
                        <span class="glyphicon glyphicon-plus"></span>&nbsp; Add Option
                    </button>
                </div>
            </div>

        </div>

    </div>

</div>