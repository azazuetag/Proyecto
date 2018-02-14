const libhttp = require('http');

const hostname = '127.0.0.1';

const port = 3000;

const servidor = libhttp.createServer((req, respuesta) =>{
	respuesta.statusCode = 200;
	respuesta.setHeader('Content-Type','application/json');
	respuesta.end('{"Servidor" : "Hola Servidor"}');
});

servidor.listen(port, hostname, () => {
	console.log('El servidor se está ejecutando en http://${hostname}:${port}/')
});