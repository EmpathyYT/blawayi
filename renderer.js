const toggleSidebarBtn = document.getElementById('toggle-sidebar');
const sidebar = document.getElementById('sidebar');
const chatList = document.getElementById("contact-list")


toggleSidebarBtn.addEventListener('click', () => {
    sidebar.classList.toggle('open');
});

const contactButton = document.getElementById('contact-button');
contactButton.addEventListener('click', async () => {
    await window.electron.contactShow()
});

window.electron.onChatUpdate((_event, values) => {
    const node = document.createElement("li")
    const button = document.createElement("button")
    button.id = values[1]
    button.innerHTML = values[0]
    button.className = "button-list"
    node.appendChild(button)
    chatList.appendChild(node)

})





