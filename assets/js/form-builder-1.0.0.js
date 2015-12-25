/**
 * Plugin name 	: Dynamic Html Form Builder
 * Plugin URI 	: http://brianmatovu.com/projects/formbuilder
 * Author 		: Brian Matovu
 * Author URI 	: http://brianmatovu.com/
 * Description 	: A free JQuery form builder plugin for your web application
 * Version 		: 1.0.1
 * License 		: GNU General Public License
 * License URI 	: http://www.gnu.org/licenses/gpl-3.0.html
 * Tags 		: Free, Opensource, Javascript, JQuery, Html5, Bootstrap, Dynamic, Builder, Form
 */
(function($) {

	$.fn.formBuilder = function(options) {

		// Set default settings from options
		var settings = $.extend({
			process_url : '/',
			preview_url : '/'
        }, options);

		var obj = this;
        var selectedField = '';

		/**
		 * Autoloading templates at dustJs start up
		 */
		dust.onLoad = function(name, callback) {

			$.ajax('assets/tpl/' + name + '.tpl', {
				success: function(data) {
					callback(undefined, data);
				},
				error: function(jqXHR, textStatus, errorThrown) {
					callback(textStatus, undefined);
				}
			});

		};

		/* Render base template (basic form builder layout) on loading */
		dust.render('base', '', function(err, out) {
			
			// load base template... (builder skeleton)
			obj.append(out);
			
			// bootstrap | setup the form
			bootstrap();

		});

		var bootstrap = function(e){

			var dragItem, dropPos;
			
			$('.new-element').click(function(e) {
				
			});

			/** 
			 * A button's drag event is by default cancelled
			 * Uncancel this to make buttons draggable
			 */
			$( '.new-element' ).draggable({
				cancel: false
			});

			/**
			 * Making tools (buttons) draggable using jquery-ui : draggable
			 */
			$('.new-element').draggable({
				cursor: 'move',
				helper: 'clone',
				snap: '.form-builder',
				containment: '.form-builder',
				connectToSortable: '.sortable'
			});

			/**
			 * Make the form preview sortable and droppable at the same time
			 */
			$('.sortable').sortable({

				placeholder: 'ui-sortable-placeholder',
				beforeStop: function (event, ui) {
					// find the item being dragged
					dragItem = ui.item;
				},
				receive: function (event, ui) {
					// find the position where the item has been release/dropped
					dropPos = $(dragItem).parent().children().index(dragItem);
					// change the div and add a custom form element div
					addField(ui, dropPos);
				}

			}).disableSelection();

			/************************************************************************************/
			/*								Bind Control Buttons								*/
			/************************************************************************************/

			/* Edit field */
			$('.sortable').on('click', '.field-group .edit', function(event) {
				// edit field group to which this delete button belongs
				editField($(this).parent().parent());
			});

			/* Delete field */
			$('.sortable').on('click', '.field-group .delete', function(event) {
				// remove field group to which this delete button belongs
				removeField($(this).parent().parent());
			});

			/************************************************************************************/
			/*								Bind Field Properties								*/
			/************************************************************************************/

			/* Bind field-title */
			$('.sortable').on('keyup', '#field-title', function() {
				var target = $(this).data('bind');
				selectedField.find(target).html($(this).val());
			});

			/* Bind field-help */
			$('.sortable').on('keyup', '#field-help', function() {
				var target = $(this).data('bind');
				selectedField.find(target).html($(this).val());
			});

			/* Bind field-required */
			$('.sortable').on('change', '.field-required', function() {
				 
				// toggle required status i.e., add/remove required class from the selected field
				selectedField.toggleClass('required');

				// check state of field-required setting
				if(this.checked) {
					dust.render('required', '', function(err, out) {
						// if-checked; add the field 'required' star tpl
						selectedField.find('.label-field-title').after(out);
					});
				} else {
					// else; add the field 'required' star tpl
					selectedField.find('.field-required-star').remove();
				}

			});

			/************************************************************************************/
			/*							Bind Field Options' Properties							*/
			/************************************************************************************/

			// binding the checkbox / radio button
			$('.sortable').on('change', '.option-check', function() {
				var target = $(this).parent().next('input').data('bind');
				var value = ( $(selectedField).data('type') != 'select' ) ? 'checked' : 'selected';
				$(selectedField).find(target).prop( value, function( i, val ) {
					return !val;
				});
			});

			// binding the title / option label
			$('.sortable').on('keyup', '.option-title', function() {
				var target = $(this).data('bind');
				if (selectedField.data('type') == 'select') {
					selectedField.find(target).html($(this).val());
				} else {
					selectedField.find(target).next('.option-label').html($(this).val());
				}
			});

			// binding the add option button
			$('.sortable').on('click', '.add-option', function() {
				addFieldOption();
			});

			// binding the remove option button
			$('.sortable').on('click', '.remove-option', function() {
				// determine option to be removed depending on the button clicked
				removeFieldOption($(this).parent());
			});

			// rewrite form preview into json
			$('.save-form').click(function(e) {
				var jsonForm = formToJson();

				$.ajax({
					//async: false,
					type: "POST",
					url: settings.process_url,
					//datatype: 'json',
					data: {jsonForm: jsonForm},
					success: function(data, textStatus, jqXHR) {
				        settings.onPreviewForm.call();
				    },
				    error: function (jqXHR, textStatus, errorThrown) {
				 		
				    }
				});

			});

		}

		/************************************************************************************/
		/*									Utility Functions								*/
		/************************************************************************************/
		
		/**
		 * Adding a field
		 * Adds a field to the form being built
		 */
		var addField = function(ui, dropPos) {
			
			// get the data-type of the field 'tool' being added to the form
			var type = $(ui.item).attr('data-type');

			// set default meta data for the field to be added
			var data = {
				'title'     : 'Untitled Question',
				'help'      : 'Help text',
				'required'  : false,
				'position'  : $(ui.item).index()
			};
			 
			// render the field template for the element being added to the form
			dust.render(type, data, function(err, out) {

				// replace the field 'tool' being add with its actual template
				$('.sortable').find('.new-element').replaceWith(out);

				// next, mark dropped field as the currently selected field
				addedField = $('.sortable').find('.field-group').eq(dropPos);

				// add field options for field types that require them
				if(type=='check' || type=='radio' || type=='select') {
					
					var options = [];
					
					// read options in the field preview	
					var items = addedField.children('.preview').children('.options').children('.option');

					if( type=='select' ) {
						items = addedField.children('.preview').children('.options').children('option');
					}
						
					// read meta data for each options
					items.each(function(i){

						if( type!='select' ) {
							var title = $(this).children('.option-label').html();
							var checked = $(this).children('input').is(':checked') ? true : false;
							var optionClass = $(this).children('input').attr('class');
						}else{
							var title = $(this).val();
							var optionClass = $(this).attr('class');
							var checked = $(this).is(':selected') ? true : false;
						}

						var data = {
							'position'     : i+1,
							'title'        : title,
							'checked'      : checked,
							'optionClass'	: optionClass
						};

						options.push(data);

					});

					var data = {
						'options' : options
					}

					// Render an option setting tpl for each option in the preview using the data collected above
					dust.render($(addedField).find('.options-settings').data('type'), data, function(err, out) {

						$(addedField).find('.options-settings').append(out);

					});

				}

			});

		}

		/**
		 * Selecting a field
		 * Find which field has been currently selected and add a class selected to it
		 */
		var selectField = function(field) {
			
			// remove class 'selected' class from any other field-groups
			$('.field-group').removeClass('selected');
			// add class 'selected' class to current field-group
			$(field).addClass('selected');

			// make current field-group is the selected-field
			selectedField = $(field);

		}

		/**
		 * Editing a field
		 * Toogles a field-group between preview and settings for editing
		 */
		var editField = function(field) {
			
			// first, select current field
			selectField(field);

			/* record it's state ( preview | edit )
			var selectedFieldState = selectedField.find('.settings').css('display');

			// reset all the field to preview state
			$('.sortable').find('.settings').hide();
			$('.sortable').find('.preview').show();

			// toogle current field's display according to the preview state before reset
			if(selectedFieldState == 'none') {
				selectedField.find('.preview').css('display', 'none');
				selectedField.find('.settings').css('display', 'block');
			}else {
				selectedField.find('.preview').css('display', 'block');
				selectedField.find('.settings').css('display', 'none');
			}*/

			showSettingsModal();

		}

		function showSettingsModal() {

			var modal = $(' \
				<div class="modal fade" id="myModal" tabindex="-1" role="dialog" aria-hidden="true"> \
					<div class="modal-dialog"> \
						<div class="modal-content"> \
							<div class="modal-body"></div> \
							<div class="modal-footer"> \
								<button type="button" class="close btn btn-default btn-circle" data-dismiss="modal"> \
									<i aria-hidden="true" class="glyphicon glyphicon-remove"></i> \
									<span class="sr-only">Close</span> \
								</button> \
							</div> \
						</div> \
					</div> \
				</div>');

			//var template = $('assets/tpl/modal.tpl').html();
			$.get('assets/tpl/modal.tpl', function(data) {
   				//alert(data);
			});

			selectedField.append(modal);
		    
		    $('.modal-body').append(selectedField.find('.settings'));
	        $('.modal-body').find('.settings').css('display', 'block');

	        $('.modal').attr('class', 'modal fade');
	        $('.modal-dialog').attr('class','modal-dialog');
	        
	        /* load setiings before showing modal
	        $('.settings').find('#field-title').val(selectedField.find('.field-title').text());
	        $('.settings').find('#field-help').val(selectedField.find('.field-help').text());
	        $('.settings').find('.field-required').prop('checked', $(selectedField).hasClass('required') ? true : false );*/


	        $('.modal').modal('show');

	        $('.modal').on('shown.bs.modal', function () {});

	        $(".modal").on('hidden.bs.modal', function () {
	        	selectedField.find('.settings').css('display', 'none');
	        	selectedField.append($('.modal-body').find('.settings'));
			    $(this).data('bs.modal', null);
			    $(this).remove();
			});

		}

		/**
		 * Deleting a field
		 * Removes a field from the form being built
		 */
		var removeField = function(field) {
			if( $('.sortable').children('.field-group').length > 1 ) {
				$(field).remove();
			}
		}

		var addFieldOption = function() {

			/* Find the class of the last option */
			if( selectedField.data('type') == 'select' ) {
				var lastOption = selectedField.find('.preview').children('.options').children('option').last();
				var lastOptionClass = lastOption.attr('class');
			} else {
				var lastOption = selectedField.find('.preview').children('.options').children('.option').children('input').last();
				var lastOptionClass = lastOption.attr('class');
			}

			var lastOptionClassSplit = lastOptionClass.split('-');

			/* determine which number the last option has */
			var newOptionNumber = ++lastOptionClassSplit[1];
			  
			var option = {
				'title'         : 'Untitled',
				'optionClass'   : 'option-'+newOptionNumber
			};

			var data = {
				'options' : option
			}

			// Render the option setting
			dust.render($(selectedField).find('.options-settings').data('type'), data, function(err, out) {
				
				// render the option setting
				selectedField.find('.options-settings').append(out);

				// render the corresponding option in preview
				dust.render($(selectedField).find('.options').data('type'), option, function(err, out) {

					selectedField.children('.preview').children('.options').append(out);

				});

			});
		}

		var removeFieldOption = function(option) {

			if( selectedField.find('.option-setting').length > 1 ) {
			 
				// Remove option settings
				$(option).remove();
		 		
		 		// find which option to delete (from preview)
				var deleteOption = $(option).find('button').data('delete');

				// Delete options from preview
				if(selectedField.data('type') == 'select') {
					selectedField.find(deleteOption).remove();
				} else {
					selectedField.find(deleteOption).parent().remove();
				}

			}

		}

		var formToJson = function() {
			
			/* read from attributes */
			var form = {};
			
			form['title'] = $('#form-title').val();
			form['description'] = $('#form-description').val();

			form['fields'] = Array();

			$('.sortable .field-group').each(function(i){

				switch($(this).data('type')) {

				    case 'text':
				        form['fields'].push(textToJson(this));
				        break;
				    case 'check':
				        form['fields'].push(checkToJson(this));
				        break;
				    case 'radio':
				        form['fields'].push(radioToJson(this));
				        break;
				    case 'select':
				        form['fields'].push(selectToJson(this));
				        break;
				    default:
				        
				}
				
			});

			var jsonForm = JSON.stringify(form);

			return jsonForm;

		}

		var textToJson = function(field) {
			return {
				'title': $(field).find('#field-title').val(),
				'description': $(field).find('#field-help').val(),
				'type': 'text',
				'required': $(field).hasClass('required') ? true : false
			}
		}

		var checkToJson = function(field) {
			var check = {
				'title'			: $(field).find('#field-title').val(),
				'description'	: $(field).find('#field-help').val(),
				'type'			: 'check',
				'required'		: $(field).hasClass('required') ? true : false
			}

			var options = Array();

			$(field).find('.options').children('.option').each(function(i) {
				var option = {
					'name': $(this).find('.option-label').html(),
					'checked': $(this).find('input:checkbox').is(':checked') ? true : false
				}
				options.push(option);
				check['options'] = options;
			});
			
			return check;
		}

		var radioToJson = function(field) {
			var radio = {
				'title'			: $(field).find('#field-title').val(),
				'description'	: $(field).find('#field-help').val(),
				'type'			: 'radio',
				'required'		: $(field).hasClass('required') ? true : false
			}

			var options = Array();

			$(field).find('.options').children('.option').each(function(i) {
				var option = {
					'name': $(this).find('.option-label').html(),
					'checked': $(this).find('input:radio').is(':checked') ? true : false
				}
				options.push(option);
				radio['options'] = options;
			});

			return radio;
		}

		var selectToJson = function(field) {
			var select = {
				'title'			: $(field).find('#field-title').val(),
				'description'	: $(field).find('#field-help').val(),
				'type'			: 'select',
				'required'		: $(field).hasClass('required') ? true : false
			}

			var options = Array();

			$(field).find('.options').children('option').each(function(i) {
				var option = {
					'name': $(this).val(),
					'selected': $(this).is(':selected') ? true : false
				}
				options.push(option);
				select['options'] = options;
			});

			return select;
		}

	}

})(jQuery);