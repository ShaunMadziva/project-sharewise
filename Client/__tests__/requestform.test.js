/**
 * @jest-environment jsdom
 */

require('../requestform'); // Adjust path as needed

beforeEach(() => {
  // Setup DOM elements used by your code
  document.body.innerHTML = `
    <form id="requestForm">
      <input id="itemType" />
      <input id="quantity" type="number" />
      <button type="submit">Submit</button>
    </form>
    <a href="#" id="logout-link">Logout</a>
  `;

  // Mock localStorage
  let localStore = {};
  const localStorageMock = {
    getItem: jest.fn((key) => localStore[key] || null),
    setItem: jest.fn((key, value) => { localStore[key] = value.toString(); }),
    clear: jest.fn(() => { localStore = {}; }),
    removeItem: jest.fn((key) => { delete localStore[key]; }),
  };
  Object.defineProperty(window, 'localStorage', { value: localStorageMock });

  // Mock sessionStorage (used in logout test)
  let sessionStore = {};
  const sessionStorageMock = {
    getItem: jest.fn((key) => sessionStore[key] || null),
    setItem: jest.fn((key, value) => { sessionStore[key] = value.toString(); }),
    clear: jest.fn(() => { sessionStore = {}; }),
    removeItem: jest.fn((key) => { delete sessionStore[key]; }),
  };
  Object.defineProperty(window, 'sessionStorage', { value: sessionStorageMock });

  // Mock alert
  window.alert = jest.fn();

  // Suppress console.error logs during tests (optional)
  console.error = jest.fn();

  // Mock window.location.href setter
  delete window.location;
  window.location = { href: '' };

  // Fire DOMContentLoaded so event listeners in your script initialize
  document.dispatchEvent(new Event('DOMContentLoaded'));
});

afterEach(() => {
  jest.resetAllMocks();
  // Clear document body to avoid side effects
  document.body.innerHTML = '';
});

describe('Request form tests', () => {
  test('submits form successfully', async () => {
    document.getElementById('itemType').value = 'Book';
    document.getElementById('quantity').value = '3';

    localStorage.setItem('token', 'testtoken');

    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ message: 'Success' }),
      })
    );

    const form = document.getElementById('requestForm');
    await form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));

    expect(global.fetch).toHaveBeenCalledWith(
      'http://localhost:3000/requests',
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({
          'Content-Type': 'application/json',
          'Authorization': 'Bearer testtoken',
        }),
        body: JSON.stringify({ itemName: 'Book', quantity: 3 }),
      })
    );

    expect(window.alert).toHaveBeenCalledWith('Request submitted successfully!');
    expect(form.itemType.value).toBe('');
    expect(form.quantity.value).toBe('');
  });

  test('shows alert on validation error', async () => {
    document.getElementById('itemType').value = '';
    document.getElementById('quantity').value = '0';

    const form = document.getElementById('requestForm');
    await form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));

    expect(window.alert).toHaveBeenCalledWith('Please fill in all fields correctly.');
    expect(global.fetch).not.toHaveBeenCalled();
  });

  test('shows alert on fetch failure (non-ok response)', async () => {
    document.getElementById('itemType').value = 'Pen';
    document.getElementById('quantity').value = '2';

    localStorage.setItem('token', 'token123');

    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: false,
        json: () => Promise.resolve({ error: 'Failed' }),
      })
    );

    const form = document.getElementById('requestForm');
    await form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));

    expect(window.alert).toHaveBeenCalledWith('An error occurred while submitting the request.');
  });

  test('shows alert on fetch error (network failure)', async () => {
    document.getElementById('itemType').value = 'Pen';
    document.getElementById('quantity').value = '2';

    localStorage.setItem('token', 'token123');

    global.fetch = jest.fn(() => Promise.reject(new Error('Network error')));

    const form = document.getElementById('requestForm');
    await form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));

    expect(window.alert).toHaveBeenCalledWith('An error occurred while submitting the request.');
  });

  test('logout clears storage and redirects', () => {
    localStorage.setItem('token', 'token123');
    sessionStorage.setItem('someKey', 'value');

    const logoutLink = document.getElementById('logout-link');
    logoutLink.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));

    expect(localStorage.clear).toHaveBeenCalled();
    expect(sessionStorage.clear).toHaveBeenCalled();
    expect(window.location.href).toBe('registerfinal.html');
  });
});
