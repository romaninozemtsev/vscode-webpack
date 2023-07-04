// interface with 1. name, 2. host 3. port 4. database 5. user 6. password
export interface ConnectionConfiguration {
    name?: string;
    host: string;
    port: string;
    database?: string;
    user: string;
    password: string;
}
