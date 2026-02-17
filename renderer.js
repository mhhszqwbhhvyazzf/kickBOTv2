const tokenInput = document.getElementById("tokenInput");
const tokenEkleBtn = document.getElementById("tokenEkleBtn");
const tokenBildirim = document.getElementById("tokenBildirim");
const tokenListEl = document.getElementById("tokenList");
const mesajInput = document.getElementById("mesajInput");
const gonderBtn = document.getElementById("gonderBtn");
const logArea = document.getElementById("logArea");
const chIDInput = document.getElementById("chID");
const chNameInput = document.getElementById("chName");

function bildirimGoster(mesaj, tip) {
    tokenBildirim.textContent = mesaj;
    tokenBildirim.className = "bildirim " + tip;
    setTimeout(() => { tokenBildirim.textContent = ""; tokenBildirim.className = "bildirim"; }, 3000);
}

function tokenListesiGuncelle(hesaplar) {
    tokenListEl.innerHTML = "";
    if (hesaplar.length === 0) {
        tokenListEl.innerHTML = '<div class="token-bos">Henüz token eklenmedi.</div>';
        return;
    }
    hesaplar.forEach((token, i) => {
        const div = document.createElement("div");
        div.className = "token-item";

        const span = document.createElement("span");
        const gizli = token.length > 20
            ? token.slice(0, 10) + "••••••" + token.slice(-6)
            : token;
        span.textContent = `${i + 1}. ${gizli}`;
        span.title = token;

        const btn = document.createElement("button");
        btn.className = "sil-btn";
        btn.textContent = "Sil";
        btn.onclick = async () => {
            const yeniListe = await window.api.tokenSil(i);
            tokenListesiGuncelle(yeniListe);
            bildirimGoster("Token silindi.", "basarili");
        };

        div.appendChild(span);
        div.appendChild(btn);
        tokenListEl.appendChild(div);
    });
}

async function tokenEkle() {
    const token = tokenInput.value.trim();
    if (!token) {
        bildirimGoster("Token boş olamaz!", "hata");
        return;
    }
    const sonuc = await window.api.tokenEkle(token);
    if (sonuc.ok) {
        tokenInput.value = "";
        tokenListesiGuncelle(sonuc.hesaplar);
        bildirimGoster("Token eklendi!", "basarili");
    } else {
        bildirimGoster(sonuc.mesaj, "hata");
    }
}

tokenEkleBtn.addEventListener("click", tokenEkle);
tokenInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") tokenEkle();
});

function logYaz(mesaj, tip) {
    const span = document.createElement("span");
    span.className = tip === "basarili" ? "log-basarili" : tip === "hata" ? "log-hata" : "";
    span.textContent = mesaj + "\n";
    logArea.appendChild(span);
    logArea.scrollTop = logArea.scrollHeight;
}

async function mesajGonder() {
    const mesaj = mesajInput.value.trim();
    if (!mesaj) return;

    const chID = chIDInput.value.trim();
    const chName = chNameInput.value.trim();
    if (!chID || !chName) {
        logYaz("Kanal ID ve adı boş olamaz!", "hata");
        return;
    }

    gonderBtn.disabled = true;
    gonderBtn.textContent = "...";
    logArea.textContent = "";

    try {
        const sonuc = await window.api.mesajGonder({ mesaj, chID, chName });
        if (sonuc.ok) {
            sonuc.sonuclar.forEach(s => logYaz(s, "basarili"));
            logYaz("✓ Tüm hesaplara gönderildi!", "basarili");
            mesajInput.value = "";
        } else {
            logYaz(sonuc.mesaj, "hata");
        }
    } catch (err) {
        logYaz("Hata: " + err.message, "hata");
    }

    gonderBtn.disabled = false;
    gonderBtn.textContent = "Gönder";
    mesajInput.focus();
}

gonderBtn.addEventListener("click", mesajGonder);
mesajInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") mesajGonder();
});

// Başlangıçta tokenleri yükle
window.api.tokenleriGetir().then(tokenListesiGuncelle);
mesajInput.focus();
