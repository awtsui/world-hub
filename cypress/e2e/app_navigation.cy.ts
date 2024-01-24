describe('App navbar', () => {
  beforeEach(() => {
    cy.visit('http://app.localhost:3000');
  });
  it('successfully loads', () => {
    cy.get('[data-testid="app-navbar"]');
  });
  it('successfully redirects to Concerts page', () => {
    cy.get('[data-testid="app-navbar"]').get('[data-testid="Concerts-link"]').click();
    cy.location('pathname').should('eq', '/marketplace/1');
  });
  it('successfully redirects back to home page', () => {
    cy.visit('http://app.localhost:3000/event/1');
    cy.get('[data-testid="app-navbar"]').get('[data-testid="marketplace-link"]').click();
    cy.location('pathname').should('eq', '/marketplace');
  });
  it('successfully searches and navigates to event page', () => {
    cy.get('[data-testid="app-navbar"]').get('[data-testid="search-menu-button"]').click();
    cy.get('[data-testid="search-dialog-input"]').type('Knock2').type('{enter}');
    cy.location('pathname').should('eq', '/event/1');
  });
  it('successfully opens shopping cart modal and navigates to cart page', () => {
    cy.get('[data-testid="app-navbar"]').get('[data-testid="cart-button"]').click();
    cy.get('[data-testid="modal-view-cart-button"]').click();
    cy.location('pathname').should('eq', '/cart');
  });
  it('successfully opens shopping cart modal and checkout button is disabled', () => {
    cy.get('[data-testid="app-navbar"]').get('[data-testid="cart-button"]').click();
    cy.get('[data-testid="modal-checkout-button"]').should('be.disabled');
  });
});
