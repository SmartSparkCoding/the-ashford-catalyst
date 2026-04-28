let editions = Array.isArray(window.CATALYST_EDITIONS) ? [...window.CATALYST_EDITIONS] : [];
const editionGrid = document.getElementById("editionGrid");
const editionTemplate = document.getElementById("editionTemplate");
const editionSearch = document.getElementById("editionSearch");
const searchButton = document.getElementById("searchButton");
const editionCount = document.getElementById("editionCount");
const dialog = document.getElementById("editionDialog");
const closeDialog = document.getElementById("closeDialog");
const dialogEditionLabel = document.getElementById("dialogEditionLabel");
const dialogTitle = document.getElementById("dialogTitle");
const dialogSummary = document.getElementById("dialogSummary");
const dialogDate = document.getElementById("dialogDate");
const dialogArticles = document.getElementById("dialogArticles");
const dialogDownload = document.getElementById("dialogDownload");
const editionForm = document.getElementById("editionForm");

function formatDate(dateText) {
  if (!dateText) {
    return "Posting date coming soon";
  }

  const date = new Date(dateText);
  return Number.isNaN(date.getTime())
    ? dateText
    : date.toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" });
}

function matchesEdition(edition, query) {
  if (!query) {
    return true;
  }

  const haystack = [edition.number, edition.title, edition.information, edition.date, edition.file, ...(edition.articles || [])]
    .join(" ")
    .toLowerCase();

  return haystack.includes(query.toLowerCase());
}

function openEdition(edition) {
  dialogEditionLabel.textContent = `Edition ${edition.number}`;
  dialogTitle.textContent = edition.title;
  dialogSummary.textContent = edition.information;
  dialogDate.textContent = `Posted ${formatDate(edition.date)}`;
  dialogDownload.href = edition.file;
  dialogDownload.textContent = `Download ${edition.file}`;

  dialogArticles.innerHTML = "";
  (edition.articles || []).forEach((article) => {
    const item = document.createElement("li");
    item.textContent = article;
    dialogArticles.appendChild(item);
  });

  if (!dialog.open) {
    dialog.showModal();
  }
}

function renderEditions(list) {
  editionGrid.innerHTML = "";

  if (!list.length) {
    const emptyState = document.createElement("div");
    emptyState.className = "team-card";
    emptyState.textContent = "No editions matched your search.";
    editionGrid.appendChild(emptyState);
    editionCount.textContent = String(editions.length);
    return;
  }

  editionCount.textContent = String(editions.length);

  list.forEach((edition, index) => {
    const node = editionTemplate.content.firstElementChild.cloneNode(true);
    node.style.animationDelay = `${index * 80}ms`;
    node.querySelector(".edition-number").textContent = `Edition ${edition.number}`;
    node.querySelector(".edition-date").textContent = formatDate(edition.date);
    node.querySelector(".edition-title").textContent = edition.title;
    node.querySelector(".edition-summary").textContent = edition.information;
    node.querySelector(".edition-file").textContent = edition.file;

    const articleList = node.querySelector(".mini-articles");
    (edition.articles || []).slice(0, 3).forEach((article) => {
      const item = document.createElement("li");
      item.textContent = article;
      articleList.appendChild(item);
    });

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

function applySearch() {
  const query = editionSearch.value.trim();
  renderEditions(editions.filter((edition) => matchesEdition(edition, query)));
}

searchButton.addEventListener("click", applySearch);
editionSearch.addEventListener("input", applySearch);
editionSearch.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    event.preventDefault();
    applySearch();
  }
});

closeDialog.addEventListener("click", () => dialog.close());
dialog.addEventListener("click", (event) => {
  const rect = dialog.getBoundingClientRect();
  const isInDialog = rect.top <= event.clientY && event.clientY <= rect.top + rect.height && rect.left <= event.clientX && event.clientX <= rect.left + rect.width;

  if (!isInDialog) {
    dialog.close();
  }
});

editionForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const formData = new FormData(editionForm);
  const articles = String(formData.get("articles") || "")
    .split(/\r?\n/)
    .map((article) => article.trim())
    .filter(Boolean);

  const edition = window.registerCatalystEdition({
    number: formData.get("number"),
    information: formData.get("information"),
    date: formData.get("date"),
    file: formData.get("file"),
    articles
  });

  editions = Array.isArray(window.CATALYST_EDITIONS) ? [...window.CATALYST_EDITIONS] : [edition];
  editionForm.reset();
  editionSearch.value = "";
  renderEditions(editions);
  openEdition(edition);
});

renderEditions(editions);