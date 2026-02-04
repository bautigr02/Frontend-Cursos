describe('Visualizar un curso al que se esta inscripto', () => { 
    it('Deberia permitir ver el curso al que el usuario esta inscripto',() => {

        cy.login('38289625','Mateo123');
        cy.visit('http://localhost:4200/learning');
        cy.contains('Base de datos').click();


    });
});