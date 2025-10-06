
const request = require('supertest');
const { expect } = require('chai');


    describe('Desafio Users', () => {
        describe('GET /users', () => {
        it('Retorna lista con todos los usuarios registrados', async () => {

            const resposta = await request(process.env.BASE_URL_REST)
            .get('/users') 
            .set('Content-Type', 'application/json');
            
            expect(resposta.status).to.equal(200);
            expect(resposta.body).to.be.an('array'); //valida que é uma lista array 
            expect(resposta.body.length).to.be.greaterThan(0); //Valida que a lista não está vazia (usa o contado length)
            //console.log('GET lista', resposta.body);

            //Com o nome 'usuario' verifica que cada item da lista tem a propriedade 'username'
            resposta.body.forEach((usuario) => {
            expect(usuario).to.have.property('username');
            expect(usuario.username).to.be.a('string');
            });
        });
    });
});



