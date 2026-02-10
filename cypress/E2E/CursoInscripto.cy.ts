describe('Visualizar un curso al que se esta inscripto, seleccionar inscribirse a un taller e inscribirse', () => { 
    beforeEach(() => {
        cy.login('38289625','Mateo123');
    });

    it('Deberia permitir ver el curso al que el usuario esta inscripto y seleccionar un taller para inscribirse',() => {
        cy.visit('/learning');

        cy.contains('Inscripto').should('be.visible').click();

        cy.contains('Taller de git').should('be.visible').click();

        cy.contains('button', 'Inscribirse').click();
        cy.contains('Confirmar inscripción').should('be.visible');
        cy.contains('Sí').click();

        cy.contains('button', 'Ya inscripto').should('be.visible')
    });
});