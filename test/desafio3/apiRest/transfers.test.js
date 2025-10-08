const request = require('supertest');
const { expect } = require('chai');
const { obterToken } = require('./helpers/autenticacao');
const postLogin = require('./fixtures/postLogin.json');
const { gerarUsuario } = require('./helpers/usuariosRandom');
const postTransferMaior5000Favorecido = require('./fixtures/postTransferMaior5000Favorecido.json');

describe('Desafio transfers', () => {
    describe('POST /transfers', () => {
        let token;
        let novoUsername;

        //Uso a função de gerarUsuarios para ter usuarios para os casos em que os usuarios não são favorecidos (com novos usuarios registrados)
        //porque observamos que a base de dados se apaga quando volto a conectar o servidor
        before(async () => {
        const novoUsuario = gerarUsuario();
        await request(process.env.BASE_URL_REST)
            .post('/users/register')
            .set('Content-Type', 'application/json')
            .send(novoUsuario);

        // guarda para usar nos testes
        novoUsername = novoUsuario.username; 
        });

        beforeEach(async () => {
        token = await obterToken(postLogin);
        });

        it('Deve retornar sucesso com 201 quando o valor da transferencia for menor ou igual a R$ 5000,00', async () => {

        const resposta = await request(process.env.BASE_URL_REST)
            .post('/transfers')
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${token}`)
            .send({
            from: 'julio',
            to: novoUsername,
            value: 100,
            });

        expect(resposta.status).to.equal(201);

        expect(resposta.body).to.have.property('from');
        expect(resposta.body.from).to.be.a('string');

        expect(resposta.body).to.have.property('to');
        expect(resposta.body.to).to.be.a('string');

        expect(resposta.body).to.have.property('value');
        expect(resposta.body.value).to.be.a('number');

        expect(resposta.body).to.have.property('date');
        expect(resposta.body.date).to.be.a('string');
        });

        it('Deve retornar erro 400 quando o valor da transferencia para um não favorecido for maior a R$ 5000,00', async () => {
        const resposta = await request(process.env.BASE_URL_REST)
            .post('/transfers')
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${token}`)
            .send({
            from: 'priscila',
            to: novoUsername,
            value: 8000,
            });

        expect(resposta.status).to.equal(400);
        expect(resposta.body.error).to.equal('Transferência acima de R$ 5.000,00 só para favorecidos');
        });

 
        //GERANDO ERRO POR FALTA DE SALDO
        
        it('Deve retornar sucesso com 201 quando o valor da transferencia para um favorecido for maior a R$ 5000,00', async () => {
        const bodyTransfers = { ...postTransferMaior5000Favorecido };

        const resposta = await request(process.env.BASE_URL_REST)
            .post('/transfers')
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${token}`)
            .send(bodyTransfers);

        expect(resposta.status).to.equal(201);

        expect(resposta.body).to.have.property('from');
        expect(resposta.body.from).to.be.a('string');

        expect(resposta.body).to.have.property('to');
        expect(resposta.body.to).to.be.a('string');

        expect(resposta.body).to.have.property('value');
        expect(resposta.body.value).to.be.a('number');

        expect(resposta.body).to.have.property('date');
        expect(resposta.body.date).to.be.a('string');
        });
        
    });

    describe('GET /transfers', () => {
        let token;

        beforeEach(async () => {
        token = await obterToken(postLogin);
        });

        it('Retorna lista com todas as transferências realizadas', async () => {
        const resposta = await request(process.env.BASE_URL_REST)
            .get('/transfers')
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${token}`);

        expect(resposta.status).to.equal(200);
        expect(resposta.body).to.be.an('array');
        expect(resposta.body.length).to.be.greaterThan(0);

        resposta.body.forEach((transferencia) => {
            expect(transferencia).to.have.property('value');
            expect(transferencia.value).to.be.a('number');
            });
        });
    });
});