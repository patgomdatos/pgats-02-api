const request = require('supertest');
const { expect } = require('chai');
const { obterToken } = require('./helpers/autenticacao')
const postLogin = require('./fixtures/postLogin.json')
const postTransfersMenor5000 = require('./fixtures/postTransfersMenor5000.json')
const postTransferMaior5000NaoFavorecido = require('./fixtures/postTransferMaior5000NaoFavorecido.json')
const postTransferMaior5000Favorecido = require('./fixtures/postTransferMaior5000Favorecido.json')


describe('Desafio transfers', () => {
    describe('POST /transfers', () => {
        let token
            
        beforeEach(async () => {
            token = await obterToken(postLogin)
        })

        it('Deve retornar sucesso com 201 quando o valor da transferencia for menor ou igual a R$ 5000,00', async () => {
            const bodyTransfers = { ...postTransfersMenor5000 }

            //console.log('Usuário enviado teste usuario registrado 201:', bodyTransfers);
            const resposta = await request(process.env.BASE_URL_REST)
                .post('/transfers')
                .set('Content-Type', 'application/json')
                .set('Authorization', `Bearer ${token}`)
                .send(bodyTransfers)

            expect(resposta.status).to.equal(201);

            expect(resposta.body).to.have.property('from');
            expect(resposta.body.from).to.be.a('string');

            expect(resposta.body).to.have.property('to');
            expect(resposta.body.to).to.be.a('string');
    
            expect(resposta.body).to.have.property('value');
            expect(resposta.body.value).to.be.a('number');

            expect(resposta.body).to.have.property('date');
            expect(resposta.body.date).to.be.a('string');

            //console.log(resposta.body)
        });

        it('Deve retornar error com 400 quando o valor da transferencia para um não favorecido for maior a R$ 5000,00', async () => {
            const bodyTransfers = { ...postTransferMaior5000NaoFavorecido }

            const resposta = await request(process.env.BASE_URL_REST)
                .post('/transfers')
                .set('Content-Type', 'application/json')
                .set('Authorization', `Bearer ${token}`)
                .send(bodyTransfers);

            expect(resposta.status).to.equal(400);
            expect(resposta.body.error).to.equal('Transferência acima de R$ 5.000,00 só para favorecidos');
            //console.log('Resposta da API:', resposta.body)
        });

        /*
        it('Deve retornar error com 201 quando o valor da transferencia para um favorecido for maior a R$ 5000,00', async () => {
            const bodyTransfers = { ...postTransferMaior5000Favorecido }

            const resposta = await request(process.env.BASE_URL_REST)
                .post('/transfers')
                .set('Content-Type', 'application/json')
                .set('Authorization', `Bearer ${token}`)
                .send(bodyTransfers)

            expect(resposta.status).to.equal(201);

            expect(resposta.body).to.have.property('from');
            expect(resposta.body.from).to.be.a('string');

            expect(resposta.body).to.have.property('to');
            expect(resposta.body.to).to.be.a('string');
    
            expect(resposta.body).to.have.property('value');
            expect(resposta.body.value).to.be.a('number');

            expect(resposta.body).to.have.property('date');
            expect(resposta.body.date).to.be.a('string');

            //console.log(resposta.body)
        });*/
    });

        
    describe('GET /transfers', () => {
         let token
            
        beforeEach(async () => {
            token = await obterToken(postLogin)
        })


        it('Retorna lista con todas las transferencias realizadas', async () => {
        
                    const resposta = await request(process.env.BASE_URL_REST)
                    .get('/transfers') 
                    .set('Content-Type', 'application/json')
                    .set('Authorization', `Bearer ${token}`);

                    expect(resposta.status).to.equal(200);
                    expect(resposta.body).to.be.an('array'); //valida que é uma lista array 
                    expect(resposta.body.length).to.be.greaterThan(0); //Valida que a lista não está vazia (usa o contado length)
                    //console.log('GET lista', resposta.body);
              
                    //Com o nome 'transferencia' verifica que cada item da lista tem a propriedade 'value'
                    resposta.body.forEach((transferencia) => {
                    expect(transferencia).to.have.property('value');
                    expect(transferencia.value).to.be.a('number');
                    });
        });
    });

});

