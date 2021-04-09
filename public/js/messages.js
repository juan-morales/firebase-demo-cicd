const URL = 'http://localhost:5001/jcm-demo-cicd/us-central1/';

/**
 * UI elements
 */
const uiMessageList = document.querySelector('#messageList');
const uiFrmAddMessage = document.querySelector('#frmAddMessage');
const uiBtnNewMessage = document.querySelector('#btnNewMessage');
const uiMessageData = document.querySelector('#messageData');
const uiSectionAddMessage = document.querySelector('#addMessageSection');


/**
 * UI Event handlers
 */

uiFrmAddMessage.addEventListener('submit', async (event) => {
    event.preventDefault();
    const text = uiFrmAddMessage.children.message.value;
    let result = await addMessage(text);

    oCFrmNewMessage();

    if (result.error) {
        alert(result.error);
        return;
    }

    let messages = await listMessages();
    loadMessages(messages);
});

uiBtnNewMessage.addEventListener('click', (event) => {
    oCFrmNewMessage();
});

/**
 * UI Functions
 */
const loadMessages = (messages) => {
    let listItems = messages
    .map(element => `<li id="${element.id}">${element.data.original} / ${element.data.uppercase} <button class="btn-delete">Delete</button></li>`)
    .join('');

    uiMessageList.innerHTML = `<ul>${listItems}</ul>`;
};

const oCFrmNewMessage = () => {
    if (uiSectionAddMessage.hasAttribute('hidden')) {
        uiSectionAddMessage.removeAttribute('hidden');
    } else {
        uiSectionAddMessage.setAttribute('hidden', 'true');
    }
};

/**
 * API Functions
 */
const listMessages = async () => {
    const methodName = 'listMessages';
    
    return fetch(`${URL}${methodName}`)
    .then(response => response.json())
    .then(data => data.data)
    .catch(error => error);
};

const getMessage = async (id) => {
    const methodName = 'getMessage';

    return fetch(`${URL}${methodName}?id=${id}`)
    .then(response => response.json())
    .then(data => data)
    .catch(error => error);
};

const deleteMessage = async (id) => {
    const methodName = 'deleteMessage';

    return fetch(`${URL}${methodName}?id=${id}`)
    .then(response => response.json())
    .then(data => data)
    .catch(error => error);
};

const addMessage = async (text) => {
    const methodName = 'addMessage';

    return fetch(`${URL}${methodName}?text=${text}`)
    .then(response => response.json())
    .then(data => data)
    .catch(error => error);
};