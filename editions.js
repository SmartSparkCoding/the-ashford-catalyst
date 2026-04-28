window.CATALYST_EDITIONS = [
  {
    number: "1",
    title: "Issue 1: The Ashford Catalyst Launches",
    information: "The first issue introduces Charles Darwin, and many scientific pioneers",
    date: "2026-01-15",
    file: "editions/issue-1.pdf",
    articles: [
      "Charles Darwin",
      "Stephen Hawking",
      "Electron Microscopes",
      "Discovery of the Cell",
      "2025 Physics Nobel Prize",
      "Under the Modern Scope",
      "AS Space Experiment",
      "Ball's Pyramid"
    ]
  }
];

window.registerCatalystEdition = function registerCatalystEdition(edition) {
  if (!edition || !edition.number || !edition.file) {
    throw new Error("Edition number and file are required.");
  }

  const normalized = {
    number: String(edition.number).trim(),
    title: edition.title ? String(edition.title).trim() : `Edition ${edition.number}`,
    information: String(edition.information || edition.summary || "").trim(),
    date: String(edition.date || "").trim(),
    file: String(edition.file).trim(),
    articles: Array.isArray(edition.articles)
      ? edition.articles.map((article) => String(article).trim()).filter(Boolean)
      : []
  };

  window.CATALYST_EDITIONS = window.CATALYST_EDITIONS || [];
  window.CATALYST_EDITIONS.unshift(normalized);
  return normalized;
};