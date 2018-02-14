var express = require("express");
var app = express();

app.use(express.static("./"));

app.listen(8000,function(){
	console.log("Esta corriendo el servidor en el puerto 8000");
});