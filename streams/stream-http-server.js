import http from "node:http";
import { Transform } from "node:stream";

class InverseNumberStream extends Transform {
  _transform(chunk, ecoding, callback) {
    const transformed = Number(chunk.toString()) * -1;

    callback(null, Buffer.from(String(transformed))); // Chama o callback com null como primeiro argumento para indicar que não houve erro, e o número transformado como segundo argumento
  }
}

//req => ReadableStream , ou seja, é possível ler dados da requisição
//res => WritableStream , e também é possível escrever dados na resposta

const server = http.createServer(async (req, res) => {
  const buffers = [];

  for await (const chunk of req) {
    buffers.push(chunk); // Lê os dados da requisição em pedaços (chunks) e os armazena no array buffers.
  }

  const fullStreamContent = Buffer.concat(buffers).toString(); // Concatena todos os buffers em um único buffer e converte para string
  console.log(fullStreamContent);

  return res.end(fullStreamContent); // Envia o conteúdo completo da requisição como resposta

  //return req
  // .pipe(new InverseNumberStream())
  // .pipe(res); // Conecta o fluxo de leitura da requisição ao fluxo de escrita da resposta
});

server.listen(3334);
