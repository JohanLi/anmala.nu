describe('Redirects', () => {
  it('anmäla.nu to anmala.nu', () => {
    cy.request({
      url: 'https://dev.anmäla.nu',
      followRedirect: false,
    }).then((res) => {
      expect(res.status).to.eq(301)
      expect(res.redirectedToUrl).to.eq('https://dev.anmala.nu/');
    });

    cy.request({
      url: 'https://dev.anmäla.nu/skapa-konto',
      followRedirect: false,
    }).then((res) => {
      expect(res.status).to.eq(301)
      expect(res.redirectedToUrl).to.eq('https://dev.anmala.nu/skapa-konto');
    });
  });

  it('http to https', () => {
    cy.request({
      url: 'http://dev.anmala.nu',
      followRedirect: false,
    }).then((res) => {
      expect(res.status).to.eq(301)
      expect(res.redirectedToUrl).to.eq('https://dev.anmala.nu/');
    });

    cy.request({
      url: 'http://dev.anmala.nu/villkor',
      followRedirect: false,
    }).then((res) => {
      expect(res.status).to.eq(301)
      expect(res.redirectedToUrl).to.eq('https://dev.anmala.nu/villkor');
    });
  });
});
