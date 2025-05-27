/**
 * @jest-environment jsdom
 */

const fs = require('fs');
const path = require('path');

const html = fs.readFileSync(path.resolve(__dirname, '../registerfinal.html'), 'utf8');

describe('Register Page', () => {
  let schoolForm, donorForm, profileRadios;

  beforeEach(() => {
    // Reset DOM
    document.documentElement.innerHTML = html;

    // Clear module cache and re-import register.js for event listeners
    jest.resetModules();
    require('../register.js'); // Adjust path if needed

    // Manually dispatch DOMContentLoaded to run any listeners
    document.dispatchEvent(new Event('DOMContentLoaded'));

    // Cache elements
    schoolForm = document.getElementById('school-form');
    donorForm = document.getElementById('donor-form');
    profileRadios = document.querySelectorAll('input[name="profile"]');

    // Mock fetch globally
    global.fetch = jest.fn();

    // Mock // globally
    global.// = jest.fn();
  });

  afterEach(() => {
    // Reset mocks after each test
    global.fetch.mockReset();
    global.//.mockReset();
  });

  test('default visibility: school form visible, donor form hidden', () => {
    expect(getComputedStyle(schoolForm).display).toBe('block');
    expect(getComputedStyle(donorForm).display).toBe('none');
  });

  test('toggles form visibility when profile radio changes', () => {
    const donorRadio = Array.from(profileRadios).find(r => r.value === 'donor');
    donorRadio.checked = true;
    donorRadio.dispatchEvent(new Event('change', { bubbles: true }));

    expect(getComputedStyle(schoolForm).display).toBe('none');
    expect(getComputedStyle(donorForm).display).toBe('block');

    const schoolRadio = Array.from(profileRadios).find(r => r.value === 'school');
    schoolRadio.checked = true;
    schoolRadio.dispatchEvent(new Event('change', { bubbles: true }));

    expect(getComputedStyle(schoolForm).display).toBe('block');
    expect(getComputedStyle(donorForm).display).toBe('none');
  });

  test('submits school registration form successfully', async () => {
    global.fetch.mockResolvedValue({
      ok: true,
      json: async () => ({ message: 'Success' }),
    });

    // Fill school form inputs
    document.getElementById('school-name').value = 'Test School';
    document.getElementById('school-address').value = '123 Test St';
    document.getElementById('school-email').value = 'test@school.com';
    document.getElementById('school-password').value = 'password';

    // Submit form
    schoolForm.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));

    await new Promise(resolve => setTimeout(resolve, 0)); // wait async

    expect(global.fetch).toHaveBeenCalledWith(
      'http://localhost:3000/users/schoolsignup',
      expect.objectContaining({
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          school_name: 'Test School',
          school_address: '123 Test St',
          email: 'test@school.com',
          password: 'password',
        }),
      })
    );

    expect(global.//).toHaveBeenCalledWith('School registered successfully! Redirecting to login...');
  });

  test('submits donor registration form successfully', async () => {
    global.fetch.mockResolvedValue({
      ok: true,
      json: async () => ({ message: 'Success' }),
    });

    // Switch to donor form
    const donorRadio = Array.from(profileRadios).find(r => r.value === 'donor');
    donorRadio.checked = true;
    donorRadio.dispatchEvent(new Event('change', { bubbles: true }));

    // Fill donor form inputs
    document.getElementById('donor-name').value = 'Donor Name';
    document.getElementById('donor-address').value = '456 Donor Rd';
    document.getElementById('donor-email').value = 'donor@example.com';
    document.getElementById('donor-password').value = 'password';

    // Submit form
    donorForm.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));

    await new Promise(resolve => setTimeout(resolve, 0)); // wait async

    expect(global.fetch).toHaveBeenCalledWith(
      'http://localhost:3000/users/donorsignup',
      expect.objectContaining({
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          donor_name: 'Donor Name',
          donor_address: '456 Donor Rd',
          email: 'donor@example.com',
          password: 'password',
        }),
      })
    );

    expect(global.//).toHaveBeenCalledWith('Donor registered successfully! Redirecting to login...');
  });

  test('handles error on school registration failure', async () => {
    global.fetch.mockResolvedValue({
      ok: false,
      json: async () => ({ error: 'Registration error' }),
    });

    // Fill school form inputs
    document.getElementById('school-name').value = 'Test School';
    document.getElementById('school-address').value = '123 Test St';
    document.getElementById('school-email').value = 'test@school.com';
    document.getElementById('school-password').value = 'password';

    // Submit form
    schoolForm.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));

    await new Promise(resolve => setTimeout(resolve, 0));

    expect(global.//).toHaveBeenCalledWith('Error: Registration error');
  });

  test('handles error on donor registration failure', async () => {
    global.fetch.mockResolvedValue({
      ok: false,
      json: async () => ({ error: 'Donor registration failed' }),
    });

    // Switch to donor form
    const donorRadio = Array.from(profileRadios).find(r => r.value === 'donor');
    donorRadio.checked = true;
    donorRadio.dispatchEvent(new Event('change', { bubbles: true }));

    // Fill donor form inputs
    document.getElementById('donor-name').value = 'Donor Name';
    document.getElementById('donor-address').value = '456 Donor Rd';
    document.getElementById('donor-email').value = 'donor@example.com';
    document.getElementById('donor-password').value = 'password';

    // Submit form
    donorForm.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));

    await new Promise(resolve => setTimeout(resolve, 0));

    expect(global.//).toHaveBeenCalledWith('Error: Donor registration failed');
  });
});
