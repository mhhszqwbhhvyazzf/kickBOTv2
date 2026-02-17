const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

async function calistir(mesaj) {

    const chID = "85227292"
    const chName = "aminakodumunevladi"

    const chAuth = [
        "",
        "",
        "",
        ""
    ]

    const chCookies = Array(chAuth.length).fill("");

    const promises = chCookies.map((cookie, i) =>
        fetch(`https://kick.com/api/v2/messages/send/${chID}`, {
            method: "POST",
            headers: {
                "accept": "application/json",
                "accept-language": "tr-TR,tr;q=0.9,en-US;q=0.8,en;q=0.7",
                "authorization": chAuth[i],
                "content-type": "application/json",
                "origin": "https://kick.com",
                "referer": `https://kick.com/${chName}`,
                "user-agent":
                    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36",
                "cookie": cookie
            },
            body: JSON.stringify({
                content: mesaj,
                type: "message",
                message_ref: Date.now().toString()
            })
        })
    );

    const responses = await Promise.all(promises);
    const texts = await Promise.all(responses.map(res => res.text()));

    texts.forEach(text => console.log(text));

    console.log("Başarılı!\n");
}

function mesajSor() {
  rl.question("Mesaj: ", async (mesaj) => {
    if (mesaj.trim().toLowerCase() === "exit") {
      console.log("Çıkılıyor...");
      rl.close();
      return;
    }

    try {
      await calistir(mesaj);
    } catch (err) {
      console.error("Hata:", err);
    }

    mesajSor();
  });
}

console.log("Program başladı (çıkmak için 'exit' yaz)");
mesajSor();