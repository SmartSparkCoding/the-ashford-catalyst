// Load edition data from global window object (populated by editions.js)
// Using spread operator to avoid mutation issues later
let editions = Array.isArray(window.CATALYST_EDITIONS) ? [...window.CATALYST_EDITIONS] : [];

// Load member data from global window object (populated by members.js)
let members = Array.isArray(window.CATALYST_MEMBERS) ? [...window.CATALYST_MEMBERS] : [];

// Cache DOM elements for the edition grid and search functionality
const editionGrid = document.getElementById("editionGrid");
const editionTemplate = document.getElementById("editionTemplate");
const editionSearch = document.getElementById("editionSearch");
const searchButton = document.getElementById("searchButton");
const editionCount = document.getElementById("editionCount");

// Cache DOM elements for the team grid
const teamGrid = document.getElementById("teamGrid");
const teamTemplate = document.getElementById("teamTemplate");

// Dialog elements for viewing edition details
const dialog = document.getElementById("editionDialog");
const closeDialog = document.getElementById("closeDialog");
const dialogEditionLabel = document.getElementById("dialogEditionLabel");
const dialogTitle = document.getElementById("dialogTitle");
const dialogSummary = document.getElementById("dialogSummary");
const dialogDate = document.getElementById("dialogDate");
const dialogArticles = document.getElementById("dialogArticles");
const dialogDownload = document.getElementById("dialogDownload");

/**
 * Format dates into readable format. If date is invalid or missing,
 * show a placeholder. This handles various date formats gracefully.
 */
function formatDate(dateText) {
  if (!dateText) {
    return "Posting date coming soon";
  }

  const date = new Date(dateText);
  // If date parsing fails, just show the raw text
  return Number.isNaN(date.getTime())
    ? dateText
    : date.toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" });
}

/**
 * Search through edition fields for a query string.
 * Searches across title, articles, issue number, etc.
 */
function matchesEdition(edition, query) {
  if (!query) {
    return true;
  }

  // Combine all searchable fields into one string for matching
  // (a bit hacky but way easier than checking each field separately)
  const haystack = [edition.number, edition.title, edition.information, edition.date, edition.file, ...(edition.articles || [])]
    .join(" ")
    .toLowerCase();

  return haystack.includes(query.toLowerCase());
}

/**
 * Open the edition details modal with the selected edition's info.
 * Populates all the dialog fields and shows the modal.
 */
function openEdition(edition) {
  if (!edition) return; // Defensive check
  
  dialogEditionLabel.textContent = `Edition ${edition.number}`;
  dialogTitle.textContent = edition.title || "Untitled Edition";
  dialogSummary.textContent = edition.information || "No description available";
  dialogDate.textContent = `Posted ${formatDate(edition.date)}`;
  dialogDownload.href = edition.file || "#";
  dialogDownload.textContent = `Download ${edition.file || "PDF"}`;

  // Clear and rebuild article list
  dialogArticles.innerHTML = "";
  (edition.articles || []).forEach((article) => {
    const item = document.createElement("li");
    item.textContent = article;
    dialogArticles.appendChild(item);
  });

  // Only show modal if not already open
  if (!dialog.open) {
    dialog.showModal();
  }
}

/**
 * Render edition cards into the grid. Shows empty state if no results.
 * Staggered animation makes the cards feel less robotic.
 */
function renderEditions(list) {
  editionGrid.innerHTML = "";

  if (!list.length) {
    // Show friendly empty state when no results match
    const emptyState = document.createElement("div");
    emptyState.className = "team-card";
    emptyState.textContent = "No editions matched your search.";
    editionGrid.appendChild(emptyState);
    editionCount.textContent = String(editions.length); // Still show total count
    return;
  }

  // Update edition count (shows total, not just filtered)
  editionCount.textContent = String(editions.length);

  list.forEach((edition, index) => {
    const node = editionTemplate.content.firstElementChild.cloneNode(true);
    
    // Stagger the animation a bit so cards don't all pop in at once
    // (80ms delay felt right, tried 100ms but seemed too slow)
    node.style.animationDelay = `${index * 80}ms`;
    
    // Populate card content from edition data
    node.querySelector(".edition-number").textContent = `Edition ${edition.number}`;
    node.querySelector(".edition-date").textContent = formatDate(edition.date);
    node.querySelector(".edition-title").textContent = edition.title || "Untitled";
    node.querySelector(".edition-summary").textContent = edition.information || "";
    node.querySelector(".edition-file").textContent = edition.file;

    // Add first 3 articles as preview (list could get long otherwise)
    const articleList = node.querySelector(".mini-articles");
    (edition.articles || []).slice(0, 3).forEach((article) => {
      const item = document.createElement("li");
      item.textContent = article;
      articleList.appendChild(item);
    });

    // Make card clickable and keyboard accessible
    node.addEventListener("click", () => openEdition(edition));
    node.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        openEdition(edition);
      }
    });

    editionGrid.appendChild(node);
  });
}

/**
 * Handle search filtering - triggers on input, button click, or Enter key
 */
function applySearch() {
  const query = editionSearch.value.trim();
  const filtered = editions.filter((edition) => matchesEdition(edition, query));
  renderEditions(filtered);
}

// Event listeners for search
searchButton.addEventListener("click", applySearch);
editionSearch.addEventListener("input", applySearch); // Live filtering
editionSearch.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    event.preventDefault();
    applySearch();
  }
});

// Close dialog on button click
closeDialog.addEventListener("click", () => dialog.close());

// Close dialog when clicking outside the dialog content
// (click on backdrop). This is a bit verbose but it works reliably.
dialog.addEventListener("click", (event) => {
  const rect = dialog.getBoundingClientRect();
  
  // Check if click was outside the dialog box
  const clickedOutside = 
    event.clientY < rect.top || 
    event.clientY > rect.top + rect.height || 
    event.clientX < rect.left || 
    event.clientX > rect.left + rect.width;

  if (clickedOutside) {
    dialog.close();
  }
});

/**
 * Render team member cards into the grid.
 * Sorts members by roleLead priority (lower number = higher priority).
 */
function renderTeam(list) {
  teamGrid.innerHTML = "";

  if (!list.length) {
    teamGrid.textContent = "No team members found.";
    return;
  }

  // Sort by roleLead (priority)
  const sorted = [...list].sort((a, b) => a.roleLead - b.roleLead);

  sorted.forEach((member, index) => {
    const node = teamTemplate.content.firstElementChild.cloneNode(true);
    
    // Stagger animation
    node.style.animationDelay = `${index * 80}ms`;
    
    // Apply role-tier class for colored glows
    // roleLead 1 = gold glow, 2 = blue glow, 3+ = pink glow
    node.classList.add(`role-tier-${member.roleLead}`);
    
    // Populate card content from member data
    node.querySelector(".member-name").textContent = member.name;
    node.querySelector(".member-role").textContent = member.role;
    node.querySelector(".member-description").textContent = member.description;

    teamGrid.appendChild(node);
  });
}

// Initial render on page load
renderTeam(members);
renderEditions(editions);