import * as vscode from 'vscode';
import { ConnectionConfiguration } from '../models/ConnectionConfiguration';

export function getSettings() {
    return vscode.workspace.getConfiguration('vscode-webpack');
}

export function getDbConfigs(settings: vscode.WorkspaceConfiguration = getSettings()) {
    const currentConfigurations = settings.get<Array<ConnectionConfiguration>>('connections') || [];
    return currentConfigurations;
}
