const express=require("express");
const http = require('http');
const socketIo = require('socket.io');
const app = express();
const cors = require("cors");
const PORT=3001;
const mysql = require('mysql2/promise');
const fs =require("fs");
const bodyParser = require('body-parser')
const path = require("path");
const { spawn } = require('child_process');
const { getUsuarisLogin, getComandes, getProductes, getUsuariInfo,getComandesProductes } = require("./scriptBD.js");
const { insertComanda } = require("./scriptBD.js");
const ubicacioArxius = path.join(__dirname, "..", "fotografies");
const ubicacioGrafics = path.join(__dirname, "..", "python/grafics");
const arxiuPython = path.join(__dirname, "..", "python/main.py");

//const io = require('socket.io')(server);

const server = http.createServer(app);
const io = socketIo(server);

/*Accept all request*/
app.use(cors());
app.use(express.json());

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.listen(PORT, function(){
    console.log("server running")
})
const connection = mysql.createPool({
    host: "dam.inspedralbes.cat",
    user: "a22albcormad_botigaG7",
    password: "botigaG7",
    database: "a22albcormad_BotigaG7"
});

//------------cosses android--------------
app.post("/usuaris", function(req, res){
    const user = req.body;

    let usuariTrobat=false;
    autoritzacio={"autoritzacio":false};
    
    usuaris= getUsuarisLogin(connection).then((usuaris) => {
    usuaris=JSON.parse(usuaris)
    
    for(var i; i<usuaris.length || usuariTrobat==false; i++){
        nom=(usuaris[1].usuario)
        contra=(usuaris[1].passwd)

        if(nom==user.usuario && contra==user.contra){
            console.log("hola")
            usuariTrobat=true;
        }
    }
    autoritzacio.autoritzacio=usuariTrobat;
    res.json(autoritzacio)}) 
}) //donarAutoritzacio al login android
app.post("/dadesUsuari", function(req, res){
    const nomUsuari=req.body
    result=getUsuariInfo(connection, nomUsuari.usuario).then((result)=>{
    console.log(result)
    result=JSON.parse(result)
    console.log(result)
    res.json(result)})
})//pasar dades del usuari a android
app.post("/crearComanda", function(req, res){
    const comanda = req.body;
    resultat=insertComanda(connection, comanda).then((resultat)  => {
    result={"autoritzacio": resultat}
    res.send(result)})
})//crear la comanda a la bbdd


/*app.get("/getComandes", async function(req, res){
    try {
        const comandes = await getComandes(connection); 
        const comandesJson = JSON.parse(comandes);
        
        res.json(comandesJson);
    } catch (error) {
        console.error('Error al obtener las comandas:', error.message);
        res.status(500).send('Error al obtener datos de comandas.');
    }
});//*/


app.get("/getProductos", function(req, res){
    result=getProductes(connection).then((result)=>{
    console.log(result)
    result=JSON.parse(result)
    for(var i=0; i<result.length; i++){
        let fotografia=ubicacioArxius+"/"+i+".jpeg"
        result[i].foto=base64_encode(fotografia)
    }
    
    console.log(result)
    res.json(result)})
})//Passar productes amb la seva foto a android


app.get("/getComandes", async function(req, res){
    try {
        const comandes = await getComandesProductes(connection); 
        const comandesJson = JSON.parse(comandes);
        res.json(comandesJson);
    } catch (error) {
        console.error('Error al obtener las comandas:', error.message);
        res.status(500).send('Error al obtener datos de comandas.');
    }
});

// Manejar la conexión de sockets
io.on('connection', (socket) => {
    console.log('Usuario conectado');
  
    // Escuchar la solicitud de comanda aceptada
    socket.on('comandaAceptada', ({ id, estat }, callback) => {
      // Aquí puedes procesar la información (id y estat) como desees
      // Por ejemplo, guardar el estado de la comanda en tu fuente de datos
      // y luego enviar una respuesta al cliente
      const info = procesarComanda(id, estat); // Esto debería devolver la información necesaria
      callback(info);
    });
  
    // Resto de la lógica de tu aplicación...
  });


/*const interval = 5000; // Interval de temps en milisegundos (5 segons)

setInterval(async () => {
    try {
        const ComandesJSON = await getComandes(connection); 
        io.emit('comandes', ComandesJSON); // Envia les comandes
    } catch (error) {
        console.error('Error al obtener les comandes:', error.message);
    }
}, interval);*/


function base64_encode(file) {
    // read binary data
    var bitmap = fs.readFileSync(file);
    // convert binary data to base64 encoded string
    return new Buffer(bitmap).toString('base64');
}//funcio auxilar per codificar fotos


function comensarPython(){

}
comensarPython()




//movil - node-> enviar usuari, demanar productes i enviar comanda
//vue - node -> demanar i enviar productes i comandes

// https://stackoverflow.com/questions/23979842/convert-base64-string-to-image obtener imagenes en android