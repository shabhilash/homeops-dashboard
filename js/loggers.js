function loadLoggerList(token) {
  fetch(baseURL + "/log-list", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to load logger list.");
      }
      return response.json();
    })
    .then((data) => {
      const loggers = data.loggers;
      const loggerTable = document.getElementById("logger-table-body");

      // Sort loggers based on log level priority (Critical first)
      const logLevelPriority = {
        DEBUG: 0,
        INFO: 1,
        WARNING: 2,
        ERROR: 3,
        CRITICAL: 4,
        NOTSET: 5,
      };

      loggers.sort(
        (a, b) => logLevelPriority[a.level] - logLevelPriority[b.level]
      );

      // Clear any existing rows before populating the table
      loggerTable.innerHTML = "";

      loggers.forEach((logger) => {
        // Create table row
        const row = document.createElement("tr");

        // Create Logger Name cell
        const loggerNameCell = document.createElement("td");
        loggerNameCell.textContent = logger.logger_name;
        row.appendChild(loggerNameCell);

        // Create Logger Level cell (dropdown)
        const loggerLevelCell = document.createElement("td");
        const levelSelect = document.createElement("select");

        // Define available log levels
        const levels = [
          "NOTSET",
          "DEBUG",
          "INFO",
          "WARNING",
          "ERROR",
          "CRITICAL",
        ];
        levels.forEach((level) => {
          const option = document.createElement("option");
          option.value = level;
          option.textContent = level;

          // If the logger's current level matches this option, mark it as selected
          if (level === logger.level) {
            option.selected = true; // Set the current log level as selected
          }

          levelSelect.appendChild(option);
        });

        loggerLevelCell.appendChild(levelSelect);
        row.appendChild(loggerLevelCell);

        // Create Save button cell with a simple icon (Unicode for save)
        const saveCell = document.createElement("td");
        const saveButton = document.createElement("button");
        saveButton.textContent = "💾"; // Save icon (Unicode)
        // saveButton.textContent = "Save";
        saveButton.classList.add("save-button");
        saveButton.onclick = () =>
          saveLogLevel(logger.logger_name, levelSelect.value);
        saveCell.appendChild(saveButton);
        row.appendChild(saveCell);

        // Append row to the table
        loggerTable.appendChild(row);
      });
    })
    .catch((error) => {
      console.error("Error loading loggers:", error);
      showToast(error.message, "error", 4000);
    });
}

// Function to save the updated log level
function saveLogLevel(loggerName, newLevel) {
  const token = localStorage.getItem("access_token");
  console.log(`Saving log level for ${loggerName} to ${newLevel}`);

  // Define the payload to send to the server
  const payload = {
    logger_name: loggerName,
    level: newLevel,
  };

  // Send a PUT request to update the log level on the server
  fetch(baseURL + "/log-level", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      // Include token in headers for authentication (if needed)
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to update log level.");
      }
      return response.json();
    })
    .then((data) => {
      console.log("Log level updated successfully:", data);
      showToast(
        `${loggerName} - Log level updated to ${newLevel} successfully!`,
        "info",
        2000
      );
      loadLoggerList(token);
    })
    .catch((error) => {
      console.error("Error updating log level:", error);
      showToast(`${loggerName} - Failed to update log level.`, "error", 4000);
    });
}

// Function to search loggers by name
function searchLoggers() {
  const searchQuery = document
    .getElementById("search-input")
    .value.toLowerCase();
  const rows = document.querySelectorAll("#logger-table-body tr");

  rows.forEach((row) => {
    const loggerName = row.cells[0].textContent.toLowerCase();
    if (loggerName.includes(searchQuery)) {
      row.style.display = ""; // Show the row
    } else {
      row.style.display = "none"; // Hide the row
    }
  });
}

// Add event listener for the search input field
document
  .getElementById("search-input")
  .addEventListener("input", searchLoggers);
