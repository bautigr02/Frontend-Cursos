describe('Login Test', () => { 
    it('Deberia permitir iniciar sesion como usuario Alumno',() => {
        cy.visit('http://localhost:4200/login');


        cy.get ('input[formcontrolname = "identifier"]').type('38289625');
        cy.get ('input[formcontrolname = "password"]').type('Mateo123');

        cy.get('button[type="submit"]').click();

        cy.wait(2000);
        cy.visit('http://localhost:4200/learning');
    });
});