function loadList() {
	$.ajax({
	 
		// The URL for the request
		url: "http://pi:5984/alice/_design/list_contacts/_view/list_contacts",
	  
		// Whether this is a POST or GET request
		type: "GET",
	 
		// The type of data we expect back
		dataType : "jsonp",
	 
		// Code to run if the request succeeds;
		// the response is passed to the function
		success: function( data ) {
		
			$( "<h2>" ).text( data.total_rows ).appendTo( "body" );     
	
			var output="<ul class=\"theList\">";
			for (var i in data.rows) {
			
	 			var id = data.rows[i].id;
	 			var key = data.rows[i].key;
	 			var name = data.rows[i].value;

				output+='<li class=\"listItem\"><a href="#" onclick="loadContact(\''+id +'\');"><span  class="listing">' +name+ "<\/span><\/li><\/a>";
				console.log(output);	
			}
	
			output+="<\/ul>";
			document.getElementById("listings").innerHTML=output;
			i++;
			console.log( "Status: " + i + " rows returned");	
		},
	 
		// Code to run if the request fails; the raw request and
		// status codes are passed to the function
		error: function( xhr, status, errorThrown ) {
			alert( "Sorry, there was a problem!" );
			console.log( "Error: " + errorThrown );
			console.log( "Status: " + status );
			console.dir( xhr );
		},
	 
		// Code to run regardless of success or failure
		complete: function( xhr, status ) {
			console.log( "The request is complete!" );
		}
	});
}

function loadContact(thisFile) {

	var myUrl = "http://pi:5984/alice/" +thisFile;
	
	$.ajax({
	 
		// The URL for the request
		url: "http://pi:5984/alice/" +thisFile,
	  
		// Whether this is a POST or GET request
		type: "GET",
	 
		// The type of data we expect back
		dataType : "jsonp",
	 
		// Code to run if the request succeeds;
		// the response is passed to the function
		success: function( data ) {

			output=  "<div id=\"head\">" +data.firstname+ " "+data.lastname;

			output+='<a href="#" onclick="editContact(\''+data._id +'\');"><div id=\"edit\">Edit<\/div><\/a><\/div>';
			output+='<a href="#" onclick="deleteContact(\''+data._id+'?_rev=' +data._rev+'\');"><div id=\"delete\">Delete<\/div><\/a><\/div>';

//			output+= "<a href=\"/edit_contact2?name="+data._id +"\"><div id=\"edit\">Edit<\/div><\/a><\/div>";

			output+= "<p class=\"listdata\">Address: "  +data.address;
			output+= "<br>Address2: "  +data.address2;
			output+= "<br>City: " +data.city;
			output+= "<br>State: " +data.state;
			output+= "<br>Country: " +data.country;
			output+= "<br>Postal Code: " +data.postcode;
			output+= "<br>Phone: " +data.phone;
			output+= "<br>Email: " +data.email+"<\/p>";
			output+= "<p>Notes: " +data.notes+	"<\/p>";			

			document.getElementById("contact").innerHTML=output;
			
			console.log( "Success: " +myUrl);	
		},
	 
		// Code to run if the request fails; the raw request and
		// status codes are passed to the function
		error: function( xhr, status, errorThrown ) {
			alert( "Sorry, there was a problem!" );
			console.log( "Error: " + errorThrown );
			console.log( "Status: " + status );
			console.dir( xhr );
		},
	 
		// Code to run regardless of success or failure
		complete: function( xhr, status ) {
			console.log( "The request is complete!" );
		}
	});

}

function editContact(thisFile) {

	var myUrl = "http://pi:5984/alice/" +thisFile;
	
	$.ajax({
	 
		// The URL for the request
		url: "http://pi:5984/alice/" +thisFile,
	  
		// Whether this is a POST or GET request
		type: "GET",
	 
		// The type of data we expect back
		dataType : "jsonp",
	 
		// Code to run if the request succeeds;
		// the response is passed to the function
		success: function( data ) {

			output=  "<div id=\"head\"> Editing: " +data.firstname+ " "+data.lastname+"<\/div>";
			output+= '<div id=\"listform\">';
			output+=  '<form method="POST" id="upDateForm" action="/update_contact2">';
			output+= '<br>First Name: <input name="firstname" type="text" value="'+data.firstname+'" size="40" maxlength="100">';
			output+= '<br>Last Name: <input name="lastname" type="text" value="'+data.lastname+'" size="40" maxlength="100">';
			output+= '<br>Address: <input name="address" type="text" value="'+data.address+'" size="40" maxlength="100">';
			output+= '<br>Address2: <input name="address2" type="text" value="'+data.address2+'" size="40" maxlength="100">';
			output+= '<br>City: <input name="city" type="text" value="'+data.city+'" size="40" maxlength="100">';
			output+= '<br>State: <input name="state" type="text" value="'+data.state+'" size="40" maxlength="100">';
			output+= '<br>Country: <input name="country" type="text" value="'+data.country+'" size="40" maxlength="100">';
			output+= '<br>Postal Code: <input name="postcode" type="text" value="'+data.postcode+'" size="40" maxlength="100">';
			output+= '<br>Phone: <input name="phone" type="text" value="'+data.phone+'" size="40" maxlength="100">';
			output+= '<br>Email: <input name="email" type="text" value="'+data.email+'" size="40" maxlength="100">';
			output+= '<br>Notes: <input name="notes" type="text" value="'+data.notes+'" size="40" maxlength="100">';
			output+= '<input name="_id" type="hidden" value="'+data._id+'">';
			output+= '<input name="_rev" type="hidden" value="'+data._rev+'">';
			output+= '<p id=\"save\"><input type="submit" name="Update"  value="Submit"><\/p>';
			output+= '<\/form>';
			output+= '<\/div>';

			document.getElementById("contact").innerHTML=output;

			console.log( "Success: ");

		},

		// Code to run if the request fails; the raw request and
		// status codes are passed to the function
		error: function( xhr, status, errorThrown ) {
			alert( "Sorry, there was a problem!" );
			console.log( "Error: " + errorThrown );
			console.log( "Status: " + status );
			console.dir( xhr );
		},
	 
		// Code to run regardless of success or failure
		complete: function( xhr, status ) {
			console.log( "The request is complete!" );
		}
	});

}


function deleteContact(doc) {

	var doit = confirm("Do you really want to delete the Document?");

	var didit = "Your Document Has Been Deleted";
	
	var d_url = "http://pi:5984/alice/"+doc;
	

	if (doit) {

		$.ajax({

			type: "DELETE",

			// The type of data we expect back
			dataType : "jsonp",

			url: d_url,


			success: function () {
				loadList();
				document.getElementById("contact").innerHTML=didit;

				console.log("URL: " + d_url);
				
			},

			// Code to run if the request fails; the raw request and
			// status codes are passed to the function
			error: function( xhr, status, errorThrown ) {
				alert( "Sorry, there was a problem!" );
				console.log( "Error: " + errorThrown );
				console.log( "Status: " + status );
				console.dir( xhr );
			},
		 
			// Code to run regardless of success or failure
			complete: function( xhr, status ) {
				console.log( "The request is complete!" );
			}

		 });
	}
}