const expressLib = require("express")
const dirLib = require("path")
const plantilla = require("ejs")

var app = expressLib()

app.use(expressLib.static('public'))
app.use(expressLib.static('views'))
app.set('view engine', 'ejs')


app.get('*',  (req, respuesta, next) => {
	var opc = req.url;
	var opcion = opc.substring(1, opc.length);
	//console.log("la cadena es=" + opcion);
	let locales = {
					seleccion : opcion
					}
	if (opc.length <= 10)
	{
		switch (opc) {
			case '/':
				respuesta.render("page", locales);
				//console.log("Ejecutando la raiz " + opc);
				break;
			default:
				respuesta.render("opciones", locales);
				break;	
		}
	}
	next();
});

//app.get('/',  (req, respuesta) => {
//	console.log("req=",req)
//	//respuesta.sendFile(dirLib.join(__dirname+'../views/index.ejs'));
//	respuesta.render("page")
//})

//app.get('/contact',  (req, respuesta) => {
//	//respuesta.sendFile(dirLib.join(__dirname+'../views/index.ejs'));
//	respuesta.render("contact")
//})

app.listen(3000);
