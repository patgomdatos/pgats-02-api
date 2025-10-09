import http from 'k6/http';
import { sleep, check } from 'k6';
import { pegarBaseURL } from './utils/variaveis.js'

//Tipos de teste usando Stages: AVERAGE
export const options = {
     stages: [
        { duration: '30s', target: 50 },
        { duration: '60s', target: 50 },
        { duration: '30s', target: 0 }    
      ],
  //iterations: 1,
  thresholds: {
    http_req_duration: ['p(90)<3000', 'max<50000'],
    http_req_failed: ['rate<0.01']
  }
};

    export default function () {
    const url = pegarBaseURL() + '/users';

    const params = {
        headers: {
        'Content-Type': 'application/json',
        },
    };

    const res = http.get(url, params);

    //console.log(JSON.stringify(res.json(), null, 2));
    check(res, {
        'Status é 200': (r) => r.status === 200,
         //Valida que a lista não está vazia 
        'Array não está vazio': (r) => r.json().length > 0
    })

    sleep(1);

    }