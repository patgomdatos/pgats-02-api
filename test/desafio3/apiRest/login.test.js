require('dotenv').config();
const request = require('supertest');
const { expect } = require('chai');
const { obterToken } = require('./helpers/autenticacao')
const postLogin = require('./fixtures/postLogin.json')

describe('Desafio Login', () => {
    describe('POST /users/login', () => {
        it('Deve retornar 200 com um token em string quando usar credenciais validas', async () => {
            const bodyLogin = { ...postLogin }

            const resposta = await request(process.env.BASE_URL_REST)
                .post('/users/login')
                .set('Content-Type', 'application/json')
                .send(bodyLogin)

            expect(resposta.status).to.equal(200);
            expect(resposta.body.token).to.be.a('string');
        })

         it('Não envia usuario e senha e retorna 400 com mensagem de erro', async () => {

            const resposta = await request(process.env.BASE_URL_REST)
            .post('/users/login')
            .set('Content-Type', 'application/json')
            .send({
                'username': '',
                'password': ''
            })

            //console.log('Resposta da API:', resposta.body);
            expect(resposta.status).to.equal(400);
            expect(resposta.body.error).to.equal('Usuário e senha obrigatórios');
            //Neste caso a API não devolve os campos quando gera o error, por isso confirmo que não devolve os campos
            expect(resposta.body).to.not.have.property('username');
            expect(resposta.body).to.not.have.property('favorecidos');
        })
    })
})