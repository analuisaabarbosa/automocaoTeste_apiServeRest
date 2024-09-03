/// <reference types="cypress" />
import contract from '../contracts/users.contract'
import { faker } from '@faker-js/faker';

describe('Users Functionality Test', () => {

  it('Must validate user contracts', () => {
    cy.request('usuarios').then((response) => {
      return contract.validateAsync(response.body)
    })
  });

  it('Must list registered users', () => {
    cy.request({
      method: 'GET',
      url: 'usuarios'
    }).should((response) => {
      expect(response.status).to.equal(200)
      expect(response.body).to.have.property('usuarios')
      expect(response.duration).to.be.lessThan(40)
    })
  });

  it('Must successfully register a user', () => {

    const userName = faker.person.fullName();
    const userEmail = faker.internet.email({ firstName: userName });
    const userPassword = faker.internet.password(5);

    cy.addUser(userName, userEmail, userPassword)
      .then((response) => {
        expect(response.status).to.equal(201)
        expect(response.body.message).to.equal("Cadastro realizado com sucesso")
      })
  });

  it('Must validate a user with an invalid email', () => {
    cy.addUser('Suelen', 'SueWolf58@gmail.com', 'suelen')
      .should((response) => {
        expect(response.status).to.equal(400)
        expect(response.body.message).to.equal("Este email já está sendo usado")
      })
  });

  it('Must edit a previously registered user', () => {

    const userName = faker.person.fullName();
    const userEmail = faker.internet.email({ firstName: userName });
    const userPassword = faker.internet.password(5);

    cy.addUser(userName, userEmail, userPassword).then((response) => {
      let id = response.body._id
      cy.request({
        method: 'PUT',
        url: `usuarios/${id}`,
        body: {
          "nome": userName,
          "email": userEmail,
          "password": userPassword,
          "administrador": 'false'
        }
      }).then((response) => {
        expect(response.body.message).to.equal('Registro alterado com sucesso')
      })
    })
  });

  it('Must delete a previously registered user', () => {

    const userName = faker.person.fullName();
    const userEmail = faker.internet.email({ firstName: userName });
    const userPassword = faker.internet.password(5);

    cy.addUser(userName, userEmail, userPassword).then((response) => {
      let id = response.body._id
      cy.request({
        method: 'DELETE',
        url: `usuarios/${id}`
      }).then(response => {
        expect(response.body.message).to.equal('Registro excluído com sucesso')
        expect(response.status).to.equal(200)
      })
    })
  });

});
