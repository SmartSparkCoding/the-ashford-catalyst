window.CATALYST_MEMBERS = [
  {
    name: "Jacob Navaratne",
    role: "Editor",
    roleLead: 1,
    link: "http://jacob.navaratne.studio/",
    description: "Year 9 at [HIDDEN] School, a Computer Science, Maths and Physics enthusiast, Academic Scholar and swimmer. He helped create the idea during a Biology project on Charles Darwin."
  },
  {
    name: "William [HIDDEN]",
    role: "Editor",
    roleLead: 1,
    link: "",
    description: "Year 9 at [HIDDEN] School, Academic Scholar, Drama Scholar and Sport Scholar. He enjoys Biology, Geography and swimming, and helped shape the magazine with Jacob."
  },
  {
    name: "Zachary [HIDDEN]",
    role: "Editor",
    roleLead: 2,
    link: "",
    description: "Academic, Music and Drama scholar, air cadet and EDI Ambassador. He is passionate about aviation and the Airbus A350-900ULR, alongside Maths and Physics."
  },
  {
    name: "William [HIDDEN]",
    role: "Editor",
    roleLead: 2,
    link: "",
    description: "A core member of the magazine team, helping bring the publication together as a science-led project with a bold, modern style."
  },
  { 
    name: "[HIDDEN TEACHER NAME]",
    role: "Guest",
    roleLead: 3,
    link: "",
    description: "A teacher at [HIDDEN] School who has supported the magazine with advice and guidance, and contributed to the first issue."
  }
];

window.registerCatalystMember = function registerCatalystMember(member) {
  if (!member || !member.name) {
    throw new Error("Member name is required.");
  }

  const normalized = {
    name: String(member.name).trim(),
    role: String(member.role || "Editor").trim(),
    roleLead: Number(member.roleLead || member.priority || 99),
    link: String(member.link || member.url || "").trim(),
    description: String(member.description || "").trim()
  };

  window.CATALYST_MEMBERS = window.CATALYST_MEMBERS || [];
  window.CATALYST_MEMBERS.push(normalized);
  return normalized;
};
