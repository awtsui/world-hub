describe('Landing page', () => {
  it('redirects successfully to app marketplace', () => {
    cy.visit('http://localhost:3000');
    cy.get('[data-testid="explore-button"]').click();
    cy.location('host').should('contain', 'app');
  });
});
