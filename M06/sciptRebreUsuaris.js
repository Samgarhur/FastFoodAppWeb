const mysql = require('mysql2/promise');

async function obtenerUsuarios() {
    const connection = await mysql.createConnection({
        host: "dam.inspedralbes.cat",
        user: "a22albcormad_botigaG7",
        password: "botigaG7",
        database: "a22albcormad_BotigaG7"
    });

    try {
        const [rows, fields] = await connection.execute('SELECT id_usuari, usuario, passwd FROM Usuari');
        const usuariosJSON = JSON.stringify(rows);
        return usuariosJSON;
    } catch (error) {
        console.error('Error al obtenir usuaris:', error.message);
        throw error;
    } finally {
        if (connection) {
            connection.end();
        }
    }
}


obtenerUsuarios()
    .then(usuariosJSON => {
        console.log('Usuaris:', usuariosJSON);
    })
    .catch(error => {
        console.error('Error:', error.message);
    });
