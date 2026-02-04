describe('Visualizar un curso al que se esta inscripto', () => { 
    it('Deberia permitir ver el curso al que el usuario esta inscripto',() => {

        cy.login('44290824','Alva123');
        cy.visit('http://localhost:4200/learning');
        cy.contains('Base de datos').click();


    });
});