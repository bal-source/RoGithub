const chatBox = document.getElementById('chatBox');
const messageInput = document.getElementById('messageInput');
const sendBtn = document.getElementById('sendBtn');

// Replace with your Cloudflare Worker URL
const BACKEND_URL = 'https://roadblocks.spc78787.workers.dev';

async function fetchMessages() {
  try {
    const res = await fetch(`${BACKEND_URL}/messages`);
    const data = await res.json();

    chatBox.innerHTML = '';
    data.forEach(msg => {
      const div = document.createElement('div');
      div.classList.add('message');
      div.innerHTML = `<span class="timestamp">[${new Date(msg.timestamp).toLocaleTimeString()}]</span> <span class="playerName">${msg.playerName}:</span> ${msg.message}`;
      chatBox.appendChild(div);
    });
    chatBox.scrollTop = chatBox.scrollHeight;
  } catch (err) {
    console.error('Error fetching messages:', err);
  }
}

// Send a message from dashboard
sendBtn.onclick = async () => {
  const message = messageInput.value.trim();
  if (!message) return;

  const data = { displayName: "Admin", message, ip: "frontend" };
  try {
    await fetch(`${BACKEND_URL}/github`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    messageInput.value = '';
    fetchMessages();
  } catch (err) {
    console.error('Error sending message:', err);
  }
}

// Poll every 2 seconds
setInterval(fetchMessages, 2000);
fetchMessages();
