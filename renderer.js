const toggleSidebarBtn = document.getElementById('toggle-sidebar');
const sidebar = document.getElementById('sidebar');
const chatList = document.getElementById("contact-list")
const homeButton = document.getElementById("home")
let footerStat = false
let messages = {}
let token = ""
let chatData;
data = {}
fetch('contacts.json')
    .then(response => response.json())
    .then(data => {
        chatData = data
    })
    .catch(error => console.error("Error fetching JSON:", error));

function createButton() {
    return document.createElement("button");
}

homeButton.addEventListener('click', () => {
    let main = document.getElementById("main-screen");
    let title = document.createElement('h1');
    let sndTitle = document.createElement('h2');
    let paragraph = document.createElement('p');
    let code = document.createElement('code');
    let hr = document.createElement("hr");
    hr.id = "main-hr"
    title.innerHTML = "A Messaging Application";
    sndTitle.innerHTML = "Token: ";
    paragraph.innerHTML = "Give it to your friends so they can add you";
    paragraph.id = "small"
    code.innerHTML = token
    while (main.firstChild) main.firstChild.remove();

    main.appendChild(title);
    main.appendChild(hr)
    main.appendChild(sndTitle);
    sndTitle.appendChild(code);
    main.appendChild(paragraph);
    sidebar.classList.toggle("open");
})

toggleSidebarBtn.addEventListener('click', () => {
    sidebar.classList.toggle('open');
    if (footerStat === true) {
        try {
            let footer = document.getElementById("chat-footer");
            footer.classList.toggle("hidden")
        } catch (err) {
            console.log(err)
        }
    }
});

const contactButton = document.getElementById('contact-button');
contactButton.addEventListener('click', async () => {
    await window.electron.contactShow()
});

window.electron.loadChats((event, values) => {
    for (const [key, value] of Object.entries(values)) {
        messages[key] = [];
        try {
            messages[key].push(...chatData[key]['chats']);
        } catch (err) {
            console.log(err)
        }
        let node = document.createElement("li");
        let button = createButton();
        button.id = key
        button.innerHTML = `${value['name']}`
        button.className = "button-list"
        button.onclick = () => {
            handling(value['name'], key)
        }
        button.oncontextmenu = ctxMenu;
        node.appendChild(button)
        chatList.appendChild(node)
    }

})

window.electron.sendToken((event, value) => {
    token = value['token']
    document.getElementById("token").innerHTML = token;
})

window.electron.onChatUpdate((event, values) => {
    const node = document.createElement("li");
    let button = createButton();
    messages[values[1]] = [];
    button.id = values[1];
    button.innerHTML = values[0];
    button.className = "button-list";
    button.oncontextmenu = ctxMenu;
    button.onclick = () => {
        handling(values[0], values[1]);
    }
    node.appendChild(button);
    chatList.appendChild(node);

})

window.electron.getChats((event) => {
    const listItems = document.getElementById("contact-list").getElementsByTagName('li')
    for (const listItem of listItems) {
        let button = listItem.firstChild;
        data[button.id] = {
            name: button.textContent,
            chats: messages[button.id]
        };
    }
    event.sender.send('chatData', data);

})


function handling(name, tokenChat) {
    sidebar.classList.toggle('open');
    let main = document.getElementById("main-screen")
    while (main.firstChild) main.firstChild.remove();
    let title = document.createElement("h1");
    let hr = document.createElement('hr')
    let textArea = document.createElement('div')
    let chatContainer = document.createElement("div")
    chatContainer.id = "chat-container"
    textArea.id = "text-area"
    hr.id = "chat-hr"
    title.innerHTML = `This is the beginning of your chat with ${name}`;
    chatContainer.appendChild(textArea)
    main.appendChild(title);
    main.appendChild(hr)
    main.appendChild(chatContainer)
    let footerContainer = document.createElement('div')
    let footerInput = document.createElement('input')
    let footer = document.createElement('footer')
    footerInput.type = "text"
    footerInput.placeholder = "Type your message here..."
    footerInput.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
            sendInput(event, textArea, tokenChat);
        }
    });
    footerContainer.className = "message-input-container"
    footer.id = "chat-footer"
    footerContainer.appendChild(footerInput)
    footer.appendChild(footerContainer)
    main.appendChild(footer)
    footerStat = true;
    chatLoader(chatData[tokenChat])
}

const ctxMenu = (event) => {
    event.preventDefault();
    let customCMenu = document.getElementById("custom-context");
    customCMenu.style.display = "block";
    customCMenu.style.left = event.pageX + "px";
    customCMenu.style.top = event.pageY + "px";
    customCMenu.addEventListener("click", () => {
        delChat(event.target.id);
        console.log(event.target.id)
        customCMenu.style.display = "none";
    });
    customCMenu.addEventListener("mouseleave", () => {
        customCMenu.style.display = "none";
    });
}

function delChat(id) {
    let chat = document.getElementById(id);
    delete chatData[id];
    chat.parentElement.remove();
}

function sendInput(event, textArea, tokenChat) {
    event.preventDefault();
    if (event.target.value === " ") {
        event.target.value = "";
        return;
    }
    chatData[tokenChat]['chats'].push(["sent", event.target.value]);
    addMessage(textArea, event.target.value)
    window.scrollTo(0, document.body.scrollHeight);
    event.target.value = "";
}

function chatLoader(data) {
    let chats = data['chats'];
    for (const chat of chats) {
        addMessage(document.getElementById("text-area"), chat[1])
    }


}

function addMessage(textArea, messageText) {
    let message = document.createElement("div");
    let messageTextHolder = document.createElement("p");
    messageTextHolder.innerHTML = messageText;
    message.className = "message";
    message.appendChild(messageTextHolder);
    textArea.appendChild(message);
}
