// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
import { ipcRenderer, contextBridge } from 'electron';
export const sendMessage = (message: string) => {
    ipcRenderer.send(message);
}

contextBridge.exposeInMainWorld('sendMessage', sendMessage);
