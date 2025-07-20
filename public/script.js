async function loadMessage() {
  try {
    const messageElement = document.querySelector('.message');
    messageElement.innerHTML = '<p>Loading...</p>'; // Loading state
    
    const res = await fetch('/api/message');
    if (!res.ok) throw new Error('API request failed');
    
    const data = await res.json();
    messageElement.innerHTML = `<p>${data.text}</p>`;
  } catch (err) {
    console.error('Error:', err);
    document.querySelector('.message').innerHTML = 
      '<p>🌌 The void is silent... Try again later.</p>';
  }
}

document.querySelector('form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const input = document.querySelector('#user-message');
  const button = document.querySelector('button[type="submit"]');
  const message = input.value.trim();

  if (message) {
    try {
      button.disabled = true;
      button.textContent = 'Sending...';
      
      const res = await fetch('/api/message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: message })
      });
      
      if (!res.ok) throw new Error('Failed to send');
      
      input.value = '';
      await loadMessage(); // Refresh with new message
    } catch (err) {
      console.error('Error:', err);
      alert('Failed to send message. Check console for details.');
    } finally {
      button.disabled = false;
      button.textContent = 'Leave it in the void';
    }
  }
});

// Initial load
window.addEventListener('DOMContentLoaded', loadMessage);