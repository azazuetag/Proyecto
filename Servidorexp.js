const expressLib = require("express")
const dirLib = require("path")
const plantilla = require("ejs")
const parseador = require("body-parser")
const fs = require("fs")
const multer = require("multer")
const mongoose = require('mongoose')
mongoose.connect("mongodb://localhost/mastersc")


contact = new mongoose.Schema({
	 nombre : String, 
	 email : String, 
	 tel : String, 
	 website : String, 
	 mensaje : String, 
	 imagen : String
}, { collection : 'contact'});

var contact = mongoose.model('contact', contact);

// Set staoge engine
const storage = multer.diskStorage({
	destination: './public/uploads/',
	filename: function(req, file, cb){
		cb(null,file.fieldname + '-' + Date.now() + dirLib.extname(file.originalname));
	}
});

const upload = multer({
	storage: storage,
	limits:{filesize: 1000000},
	fileFilter: function (req, file, cb){
		checkFileType(file, cb);
	}
}).single('archivo');

function checkFileType(file, cb){
	const filetypes = /jpeg|jpg|png|gif/;
	const extname = filetypes.test(dirLib.extname(file.originalname).toLowerCase());
	const mimetype = filetypes.test(file.mimetype);

	if (mimetype && extname){
		return cb(null, true);
	}else{
		cb('Error: Solo Imagenes!');
	}
}

// Inicia app
var app = expressLib()

app.use(expressLib.static('public'))
app.use(expressLib.static('views'))
app.set('view engine', 'ejs')


app.get('/lista', (req,res) =>{
	contact.find(function(error, result){
		if (error) { 
			console.log(error);
		}
		else
        {
            res.render("opciones",{
                data: req.url,
                contactos: result,
                seleccion : 'lista'
            });        
        }
	});
});


var urlparser = parseador.urlencoded({ extended: false }); 

app.post('/contact', (req, respuesta)=> {

	upload(req, respuesta,(err) => {
		if (err){
			console.log(err);
		} else {
				var data = {
							 nombre : req.body.name, 
							 email : req.body.email, 
							 tel : req.body.phone, 
							 website : req.body.website, 
							 mensaje : req.body.message, 
							 imagen : req.file.filename
							};
					var contacto = new contact(data);
					contacto.save(function(err){
						console.log(contacto);
					});

			fs.writeFile('./Archivostxt/'+ req.body.email + '.txt','{Nombre:' + req.body.name + ',Correo:' + 
				req.body.email + ',Telefono:' + req.body.phone + ',SitioWeb:' + req.body.website + ',Mensaje:' + 
				req.body.message + '}', function(error)
			{
				if (error)
					console.log(error);
				else
					console.log("Archivo txt Guardado");
			})
		}
	});
});

app.get('*',  (req, respuesta, next) => {
	var opc = req.url;
	var opcion = opc.substring(1, opc.length);
	let locales = {
					seleccion : opcion
					}
	if (opc.length <= 10)
	{
		switch (opc) {
			case '/':
				respuesta.render("page", locales);
				break;
			default:
				respuesta.render("opciones", locales);
				break;	
		}
	}
	next();
});

app.listen(3000);
