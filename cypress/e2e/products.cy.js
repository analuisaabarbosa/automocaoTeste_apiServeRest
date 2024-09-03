/// <reference types="cypress" />
import contract from '../contracts/products.contract'
import { faker } from '@faker-js/faker';

const productName = faker.commerce.productName();
const productPrice = faker.commerce.price();
const productDescription = faker.commerce.productDescription(productName);
const productQuantity = faker.number.int(200);

describe('Product Functionality Testing', () => {
    let token
    before(() => {
        cy.token('fulano@qa.com', 'teste').then(tkn => { token = tkn })
    });

    it('Must validate product contracts', () => {
        cy.request('produtos').then(response => {
            return contract.validateAsync(response.body)
        })
    });

    it('Must list the registered products', () => {
        cy.request({
            method: 'GET',
            url: 'produtos'
        }).then((response) => {
            expect(response.status).to.equal(200)
            expect(response.body).to.have.property('produtos')
            expect(response.duration).to.be.lessThan(20)
        })
    });

    it('Must successfully register a product', () => {
        cy.request({
            method: 'POST',
            url: 'produtos',
            body: {
                "nome": productName,
                "preco": productPrice,
                "descricao": productDescription,
                "quantidade": productQuantity
            },
            headers: { authorization: token }
        }).then((response) => {
            expect(response.status).to.equal(201)
            expect(response.body.message).to.equal('Cadastro realizado com sucesso')
        })
    });

    it('Must validate error message when registering a duplicate product', () => {
        cy.addProduct(token, 'Unbranded Granite Table', 250, "New product", 1000)
            .then((response) => {
                expect(response.status).to.equal(400)
                expect(response.body.message).to.equal('Já existe produto com esse nome')
            })
    });

    it('Must edit an already registered product', () => {
        cy.request('produtos').then(response => {
            let id = response.body.produtos[0]._id
            cy.request({
                method: 'PUT',
                url: `produtos/${id}`,
                headers: { authorization: token },
                body:
                {
                    "nome": productName + " " + Math.floor(Math.random()),
                    "preco": productPrice,
                    "descricao": productDescription,
                    "quantidade": productQuantity
                }
            }).then(response => {
                expect(response.body.message).to.equal('Registro alterado com sucesso')
            })
        })
    });

    it('Must delete a previously registered product', () => {
        cy.addProduct(token, "Erase", productPrice, "Product for delete.", 180)
            .then(response => {
                let id = response.body._id
                cy.request({
                    method: 'DELETE',
                    url: `produtos/${id}`,
                    headers: { authorization: token }
                }).then(response => {
                    expect(response.body.message).to.equal('Registro excluído com sucesso')
                    expect(response.status).to.equal(200)
                })
            })
    });
});

