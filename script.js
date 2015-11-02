var Pup = (function(){
	// To initialize this we want to get our initial Puppy list and display it on
	//  the page. Also setup all of our listeners to functino properly.
	function init(){
		_getPuppyList();
		_buildBreedSelect();
		_config();
	}

	// Public Functions


	// Private Functions
	function _config(){
		// Setup form submit listener
		$('#register-puppy-form').submit(function(e){
			var form = $(this);
			var puppyName = $('#name', form).val();
			var breedID = $('#breed-select', form).val();
			_registerPuppy(puppyName, breedID);
			form.trigger('reset');
			_flashMessage("info", "Puppy Submitted!");
			e.preventDefault();
		})

		// Refresh Puppy List listener
		$('#refresh-puppy-list').click(function(e){
			_getPuppyList();
			e.preventDefault();
		})

		// Setup adopt link listener
		$('#puppy-list').on('click', '.adopt-link', function(e){
			_adoptPuppy($(e.currentTarget).attr('breed_id'));
			e.preventDefault();
		})
	}

	function _flashMessage(type, message){
		$('#flash').addClass(type);
		$('#flash').html(message);
		$('#flash').addClass('show');
		setTimeout( function(){
			$('#flash').attr("class", "");;
    },3000);
	}

	function _adoptPuppy(id){
		$.ajax( {
			url: "https://ajax-puppies.herokuapp.com/puppies/"+ id +".json",
			type: "DELETE",
			dataType: "json",
			contentType: "application/json",
			success: function( json ) { 
				_buildPuppyList(json);
				_flashMessage("success", "Puppy Adopted!");
			},
			error: function( xhr, status, errorThrown ) { 
				_displayError(errorThrown);
			},
			complete: function( xhr, status ) { _getPuppyList(); }
		});
	}

	function _registerPuppy(name, id){
		$.ajax( {
			url: "https://ajax-puppies.herokuapp.com/puppies.json",
			type: "POST",
			dataType: "json",
			contentType: "application/json",
			data: JSON.stringify({name: name, breed_id: id}),
			success: function( json ) { 
				_buildPuppyList(json);
				_flashMessage("success", "Puppy Added!");
			},
			error: function( xhr, status, errorThrown ) { 
				_displayError(errorThrown);
			},
			complete: function( xhr, status ) { _getPuppyList(); }
		});
	}

	function _buildBreedSelect(){
		$.ajax( {
			url: "https://ajax-puppies.herokuapp.com/breeds.json",
			type: "GET",
			dataType : "json",
			success: function( json ) { 
				var buffer = '<option value="" selected>Select a Breed</option>';
				for(var i=0;i<json.length;i++){
					buffer += '<option value="'+ json[i].id +'">'+ json[i].name +'</option>';
				}
				$('#breed-select').html(buffer);
			},
			error: function( xhr, status, errorThrown ) { 
				_displayError(errorThrown);
			}
		});
	}

	function _getPuppyList(){
		$.ajax( {
			url: "https://ajax-puppies.herokuapp.com/puppies.json",
			type: "GET",
			dataType : "json",
			success: function( json ) { 
				_buildPuppyList(json); 
			},
			error: function( xhr, status, errorThrown ) { alert("Error"); },
		});
	}

	function _buildPuppyList(json){
		var listElement = $('#puppy-list');

		// The buffer we'll use to assemble our list HTML
		var buffer = "";

		for(var i=0;i<json.length;i++){
			buffer += '<li>';
			buffer += '<b>'+ json[i].name +'</b>' + ' ';
			buffer += '('+ json[i].breed.name +')' + ' ';
			buffer += 'created ' + $.timeago(json[i].created_at) + ' ';
			buffer += '-- <a class="adopt-link" breed_id="'+ json[i].id +'" href="#">adopt</a>';
			buffer += '</li>';
		}

		// Add the buffer HTML to the list
		listElement.html(buffer);
	}

	function _displayError(error){
		// Actually build this later
		_flashMessage("error", error);
	}

	// Return everything!
	return{
		init: init
	}

})();



$( document ).ready(function(){
	Pup.init();
});