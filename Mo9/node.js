const express = require("express");
const http = require('http');
const socketIo = require('socket.io');
const app = express();
const cors = require("cors");
const PORT = 3001;
const mysql = require('mysql2/promise');
const fs = require("fs");
const bodyParser = require('body-parser')
const path = require("path");
const { spawn } = require('child_process');
const { getUsuarisLogin, getComandes, getProductes, getUsuariInfo, getComandesProductes, insertProducte, deleteProducte, getNumProductes, updateProducte } = require("./scriptBD.js");
const { insertComanda } = require("./scriptBD.js");
const ubicacioArxius = path.join(__dirname, "..", "fotografies");
const ubicacioGrafics = path.join(__dirname, "..", "python/grafics");
const arxiuPython = path.join(__dirname, "..", "python/main.py");
const axios = require('axios');


//const io = require('socket.io')(server);

const server = http.createServer(app);
const io = socketIo(server);

/*Accept all request*/
app.use(cors());
app.use(express.json());

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.listen(PORT, function () {
    console.log("server running")
})
const connection = mysql.createPool({
    host: "dam.inspedralbes.cat",
    user: "a22albcormad_botigaG7",
    password: "botigaG7",
    database: "a22albcormad_BotigaG7"
});

//------------cosses android----------------//
app.post("/usuaris", function (req, res) {
    const user = req.body;
    console.log(user)
    console.log(user.usuario)
    console.log(user.passwd)
    let usuariTrobat = false;
    autoritzacio = { "autoritzacio": false };

    usuaris = getUsuarisLogin(connection).then((usuaris) => {
        usuaris = JSON.parse(usuaris)
        console.log(usuaris[0].usuario)
        for (var i = 0; i < usuaris.length || usuariTrobat == false; i++) {
            if (usuaris[i].usuario == user.usuario && usuaris[i].contra == user.contra) {
                console.log("hola")
                usuariTrobat = true;
            }
        }
        autoritzacio.autoritzacio = usuariTrobat;
        res.json(autoritzacio)
    })
})//donarAutoritzacio al login android
app.post("/dadesUsuari", function (req, res) {
    const nomUsuari = req.body
    console.log(nomUsuari);
    result = getUsuariInfo(connection, nomUsuari.usuario).then((result) => {
        console.log(result)
        result = JSON.parse(result)
        console.log(result)
        res.json(result)
    })
})//pasar dades del usuari a android
app.post("/crearComanda", function (req, res) {
    const comanda = req.body;
    resultat = insertComanda(connection, comanda).then((resultat) => {
        result = { "autoritzacio": resultat }
        res.send(result)
    })
})//crear la comanda a la bbdd

//----------------cosses vue----------------------//
app.post("/agregarProducte", function (req, res) {
    nouProducte = req.body
    novaFoto = nouProducte.foto
    //console.log(nouProducte)
    //separar la foto al seu directori
    id = getNumProductes(connection).then((id) => {
        console.log(id, "1")
        id = JSON.parse(id)
        //console.log(id[0].MAX(id_producte), "2")
        let obj = id[0];
        let valor = obj['MAX(id_producte)'];
        numProd = valor + 1
        descargarImagen(novaFoto, ubicacioArxius + "/" + numProd + ".jpeg")
            .then(() =>
                //console.log('Imagen descargada con éxito')d
                insertProducte(connection, nouProducte)
            )
    })
        .catch(console.error);


})//agregar producte a la bbdd 
app.delete("/eliminarProducte/:id", function (req, res) {
    const prod = req.params.id
    deleteProducte(connection, prod)
    fs.unlink(ubicacioArxius + "/" + prod + ".jpeg")
})//Eliminar productes a la bbdd 
app.put("/modificarProducte/:id", function (req, res) {
    console.log("Entra en modificar producte");
    const producteModificat = req.body
    const producteId = req.params.id
    //console.log(producteModificat)
    novaFoto = producteModificat.foto   
    //separar la foto al seu directori
    id = getNumProductes(connection).then((id) => {
        console.log(id, "1")
        id = JSON.parse(id)
        //console.log(id[0].MAX(id_producte), "2")
        let obj = id[0];
        let valor = obj['MAX(id_producte)'];
        numProd = valor + 1
        descargarImagen(novaFoto, ubicacioArxius + "/" + numProd + ".jpeg")
            .then(() =>
                //console.log('Imagen descargada con éxito')
                updateProducte(connection, producteId, producteModificat).then(result => {
                    // Operación exitosa, envía una respuesta 200 OK
                    res.status(200).json({ message: "Producte actualitzat amb èxit" });
                })
                    .catch(error => {
                        // Error en la operación, envía una respuesta de error con código 500 u otro código apropiado
                        res.status(500).json({ message: "Error al actualitzar el producte" });
                    }))

    })
})//modificar un producte de la bbdd


//----------------General-------------------------//
app.get("/getProductos", function (req, res) {
    result = getProductes(connection).then((result) => {
        //console.log(result)
        result = JSON.parse(result)
        //console.log(result)
        for (var i = 0; i < result.length; i++) {
            numFoto = i + 1
            let fotografia = ubicacioArxius + "/" + numFoto + ".jpeg"
            result[i].foto = base64_encode(fotografia)
        }

        //console.log(result)
        res.json(result)
    })
})//Passar productes amb la seva foto codificada
app.get("/getComandes", async function (req, res) {
    try {
        const comandes = await getComandesProductes(connection);
        const comandesJson = JSON.parse(comandes);
        res.json(comandesJson);
    } catch (error) {
        console.error('Error al obtener las comandas:', error.message);
        res.status(500).send('Error al obtener datos de comandas.');
    }
});
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
})// Manejar la conexión de sockets

//-----------funcions auxiliars-------------------//

async function descargarImagen(url, rutaImagen) {
    console.log("descarregant imatge")
    const respuesta = await axios({
        url,
        method: 'GET',
        responseType: 'stream'
    });

    const escritor = fs.createWriteStream(rutaImagen);
    respuesta.data.pipe(escritor);

    return new Promise((resolver, rechazar) => {
        escritor.on('finish', resolver);
        escritor.on('error', rechazar);
    });
}//descarregar la foto desde la url amb axios
function base64_encode(file) {
    // read binary data
    var bitmap = fs.readFileSync(file);
    // convert binary data to base64 encoded string
    return new Buffer(bitmap).toString('base64');
}//funcio auxilar per codificar fotos

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


//-------------py-----------------//
function comensarPython() {

}
//començarPython()




//movil - node-> enviar usuari, demanar productes i enviar comanda
//vue - node -> demanar i enviar productes i comandes

