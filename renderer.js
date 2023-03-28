const toggleSidebarBtn = document.getElementById('toggle-sidebar');
const sidebar = document.getElementById('sidebar');
const chatList = document.getElementById("contact-list")
let footerStat = false
data = {}



function createButton() {
    return document.createElement("button");
}



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
        let node = document.createElement("li");
        let button = createButton();
        button.id = key
        button.innerHTML = `${value}`
        button.className = "button-list"
        button.onclick = handling
        node.appendChild(button)
        chatList.appendChild(node)
    }

})

window.electron.onChatUpdate((event, values) => {
    const node = document.createElement("li");
    let button = createButton();
    button.id = values[1]
    button.innerHTML = values[0]
    button.className = "button-list"
    node.appendChild(button)
    chatList.appendChild(node)

})

window.electron.getChats((event) => {
    const listItems = document.getElementById("contact-list").getElementsByTagName('li')
    for (const listItem of listItems) {
        let button = listItem.firstChild
        data[button.id] = button.textContent

    }
    event.sender.send('chatData', data)

})

function handling() {
    sidebar.classList.toggle('open');
    let main = document.getElementById("main-screen")
    while (main.firstChild) main.firstChild.remove();
    let title = document.createElement("h1");
    let hr = document.createElement('hr')
    hr.id = "chat-hr"
    title.innerHTML = "This is the beginning of your chat with me";
    main.appendChild(title);
    main.appendChild(hr)
    let footerContainer = document.createElement('div')
    let footerInput = document.createElement('input')
    let footer = document.createElement('footer')
    footerInput.type = "text"
    footerInput.placeholder="Type your message here..."
    footerContainer.className = "message-input-container"
    footer.id = "chat-footer"
    footerContainer.appendChild(footerInput)
    footer.appendChild(footerContainer)
    main.appendChild(footer)
    footerStat = true;
    //TODO: work on the chat

}



