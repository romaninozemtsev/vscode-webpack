import * as mysql from 'mysql2/promise';

export let connection: mysql.Connection;

export async function establishConnection() {
    if (!connection) {
        connection = await mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: '',
            // If you are connecting to a named instance
            // socketPath: '/var/run/mysqld/mysqld.sock',
        });
        console.log("connection established");
    }
    return connection;
}
