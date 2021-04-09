const URLMessages = '/messages/';

/**
 * UI elements
 */
const uiMessageList = document.querySelector('#messageList');
const uiFrmAddMessage = document.querySelector('#frmAddMessage');
const uiBtnNewMessage = document.querySelector('#btnNewMessage');
const uiMessageData = document.querySelector('#messageData');
const uiSectionAddMessage = document.querySelector('#addMessageSection');
const uiDeleteBtnClick = document.querySelector('.btn-delete');

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
    .map(element => `<li id="${element.id}">${element.data.original} / ${element.data.uppercase} <button class="btn-delete" onclick="uiDeleteMessage('${element.id}')">Delete</button></li>`)
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

const uiLoadMessages = async () => {
    let messages = await listMessages();
    loadMessages(messages);
};

const uiDeleteMessage = async (id) => {
    await deleteMessage(id);
    uiLoadMessages();
};

/**
 * API Functions
 */
const listMessages = async () => {
    const response =  await fetch(
        `${URLMessages}`,
        {
            method: 'GET',
            mode: 'cors',
            headers: {
                'Content-Type' : 'application/json'
            },
        }
    )
    .then(response => response.json())
    .then(data => data.data)
    .catch(error => error);

    return response;
};

const getMessage = async (id) => {
    const response =  await fetch(
        `${URLMessages}` + new URLSearchParams({
            id: id
        }),
        {
            method: 'GET',
            mode: 'cors',
            headers: {
                'Content-Type' : 'application/json'
            },
        }
    )
    .then(response => response.json())
    .then(data => data.data)
    .catch(error => error);

    return response;
};

const deleteMessage = async (id) => {
    const response =  await fetch(
        `${URLMessages}`,
        {
            method: 'DELETE',
            mode: 'cors',
            headers: {
                'Content-Type' : 'application/json'
            },
            body: JSON.stringify({
                id: id
            })
        }
    )
    .then(response => response.json())
    .then(data => data)
    .catch(error => error);

    return response;
};

const addMessage = async (text) => {
    const response =  await fetch(
        `${URLMessages}`,
        {
            method: 'POST',
            mode: 'cors',
            headers: {
                'Content-Type' : 'application/json'
            },
            body: JSON.stringify({
                text: text
            })
        }
    )
    .then(response => response.json())
    .then(data => data)
    .catch(error => error);

    return response;
};