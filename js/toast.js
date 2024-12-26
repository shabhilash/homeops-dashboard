function showToast(message, type = "info", duration = 3000) {
  const toastContainer = document.getElementById("toast-container");
  // Create a new toast element
  const toast = document.createElement("div");
  toast.classList.add("toast", "show", type);

  // Add icon based on type
  const icon = document.createElement("span");
  icon.classList.add("icon");
  switch (type) {
    case "success":
      icon.textContent = "check_circle";
      break;
    case "error":
      icon.textContent = "error";
      break;
    case "info":
      icon.textContent = "info";
      break;
    case "warning":
      icon.textContent = "warning";
      break;
    default:
      icon.textContent = "notifications";
      break;
  }
  toast.appendChild(icon);

  // Add message text (support multiline content)
  const messageText = document.createElement("div");
  messageText.classList.add("message-text");
  messageText.textContent = message;
  toast.appendChild(messageText);

  // Add close button
  const closeButton = document.createElement("span");
  closeButton.classList.add("close-btn");
  closeButton.textContent = "close";
  closeButton.onclick = () => {
    toast.classList.remove("show");
    toast.addEventListener("transitionend", () => {
      toast.remove();
    });
  };
  toast.appendChild(closeButton);

  // Add copy button
  const copyButton = document.createElement("span");
  copyButton.classList.add("copy-btn");
  copyButton.textContent = "content_copy";
  copyButton.onclick = () => {
    navigator.clipboard.writeText(message).then(() => {
      copyButton.textContent = "check_circle"; // Change icon to confirm
      setTimeout(() => {
        copyButton.textContent = "content_copy"; // Reset after a second
      }, 1000);
    });
  };
  toast.appendChild(copyButton);

  // Add circular progress bar
  const circularProgress = document.createElement("div");
  circularProgress.classList.add("circular-progress");
  toast.appendChild(circularProgress);

  // Append the toast to the container
  toastContainer.appendChild(toast);

  // Ensure the toasts stack nicely with a small delay
  const allToasts = toastContainer.children;
  if (allToasts.length > 1) {
    let delay = (allToasts.length - 1) * 100; // Increment delay for stacking
    toast.style.animationDelay = `${delay}ms`;
  }

  let progress = 100;
  const decrement = 100 / (duration / 50); // Decrease every 50ms
  let elapsedTime = 0; // Track elapsed time

  // Set the progress bar width decrementally from 100%
  const progressInterval = setInterval(() => {
    if (elapsedTime >= duration) {
      clearInterval(progressInterval);
    }
    progress -= decrement;
    elapsedTime += 50; // Increment elapsed time by 50ms
    circularProgress.style.background = `conic-gradient(rgba(255, 255, 255, 0.5) ${progress}%, rgba(255, 255, 255, 0.1) ${progress}%)`;
  }, 50);

  // Stop the timer when hovering over the toast
  let timeoutId;
  toast.onmouseover = () => {
    clearTimeout(timeoutId);
    clearInterval(progressInterval); // Pause the progress bar
  };

  toast.onmouseleave = () => {
    // Calculate remaining time and resume the progress bar immediately
    const remainingTime = duration - elapsedTime; // Time left
    let remainingProgress = progress; // Progress left

    const resumeInterval = setInterval(() => {
      if (remainingProgress <= 0) {
        clearInterval(resumeInterval);
      }
      remainingProgress -= decrement;
      circularProgress.style.background = `conic-gradient(rgba(255, 255, 255, 0.5) ${remainingProgress}%, rgba(255, 255, 255, 0.1) ${remainingProgress}%)`;
    }, 50);

    timeoutId = setTimeout(() => {
      toast.classList.add("hide");
      toast.addEventListener("animationend", () => {
        toast.remove();
      });
    }, remainingTime);
  };

  // Auto-remove toast after specified duration
  timeoutId = setTimeout(() => {
    toast.classList.add("hide");
    toast.addEventListener("animationend", () => {
      toast.remove();
    });
  }, duration);
}
