describe('Login Test', () => { 
    it('Deberia permitir iniciar sesion como usuario Alumno',() => {
        cy.visit('http://localhost:4200/login');


        cy.get ('input[formcontrolname = "identifier"]').type('44290824');
        cy.get ('input[formcontrolname = "password"]').type('Alva123');

        cy.get('button[type="submit"]').click();

        cy.wait(2000);
        cy.visit('http://localhost:4200/learning');
    });
});