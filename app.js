var http = require('http');
var url = require('url');
var fs = require('fs');
http.createServer(function(peticion, respuesta){
   var path_nombre = (url.parse(peticion.url).pathname == '/') ? '/index.html' : url.parse(peticion.url).pathname;
   var ruta_a_archivo = '.' + path_nombre;
   //respuesta.end('la ruta es:' + ruta_a_archivo);
   fs.exists(ruta_a_archivo, function(existe){
      if(existe){
         fs.readFile(ruta_a_archivo, function(error, contenido_archivo){
            if(error){
               respuesta.writeHead(500, 'text/plain');
               respuesta.end('Error interno.');
            }else{
               respuesta.writeHead(200, {'Content-Type': 'text/html'});
               respuesta.end(contenido_archivo);
            }
         });
      }else{
         respuesta.writeHead(404, 'text/plain');
         respuesta.end('Error 404. El enlace no existe o ha dejado de existir.');
      }
   });
}).listen(3000, '127.0.0.1');
console.log('El servidor esta funcionando correctamente en https://localhost:3000/');