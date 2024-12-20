async function getServiceStatus() {
  let baseURL =
    localStorage.getItem("base_url") || "https://127.0.0.1:8000/api/v1";

  // Check if baseURL is null or empty, then get it from the input field
  if (!baseURL) {
    baseURL = document.getElementById("baseurl").value;
  }

  const serviceInput = document.getElementById("serviceInput").value;
  const apiUrl = `${baseURL}/service?svc=${serviceInput}`;

  // Show the loading spinner and hide the service status card initially
  document.getElementById("loadingSpinner").classList.remove("hidden");
  document.getElementById("serviceStatus").classList.add("hidden");

  try {
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    displayServiceStatus(data);
  } catch (error) {
    console.error("Error fetching service status:", error);
    displayServiceStatus(null, error);
  } finally {
    // Hide the loading spinner and show the status card once data is processed
    document.getElementById("loadingSpinner").classList.add("hidden");
  }
}

function displayServiceStatus(data, error = null) {
  const statusElement = document.querySelector("#status span");
  const serviceElement = document.querySelector("#service span");
  const cardElement = document.getElementById("serviceStatus");

  // Remove all previous status classes
  statusElement.classList.remove(
    "status-active",
    "status-inactive",
    "status-error"
  );
  cardElement.classList.remove(
    "status-active",
    "status-inactive",
    "status-error"
  );

  // Handle error case
  if (error) {
    statusElement.textContent = "Error";
    serviceElement.textContent = error.message;
    cardElement.classList.add("status-error");
  } else {
    // Update with fetched status data
    statusElement.textContent = data.status;
    serviceElement.textContent = data.service ? data.service : "N/A";

    // Add status-specific styling
    if (data.status === "active") {
      statusElement.classList.add("status-active");
      cardElement.classList.add("status-active");
    } else if (data.status === "inactive") {
      statusElement.classList.add("status-inactive");
      cardElement.classList.add("status-inactive");
    } else {
      // Remove both active and inactive classes
      statusElement.classList.remove("status-active", "status-inactive");
      cardElement.classList.remove("status-active", "status-inactive");
    }

    // Show toast message
    showToast(
      `${data.service ? data.service : "N/A"} is ${data.status}`,
      "info",
      1000
    );
  }

  // Show the service status card
  cardElement.classList.remove("hidden");
}
