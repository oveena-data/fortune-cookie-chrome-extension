async function getMessageOfDay() {
  try {
    const res = await fetch(chrome.runtime.getURL("messages.json"));
    const messages = await res.json();

    const now = Date.now();

    chrome.storage.local.get(['lastTimestamp', 'lastMessage'], (data) => {
      const twelveHours = 12 * 60 * 60 * 1000;

      if (data.lastTimestamp && now - data.lastTimestamp < twelveHours) {
        // Show stored message
        displayMessage(data.lastMessage);
        startCountdown(data.lastTimestamp + twelveHours);
      } else {
        // Pick a new one
        const message = messages[Math.floor(Math.random() * messages.length)];
        chrome.storage.local.set({ lastTimestamp: now, lastMessage: message });
        displayMessage(message);
        startCountdown(now + twelveHours);
      }
    });
  } catch (error) {
    document.getElementById("fortune").innerText = "No cookie today 😢";
    console.error("Error loading messages:", error);
  }
}

function displayMessage(msg) {
  document.getElementById("fortune").innerText = msg;
}

function startCountdown(nextTimestamp) {
  const timerEl = document.getElementById("countdown");

  function updateCountdown() {
    const remaining = nextTimestamp - Date.now();

    if (remaining <= 0) {
      timerEl.innerText = "Your Cookie is now Ready! 🔁 Refresh";
      return;
    }

    const hours = Math.floor(remaining / (1000 * 60 * 60));
    const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((remaining % (1000 * 60)) / 1000);

    timerEl.innerText = `Next Cookie In: ${hours}h ${minutes}m ${seconds}s`;
    setTimeout(updateCountdown, 1000);
  }

  updateCountdown();
}

document.addEventListener("DOMContentLoaded", getMessageOfDay);
