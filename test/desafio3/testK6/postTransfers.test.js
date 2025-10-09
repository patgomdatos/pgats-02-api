import http from 'k6/http';
import { sleep, check } from 'k6';
import { obterToken } from './helpers/autenticacao.js';
import { pegarBaseURL } from './utils/variaveis.js';
const postTransfer = JSON.parse(open('./fixtures/postTransfer.json'));

//Usado para testar error no rate parando o servidor
export const options = {

  thresholds: {
    http_req_duration: ['p(90)<3000', 'max<50000'],
    http_req_failed: ['rate<0.01']
  },
  iterations: 20,
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

  check(res, {
    "Status é 201": (res) => res.status === 201,

  });

  sleep(1);
}
