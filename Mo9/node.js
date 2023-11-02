const express = require("express");
const http = require('http');
const app = express();
const cors = require("cors");
const PORT = 3001;
const mysql = require('mysql2/promise');
const fs = require("fs");
const bodyParser = require('body-parser')
const path = require("path");
const { spawn } = require('child_process');
const { getUsuarisLogin, getComandes, getProductes, getUsuariInfo, getComandesProductes, insertProducte, deleteProducte, getNumProductes, updateProducte, updateEstatComanda } = require("./scriptBD.js");
const { insertComanda } = require("./scriptBD.js");
const ubicacioArxius = path.join(__dirname, "..", "fotografies");
const ubicacioGrafics = path.join(__dirname, "..", "python/grafics");
const arxiuPython = path.join(__dirname, "..", "python/main.py");
const axios = require('axios');
var session = require('express-session')



//const io = require('socket.io')(server);

const { createServer } = require('http');
const { Server } = require('socket.io');
const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: '*', // Replace with the actual origin of your client application
        methods: ['GET', 'POST'],
    }
});

/*Accept all request*/
app.use(cors());
app.use(express.json());
app.use(session({
    secret: 'keyboardcat',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true }
}))
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
                req.session.nombre = user.usuario;
                req.session.passwd = user.passwd;
            }
        }
        autoritzacio.autoritzacio = usuariTrobat;
        res.json(autoritzacio)
    })
})//donarAutoritzacio al login android
app.post("/dadesUsuari", function (req, res) {
    console.log(req.session.nombre)
    console.log(nomUsuari);
    result = getUsuariInfo(connection, req.session.nombre).then((result) => {
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
    fs.unlinkSync(ubicacioArxius + "/" + prod + ".jpeg")
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
        if (producteModificat.modificarFoto) {
            fs.unlinkSync(ubicacioArxius + "/" + producteId + ".jpeg")
            descargarImagen(novaFoto, ubicacioArxius + "/" + producteId + ".jpeg")
                .then(() =>
                    //console.log('Imagen descargada con éxito')d
                    updateProducte(connection, producteId, producteModificat)
                )
        }
        else
            updateProducte(connection, producteId, producteModificat)
    })
        .catch(console.error);
})//modificar un producte de la bbdd


//----------------General-------------------------//
app.get("/getProductos", function (req, res) {
    result = getProductes(connection).then((result) => {
        //console.log(result)
        result = JSON.parse(result)
        //console.log(result)
        let j = 0
        for (var i = 0; i < result.length; i++) {
            numFoto = i + 1
            let fitxer
            let fotografia = ubicacioArxius + "/" + numFoto + ".jpeg"
            fs.access(fotografia, fs.constants.F_OK, (err) => {
                if (err) {
                    fitxer = false
                } else {
                    fitxer = true
                }
            })
            if (fitxer)
                result[i - j].foto = base64_encode(fotografia)
            else
                j++
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

//-----------Conexion con socket-----------------------------------------------------//
server.listen(3002, () => {
    console.log('Server Socket running at http://localhost:3002');
});

io.on('connection', (socket) => {
    console.log('Usuario conectado');

    socket.on('solicitarComandasIniciales', async () => {

        const comandes = await getComandesProductes(connection);
        const comandesJson = JSON.parse(comandes);

        socket.emit('getComandas', JSON.stringify(comandesJson));


    });

    // Escuchar la solicitud de comanda aceptada
    socket.on('comandaAceptada', (id, estat) => {
        console.log('comanda aceptada numero : ' + id)
        console.log('estado : ' + estat)
        // Aquí puedes procesar la información (id y estat) como desees
        // Por ejemplo, guardar el estado de la comanda en tu fuente de datos
        // y luego enviar una respuesta al cliente

        updateEstatComanda(connection, id, estat); // Llama a la funcion para cambiar el estado en la BD a aceptada       

    });
    socket.on('comandaRebutjada', (id, estat) => {
        console.log('comanda rebutjada numero : ' + id)
        console.log('estado : ' + estat)
        // Aquí puedes procesar la información (id y estat) como desees
        // Por ejemplo, guardar el estado de la comanda en tu fuente de datos
        // y luego enviar una respuesta al cliente
        updateEstatComanda(connection, id, estat); // Llama a la funcion para cambiar el estado en la BD a aceptada        

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

