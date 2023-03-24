const toggleSidebarBtn = document.getElementById('toggle-sidebar');
const sidebar = document.getElementById('sidebar');
const chatList = document.getElementById("contact-list")
data = {}


function createButton() {
    return document.createElement("button");
}

toggleSidebarBtn.addEventListener('click', () => {
    sidebar.classList.toggle('open');
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


