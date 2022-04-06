const title = 'Förändringsledning & förändringsledarskap';
const email = 'test@example.com';

describe('Onboarding', () => {
  it('fill in forms for a Page', () => {
    cy.visit('/');
    cy.get('[data-test=button]').contains('Kom igång').click();

    cy.get('[data-test=inputTitle]').type(title);

    cy.get('[data-test=editor]').type('Förändringsledning & förändringsledarskap{enter}Utbildningen riktar sig till dig som vill få mer kunskap om hur du som ledare får människor att själva vilja ta ansvar för och genomföra förändringsarbete.{enter}{enter}Utbildningen ger dig beprövade och konkreta verktyg samt insikter som du direkt kan använda i ditt eget förändringsarbete. Vi kommer att variera korta föreläsningar med praktiska övningar samt ge dig utrymme för att planera hur du kan använda insikterna och verktygen när du kommer hem.')

    cy.get('[data-test=editor]').get('.ql-editor p:first-child').click();

    cy.get('[data-test=editor]').get('.ql-header:visible').click();
    cy.get('[data-test=editor]').get('.ql-picker-options .ql-picker-item:first-child').click();

    cy.get('[data-test=inputTicketDescription]').type('Vuxen');
    cy.get('[data-test=inputTicketPrice]').type('199');
    cy.get('[data-test=inputTicketVat]').select('25%');
    cy.get('[data-test=inputTicketSeats]').type('1');

    cy.get('button').contains('Lägg till fler alternativ').click();

    cy.get('[data-test=inputTicketDescription]').eq(1).type('Student');
    cy.get('[data-test=inputTicketPrice]').eq(1).type('149');
    cy.get('[data-test=inputTicketVat]').eq(1).select('25%');

    cy.get('button').contains('Lägg till fler fält').click();

    cy.get('[data-test=inputOrderCustomFieldName]').type('Telefonnummer');
    cy.get('[data-test=inputOrderCustomFieldRequired]').check();

    cy.get('button').contains('Nästa steg').click();

    cy.get('button').contains('Skapa konto med e-post och lösenord').click();

    cy.get('[data-test=inputEmail]').type(email);
    cy.get('[data-test=inputPassword]').type('qwerty123');

    cy.get('button').contains('Klar').click();

    cy.url().should('eq', `${Cypress.config().baseUrl}/mina-formular`);

    cy.get('[data-test=menu]').should('contain', 'Mina formulär');
    cy.get('[data-test=menu]').should('contain', email);

    cy.get('[data-test=alert]').should('contain', title);
    cy.get('table').should('contain', title);

    cy.get('table').contains(Cypress.config().baseUrl).click();

    cy.get('h1').should('contain', title);
    cy.get('h2').should('contain', title);

    cy.get('[data-test=tickets]').should('contain', 'Vuxen');
    cy.get('[data-test=tickets]').should('contain', '199 kr');
    cy.get('[data-test=tickets]').should('contain', 'Student');
    cy.get('[data-test=tickets]').should('contain', '149 kr');
  });

  // it('fill in form for an email and password account', () => {
  //
  // });
  //
  // it('navigate to Dashboard, with Page created and user logged in', () => {
  //
  // });
});
