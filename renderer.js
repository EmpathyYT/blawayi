const toggleSidebarBtn = document.getElementById('toggle-sidebar');
const sidebar = document.getElementById('sidebar');
const chatList = document.getElementById("contact-list")
const homeButton = document.getElementById("home")
let loginForm = document.getElementById("loginForm");
let footerStat = false
let spinnerCont = document.createElement("div");
spinnerCont.id = "spinner-container";
let token = ""
let chatData;
data = {}
fetch('./storedData/contacts.json')
    .then(response => response.json())
    .then(data => {
        chatData = data
    })
    .catch(error => console.error("Error fetching JSON:", error));

function createButton() {
    return document.createElement("button");
}

homeButton.addEventListener('click', () => mainScreenTog())

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
    loginScreen()
    /*
    for (const [key, value] of Object.entries(values)) {
        let node = document.createElement("li");
        let button = createButton();
        button.id = key
        button.innerHTML = `${value['name']}`
        button.oncontextmenu = ctxMenu;
        button.className = "button-list"
        if (chatData[token]?.chats === undefined) {
            createObj(token, name)
        }
        button.onclick = () => {
            handling(value['name'], key)
        }
        button.oncontextmenu = ctxMenu;
        node.appendChild(button)
        chatList.appendChild(node)
    }
*/

})

window.electron.sendToken((event, value) => {
    token = value['token']
    document.getElementById("token").innerHTML = token;
})

window.electron.onChatUpdate((event, values) => {
    const node = document.createElement("li");
    let button = createButton();
    button.id = values[1];
    button.innerHTML = values[0];
    button.className = "button-list";
    button.oncontextmenu = ctxMenu;
    if (chatData[values[1]]?.chats === undefined) {
        createObj(values[1], values[0])
    }
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
            chats: chatData[button.id]['chats']
        };
    }
    event.sender.send('chatData', data);

})

function loginScreen() {
    let mainscreen = document.getElementById("main-screen");
    let maincontent = document.getElementById("main-content");
    let tokenLogin = document.createElement("input");
    let passLogin = document.createElement("input");
    let subutton = document.createElement("button");
    let container = document.createElement("div");
    let formTitle = document.createElement("h2");
    formTitle.classList.add("form-title")
    mainscreen.style.display = "none";
    maincontent.style.display = "none";
    subutton.type = "submit";
    subutton.innerHTML = "Login"
    tokenLogin.type = "text";
    tokenLogin.name = "Token";
    tokenLogin.placeholder = "Enter your token";
    passLogin.type = "text";
    passLogin.name = "Password";
    passLogin.placeholder = "Enter your password"
    formTitle.innerHTML = "Welcome Back!"
    loginForm.classList.add("login-form");
    loginForm.id = "loginForm"
    container.classList.add("container", "center");
    container.id = "logincontain"
    loginForm.appendChild(tokenLogin);
    loginForm.appendChild(passLogin);
    loginForm.appendChild(subutton);
    container.appendChild(formTitle)
    container.appendChild(loginForm)
    document.body.appendChild(container);
}

loginForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    let container = document.getElementById("logincontain")
    document.body.removeChild(container);
    spinnerCont.classList.add("spinner-container", "center")

    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("width", "100");
    svg.setAttribute("height", "100");
    svg.setAttribute("viewBox", "0 0 100 100");

    const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    rect.setAttribute("x", "25");
    rect.setAttribute("y", "25");
    rect.setAttribute("width", "50");
    rect.setAttribute("height", "50");
    rect.setAttribute("rx", "10");
    rect.setAttribute("ry", "10");
    rect.setAttribute("fill", "none");
    rect.setAttribute("stroke", "#40414f");
    rect.setAttribute("stroke-width", "5");

    const animate = document.createElementNS("http://www.w3.org/2000/svg", "animateTransform");
    animate.setAttribute("attributeName", "transform");
    animate.setAttribute("type", "rotate");
    animate.setAttribute("from", "0 50 50");
    animate.setAttribute("to", "360 50 50");
    animate.setAttribute("dur", "1s");
    animate.setAttribute("repeatCount", "indefinite");
    svg.classList.add("spinner-circle")
    rect.appendChild(animate);
    svg.appendChild(rect);
    spinnerCont.appendChild(svg);
    document.body.appendChild(spinnerCont);
    const formData = new FormData(loginForm);
    const token = formData.get('Token');
    const password = formData.get('Password');
    const couple = {
        token: token,
        password: password
    }
    await window.electron.send('authenticate', couple);
})


function handling(name, tokenChat) {
    sidebar.classList.toggle('open');
    let main = document.getElementById("main-screen")
    while (main.firstChild) main.firstChild.remove();
    let title = document.createElement("h1");
    let hr = document.createElement('hr')
    let textArea = document.createElement('div')
    let chatContainer = document.createElement("div")
    chatContainer.id = "chat-cont"
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
    footerContainer.className = "MIC"
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
    mainScreenTog();
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

function mainScreenTog() {
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
}

function createObj(tokenChat, name) {
    chatData[tokenChat] = {
        name: name,
        chats: []
    }
}

function authentication(token, password) {

}