// TODO: write a test for refactored search menu

describe('App navigation', () => {
  beforeEach(() => {
    cy.visit('http://app.localhost:3000');
  });
  it('successfully loads', () => {
    cy.findByTestId('app-navbar');
  });
  it('successfully redirects to Concerts page', () => {
    cy.findByTestId('app-navbar').findByTestId('Concerts-link').click();
    cy.location('pathname').should('eq', '/marketplace/1');
  });
  it('successfully redirects back to home page', () => {
    cy.visit('http://app.localhost:3000/event/1');
    cy.findByTestId('app-navbar').findByTestId('marketplace-link').click();
    cy.location('pathname').should('eq', '/marketplace');
  });
  it('successfully opens shopping cart modal and navigates to cart page', () => {
    cy.findByTestId('app-navbar').findByTestId('cart-button').click();
    cy.get('[data-testid="modal-view-cart-button"]').click();
    cy.location('pathname').should('eq', '/cart');
  });
  it('successfully opens shopping cart modal and checkout button is disabled', () => {
    cy.findByTestId('app-navbar').findByTestId('cart-button').click();
    cy.get('[data-testid="modal-checkout-button"]').should('be.disabled');
  });
  it('successfully opens search modal and navigate to search page with keyword in search params', () => {
    cy.findByTestId('app-navbar').findByTestId('search-menu-button').click();
    cy.findByTestId('search-keyword-command-input').type('test');
    cy.findByTestId('search-keyword-command-button').click();
    cy.location('pathname').should('eq', '/search');
    cy.location('search').should('contain', 'keyword=test');
  });
});
