const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electron', {
    contactShow: () => ipcRenderer.send('contact-show'),
    send: (channel, formData) => ipcRenderer.send(channel, formData),
    on:(channel, func) => ipcRenderer.on(channel, (event, ...args) => func(...args)),
    onChatUpdate: (callback) => ipcRenderer.on('new-chat', callback),
    getChats: (callback) => ipcRenderer.on('get-chats', callback),
    loadChats: (callback) => ipcRenderer.on('load-chats', callback),
    sendToken: (callback) => ipcRenderer.on('load-token', callback),
    authResp: (callback) => ipcRenderer.on('authresp', callback)
})
