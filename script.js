const API_URL =
  "https://fsa-crud-2aa9294fe819.herokuapp.com/api/2502-FTB-ET-WEB-PT/events";

let partyState = [];

// DOM Elements
const form = document.getElementById("party-form");
const partyListEl = document.getElementById("party-list");

// Fetch and render all parties
async function fetchParties() {
  try {
    console.log("Fetching parties from API...");
    const response = await fetch(API_URL);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const json = await response.json();
    console.log("API Response:", json);

    if (!json.data || !Array.isArray(json.data)) {
      console.error("Invalid data format received:", json);
      return;
    }

    partyState = json.data;
    console.log("Parties loaded:", partyState.length);

    // Check if partyListEl exists
    if (!partyListEl) {
      console.error("partyListEl is null or undefined!");
      return;
    }

    console.log("partyListEl:", partyListEl);
    renderParties(partyState);
  } catch (err) {
    console.error("Failed to fetch parties:", err);
    alert("Failed to load parties. Please refresh the page.");
  }
}

// Render all parties
function renderParties(parties) {
  console.log("Rendering parties:", parties);
  const tbody = partyListEl.querySelector("tbody");

  if (!tbody) {
    console.error("Table body element not found!");
    return;
  }

  console.log("Table body found, clearing content");
  tbody.innerHTML = "";

  if (parties.length === 0) {
    console.log("No parties to display");
    const tr = document.createElement("tr");
    tr.innerHTML = "<td colspan='5'>No parties found</td>";
    tbody.appendChild(tr);
    return;
  }

  console.log(`Adding ${parties.length} parties to the table`);
  parties.forEach((party) => renderParty(party, tbody));
}

// Render a single party
function renderParty(party, tbody) {
  console.log("Rendering party:", party);
  const tr = document.createElement("tr");

  tr.innerHTML = `
    <td>${party.name}</td>
    <td>${new Date(party.date).toLocaleString()}</td>
    <td>${party.location}</td>
    <td>${party.description}</td>
    <td><button class="delete-btn" data-party-id="${party.id}">Delete</button></td>
  `;

  const deleteBtn = tr.querySelector(".delete-btn");
  deleteBtn.addEventListener("click", async () => {
    try {
      const response = await fetch(`${API_URL}/${party.id}`, {
        method: "DELETE"
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      console.log("Party deleted successfully");
      await fetchParties(); // Refresh the list after deletion
    } catch (err) {
      console.error("Failed to delete party:", err);
      alert("Failed to delete party. Please try again.");
    }
  });

  tbody.appendChild(tr);
  console.log("Party row added to table");
}

// Handle form submission to create a new party
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const formData = new FormData(form);
  const newParty = {
    name: formData.get("name"),
    date: new Date(formData.get("date")).toISOString(),
    location: formData.get("location"),
    description: formData.get("description")
  };

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(newParty)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    console.log("Party added successfully:", result);

    form.reset();
    await fetchParties(); // Refresh list after new party is added
  } catch (err) {
    console.error("Failed to add party:", err);
    alert("Failed to add party. Please try again.");
  }
});

// Initial fetch
fetchParties();
