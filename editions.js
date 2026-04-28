window.CATALYST_EDITIONS = [
  {
    number: "1",
    title: "Launch Edition",
    information: "The first issue introduces The Ashford Catalyst and the ideas that started it.",
    date: "2026-04-28",
    file: "editions/issue-1.pdf",
    articles: [
      "Why Charles Darwin still matters",
      "How science shapes the world around us",
      "Meet the Year 9 editors"
    ]
  },
  {
    number: "2",
    title: "Flight and Forces",
    information: "An issue focused on aviation, physics and the ideas that keep aircraft in the sky.",
    date: "2026-05-05",
    file: "editions/issue-2.pdf",
    articles: [
      "The science of lift",
      "Airbus A350-900ULR spotlight",
      "Physics in everyday motion"
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