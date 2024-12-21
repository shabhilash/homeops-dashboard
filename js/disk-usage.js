// Fetch Disk Usage Data
async function fetchDiskUsage() {
  let baseURL =
    localStorage.getItem("base_url") || "https://127.0.0.1:8000/api/v1";

  if (!baseURL) {
    baseURL = document.getElementById("baseurl").value;
  }

  const apiUrl = `${baseURL}/server/disk-usage`;

  document.getElementById("loadingSpinner").classList.remove("hidden");
  document.getElementById("stats-container").classList.add("hidden");

  try {
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    displayDiskStats(data);
  } catch (error) {
    console.error("Error fetching disk usage:", error);
    displayError(error);
  } finally {
    document.getElementById("loadingSpinner").classList.add("hidden");
  }
}

// Fetch CPU Usage Data
async function fetchCPUUsage() {
  let baseURL =
    localStorage.getItem("base_url") || "https://127.0.0.1:8000/api/v1";

  if (!baseURL) {
    baseURL = document.getElementById("baseurl").value;
  }

  const apiUrl = `${baseURL}/server/cpu-usage`;

  try {
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    displayCPUUsage(data);
  } catch (error) {
    console.error("Error fetching CPU usage:", error);
    displayError(error);
  }
}

// Fetch Memory Usage Data
async function fetchMemoryUsage() {
  let baseURL =
    localStorage.getItem("base_url") || "https://127.0.0.1:8000/api/v1";

  if (!baseURL) {
    baseURL = document.getElementById("baseurl").value;
  }

  const apiUrl = `${baseURL}/server/memory-usage`;

  try {
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    displayMemoryUsage(data);
  } catch (error) {
    console.error("Error fetching memory usage:", error);
    displayError(error);
  }
}

// Display Disk Stats
function displayDiskStats(data) {
  const statsContainer = document.getElementById("stats-container");
  const statsCardContainer = statsContainer.querySelector(
    ".stats-card-container"
  );
  statsCardContainer.innerHTML = "";

  if (data.length === 0) {
    statsCardContainer.innerHTML = "<p>No data available</p>";
    statsContainer.classList.remove("hidden");
    return;
  }

  data.forEach((disk) => {
    const card = document.createElement("div");
    card.classList.add("stats-card");

    const cardContent = `
        <h3>${disk.mountpoint}</h3>
        <div class="progress-bar">
          <div class="used-bar" style="width: ${disk.percent_used}">
            <div class="tooltip">Used: ${disk.used} of ${disk.total} (${
      disk.percent_used
    }%)</div>
          </div>
          <div class="free-bar" style="width: calc(100% - ${
            disk.percent_used
          })">
            <div class="tooltip">Free: ${disk.free} of ${disk.total} (${
      100 - parseInt(disk.percent_used)
    }%)</div>
          </div>
        </div>
        <p class="percentage">${disk.percent_used}%</p>
        <div class="disk-info">
          <p>Device: ${disk.device}</p>
          <p>Total: ${disk.total}</p>
          <p>Used: ${disk.used}</p>
          <p>Free: ${disk.free}</p>
        </div>
      `;
    card.innerHTML = cardContent;
    statsCardContainer.appendChild(card);
  });
}

// Display CPU Usage
function displayCPUUsage(data) {
  const statsContainer = document.getElementById("stats-container");
  const statsCardContainer = statsContainer.querySelector(
    ".stats-card-container"
  );

  const cpuCard = document.createElement("div");
  cpuCard.classList.add("stats-card");

  const cardContent = `
        <h3>CPU Usage</h3>
        <p>${data.cpu_usage}</p>
      `;
  cpuCard.innerHTML = cardContent;
  statsCardContainer.appendChild(cpuCard);
}

// Display Memory Usage
function displayMemoryUsage(data) {
  const statsContainer = document.getElementById("stats-container");
  const statsCardContainer = statsContainer.querySelector(
    ".stats-card-container"
  );

  const memoryCard = document.createElement("div");
  memoryCard.classList.add("stats-card");

  const cardContent = `
        <h3>Memory Usage</h3>
        <p>${data.memory_usage_percent}</p>
      `;
  memoryCard.innerHTML = cardContent;
  statsCardContainer.appendChild(memoryCard);
}

// Display Error
function displayError(error) {
  const statsContainer = document.getElementById("stats-container");
  const statsCardContainer = statsContainer.querySelector(
    ".stats-card-container"
  );
  statsCardContainer.innerHTML = `<div class="stats-card"><h3>Error fetching data</h3><p>${error.message}</p></div>`;
  statsContainer.classList.remove("hidden");
}

// Load All Stats
async function loadStats() {
  document.getElementById("loadingSpinner").style.display = "block";
  try {
    // Fetching Disk Stats
    await fetchDiskUsage();

    // Fetching CPU Usage
    await fetchCPUUsage();

    // Fetching Memory Usage
    await fetchMemoryUsage();
  } catch (error) {
    console.error("Error loading stats:", error);
  } finally {
    document.getElementById("loadingSpinner").style.display = "none";
  }
}

// Trigger loading stats when the button is clicked
document.getElementById("stats-button").addEventListener("click", loadStats);
