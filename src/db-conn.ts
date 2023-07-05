import * as mysql from 'mysql2/promise';
import { ConnectionConfiguration } from './models/ConnectionConfiguration';

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


export async function establishConnectionWithConfig(connectionConfig: ConnectionConfiguration) {
    if (!connection) {
        connection = await mysql.createConnection({
            host: connectionConfig.host,
            user: connectionConfig.user,
            password: connectionConfig.password,
            database: connectionConfig.database,
            port: parseInt(connectionConfig.port)
        });
        console.log("connection established");
    }
    return connection;
}
