let baseURL =
  localStorage.getItem("base_url") || "http://127.0.0.1:8000/api/v1";

// Function to save the token and expiration time
function saveToken(token, expiresIn, baseURL) {
  const expiresAt = new Date().getTime() + expiresIn * 1000; // Convert seconds to milliseconds
  localStorage.setItem("access_token", token);
  localStorage.setItem("expires_at", expiresAt);
  localStorage.setItem("base_url", baseURL);
}

// Function to check if the token is valid
function isTokenValid() {
  const token = localStorage.getItem("access_token");
  const expiresAt = localStorage.getItem("expires_at");

  // If no token or expired
  if (!token || !expiresAt) {
    return false;
  }

  // If the current time is less than the expiry time, token is valid
  const currentTime = new Date().getTime();
  return currentTime < expiresAt;
}

// Function to update the countdown timer
function updateTimer() {
  const expiresAt = localStorage.getItem("expires_at");
  if (!expiresAt) {
    return;
  }

  const currentTime = new Date().getTime();
  const timeLeft = expiresAt - currentTime;

  if (timeLeft <= 0) {
    // If the token has expired, stop the timer and log out
    showToast("Session Expired", "warning", 2000);
    logout();
  } else {
    // Calculate minutes and seconds
    const minutes = Math.floor(timeLeft / 60000);
    const seconds = Math.floor((timeLeft % 60000) / 1000);

    // Format time as MM:SS
    document.getElementById("timer").style.display = "block";
    document.getElementById("logout").style.display = "block";
    document.getElementById("sidebar").style.display = "block";
    document.getElementById("timer").innerText = `${String(minutes).padStart(
      2,
      "0"
    )}:${String(seconds).padStart(2, "0")}`;
  }
}

// Function to log out and clear session data
function logout() {
  // Clear session storage
  localStorage.removeItem("access_token");
  localStorage.removeItem("expires_at");

  // Hide actions container and show login form
  document.getElementById("login-form").style.display = "block";

  // Hide all elements with the class name "content-section"
  const contentSections = document.getElementsByClassName("content-section");
  for (let i = 0; i < contentSections.length; i++) {
    contentSections[i].style.display = "none";
  }
  let currentVisibleContainerId = null;
  document.getElementById("logout").style.display = "none";
  document.getElementById("sidebar").style.display = "none";
  document.getElementById("timer").innerText = "Session Expired";
  showToast("Logout Successful", "success", 1000);
}

// Check if token is valid on page load
document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("login-form");

  if (isTokenValid()) {
    // Token is valid, show the actions container and hide the login form
    loginForm.style.display = "none";

    // Start the timer
    setInterval(updateTimer, 1000); // Update the timer every second
  } else {
    // Token is not valid or expired, show login form
    loginForm.style.display = "block";
  }
});

// Store the currently visible container ID
let currentVisibleContainerId = null;

// Optimized function to toggle visibility of any container
function toggleContainerVisibility(containerId) {
  // If the requested container is already visible, do nothing
  if (currentVisibleContainerId === containerId) {
    return;
  }

  // If there's a currently visible container, hide it
  if (currentVisibleContainerId) {
    const currentContainer = document.getElementById(currentVisibleContainerId);
    if (currentContainer) {
      currentContainer.style.display = "none"; // Hide the current container
    }
  }

  // Get the requested container
  const container = document.getElementById(containerId);

  // Show the requested container
  if (container) {
    container.style.display = "block";
    currentVisibleContainerId = containerId; // Update the currently visible container
  }
}

// Show/Hide loggers-container (Logger Table) on button click
document
  .getElementById("loggers-button")
  .addEventListener("click", function () {
    // Load logger list (assuming the token is valid)
    const token = localStorage.getItem("access_token");
    loadLoggerList(token);
    toggleContainerVisibility("loggers-container");
  });

document
  .getElementById("service-button")
  .addEventListener("click", function () {
    toggleContainerVisibility("service-container");
  });
document.getElementById("stats-button").addEventListener("click", function () {
  toggleContainerVisibility("stats-container");
});
