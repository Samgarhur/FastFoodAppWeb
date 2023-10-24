const mysql = require('mysql2/promise');
module.exports = {obtenerUsuarios, insertComanda}; 
// Connexio a la base de dades
const connection = mysql.createPool({
    host: "dam.inspedralbes.cat",
    user: "a22albcormad_botigaG7",
    password: "botigaG7",
    database: "a22albcormad_BotigaG7"
});

async function obtenerUsuarios(connection) {
    try {
        const [rows, fields] = await connection.execute('SELECT id_usuari, usuario, passwd FROM Usuari');
        const usuariosJSON = JSON.stringify(rows);
        return usuariosJSON;
    } catch (error) {
        console.error('Error al obtener usuarios:', error.message);
        throw error;
    }
}

async function insertComanda(connection, comandaData) {
    try {
        // INSERT
        console.log(comandaData)
        const { id_comanda, id_usuari, data_comanda, estat } = comandaData;
        const [result] = await connection.execute(
            'INSERT INTO Comanda (id_comanda, id_usuari, data_comanda, estat) VALUES (?, ?, ?, ?)',
            [id_comanda, id_usuari, data_comanda, estat]
        );

        // Casos Error
        if (result.affectedRows === 1) {
            return true;
        } else {
            return false;
        }
    } catch (error) {
        console.error('Error al insertar comanda:', error.message);
        throw error;
    }
}
async function obtenirProductes(connection) {
    try {
        const [rows, fields] = await connection.execute('SELECT id_producte , nom , descripcio , preu ,  estat FROM Producte');
        const productosJSON = JSON.stringify(rows);
        return productosJSON;
    } catch (error) {
        console.error('Error al obtenir els productes:', error.message);
        throw error;
    }
}

async function insertProducte(connection, producteData) {
    try {
        // INSERT
        const {id_producte, nom, descripcio, preu, estat} = producteData;
        const [result] = await connection.execute(
            'INSERT INTO Producte (id_producte, nom, descripcio, preu, estat) VALUES (?, ?, ?, ?, ?)',
            [id_producte, nom, descripcio, preu, estat]
        );

        // Casos d'error
        if (result.affectedRows === 1) {
            return 'Producte inserit correctament.';
        } else {
            return 'No sha pogut inserir el producte.';
        }
    } catch (error) {
        console.error('Error al inserir el producte:', error.message);
        throw error;
    }
}

/* 
//Constant del producte
const producteData = {
    id_producte: 3,
    nom: "Patatas",
    descripcio: "Patatas deluxe",
    preu: 4.50,
    estat: true
};

//Inserir el producte
insertProducte(connection, producteData)
    .then(resultado => {
        console.log(resultado);
    })
    .catch(error => {
        console.error('Error:', error.message);
    });
*/

/*
//Fer select de productes
obtenirProductes(connection)
    .then(productosJSON => {
        console.log('Productos:', productosJSON);
        connection.end();
    })
    .catch(error => {
        console.error('Error:', error.message);
    });
*/


// Exemple us
/*const comandaData = {
    id_comanda:1,
    id_usuari: 1,
    data_comanda: new Date(),
    estat: true
};

insertComanda(connection, comandaData)
    .then(resultado => {
        console.log(resultado);
    })
    .catch(error => {
        console.error('Error:', error.message);
    });


obtenerUsuarios(connection)
    .then(usuariosJSON => {
        console.log('Usuaris:', usuariosJSON);
    })
    .catch(error => {
        console.error('Error:', error.message);
    });
*/
