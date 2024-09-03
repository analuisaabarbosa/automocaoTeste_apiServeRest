Cypress.Commands.add('token', (email, password) => {
    cy.request({
        method: 'POST',
        url: 'login',
        body: {
            "email": email,
            "password": password 
        }
    }).then((response) => {
        expect(response.status).to.equal(200)
        return response.body.authorization
    })
 })

 Cypress.Commands.add('addProduct' , (token, products, price, description, quantity) =>{
    cy.request({
        method: 'POST', 
        url: 'produtos',
        headers: {authorization: token}, 
        body: {
            "nome": products,
            "preco": price,
            "descricao": description,
            "quantidade": quantity
          }, 
          failOnStatusCode: false
    })
 })

 Cypress.Commands.add('addUser', (name, email, password) => {
    cy.request({
        method: 'POST',
        url: 'usuarios',
        body: {
            "nome": name,
            "email": email,
            "password": password,
            "administrador": 'true'
        },
        failOnStatusCode: false
    })
 })

