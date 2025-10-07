import http from 'k6/http';
import { sleep, check } from 'k6';
import { obterToken } from './helpers/autenticacao.js';
import { pegarBaseURL } from './utils/variaveis.js';
const postTransfer = JSON.parse(open('./fixtures/postTransfer.json'));

export const options = {
  iterations: 1
};

export default function() {

  const token = obterToken()

  const url = pegarBaseURL() + '/transfers';
  
  const bodyTransfers = { ...postTransfer};
  
  const payload = JSON.stringify(bodyTransfers);

 const params = {
        headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
        },
    };


  let res = http.post(url, payload, params);

  //console.log(JSON.stringify(res.json(), null, 2));
  check(res, {
    "Status é 201": (res) => res.status == 201,
    "'from' é string": (r) => typeof(r.json().from)  == 'string',
    "'to' é string": (r) => typeof(r.json().to)  == 'string',
    "'Value' é number": (r) => typeof(r.json().value)  == 'number',
    "'date' é string": (r) => typeof(r.json().date)  == 'string',

  });

  sleep(1);
}
