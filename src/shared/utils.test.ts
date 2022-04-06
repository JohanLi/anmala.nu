import { validOrganizationId } from './utils';

test('Organization ID must be 10 digits and contain a valid checksum', () => {
  expect(validOrganizationId('202100-5489')).toEqual(true);
  expect(validOrganizationId('660318-4182')).toEqual(true);
  expect(validOrganizationId('771122-1234')).toEqual(false);
});
