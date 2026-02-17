const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const fs = require("fs");

const HESAPLAR_PATH = path.join(__dirname, "hesaplar.json");

function hesaplariOku() {
    try {
        if (fs.existsSync(HESAPLAR_PATH)) {
            return JSON.parse(fs.readFileSync(HESAPLAR_PATH, "utf-8"));
        }
    } catch (e) {}
    return [];
}

function hesaplariKaydet(hesaplar) {
    fs.writeFileSync(HESAPLAR_PATH, JSON.stringify(hesaplar, null, 2), "utf-8");
}

let mainWindow;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 700,
        height: 620,
        resizable: false,
        webPreferences: {
            preload: path.join(__dirname, "preload.js"),
            contextIsolation: true,
            nodeIntegration: false
        },
        icon: path.join(__dirname, "icon.png"),
        autoHideMenuBar: true
    });

    mainWindow.loadFile("index.html");
}

app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
    app.quit();
});

// Token ekle
ipcMain.handle("token-ekle", (event, token) => {
    const hesaplar = hesaplariOku();
    if (hesaplar.includes(token)) return { ok: false, mesaj: "Bu token zaten ekli." };
    hesaplar.push(token);
    hesaplariKaydet(hesaplar);
    return { ok: true, hesaplar };
});

// Token sil
ipcMain.handle("token-sil", (event, index) => {
    const hesaplar = hesaplariOku();
    if (index >= 0 && index < hesaplar.length) {
        hesaplar.splice(index, 1);
        hesaplariKaydet(hesaplar);
    }
    return hesaplar;
});

// Tokenleri getir
ipcMain.handle("tokenleri-getir", () => {
    return hesaplariOku();
});

// Mesaj gönder
ipcMain.handle("mesaj-gonder", async (event, { mesaj, chID, chName }) => {
    const hesaplar = hesaplariOku();
    if (hesaplar.length === 0) return { ok: false, mesaj: "Hiç token eklenmemiş." };

    const sonuclar = [];

    const promises = hesaplar.map((token, i) =>
        fetch(`https://kick.com/api/v2/messages/send/${chID}`, {
            method: "POST",
            headers: {
                "accept": "application/json",
                "accept-language": "tr-TR,tr;q=0.9,en-US;q=0.8,en;q=0.7",
                "authorization": token,
                "content-type": "application/json",
                "origin": "https://kick.com",
                "referer": `https://kick.com/${chName}`,
                "user-agent":
                    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36"
            },
            body: JSON.stringify({
                content: mesaj,
                type: "message",
                message_ref: Date.now().toString() + "_" + i
            })
        })
            .then(res => res.text())
            .then(text => { sonuclar.push(`Hesap ${i + 1}: ${text}`); })
            .catch(err => { sonuclar.push(`Hesap ${i + 1}: HATA - ${err.message}`); })
    );

    await Promise.all(promises);
    return { ok: true, sonuclar };
});
