const toggleSidebarBtn = document.getElementById('toggle-sidebar');
const sidebar = document.getElementById('sidebar');

toggleSidebarBtn.addEventListener('click', () => {
    sidebar.classList.toggle('open');
});

const contactButton = document.getElementById('contact-button');
contactButton.addEventListener('click',  async () => {
  const response = await window.versions.contactShow()
});




