const expressLib = require("express")
const dirLib = require("path")
const plantilla = require("ejs")
const parseador = require("body-parser")
const fs = require("fs")
const multer = require("multer")

var app = expressLib()

app.use(expressLib.static('public'))
app.use(expressLib.static('views'))
app.use(multer({dest: "./uploads"}).single('archivo'));
app.set('view engine', 'ejs')


//app.use(parseador.json()); // support json encoded bodies
var urlparser = parseador.urlencoded({ extended: false }); // support encoded bodies

app.post('/contact', urlparser, function(req, respuesta) {
	console.log("El archivos es:" + req.files);
	if (!req.body) return respuesta.sendStatus(400)
	fs.writeFile('./Archivostxt/'+ req.body.email + '.txt','{Nombre:' + req.body.name + ',Correo:' + req.body.email + ',Telefono:' + req.body.phone + ',SitioWeb:' + req.body.website + ',Mensaje:' + req.body.message + '}', function(error){
		if (error)
			console.log(error);
		else{
			console.log('Se creo el archivo');
		}

	});
	respuesta.send("Almacenado, muchas gracias:" + req.body.email)
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
				respuesta.render("opciones", locales);
				break;	
		}
	}
	next();
});

app.listen(3000);
