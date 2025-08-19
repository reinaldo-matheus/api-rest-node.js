// process.stdin.pipe(process.stdout)

import { Readable, Transform, Writable } from "node:stream";

class OneHundreadStream extends Readable {
  index = 1;

  _read() {
    const i = this.index++;

    setTimeout(() => {
      if (i > 100) {
        this.push(null);
      } else {
        const buf = Buffer.from(String(i)); // Converte o número para uma string e depois para um buffer

        this.push(buf);
      }
    }, 1000);
  }
}

class InverseNumberStream extends Transform {
  _transform(chunk, ecoding, callback) {
    const transformed = Number(chunk.toString()) * -1;

    callback(null, Buffer.from(String(transformed))); // Chama o callback com null como primeiro argumento para indicar que não houve erro, e o número transformado como segundo argumento
  }
}

class MultiplyByTenStream extends Writable {
  _write(chunk, encoding, callback) {
    console.log(chunk.toString() * 10);
    callback();
  }
}

new OneHundreadStream()
  .pipe(new InverseNumberStream()) // Cria uma instância do OneHundredStream e a conecta ao InverseNumberStream
  .pipe(new MultiplyByTenStream()); // Cria uma instância do OneHundredStream e a conecta ao processo de saída padrão
