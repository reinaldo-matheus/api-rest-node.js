import { Readable } from "node:stream";

class OneHundreadStream extends Readable {
  index = 1;

  _read() {
    const i = this.index++;

    setTimeout(() => {
      if (i > 5) {
        this.push(null);
      } else {
        const buf = Buffer.from(String(i)); // Converte o número para uma string e depois para um buffer

        this.push(buf);
      }
    }, 1000);
  }
}

fetch("http://localhost:3334", {
  method: "POST",
  body: new OneHundreadStream(), // Cria uma instância do OneHundredStream e a usa como corpo da requisição
})
  .then((res) => {
    return res.text();
  })
  .then((data) => {
    console.log(data);
  });
