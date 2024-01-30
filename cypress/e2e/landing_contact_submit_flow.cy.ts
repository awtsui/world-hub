describe('Landing contact form flow', () => {
  it('successfully submits contact form', () => {
    cy.visit('http://localhost:3000/contact');
    cy.get('form').within((form$) => {
      form$.on('submit', (e) => {
        e.preventDefault();
      });
      cy.fixture('contact_form.json').then((formData) => {
        cy.findByRole('textbox', { name: 'Name' }).type(formData.name);
        cy.findByRole('textbox', { name: 'Subject' }).type(formData.subject);
        cy.findByRole('textbox', { name: 'Company' }).type(formData.company);
        cy.findByRole('textbox', { name: 'Email' }).type(formData.email);
        cy.findByRole('textbox', { name: 'Message' }).type(formData.message);
      });
      cy.findByRole('button', { name: 'Submit' }).click();
    });

    cy.findByRole('status').within(() => {
      cy.findByText('Contact form successfully sent');
    });
  });
});
