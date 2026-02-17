const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("api", {
    tokenEkle: (token) => ipcRenderer.invoke("token-ekle", token),
    tokenSil: (index) => ipcRenderer.invoke("token-sil", index),
    tokenleriGetir: () => ipcRenderer.invoke("tokenleri-getir"),
    mesajGonder: (data) => ipcRenderer.invoke("mesaj-gonder", data)
});
