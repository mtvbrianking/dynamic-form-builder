{#options}
<div class="option-setting form-group form-inline col-sm-12">
    <label class="radio custom">
        <input type="radio" name="radio-set" class="option-check" {#checked}checked{/checked} />&nbsp; <!-- name="radio" -->
    </label>
    <input type="text" class="form-control option-title" data-bind=".{optionClass}" value="{title}"/>&nbsp;
    <button class="btn btn-default remove-option" data-delete=".{optionClass}">
        <span class="remove glyphicon glyphicon-minus"></span>
    </button>
</div>
{/options}