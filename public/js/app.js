document.addEventListener('DOMContentLoaded', async function() {
    let messages = await listMessages();
    loadMessages(messages);
});