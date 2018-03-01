const expressLib = require("express")
const dirLib = require("path")
const plantilla = require("ejs")
const parseador = require("body-parser")
const fs = require("fs")
const multer = require("multer")

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


//app.use(parseador.json()); // support json encoded bodies
var urlparser = parseador.urlencoded({ extended: false }); // support encoded bodies

app.post('/contact', (req, respuesta)=> {

	upload(req, respuesta,(err) => {
		if (err){
			res.render('contact',{
				msg: err
			});
		} else {
			//respuesta.send('Prueba' + req.body.name);
			fs.writeFile('./Archivostxt/'+ req.body.email + '.txt','{Nombre:' + req.body.name + ',Correo:' + 
				req.body.email + ',Telefono:' + req.body.phone + ',SitioWeb:' + req.body.website + ',Mensaje:' + 
				req.body.message + '}', function(error)
			{
				if (error)
					console.log(error);
				else
					console.log("Archivo txt Guardado");
			})

			respuesta.render("opciones", {
					seleccion : 'Lista',
					msg: 'Imagen Cargada'
					});
		}

	});
});

app.get('*',  (req, respuesta, next) => {
	var opc = req.url;
	var opcion = opc.substring(1, opc.length);
	console.log("la cadena es=" + opcion);
	let locales = {
					seleccion : opcion
					}
	if (opc.length <= 10)
	{
		switch (opc) {
			case '/':
				respuesta.render("page", locales);
				console.log("Ejecutando la raiz " + opc);
				break;
			default:
				console.log("Ejecutando" + opcion);
				respuesta.render("opciones", locales);
				break;	
		}
	}
	next();
});



app.listen(3000);
