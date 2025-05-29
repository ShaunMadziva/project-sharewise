/**
 * @jest-environment jsdom
 */

import { aggregateRequestsData } from "../sharewise-api/helpers/dataProcessor.js";
jest.mock("../sharewise-api/helpers/dataProcessor.js", () => ({
  aggregateRequestsData: jest.fn(),
}));

global.Chart = jest.fn().mockImplementation(() => ({}));

import "../donordash.js"; // Important: Static import for coverage instrumentation

beforeEach(() => {
  // DOM setup
  document.body.innerHTML = `
    <div id="donor-name"></div>
    <div id="donor-email"></div>
    <div id="donor-address"></div>
    <div id="barChart"></div>
    <table>
      <tbody id="donations-table-body"></tbody>
    </table>
    <a href="#" id="logout-link">Logout</a>
  `;

  // localStorage mock
  const localStorageMock = (() => {
    let store = {};
    return {
      getItem: jest.fn((key) => store[key] || null),
      setItem: jest.fn((key, value) => { store[key] = value.toString(); }),
      clear: jest.fn(() => { store = {}; }),
      removeItem: jest.fn((key) => { delete store[key]; }),
    };
  })();
  Object.defineProperty(window, "localStorage", { value: localStorageMock });

  // sessionStorage mock
  const sessionStorageMock = (() => {
    let store = {};
    return {
      getItem: jest.fn((key) => store[key] || null),
      setItem: jest.fn((key, value) => { store[key] = value.toString(); }),
      clear: jest.fn(() => { store = {}; }),
      removeItem: jest.fn((key) => { delete store[key]; }),
    };
  })();
  Object.defineProperty(window, "sessionStorage", { value: sessionStorageMock });

  // window.location.href mock
  delete window.location;
  window.location = { href: "" };

  jest.clearAllMocks();
});

describe("DonorDash page", () => {
  test("populates donor info and renders donations", async () => {
    // Setup localStorage mock values
    window.localStorage.getItem.mockImplementation((key) => {
      switch (key) {
        case "donor_name": return "Jane Donor";
        case "email": return "jane@donor.com";
        case "donor_address": return "789 Road St";
        case "token":
          return "header." + btoa(JSON.stringify({ donor_id: "donor123" })) + ".signature";
        default: return null;
      }
    });

    // Mock fetch response
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({
          donations: [
            {
              donorName: "Jane Donor",
              itemName: "Books",
              quantity: 5,
              description: "Textbooks",
              schoolName: "Local School",
              status: "Delivered",
            },
          ],
        }),
      })
    );

    // Mock data processing
    aggregateRequestsData.mockReturnValue({ x: ["Books"], y: [5] });

    // Trigger DOMContentLoaded (which runs fetchAndRenderDonations)
    document.dispatchEvent(new Event("DOMContentLoaded"));

    await new Promise(process.nextTick); // wait for async DOM updates

    expect(document.getElementById("donor-name").textContent).toBe("Jane Donor");
    expect(document.getElementById("donor-email").textContent).toBe("jane@donor.com");
    expect(document.getElementById("donor-address").textContent).toBe("789 Road St");

    expect(global.fetch).toHaveBeenCalledWith("http://localhost:3000/donations/donor/donor123");
    expect(aggregateRequestsData).toHaveBeenCalled();

    const row = document.getElementById("donations-table-body").children[0];
    expect(row.children[0].textContent).toBe("Jane Donor");
    expect(row.children[1].textContent).toBe("Books");
    expect(row.children[2].textContent).toBe("5");
    expect(row.children[3].textContent).toBe("Textbooks");
    expect(row.children[4].textContent).toBe("Local School");
    expect(row.children[5].textContent).toBe("Delivered");
    expect(row.children[6].querySelectorAll("button").length).toBe(3);
  });

  test("handles missing token gracefully", async () => {
    window.localStorage.getItem.mockImplementation(() => null);

    const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {});

    document.dispatchEvent(new Event("DOMContentLoaded"));
    await new Promise(process.nextTick);

    expect(consoleErrorSpy).toHaveBeenCalledWith("No token found in localStorage");

    consoleErrorSpy.mockRestore();
  });

  test("handles fetch failure gracefully", async () => {
    window.localStorage.getItem.mockImplementation((key) => {
      if (key === "token") return "header." + btoa(JSON.stringify({ donor_id: "donor123" })) + ".signature";
      if (key === "donor_name") return "Jane Donor";
      if (key === "email") return "jane@donor.com";
      if (key === "donor_address") return "789 Road St";
      return null;
    });

    global.fetch = jest.fn(() =>
      Promise.resolve({ ok: false, status: 500 })
    );

    const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {});

    document.dispatchEvent(new Event("DOMContentLoaded"));
    await new Promise(process.nextTick);

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "Error loading donations:",
      expect.any(Error)
    );

    consoleErrorSpy.mockRestore();
  });

  test("logout clears storage and redirects", async () => {
    document.dispatchEvent(new Event("DOMContentLoaded"));
    const logoutLink = document.getElementById("logout-link");
    logoutLink.click();

    expect(window.localStorage.clear).toHaveBeenCalled();
    expect(window.sessionStorage.clear).toHaveBeenCalled();
    expect(window.location.href).toBe("registerfinal.html");
  });
});
