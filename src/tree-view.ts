import * as vscode from 'vscode';
import * as mysql from 'mysql2/promise';

export class DatabaseProvider implements vscode.TreeDataProvider<BaseDatabaseItem> {

    constructor(private connection: mysql.Connection) {
        
    }

    getTreeItem(element: BaseDatabaseItem): vscode.TreeItem | Thenable<vscode.TreeItem> {
        return element;
    }

    getChildren(element?: BaseDatabaseItem): vscode.ProviderResult<BaseDatabaseItem[]> {
        if (element === undefined) {
            return this.getDatabases();
        }
        return element.getChildren();
    }

    private async getDatabases(): Promise<BaseDatabaseItem[]> {
        // Code to fetch the list of databases and return DatabaseItem array
        // return empty list for now
        return Promise.resolve([
            new ConnectionItem(
                this.connection,
                'localhost', 
                ''
            )
        ]);
    }
}

// class ColumnItem extends vscode.TreeItem {
//     constructor(
//         public readonly label: string,
//         readonly description?: string,
//     ) {
//         super(label, vscode.TreeItemCollapsibleState.None);
//             this.contextValue = 'column';
//         this.iconPath = new vscode.ThemeIcon('split-horizontal');

//     }
// }

class BaseDatabaseItem extends vscode.TreeItem {
    getChildren(): vscode.ProviderResult<BaseDatabaseItem[]> {
        throw new Error("Method not implemented.");
    }
}

class ColumnItem extends BaseDatabaseItem {
    constructor(
        public readonly label: string,
        readonly description?: string,
    ) {
        super(label, vscode.TreeItemCollapsibleState.None);
        this.contextValue = 'column';
        this.iconPath = new vscode.ThemeIcon('split-horizontal');
    }

    getChildren(): vscode.ProviderResult<BaseDatabaseItem[]> {
        return [];
    }
}


class TableItem extends BaseDatabaseItem {
    constructor(
        private readonly connection: mysql.Connection,
        private readonly dbSchemaName: string,
        public readonly label: string,
        readonly description?: string,
    ) {
        super(label, vscode.TreeItemCollapsibleState.Collapsed);
        this.contextValue = 'table';
        this.iconPath = new vscode.ThemeIcon('table');
    }

    async getChildren(): Promise<BaseDatabaseItem[]> {
        const [rows] = await this.connection.query(`DESCRIBE ${this.dbSchemaName}.${this.label}`);
            if (Array.isArray(rows)) {
                return rows.map((row: any) => {
                    return new ColumnItem(
                        row.Field,
                        `${row.Type}`
                    );
                });
            }
            return Promise.resolve([]);
        }
}

class DbItem extends BaseDatabaseItem {
    constructor(
        private readonly connection: mysql.Connection,
        public readonly label: string,
        readonly description?: string,
    ) {
        super(label, vscode.TreeItemCollapsibleState.Collapsed);
        this.contextValue = 'database';
        this.iconPath = new vscode.ThemeIcon('database');
    }

    async getChildren(): Promise<BaseDatabaseItem[]> {
        await this.connection.query('USE information_schema');
            // 
            const [rows] = await this.connection.query('select TABLE_NAME, TABLE_ROWS,TABLE_COMMENT from information_schema.tables where TABLE_SCHEMA = ?', [this.label]);
            if (Array.isArray(rows)) {
                return rows.map((row: any) => {
                    return new TableItem(
                        this.connection,
                        this.label,
                        row['TABLE_NAME'], 
                        `${row['TABLE_ROWS']}`);
                });
            }
            return Promise.resolve([]);
        }

}

class ConnectionItem extends BaseDatabaseItem {
    constructor(
        private readonly connection: mysql.Connection,
        public readonly label: string,
        readonly description?: string,
    ) {
        super(label, vscode.TreeItemCollapsibleState.Collapsed);
        this.contextValue = 'connection';
        this.iconPath = new vscode.ThemeIcon('server-process');
    }

    async getChildren(): Promise<BaseDatabaseItem[]> {
        const [rows] = await this.connection.query('SHOW DATABASES');
            if (Array.isArray(rows)) {
                return rows.map((row: any) => {
                    return new DbItem(
                        this.connection,
                        row.Database, 
                        ''
                    );
                });
            }
            return Promise.resolve([]);
        }
}
