declare namespace Cypress {
    interface Chainable {
        login(identifier: string, password: string): Chainable<void>;
    }
}

Cypress.Commands.add('login', (identifier: string, password: string) => {
    cy.visit('/login');

    cy.get ('input[formcontrolname = "identifier"]').type(identifier);
    cy.get ('input[formcontrolname = "password"]').type(password);

    cy.get('button[type="submit"]').click();

    cy.wait(2000);
    cy.visit('http://localhost:4200/learning');
});
