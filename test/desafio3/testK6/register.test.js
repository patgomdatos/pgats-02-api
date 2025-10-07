  import http from 'k6/http';
  import { sleep, check } from 'k6';
  import { pegarBaseURL } from './utils/variaveis.js';
  const { gerarUsuario } = require('./helpers/usuariosRandom.js');


  export const options = {
    iterations: 1
  };

  export default function() {

    const novoUsuario = gerarUsuario();

    const url = pegarBaseURL() + '/users/register';

    const payload = JSON.stringify(novoUsuario);

      const params = {
          headers: {
          'Content-Type': 'application/json',
          },
      };


    let res = http.post(url, payload, params);
    
    //console.log(JSON.stringify(res.json(), null, 2));
    check(res, {
      "Status é 201": (res) => res.status == 201,
      "'Saldo' é number": (r) => typeof(r.json().saldo) == 'number',
      "Valor do saldo é 10000": (r) => r.json().saldo == 10000,
    });

    sleep(1);
  }
