// Function to get the saved token from localStorage
function getToken() {
  const token = localStorage.getItem("access_token");
  const expiresAt = localStorage.getItem("expires_at");

  if (token && expiresAt) {
    const currentTime = new Date().getTime();
    if (currentTime < expiresAt) {
      return token;
    } else {
      // Token has expired
      console.error("Token has expired.");
      return null;
    }
  }
  // No token found
  return null;
}

async function postServiceAction() {
  let baseURL =
    localStorage.getItem("base_url") || "http://127.0.0.1:8000/api/v1";

  // Check if baseURL is null or empty, then get it from the input field
  if (!baseURL) {
    baseURL = document.getElementById("baseurl").value;
  }

  const svc = document.getElementById("serviceInput").value;
  const action = document.getElementById("action").value;

  const responseDiv = document.getElementById("response");
  const loadingSpinner = document.getElementById("loadingSpinner");
  responseDiv.innerHTML = "";
  responseDiv.className = "status-card hidden";
  loadingSpinner.classList.remove("hidden");

  const token = getToken();
  if (!token) {
    responseDiv.className += " status-error";
    responseDiv.innerHTML = "Error: Authorization token is missing or expired.";
    responseDiv.classList.remove("hidden");
    loadingSpinner.classList.add("hidden");
    return;
  }

  try {
    const response = await fetch(
      `${baseURL}/server/service?svc=${encodeURIComponent(
        svc
      )}&action=${encodeURIComponent(action)}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({}),
      }
    );

    if (response.ok) {
      const data = await response.json();
      responseDiv.className += " status-active";
      responseDiv.innerHTML = `
                <p>Status: Success</p>
                <p>Message: ${
                  data.message || "Action executed successfully."
                }</p>
                <p>Service: ${svc}</p>
                <p>Action: ${action}</p>
            `;
    } else {
      const errorText = await response.text();
      let errorMsg = "Unknown error occurred.";
      try {
        const errorData = JSON.parse(errorText);
        errorMsg = errorData.detail;
      } catch (e) {
        errorMsg = errorText || errorMsg;
      }
      responseDiv.className += " status-error";
      responseDiv.innerHTML = `
                <p>Status: Error</p>
                <p>Message: ${errorMsg}</p>
                <p>Service: ${svc}</p>
                <p>Action: ${action}</p>
            `;
    }
  } catch (error) {
    responseDiv.className += " status-error";
    responseDiv.innerHTML = `
            <p>Status: Error</p>
            <p>Message: ${error.message}</p>
            <p>Service: ${svc}</p>
            <p>Action: ${action}</p>
        `;
  }

  loadingSpinner.classList.add("hidden");
  responseDiv.classList.remove("hidden");
}

async function getServiceStatus() {
  let baseURL =
    localStorage.getItem("base_url") || "https://127.0.0.1:8000/api/v1";

  // Check if baseURL is null or empty, then get it from the input field
  if (!baseURL) {
    baseURL = document.getElementById("baseurl").value;
  }

  const serviceInput = document.getElementById("serviceInput").value;
  const apiUrl = `${baseURL}/server/service?svc=${serviceInput}`;

  // Show the loading spinner and hide the service status card initially
  document.getElementById("loadingSpinner").classList.remove("hidden");
  document.getElementById("serviceStatus").classList.add("hidden");

  try {
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status}`);
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
      showToast(
        `${data.service ? data.service : "N/A"} is ${data.status}`,
        "success",
        1500
      );
    } else if (data.status === "inactive") {
      statusElement.classList.add("status-inactive");
      cardElement.classList.add("status-inactive");
      showToast(
        `${data.service ? data.service : "N/A"} is ${data.status}`,
        "error",
        1500
      );
    } else {
      // Remove both active and inactive classes
      statusElement.classList.remove("status-active", "status-inactive");
      cardElement.classList.remove("status-active", "status-inactive");
      showToast(
        `${data.service ? data.service : "N/A"} is ${data.status}`,
        "info",
        1500
      );
    }
  }

  // Show the service status card
  cardElement.classList.remove("hidden");
}
