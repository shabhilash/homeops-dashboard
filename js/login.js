document
  .getElementById("login-form-submit")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    // Get input values
    const baseURL = document.getElementById("baseurl").value;
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    // Show the loader and disable the inputs
    document.getElementById("loading-container").style.display = "block";
    document.getElementById("username").disabled = true;
    document.getElementById("password").disabled = true;
    document.getElementById("baseurl").disabled = true;
    document.querySelector("button").disabled = true;

    // Prepare login data using URLSearchParams
    const loginData = new URLSearchParams();
    loginData.append("username", username);
    loginData.append("password", password);

    // Make the login request using fetch
    fetch(baseURL + "/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded", // Ensure form encoding
      },
      body: loginData.toString(), // Send the data as a URL-encoded string
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(
            "Login failed! Please check your username and password."
          );
        }
        return response.json();
      })
      .then((data) => {
        // Get the token from the response and save it
        const token = data.access_token;
        const expiresIn = data.expires_in;

        // Save the token and expiration time
        saveToken(token, expiresIn, baseURL);

        // Hide the login form and show the action buttons
        document.getElementById("login-form").style.display = "none";
        document.getElementById("sidebar").style.display = "block";

        // Show success toast message using existing showToast function
        showToast("Welcome, " + username.toUpperCase(), "success", 1000);

        // Start the timer
        setInterval(updateTimer, 1000); // Update the timer every second
      })
      .catch((error) => {
        console.error("Error logging in:", error); // Log the error message

        // Show error toast message using existing showToast function
        showToast(error.message, "error", 3000);
      })
      .finally(() => {
        // Hide the loader and re-enable the inputs
        document.getElementById("loading-container").style.display = "none";
        document.getElementById("username").disabled = false;
        document.getElementById("password").disabled = false;
        document.getElementById("baseurl").disabled = false;
        document.querySelector("button").disabled = false;
      });
  });
