const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

async function calistir(mesaj) {

    const chID = "85227292"
    const chName = "aminakodumunevladi"

    const chCookies = [
        "",
        "",
        "",
        ""
    ]

    const chAuth = [
        "Bearer 322426448|yla29mOyBBMQgek3mLbVhrbgdk9SqgTIoRxNojLR",
        "",
        "",
        ""
    ]

    const p1 = fetch(
        `https://kick.com/api/v2/messages/send/${chID}`,
        {
            method: "POST",
            headers: {
                "accept": "application/json",
                "accept-language": "tr-TR,tr;q=0.9,en-US;q=0.8,en;q=0.7",
                "authorization": `${chAuth[0]}`,
                "content-type": "application/json",
                "origin": "https://kick.com",
                "referer": `https://kick.com/${chName}`,
                "user-agent":
                    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36",
                "cookie": `${chCookies[0]}`
            },
            body: JSON.stringify({
                content: mesaj,
                type: "message",
                message_ref: Date.now().toString()
            })
        }
    );

    const p2 = fetch(
        `https://kick.com/api/v2/messages/send/${chID}`,
        {
            method: "POST",
            headers: {
                "accept": "application/json",
                "accept-language": "tr-TR,tr;q=0.9,en-US;q=0.8,en;q=0.7",
                "authorization": `${chAuth[1]}`,
                "content-type": "application/json",
                "origin": "https://kick.com",
                "referer": `https://kick.com/${chName}`,
                "user-agent":
                    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36",
                "cookie": `${chCookies[1]}`
            },
            body: JSON.stringify({
                content: mesaj,
                type: "message",
                message_ref: Date.now().toString()
            })
        }
    );

    const p3 = fetch(
        `https://kick.com/api/v2/messages/send/${chID}`,
        {
            method: "POST",
            headers: {
                "accept": "application/json",
                "accept-language": "tr-TR,tr;q=0.9,en-US;q=0.8,en;q=0.7",
                "authorization": `${chAuth[2]}`,
                "content-type": "application/json",
                "origin": "https://kick.com",
                "referer": `https://kick.com/${chName}`,
                "user-agent":
                    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36",
                "cookie": `${chCookies[2]}`
            },
            body: JSON.stringify({
                content: mesaj,
                type: "message",
                message_ref: Date.now().toString()
            })
        }
    );

    const p4 = fetch(
        `https://kick.com/api/v2/messages/send/${chID}`,
        {
            method: "POST",
            headers: {
                "accept": "application/json",
                "accept-language": "tr-TR,tr;q=0.9,en-US;q=0.8,en;q=0.7",
                "authorization": `${chAuth[3]}`,
                "content-type": "application/json",
                "origin": "https://kick.com",
                "referer": `https://kick.com/${chName}`,
                "user-agent":
                    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36",
                "cookie": `${chCookies[3]}`
            },
            body: JSON.stringify({
                content: mesaj,
                type: "message",
                message_ref: Date.now().toString()
            })
        }
    );

    const [res, res2, res3, res4] = await Promise.all([p1, p2, p3, p4]);

    const [text, text2, text3, text4] = await Promise.all([
        res.text(),
        res2.text(),
        res3.text(),
        res4.text()
    ]);

    console.log(text)
    console.log(text2)
    console.log(text3)
    console.log(text4)

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

    // tekrar mesaj iste
    mesajSor();
  });
}

console.log("Program başladı (çıkmak için 'exit' yaz)");
mesajSor();