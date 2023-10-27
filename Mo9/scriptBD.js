const mysql = require('mysql2/promise');
module.exports = {getUsuarisLogin, insertComanda, getProductes, getComandes, getComandesProductes};
// Connexio a la base de dades
const connection = mysql.createPool({
    host: "dam.inspedralbes.cat",
    user: "a22albcormad_botigaG7",
    password: "botigaG7",
    database: "a22albcormad_BotigaG7"
});


async function getUsuarisLogin(connection) {
    try {
        const [rows, fields] = await connection.execute('SELECT id_usuari, usuario, passwd FROM Usuari');
        const usuariosJSON = JSON.stringify(rows);
        return usuariosJSON;
    } catch (error) {
        console.error('Error al obtener usuarios:', error.message);
        throw error;
    }
}


/*-------------------Comandes------------------*/


async function getComandes(connection) {
    try {
        const [rows, fields] = await connection.execute('SELECT * FROM Comanda WHERE  ');
        const comandasJSON = JSON.stringify(rows);
        return comandasJSON;
    } catch (error) {
        console.error('Error al obtener comandas:', error.message);
        throw error;
    }
}

async function getComandesProductes(connection) {
    try {
        const queryString = `
            SELECT C.id_comanda, P.nom AS nombre_producto, CP.quantitat
            FROM Comanda_Producte CP
            JOIN Comanda C ON CP.id_comanda = C.id_comanda
            JOIN Producte P ON CP.id_producte = P.id_producte
            WHERE C.estat IS NULL AND C.finalitzada = 0 AND C.recollida = 0;
        `;
        
        const [rows, fields] = await connection.execute(queryString);

        // Organizar los resultados por id_comanda
        const comandesOrganizados = rows.reduce((result, row) => {
            const { id_comanda, nombre_producto, quantitat } = row;

            if (!result[id_comanda]) {
                result[id_comanda] = {
                    id_comanda,
                    productos: [],
                };
            }

            result[id_comanda].productos.push({
                nombre_producto,
                quantitat,
            });

            return result;
        }, {});

        // Convertir a JSON
        const comandesJSON = JSON.stringify(Object.values(comandesOrganizados));
        return comandesJSON;
    } catch (error) {
        console.error('Error al obtener comandes:', error.message);
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


async function marcarComandaFinalizada(connection) {
}


async function marcarComandaRecogida(connection) {
}


async function getComandaFinalizada(connection) {
}


async function getComandaAceptada(connection) {
}


async function updateEstatComanda(connection) {
}


/*-------------------Productes------------------*/


async function getProductes(connection) {
    try {
        const [rows, fields] = await connection.execute('SELECT * FROM Producte');
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


async function deleteProducte(connection) {
}


async function addProducte(connection) {
}


async function updateProducte(connection) {
}




/*-------------------Proves------------------*/


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




//Fer select de productes
getProductes(connection)
    .then(productosJSON => {
        console.log('Productos:', productosJSON);
        connection.end();
    })
    .catch(error => {
        console.error('Error:', error.message);
    });


//Select comandes
getComandes(connection)
    .then(comandasJSON => {
        console.log('Comandas:', comandasJSON);
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
