async function getMessageOfDay() {
  try {
    const res = await fetch(chrome.runtime.getURL('messages.json'));
    const messages = await res.json();

    const today = new Date().toISOString().split('T')[0];

    chrome.storage.local.get(['lastDate', 'lastMessage'], function(data) {
      if (data.lastDate === today) {
        document.getElementById("fortune").innerText = data.lastMessage;
      } else {
        const message = messages[Math.floor(Math.random() * messages.length)];
        chrome.storage.local.set({ lastDate: today, lastMessage: message });
        document.getElementById("fortune").innerText = message;
      }
    });
  } catch (error) {
    document.getElementById("fortune").innerText = "No luck today! 😢";
    console.error("Error loading messages.json:", error);
  }
}

getMessageOfDay();
