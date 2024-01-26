describe('App checkout flow', () => {
  it('successfully adds ticket, checkouts, and navigates to auth page', () => {
    // Navigate to marketplace page
    cy.visit('http://app.localhost:3000');

    // Assert that there are events in the trending seciton
    cy.findByTestId('trending-events-section').findAllByTestId('event-card').should('exist');

    // Click first event to navigate
    cy.findByTestId('trending-events-section').findByTestId('event-0-card-link').click();

    // Assert that url is updated
    cy.location('pathname').should('contain', '/event');

    // Add first ticket tier to cart
    cy.findByTestId('add-ticket-dialog-button').click();

    // Assert that add ticket to cart is not visible
    cy.findByTestId('add-ticket-to-cart-button').should('not.exist');

    // Select the first ticket tier and add to cart
    cy.findByTestId('select-tier-0-button').click();
    cy.findByTestId('add-ticket-to-cart-button').click();

    // Click toast action to open cart modal
    cy.findByRole('status').within(() => {
      cy.findByText('Ticket added to cart');
      cy.findByTestId('toast-view-cart-button').click();
    });

    // Navigate to cart page
    cy.findByTestId('modal-cart-item-0');
    cy.findByTestId('modal-view-cart-button').click();
    cy.location('pathname').should('eq', '/cart');

    // Assert that ticket has been added
    cy.findByTestId('cart-item-0').should('exist');

    cy.findByTestId('checkout-button').should('not.be.disabled').click();

    cy.location('pathname').should('contain', '/auth');
  });
});
