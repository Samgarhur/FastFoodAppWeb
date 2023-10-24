const mysql = require('mysql2/promise');

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
        const { id_comanda, id_usuari, data_comanda, estat } = comandaData;
        const [result] = await connection.execute(
            'INSERT INTO Comanda (id_comanda, id_usuari, data_comanda, estat) VALUES (?, ?, ?, ?)',
            [id_comanda, id_usuari, data_comanda, estat]
        );

        // Casos Error
        if (result.affectedRows === 1) {
            return 'Comanda insertada correctamente.';
        } else {
            return 'No se pudo insertar la comanda.';
        }
    } catch (error) {
        console.error('Error al insertar comanda:', error.message);
        throw error;
    }
}

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
