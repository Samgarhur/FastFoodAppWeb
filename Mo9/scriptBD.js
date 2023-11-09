const mysql = require('mysql2/promise');
module.exports = {getUsuarisLogin, getComandasUsuario, registrarUsuari,updateUsuario, insertComanda, getProductes, getComandesSenceres, getComandaAceptada,getComandaFinalizada,getComandesProductes, getUsuariInfo, insertProducte, getNumComanda, deleteProducte, getNumProductes,updateProducte,updateEstatProducte,updateEstatComanda,updateTempsComanda};
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

async function getUsuariInfo(connection, user) {
    try {
        const [rows, fields] = await connection.execute('SELECT * FROM Usuari WHERE usuario='+"'"+user+"'");
        const usuariosJSON = JSON.stringify(rows);
        console.log("a:"+usuariosJSON)
        return usuariosJSON;
    } catch (error) {
        console.error('Error al obtener usuarios:', error.message);
        throw error;
    }
}

async function registrarUsuari(connection, usuari){
    try {
        // INSERT
        console.log(usuari)
        const { usuario, nom, cognom, passwd, nTargeta, cvv, dataCaducitat, correu } = usuari;
        const [result] = await connection.execute(
            'INSERT INTO Usuari (usuario, nom, cognoms, passwd, nTargeta, CVV, DataCaducitat, correu) VALUES (?,?,?,?,?,?,?,?)',
            [usuario, nom, cognom, passwd, nTargeta, cvv, dataCaducitat, correu]
        );

        // Casos Error
        if (result.affectedRows === 1) {
            return true;
        } else {
            return false;
        }
    } catch (error) {
        console.error('Error al insertar usuari:', error.message);
        throw error;
    }
}

async function updateUsuario (connection,usuari){
    try{
        console.log("BASE");
        console.log(usuari);
        const {usuario, nom, cognoms, passwd, nTargeta, CVV, DataCaducitat, correu,id_usuari } = usuari;
        const params = [usuario,nom, cognoms, passwd, nTargeta, CVV, DataCaducitat, correu];
        const updatedParams = params.map(param => (param !== undefined ? param : null));


        const [result] = await connection.execute(
            `UPDATE Usuari SET usuario = ?, nom = ?, cognoms=?, passwd = ?, nTargeta = ?, CVV=?, DataCaducitat=?,correu=? WHERE id_usuari = ?`,
            [...updatedParams,id_usuari]
        );
        console.log("Número de filas actualizadas:", result.affectedRows);
    }catch(error){
        console.log("Error al actualizar: ",error.message);
    }
}
/*-------------------Comandes------------------*/


async function getComandesSenceres(connection) {
    try {
        const [rows, fields] = await connection.execute('SELECT * FROM Comanda ');
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
            SELECT C.id_comanda, C.id_usuari, U.usuario as nombre_usuario, P.nom AS nombre_producto, CP.quantitat
            FROM Comanda_Producte CP
            JOIN Comanda C ON CP.id_comanda = C.id_comanda
            JOIN Producte P ON CP.id_producte = P.id_producte
            JOIN Usuari U ON C.id_usuari = U.id_usuari
            WHERE C.estat = "rebut";
        `;
        
        const [rows, fields] = await connection.execute(queryString);

        // Organizar los resultados por id_comanda
        const comandesOrganizados = rows.reduce((result, row) => {
            const { id_comanda, id_usuari, nombre_usuario, nombre_producto, quantitat } = row;

            if (!result[id_comanda]) {
                result[id_comanda] = {
                    id_comanda,
                    id_usuari,
                    nombre_usuario,
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
async function getNumComanda(connection) {
    try {
        const [rows, fields] = await connection.execute('SELECT MAX(id_comanda) FROM Comanda  ');
        const productosJSON = JSON.stringify(rows);
        console.log("obtingut!")
        return productosJSON;
    } catch (error) {
        console.error('Error al obtenir les comandes:', error.message);
        throw error;
    }
}
async function insertComanda(connection, comandaData) {
    try {
        // INSERT
        console.log(comandaData)
        const { id_usuari, productes, hora_recollida, dia_recollida  } = comandaData;
        const [result] = await connection.execute(
            'INSERT INTO Comanda (id_usuari, hora_recollida,dia_recollida ) VALUES (?,?,?)',
            [id_usuari,hora_recollida,dia_recollida]
        );

        //Obtenir id comanda de la comanda inserida
        const id_comanda = result.insertId;
        console.log(id_comanda)
        console.log("insertant productes...")
        console.log(productes)
        await insertProdComand(connection, productes, id_comanda);

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

async function insertProdComand(connection, productes, id_comanda) {
    console.log("seguim insertant productes...")
    try {
        console.log(productes.length)
        console.log("tercer missatge...")
        // INSERT
        for (let i = 0; i < productes.length; i++) {
            let id_producte = productes[i].id
            let cantidad = productes[i].cantidad
            console.log("insertant ")
            const [result] = await connection.execute(
                'INSERT INTO Comanda_Producte (id_comanda, id_producte, quantitat) VALUES (?, ?, ?)',
                [id_comanda, id_producte, cantidad]
            );
            const [result2] = await connection.execute('UPDATE Producte SET num_comprat = num_comprat + ? WHERE id_producte = ?', [cantidad, id_producte]);

            // Casos para mostrar error
            if (result.affectedRows === 1) {
                console.log("insertat");
            } else {
                console.log("no instertat");
            }
            if (result2.affectedRows === 1) {
                console.log("insertat");
            } else {
                console.log("no instertat");
            }
        }
    } catch (error) {
        console.error('Error al insertar comanda:', error.message);
        throw error;
    }
}


async function getComandaFinalizada(connection) {
        try {
            const queryString = `
                SELECT C.id_comanda, C.id_usuari,C.data_comanda, U.usuario as nombre_usuario, P.nom AS nombre_producto, CP.quantitat
                FROM Comanda_Producte CP
                JOIN Comanda C ON CP.id_comanda = C.id_comanda
                JOIN Producte P ON CP.id_producte = P.id_producte
                JOIN Usuari U ON C.id_usuari = U.id_usuari           
                WHERE C.estat = "finalitzada";
            `;
            
            const [rows, fields] = await connection.execute(queryString);
    
            // Organizar los resultados por id_comanda
            const comandesOrganizados = rows.reduce((result, row) => {
                const { id_comanda, id_usuari, data_comanda, nombre_usuario, nombre_producto, quantitat } = row;
    
                if (!result[id_comanda]) {
                    result[id_comanda] = {
                        id_comanda,
                        id_usuari,
                        data_comanda,
                        nombre_usuario,
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
            console.error('Error al obtener las comandas finalizadas:', error.message);
            throw error;
        }
    }
async function getComandasUsuario(connection, id) {
        try {
            const queryString = `
                SELECT C.id_comanda, C.id_usuari, C.data_comanda, C.estat, U.usuario as nombre_usuario, P.nom AS nombre_producto, CP.quantitat
                FROM Comanda_Producte CP
                JOIN Comanda C ON CP.id_comanda = C.id_comanda
                JOIN Producte P ON CP.id_producte = P.id_producte
                JOIN Usuari U ON C.id_usuari = U.id_usuari           
                WHERE C.id_usuario = ?; ,` [id];
            ;
            
            const [rows, fields] = await connection.execute(queryString);
    
            // Organizar los resultados por id_comanda
            const comandesOrganizados = rows.reduce((result, row) => {
                const { id_comanda, id_usuari, data_comanda, estat, nombre_usuario, nombre_producto, quantitat } = row;
    
                if (!result[id_comanda]) {
                    result[id_comanda] = {
                        id_comanda,
                        id_usuari,
                        data_comanda,
                        estat,
                        nombre_usuario,
                        productos: [],
                    };
                }
    
                result[id_comanda].productos.push({
                    nombre_producto,
                    quantitat,
                });
                console.log(result)
    
                return result;
            }, {});
    
            // Convertir a JSON
            const comandesJSON = JSON.stringify(Object.values(comandesOrganizados));
            return comandesJSON;
        } catch (error) {
            console.error('Error al obtener las comandas finalizadas:', error.message);
            throw error;
        }
    }


async function getComandaAceptada(connection) {
    try {
        const queryString = `
            SELECT C.id_comanda, C.id_usuari,C.data_comanda, U.usuario as nombre_usuario, P.nom AS nombre_producto, CP.quantitat
            FROM Comanda_Producte CP
            JOIN Comanda C ON CP.id_comanda = C.id_comanda
            JOIN Producte P ON CP.id_producte = P.id_producte
            JOIN Usuari U ON C.id_usuari = U.id_usuari            
            WHERE C.estat = "aceptada";
        `;
        
        const [rows, fields] = await connection.execute(queryString);

        // Organizar los resultados por id_comanda
        const comandesOrganizados = rows.reduce((result, row) => {
            const { id_comanda, id_usuari, data_comanda, nombre_usuario, nombre_producto, quantitat } = row;

            if (!result[id_comanda]) {
                result[id_comanda] = {
                    id_comanda,
                    id_usuari,
                    data_comanda,
                    nombre_usuario,
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
        console.error('Error al obtener las comandas aceptadas:', error.message);
        throw error;
    }
}


async function updateEstatComanda(connection, id_comanda, estat) {
    try {
        const [rows, fields] = await connection.execute('UPDATE Comanda SET estat = ? WHERE id_comanda = ?', [estat, id_comanda]);
        return rows.affectedRows;
    } catch (error) {
        console.error('Error al actualizar el estat de la comanda:', error.message);
        throw error;
    }
}

async function updateTempsComanda(connection, id_comanda, temps) {
    try {
        const [rows, fields] = await connection.execute('UPDATE Comanda SET temps = ? WHERE id_comanda = ?', [temps, id_comanda]);
        return rows.affectedRows;
    } catch (error) {
        console.error('Error al actualizar el estat de la comanda:', error.message);
        throw error;
    }
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

async function getNumProductes(connection) {
    try {
        const [rows, fields] = await connection.execute('SELECT MAX(id_producte) FROM Producte  ');
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
        let { nom, descripcio, preu, estat, tipus_producte, foto} = producteData;      
            foto=null;
          
        const [result] = await connection.execute(
            'INSERT INTO Producte ( nom, descripcio, preu, estat, tipus_producte, foto) VALUES ( ?, ?, ?, ?, ?, ?)',
            [ nom, descripcio, preu, estat, tipus_producte, foto]
        );


        // Casos d'error
        if (result.affectedRows === 1) {
            return true;
        } else {
            return false;
        }
    } catch (error) {
        console.error('Error al inserir el producte:', error.message);
        throw error;
    }
}


async function deleteProducte(connection, id_producte) {
    try {
        const [result] = await connection.execute(
            'DELETE FROM Producte WHERE id_producte = ?',
            [id_producte]
        );


        if (result.affectedRows === 1) {
            return 'Poducte eliminat';
        } else {
            return 'No es pot eliminar';
        }
    } catch (error) {
        console.error('Error al eliminar el producte:', error.message);
        throw error;
    }
}

//Update Productes (prova)
async function updateProducte(connection, id_producte, producteData) {
try {
    console.log(producteData)
        let { nom, descripcio, preu, estat, foto, tipus_producte } = producteData;

        foto=null;
        const [result] = await connection.execute(
            'UPDATE Producte SET nom = ?, descripcio = ?, preu = ?, estat = ?, foto = ?, tipus_producte = ? WHERE id_producte = ?',
            [nom, descripcio, preu, estat, foto, tipus_producte, id_producte]
        );

        if (result.affectedRows === 1) {
            console.log( 'Producte actualitzat');
        } else {
            console.log('No es pot actualitzar el producte');
        }
    } catch (error) {
        console.error('Error al actualitzar el producte:', error.message);
        throw error;
    }
}



async function updateEstatProducte(connection, id_producte, setEstat) {
    try {
        const [result] = await connection.execute(
            'UPDATE Producte SET estat = ? WHERE id_producte = ?',
            [setEstat, id_producte]
        );


        if (result.affectedRows === 1) {
            return 'Estat Actualitzat.';
        } else {
            return 'No es pot Actualitzar el estat.';
        }
    } catch (error) {
        console.error('Error al actualizar el estat del producte:', error.message);
        throw error;
    }
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
