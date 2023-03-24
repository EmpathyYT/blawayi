const contactForm = document.getElementById('contact-form');
let data = [];

contactForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const formData = new FormData(contactForm);
    for (const value of formData.values()) {
        data.push(value)
    }
    await window.electron.send('submit:contactForm', data);
})
