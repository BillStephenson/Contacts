var express = require('express');
var router = express.Router();

var nano = require('nano')('http://192.168.0.131:5984');
var db = nano.use('alice');
var appName = "iblocDB";
var alldoc = "ALL DOCS: ";


/* GET HOME PAGE view. */
router.route('/')
    // show the form (GET http://localhost:8080/login)
	.get(function(req, res) {
	res.render('index', { title: appName });
	console.log('processing index');
    })

/* GET List view. */
// router.get('/list', function(req, res){
// 
// 	db.list(function(err, body) {
// 		if (!err) {
// 			body.rows.forEach(function(doc) {
// 				db.get(doc.id, { revs_info: true }, function(err, mydoc) {
// 					if (!err) {
// 						if (mydoc.type ==="contact") {
// 							alldoc+="<p> Doc ID: "+doc.id+"<br> Name: "+mydoc.name+"<br> Phone: "+mydoc.phone+"</p>";
// 						}
// 					}				
// 				});
// 			});
// 		}
// 	});
// 
// 		res.render('index', { mylist: alldoc });
// 		//res.send("<h1>RESULT:</h1>" +alldoc);
// 	});

////////////////////////////////////////////////////////////////////////////////

/* GET List view. */
router.get('/list', function(req, res) {

// use a key to narrow down the list..
	//var myKey='bill2@ezInvoice.com';
	//db.view( 'list_all', 'list_all', { keys: [myKey] }, function(err, body ) {

// Get the full list...
	db.view( 'list_all', 'list_all', function(err, body ) {

	  if (!err) {
		body.rows.forEach(function(doc) {
		  console.log(doc.id);
		  alldoc+=doc.email+": ";
		});
	  }
	});
	console.log(alldoc);
	res.render('index', { mylist: alldoc });
	alldoc = "ALL DOCS: ";
});

// json url: http://pi:5984/alice/_design/list_all/_view/list_all
// json url: http://pi:5984/alice/_design/list_contacts/_view/list_contacts

////////////////////////////////////////////////////////////////////////////////

/* POST New DB view. */
router.route('/createdb')

	.post(function(req, res){
		nano.db.create(req.body.dbname,function(err) {
			// create a new database
			if (err) {
				res.send("Error creating Database "+req.body.dbname);
				return;
			}

			res.send("Database "+req.body.dbname+" was created sucessfully"); 

		});
	});

////////////////////////////////////////////////////////////////////////////////

/* POST New Contact view. */

router.route('/new_contact')
	.post(function(req, res){
		var name=req.body.name;
		var email=req.body.email;
		var phone=req.body.phone;
		var address=req.body.address;
		var city=req.body.city;
		var contact="contact";


		/*The second parameter phone is the id we are explicitly specifying*/
		db.insert({ name:name, 
					email:email,
					phone:phone, 
					address:address,
					city:city }, function(err, body, header) {
			if (err) {
				res.send("Error creating contacts or contacts already exists");
				return;
			}
	
//			res.send("Contacts was created sucessfully"); 

			res.render('index', { msg: name + " has beed added to the database" });
			console.log('processing index');

		});
	});

////////////////////////////////////////////////////////////////////////////////

/* POST View Contact Info view. */
// json url: http://pi:5984/alice/_design/list_all/_view/list_all

router.route('/view_contact')
	.post(function(req, res){
		var alldoc="Here's you're record: <br/><br/>";
		db.get(req.body.id, { revs_info: true }, function(err, body) {
			if (!err)
				console.log(body);
			if(body){
				alldoc+="Name: "+body.name +"<br/> Phone: "+body.phone;
			}else{
				alldoc="No Record exist with that key";
			}
			res.render('index', { msg: body.name });
//			res.send(body);
		});
	});

////////////////////////////////////////////////////////////////////////////////

/* POST Edit Contact view. */
router.route('/edit_contact')
	.post(function(req, res){
		var msg;
		var _id = req.body.name;
		db.get(_id, { revs_info: true }, function(err, body) {
			if (!err)
				console.log(body);
			if(body){
				msg="Editing: "+body.name;
			}else{
				msg="No Record exist with that key";
			}			
			res.render('update', 
			{ msg: msg, 
			  _id: _id,
			  name:body.name, 
			  email:body.email,
			  phone:body.phone,
			  address:body.address,
			  city:body.city
			});

		});
	});


////////////////////////////////////////////////////////////////////////////////

/* GET Edit Contact view. */
//URL Example: http://pi:3000/edit_contact2?name=cd6b2cba42e32d50b8618bf0be000e1e
router.route('/edit_contact2')
	.get(function(req, res){
		var msg;
		var _id = req.query.name;
		console.log("Query: ", _id);
		
		db.get(_id, { revs_info: true }, function(err, body) {
			if (!err)
				console.log("Query: ", req.query);
			if(body){
				msg="Editing: "+_id;
			}else{
				msg="No Record exist with that key";
			}			
			res.render('update', 
			{ msg: msg, 
			  _id: _id,
			  name:body.name, 
			  email:body.email,
			  phone:body.phone,
			  address:body.address,
			  city:body.city
			});

		});
	
	});

////////////////////////////////////////////////////////////////////////////////

/* POST Update Contact view. */
router.route('/update_contact')
	.post(function(req, res){
		var _id=req.body._id;
		
		db.get(_id, function(err, val) {
			if(err) {throw err;}
			console.log('retrieved document', _id);

			val.name=req.body.name;
			val.email=req.body.email;
			val.phone=req.body.phone;
			val.address=req.body.address;
			val.city=req.body.city;

/* replace the old values with the new values */
			db.insert(val, function(err) {
				if (err) { console.log('insert failed') }
					console.log('inserted document', val);
					db.get(_id, function(err, val) {
						console.log('doc = ', val);
				});
			});

/* check the new values were set */
			db.insert(val, function(err) {
				if (err) { console.log('insert confirmed') }
					console.log('inserted document', val);
					db.get(_id, function(err, val) {
						console.log('doc = ', val);
				});
			});
			console.log('processing index');
			res.render('index', { msg: val.name + " has been updated" });
		});
	});

////////////////////////////////////////////////////////////////////////////////

/* POST Delete Contact view. */
router.route('/delete_contact')

	.post(function(req, res){
		db.get(req.body.phone, { revs_info: true }, function(err, body) {
			if (!err){
				db.destroy(req.body.phone,body._rev , function(err, body) {
				if (!err){
					//res.send("Error1 in deleting");
				}else{
					res.send("Error2 in deleting");
				}
			});
			res.send("Document deleted sucessfully");
			}
		});
	});


////////////////////////////////////////////////////////////////////////////////

/* GET Contacts view. */

var html_dir = '/';
router.get('/contact', function(req, res) {
    res.sendfile(html_dir + 'contacts.html');
});

////////////////////////////////////////////////////////////////////////////////

/* GET Bill view. */

router.get('/Bill', function(req, res) {

	// and insert a document in it
	db.insert({ color: 'blue' }, function(err, body, header) {
		if (err) {
			console.log('[db.insert] ', err.message);
			return;
		}
		console.log('you have inserted a color.')
		console.log(body);
		});
		res.render('bill', { title: 'Bill\'s test' });
	});

////////////////////////////////////////////////////////////////////////////////

module.exports = router;
