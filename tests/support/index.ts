import './commands';

before(() => {
  cy.exec('npm run test:e2e:cleanup');
});
