<?php
/**
 * This class converts the form to html from json
 * So that it can be rendered for preview
 */

class JsonToHtml {

	var $formData;

	public function __construct($jsonForm) {
		$this->formData = json_decode(str_replace('\\', '', $jsonForm));
	}

	public function getHtmlForm() {

		if( empty($this->formData) ) {
			throw new Exception("Error Processing Request", 1);
		}

		$fields = $this->writeFields();

		return $this->writeForm($fields);

	}

	private function writeForm($fields) {

		$form = '<form action="" method="POST" accept-charset="utf-8" role="form" >';
		$form .= '<div class="form-title">';
		$form .= sprintf('<h2>%s</h2><h3>%s</h3>', $this->formData->title, $this->formData->description);
		$form .= $fields;
		//$form .= '<button type="submit" class="btn btn-primary">Submit</button>';
		$form .= '</div></form>';
		return $form;

	}

	private function writeFields() {

		$fields = '';

		foreach ($this->formData->fields as $field) {

			switch($field->type) {

			    case 'text':
			        $fields .= $this->write_field_text($field);
			        break;
			    case 'check':
			        $fields .= $this->write_field_check($field);
			        break;
			    case 'radio':
			        $fields .= $this->write_field_radio($field);
			        break;
			    case 'select':
			        $fields .= $this->write_field_select($field);
			        break;
			    default:
			    	
			}

		}

		return $fields;

	}

	// encode field/option name from title
	private function encode_title($title) {
		$name = str_replace(' ', '_', strtolower($title));
		$name = preg_replace('/[^a-zA-Z0-9.-_]/', '', $name);
		$name = htmlentities($name, ENT_QUOTES, 'UTF-8');
		$name = html_entity_decode($name, ENT_QUOTES, 'UTF-8');
		return $name;
	}

	// write field label
	private function write_label($id, $title, $required) {
		if( $required ) {
			$label = sprintf('<label for="%s" class="control-label">%s <span style="color: red">*</span></label>', $id, $title);
		} else {
			$label = sprintf('<label for="%s" class="control-label">%s </label>', $id, $title);
		}
		return $label;
	}

	private function write_field_text($field) {

		$name = $this->encode_title($field->title);
		$required = ($field->required) ? 'required' : FALSE;

		$field_text = '<div class="form-group">';
		$field_text .= $this->write_label($name, $field->title, $required);
	    $field_text .= sprintf('<input type="text" name="%s" id="%s" class="form-control %s">', $name, $name, $required);
	    $field_text .= sprintf('<span class="help-block">%s</span>', $field->description);
	  	$field_text .= '</div>';

		return $field_text;

	}

	private function write_field_check($field) {

		$name = $this->encode_title($field->title);
		$required = ($field->required) ? 'required' : FALSE;

		$field_check = '<div class="form-group">';
		$field_check .= $this->write_label($name, $field->title, $required);
		$field_check .= sprintf('<span class="help-block">%s</span>', $field->description);
	    
	    $field_check .= '<div class="input-group">';
	    for($i=0; $i < count($field->options); $i++) {
			$checked = $field->options[$i]->checked ? "checked" : '';
			$field_check .= sprintf('<label class="checkbox-inline"><input type="checkbox" name="%s[]" value="%s" %s/>%s</label>', 
				$name, $field->options[$i]->name, $checked, $field->options[$i]->name);
		}
		$field_check .= '</div>';

	  	$field_check .= '</div>';

		return $field_check;

	}

	private function write_field_radio($field) {

		$name = $this->encode_title($field->title);
		$required = ($field->required) ? 'required' : FALSE;

		$field_radio = '<div class="form-group">';
		$field_radio .= $this->write_label($name, $field->title, $required);
		$field_radio .= sprintf('<span class="help-block">%s</span>', $field->description);
	    
	    $field_radio .= '<div class="input-group">';
	    for($i=0; $i < count($field->options); $i++) {
			$checked = $field->options[$i]->checked ? "checked" : '';
			$field_radio .= sprintf('<label class="radio-inline"><input type="radio" name="%s" value="%s" %s/>%s</label>', 
				$name, $field->options[$i]->name, $checked, $field->options[$i]->name);
		}
		$field_radio .= '</div>';

	  	$field_radio .= '</div>';

		return $field_radio;

	}

	private function write_field_select($field) {

		$name = $this->encode_title($field->title);
		$required = ($field->required) ? 'required' : FALSE;

		$field_select = '<div class="form-group">';
		$field_select .= $this->write_label($name, $field->title, $required);
		$field_select .= sprintf('<span class="help-block">%s</span>', $field->description);
	    
	    $field_select .= sprintf('<select class="form-control" name="%s">', $name);
	    for($i=0; $i < count($field->options); $i++) {
			$selected = $field->options[$i]->selected ? "selected" : '';
			$field_select .= sprintf('<option value="%s" %s>%s</option>', 
				$field->options[$i]->name, $selected, $field->options[$i]->name);
		}
		$field_select .= '</select>';

	  	$field_select .= '</div>';

		return $field_select;

	}

}