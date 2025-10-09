const request = require('supertest');
const { expect } = require('chai');
const postRegister = require('./fixtures/postRegister.json');
const { gerarUsuario } = require('./helpers/usuariosRandom.js');

describe('Desafio Register', () => {
    describe('POST /users/register', () => {
        it('Valida que se permite ingresar um novo usuário com um favorecido e retorna 201', async () => {

            const novoUsuario = gerarUsuario();

            const resposta = await request(process.env.BASE_URL_REST)
                .post('/users/register')
                .set('Content-Type', 'application/json')
                .send(novoUsuario)

            expect(resposta.status).to.equal(201);
            expect(resposta.body.saldo).to.be.a('number');
            expect(resposta.body.saldo).to.equal(10000);
        });

        it('Valida que se não se permite ingresar usuarios duplicados e retorna 400', async () => {
            const bodyRegister = { ...postRegister }

            const resposta = await request(process.env.BASE_URL_REST)
                .post('/users/register')
                .set('Content-Type', 'application/json')
                .send(bodyRegister)

            expect(resposta.status).to.equal(400);
            expect(resposta.body.error).to.equal('Usuário já existe');
        });
    });
});