import http from "node:http";
import { Database } from "./database.js";
import { json } from "./middlewares/json.js"; // Importa o middleware json para processar o corpo da requisição

const database = new Database(); // Importa a classe Database para manipulação de dados

const server = http.createServer(async (req, res) => {
  const { method, url } = req;

  await json(req, res); // Chama o middleware json para processar o corpo da requisição

  if (method === "GET" && url === "/users") {
    const users = database.select("users"); // Seleciona os usuários do banco de dados

    return res.end(JSON.stringify(users));
  }

  if (method === "POST" && url === "/users") {
    const { name, email } = req.body;

    const user = {
      id: 1,
      name,
      email,
    };

    database.insert("users", user); // Insere o usuário no banco de dados

    return res.writeHead(201).end(); // eese método é responsável por definir o status code da resposta HTTP
  }

  return res.writeHead(404).end(); // Se nenhum dos métodos ou URLs corresponder, retornamos um erro 404
});

server.listen(3333); //esse método inicia o servidor na porta 3333;

// const server = http.createServer((req, res) =>{
//     const { method, url } = req

//     if (method === 'GET' && url === '/users') {

//         return res.end('Funcionou, yhuuuu!') //early return:consiste //em retornar a resposta imediatamente, sem continuar a execução do código abaixo
//     }

//     if (method === 'POST' && url === '/users') {
//         return res.end('HELLO, yhuuuu!')
//     }

// })

// server.listen(3333)
