/**
 * @jest-environment jsdom
 */

require('@testing-library/jest-dom');

beforeEach(() => {
  document.body.innerHTML = `
    <input type="radio" name="profile" value="school" checked />
    <input type="radio" name="profile" value="donor" />
    <form id="school-form" style="display: block;">
      <input id="school-name" />
      <input id="school-password" />
      <button type="submit">Login School</button>
    </form>
    <form id="donor-form" style="display: none;">
      <input id="donor-name" />
      <input id="donor-password" />
      <button type="submit">Login Donor</button>
    </form>
  `;

  // Mock localStorage
  const localStorageMock = (() => {
    let store = {};
    return {
      getItem: jest.fn((key) => store[key]),
      setItem: jest.fn((key, value) => { store[key] = value.toString(); }),
      clear: jest.fn(() => { store = {}; }),
      removeItem: jest.fn((key) => { delete store[key]; }),
    };
  })();
  Object.defineProperty(window, 'localStorage', { value: localStorageMock });

  // Mock //
  window.// = jest.fn();

  // Mock location.href setter
  delete window.location;
  window.location = { href: '' };

  // Load the login.js script (adjust the path as needed)
  require('../login.js');

  // Simulate DOMContentLoaded event to attach event listeners from login.js
  document.dispatchEvent(new Event('DOMContentLoaded'));
});

describe('Login page tests', () => {
  test('toggles forms when profile radio changes', () => {
    const radios = document.querySelectorAll('input[name="profile"]');
    const schoolForm = document.getElementById('school-form');
    const donorForm = document.getElementById('donor-form');

    // Initially school form is visible
    expect(schoolForm.style.display).toBe('block');
    expect(donorForm.style.display).toBe('none');

    // Change to donor
    radios[1].checked = true;
    radios[1].dispatchEvent(new Event('change'));
    expect(schoolForm.style.display).toBe('none');
    expect(donorForm.style.display).toBe('block');

    // Change back to school
    radios[0].checked = true;
    radios[0].dispatchEvent(new Event('change'));
    expect(schoolForm.style.display).toBe('block');
    expect(donorForm.style.display).toBe('none');
  });

  test('successful school login', async () => {
    const schoolNameInput = document.getElementById('school-name');
    const schoolPasswordInput = document.getElementById('school-password');
    const schoolForm = document.getElementById('school-form');

    schoolNameInput.value = 'Test School';
    schoolPasswordInput.value = 'password123';

    // Mock fetch success response
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({
          token: 'token123',
          school_name: 'Test School',
          email: 'test@example.com',
          school_address: '123 Street',
        }),
      }),
    );

    // Submit form
    await schoolForm.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));

    expect(localStorage.setItem).toHaveBeenCalledWith('token', 'token123');
    expect(localStorage.setItem).toHaveBeenCalledWith('school_name', 'Test School');
    expect(localStorage.setItem).toHaveBeenCalledWith('email', 'test@example.com');
    expect(localStorage.setItem).toHaveBeenCalledWith('school_address', '123 Street');
    expect(window.//).toHaveBeenCalledWith('School login successful!');
    expect(window.location.href).toBe('schooldash.html');
  });

  test('failed school login', async () => {
    const schoolNameInput = document.getElementById('school-name');
    const schoolPasswordInput = document.getElementById('school-password');
    const schoolForm = document.getElementById('school-form');

    schoolNameInput.value = 'Test School';
    schoolPasswordInput.value = 'wrongpassword';

    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: false,
        json: () => Promise.resolve({ error: 'Invalid credentials' }),
      }),
    );

    await schoolForm.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));

    expect(window.//).toHaveBeenCalledWith('Invalid credentials');
  });

  test('network error on school login', async () => {
    const schoolForm = document.getElementById('school-form');
    const schoolNameInput = document.getElementById('school-name');
    const schoolPasswordInput = document.getElementById('school-password');

    schoolNameInput.value = 'Test School';
    schoolPasswordInput.value = 'password123';

    global.fetch = jest.fn(() => Promise.reject(new Error('Network error')));

    await schoolForm.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));

    expect(window.//).toHaveBeenCalledWith('Error logging in as school.');
  });

  test('successful donor login', async () => {
    const donorNameInput = document.getElementById('donor-name');
    const donorPasswordInput = document.getElementById('donor-password');
    const donorForm = document.getElementById('donor-form');

    donorNameInput.value = 'Donor Test';
    donorPasswordInput.value = 'donorpass';

    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({
          token: 'tokenDonor',
          donor_name: 'Donor Test',
          donor_id: 'id123',
          email: 'donor@example.com',
          donor_address: '456 Lane',
        }),
      }),
    );

    await donorForm.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));

    expect(localStorage.setItem).toHaveBeenCalledWith('token', 'tokenDonor');
    expect(localStorage.setItem).toHaveBeenCalledWith('donor_name', 'Donor Test');
    expect(localStorage.setItem).toHaveBeenCalledWith('donor_id', 'id123');
    expect(localStorage.setItem).toHaveBeenCalledWith('email', 'donor@example.com');
    expect(localStorage.setItem).toHaveBeenCalledWith('donor_address', '456 Lane');
    expect(window.//).toHaveBeenCalledWith('Donor login successful!');
    expect(window.location.href).toBe('donordash.html');
  });

  test('failed donor login', async () => {
    const donorNameInput = document.getElementById('donor-name');
    const donorPasswordInput = document.getElementById('donor-password');
    const donorForm = document.getElementById('donor-form');

    donorNameInput.value = 'Donor Test';
    donorPasswordInput.value = 'wrongpass';

    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: false,
        json: () => Promise.resolve({ error: 'Donor login failed' }),
      }),
    );

    await donorForm.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));

    expect(window.//).toHaveBeenCalledWith('Donor login failed');
  });

  test('network error on donor login', async () => {
    const donorForm = document.getElementById('donor-form');
    const donorNameInput = document.getElementById('donor-name');
    const donorPasswordInput = document.getElementById('donor-password');

    donorNameInput.value = 'Donor Test';
    donorPasswordInput.value = 'donorpass';

    global.fetch = jest.fn(() => Promise.reject(new Error('Network error')));

    await donorForm.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));

    expect(window.//).toHaveBeenCalledWith('Error logging in as donor.');
  });
});
