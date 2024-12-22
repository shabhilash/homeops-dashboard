// Define the sidebar items
const sidebarItems = [
  { id: "loggers-button", text: "HomeOps Loggers", href: "javascript:void(0)" },
  { id: "service-button", text: "Service", href: "javascript:void(0)" },
  { id: "stats-button", text: "System Stats", href: "javascript:void(0)" },
  {
    id: "",
    text: "API",
    href: "https://github.com/shabhilash/homeops-api",
    external: true,
  },
  {
    id: "",
    text: "Dashboard",
    href: "https://github.com/shabhilash/homeops-dashboard",
    external: true,
  },
];

// Get the sidebar container
const sidebar = document.getElementById("sidebar");

// Get the <ul> inside the sidebar
const sidebarList = sidebar.querySelector("ul");

// Function to create a sidebar item
function createSidebarItem(item) {
  const li = document.createElement("li");
  const a = document.createElement("a");
  a.className = "button";
  if (item.id) a.id = item.id;
  a.href = item.href;
  a.textContent = item.text;

  if (item.external) {
    a.target = "_blank";
    const span = document.createElement("span");
    span.className = "material-icons";
    span.style.fontSize = "16px";
    span.style.color = "red";
    span.textContent = "arrow_outward";
    a.appendChild(span);
  }

  li.appendChild(a);
  return li;
}

// Add the sidebar items to the <ul> container
function populateSidebar() {
  sidebarItems.forEach((item) => {
    sidebarList.appendChild(createSidebarItem(item));
  });

  if (baseURL) {
    const docsItem = {
      id: "docs-button",
      text: "Documentation",
      href: `${baseURL}/docs`,
      external: true,
    };
    sidebarList.appendChild(createSidebarItem(docsItem));
  } else {
    console.debug("Base URL is missing in localStorage.");
  }
}

// Initialize sidebar only once
if (!sidebarList.children.length) {
  populateSidebar();
}

// Show/Hide loggers-container (Logger Table) on button click
function addClickListener(buttonId, containerId, callback) {
  document.getElementById(buttonId).addEventListener("click", function () {
    if (callback) callback();
    toggleContainerVisibility(containerId);
  });
}

// Define specific callbacks
const loadLoggersCallback = () => {
  const token = localStorage.getItem("access_token");
  if (!token) {
    console.error("Access token is missing!");
    return;
  }
  loadLoggerList(token);
};

// Add event listeners
addClickListener("loggers-button", "loggers-container", loadLoggersCallback);
addClickListener("service-button", "service-container");
addClickListener("stats-button", "stats-container");
