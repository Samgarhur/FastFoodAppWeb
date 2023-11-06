const express = require("express");
const app = express();
const cors = require("cors");
const PORT = 3001;
const mysql = require('mysql2/promise');
const fs = require("fs");
const bodyParser = require('body-parser')
const path = require("path");
const { spawn } = require('child_process');
const { getUsuarisLogin, getComandesSenceres, getProductes, getUsuariInfo, getComandesProductes, getComandaAceptada,getComandaFinalizada, insertProducte, deleteProducte, getNumProductes, updateProducte, updateEstatComanda, updateEstatProducte,updateTempsComanda } = require("./scriptBD.js");
const { insertComanda } = require("./scriptBD.js");
const ubicacioArxius = path.join(__dirname, "..", "fotografies/");
const ubicacioGrafics = path.join(__dirname, "..", "Mo10/grafics");
const arxiuPython = path.join(__dirname, "..", "Mo10/produirInfo.py");
const axios = require('axios');
var session = require('express-session')
var usuariLog //guardem el nom del usuari logejat aqui

//const io = require('socket.io')(server);

const { createServer } = require('http');
const { Server } = require('socket.io');
const { timeStamp } = require("console");
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
    let usuariTrobat = false;

    autoritzacio = { "autoritzacio": false };

    usuaris = getUsuarisLogin(connection).then((usuaris) => {
        usuaris = JSON.parse(usuaris)
        for (var i = 0; i < usuaris.length && usuariTrobat == false; i++) {

            if (usuaris[i].usuario == user.usuario  ) {
                contra=(user.passwd)
                if (usuaris[i].passwd == contra){
                    usuariTrobat = true;
                    req.session.nombre = user.usuario;
                    usuariLog=req.session.nombre
                }
            }
        }
        autoritzacio.autoritzacio = usuariTrobat;
        res.json(autoritzacio)
    })
})//donarAutoritzacio al login android
app.get("/dadesUsuari", function (req, res) {
    console.log(usuariLog)
    result = getUsuariInfo(connection, usuariLog).then((result) => {
        //console.log(result)
        result = JSON.parse(result)
        //console.log(result)
        res.json(result)
    })
})//pasar dades del usuari a android
app.post("/crearComanda", function (req, res) {
     comanda = 
     {
        id_usuari:"",
        productes:req.body.productos,
        hora_recollida:req.body.hora,
        dia_recollida:req.body.dia
    }
        var infoUsuari = getUsuariInfo(connection, usuariLog).then((infoUsuari) => {
            infoUsuari=JSON.parse(infoUsuari)
            comanda.id_usuari=infoUsuari[0].id_usuari

        var resultat = insertComanda(connection, comanda).then((resultat) => {
            resultat = { "autoritzacio": resultat }
            res.send(resultat)
        })
        })
})//crear la comanda a la bbdd

//----------------cosses vue------------------------------------------------------------------------//
app.post("/agregarProducte", function (req, res) {
    nouProducte = req.body
    novaFoto = nouProducte.foto
    //console.log(nouProducte)
    //separar la foto al seu directori
    insertProducte(connection, nouProducte).then(() => {
        id = getNumProductes(connection).then((id) => {
        console.log(id, "1")
        id = JSON.parse(id)
        //console.log(id[0].MAX(id_producte), "2")
        let obj = id[0];
        let valor = obj['MAX(id_producte)'];
        numProd = valor 
        descargarImagen(novaFoto, ubicacioArxius + "/"+"00"+ + numProd + ".jpeg")
        })
    })
        .catch(console.error);


})//agregar producte a la bbdd 
app.delete("/eliminarProducte/:id", function (req, res) {
    const prod = req.params.id
    deleteProducte(connection, prod)
    fs.unlinkSync(ubicacioArxius + "/" +"00"+ prod + ".jpeg")
})//Eliminar productes a la bbdd 
app.put("/modificarProducte/:id", async function (req, res) {
    try {
        console.log("Entra en modificar producte");
        const producteModificat = req.body;
        const producteId = req.params.id;
        const novaFoto = producteModificat.foto;

        // Eliminar la imagen antigua si es necesario
        if (producteModificat.modificarFoto) {
            fs.unlinkSync(`${ubicacioArxius}00${producteId}.jpeg`);
            // Descargar la nueva imagen y esperar a que se complete
            await descargarImagen(novaFoto, `${ubicacioArxius}/00${producteId}.jpeg`);
        }

        // Actualizar el producto en la base de datos
        await updateProducte(connection, producteId, producteModificat);

        res.send("Producto modificado correctamente.");
    } catch (error) {
        console.error("Error al modificar producto:", error);
        res.status(500).send("Error al modificar producto.");
    }
});//modificar un producte de la bbdd
app.put("/updateEstatProducte/:id", function (req, res) {
    //console.log("Entra en update estat del producte");
    const estatProducte = req.body.estat
    const producteId = req.params.id
    updateEstatProducte(connection, producteId, estatProducte)

})//desactiva un producte


//----------------General-----------------------------------------------------------------//
app.get("/getProductos",function (req, res) {
    result = getProductes(connection).then((result) => {
        result = JSON.parse(result)
        fitxers = comprobarExistencia(ubicacioArxius).then((fitxers) => {

            for (var i = 0; i < result.length; i++) {
                console.log(i)
                console.log(fitxers[i])
                result[i].foto = base64_encode(ubicacioArxius + fitxers[i])
            }
            res.json(result)
        })
        //console.log(result)

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

app.get("/getComandasFinalizadas", async function (req, res) {
    try {
        const comandes = await getComandaFinalizada(connection);
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
    //Para solicitar todas las comandas por socket
    socket.on('solicitarComandasIniciales', async () => {

        const comandes = await getComandesProductes(connection);
        const comandesJson = JSON.parse(comandes);

        socket.emit('getComandas', JSON.stringify(comandesJson));


    });

    //Para solicitar todas las comandas aceptadas por socket
    socket.on('solicitarComandasAceptadasIniciales', async () => {

        const comandes = await getComandaAceptada(connection);
        const comandesJson = JSON.parse(comandes);

        socket.emit('getComandasAceptadas', JSON.stringify(comandesJson));


    });

    //Para solicitar todas las comandas finalizadas por socket
    socket.on('solicitarComandasFinalizadasIniciales', async () => {

        const comandes = await getComandaFinalizada(connection);
        const comandesJson = JSON.parse(comandes);

        socket.emit('getComandasFinalizadas', JSON.stringify(comandesJson));


    });
   

    //Para solicitar todas los productos por socket
    socket.on('solicitarProductosIniciales', async () => {
        const result = await getProductes(connection);
        const productesJson = JSON.parse(result);

        const fitxers = await comprobarExistencia(ubicacioArxius);
        for (let i = 0; i < productesJson.length; i++) {
            const foto = base64_encode(ubicacioArxius + fitxers[i]);
            productesJson[i].foto = foto;
        }

        socket.emit('getProductes', JSON.stringify(productesJson));
    });

    //Para updatear el estado de los productos por socket
    socket.on('updateEstatProductes', async (id,estat) => {
        updateEstatProducte(connection, id, estat);      

       
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

    // Escuchar la solicitud de comanda rebutjada
    socket.on('comandaRebutjada', (id, estat) => {
        console.log('comanda rebutjada numero : ' + id)
        console.log('estado : ' + estat)
        // Aquí puedes procesar la información (id y estat) como desees
        // Por ejemplo, guardar el estado de la comanda en tu fuente de datos
        // y luego enviar una respuesta al cliente
        updateEstatComanda(connection, id, estat); // Llama a la funcion para cambiar el estado en la BD a aceptada        

    });

    // Escuchar la solicitud de comanda finalitzada
    socket.on('comandaFinalitzada', (id, estat,temps) => {
        console.log('comanda finalitzada numero : ' + id)
        console.log('estado : ' + estat)
        // Aquí puedes procesar la información (id y estat) como desees
        // Por ejemplo, guardar el estado de la comanda en tu fuente de datos
        // y luego enviar una respuesta al cliente
        updateEstatComanda(connection, id, estat); // Llama a la funcion para cambiar el estado en la BD a finalitzada        
        updateTempsComanda(connection, id, temps)// Llama a la funcion para añadir el tiempo de preparacion de la comanda       
    });

    // Escuchar la solicitud de comanda recollida
    socket.on('comandaRecollida', (id, estat) => {
        console.log('comanda recollida numero : ' + id)
        console.log('estado : ' + estat)
        // Aquí puedes procesar la información (id y estat) como desees
        // Por ejemplo, guardar el estado de la comanda en tu fuente de datos
        // y luego enviar una respuesta al cliente
        updateEstatComanda(connection, id, estat); // Llama a la funcion para cambiar el estado en la BD a aceptada        

    });
    
    

    // Resto de la lógica de tu aplicación...
})// Manejar la conexión de sockets

//-----------funcions auxiliars-------------------//

async function descargarImagen(url, rutaImagen,) {
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
async function comprobarExistencia(fotografia) {
    console.log("hola")
    return new Promise((resolve, reject) => {
        fs.readdir(fotografia, function (err, archivos) {
            console.log("hola2")
            if (err) {
                console.log('Error al leer el directorio');
            } else {
                console.log(archivos)
                resolve(archivos);
            }

        })
    })
}//llegir el directori de fotografies 
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
async function comensarPython() {
    console.log("dintre de la generacio de grafics")
    //passar dades
    data={
        productos:[],
        comandas:[]
        }
    productos=getProductes(connection).then((productos) => {
        productos=JSON.parse(productos)
        data.productos=productos
        console.log("369")
        comandas=getComandesSenceres(connection).then((comandas) => {
            comandas=JSON.parse(comandas)
            data.comandas=comandas
            console.log("373")
            //generar grafics
            console.log(arxiuPython)
            //console.log(data)
            data=JSON.stringify(data)
            console.log("377")
            
            py=spawn('python', [arxiuPython, data])
            py.stdout.on('data', (data) => {
                console.log(`Resultado de Python: ${data}`);
            });
            py.stderr.on('data', (data) => {
                console.error(`Error: ${data}`);
            });
        })
    })
    
    
}
app.get('/py', function(req, res){
    console.log("entrant a python")
    //generar grafics
    comensarPython().then(()=>{
    //passar grafics
    arxiu={"titol":"", "foto":""}
    arxius=[]
    /*comprobarExistencia(ubicacioGrafics).then((grafics)=>{
        for(var i=0; i<grafics.length; i++){
            arxiu=
            {
                titol:grafics[i],
                foto:base64_encode[ubicacioGrafics+"/"+grafics[i]]
            }
            arxius[i]=arxiu
        }
        arxius=JSON.parse(arxius)
        res.json(arxius)})*/
    })
})
//setInterval(comensarPython, 24 * 60 * 60 * 1000);

//movil - node-> enviar usuari, demanar productes i enviar comanda
//vue - node -> demanar i enviar productes i comandes

