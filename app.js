const {app, BrowserWindow, Menu, ipcMain} = require('electron')
const path = require('path')
const fs = require('fs');
let window;
let token;

class Windows {
	win = new BrowserWindow({
		width: 1490,
		height: 700,
		title: "A Messaging Application",
		autoHideMenuBar: true,
		webPreferences: {
			nodeIntegration: true,
			preload: path.join(__dirname, 'preload.js'),
			enableRemoteModule: true,
		}
	})

	addContact = new BrowserWindow({
		width: 800,
		height: 580,
		title: 'Contact',
		resizable: false,
		autoHideMenuBar: true,
		webPreferences: {
			nodeIntegration: true,
			preload: path.join(__dirname, 'preload.js'),
			enableRemoteModule: true,
		},
		show: false

	})

	loadChat() {
		this.win.webContents.send('load-chats');
	}

	createWindow() {
		this.win.loadFile('index.html');
		this.addContact.loadFile("visuals/contact.html");

		this.win.once('ready-to-show', (event) => {
			this.loadChat();
		})

		this.win.once('close', (event) => {
			event.preventDefault();
			this.win.webContents.send('get-chats')
		})

		this.addContact.once('close', (event) => {
			event.preventDefault();
			this.addContact.hide();
		})
		ipcMain.on('chatData', (event, value) => {
			for (const [key, val] of Object.entries(value)) {
				val['chats'].map((x) => x.filter((y) => y !== []));
			}
			fs.writeFile(path.join(__dirname, 'storedData', 'contacts.json'), JSON.stringify(value), 'utf-8', (error) => {
				if (error) {
					console.log('[write auth]: ' + error);
				}
			})
			BrowserWindow.getAllWindows().forEach((win) => {
				win.destroy();
			});
			app.quit();
		})

		ipcMain.on('contact-show', () => {
			this.addContact.show()
		});

		ipcMain.on('submit:contactForm', (event, formData) => {
			this.win.webContents.send('new-chat', formData)
			this.addContact.hide();
		})
		ipcMain.on("authenticate", async (event, couple) => {
			const resp = await fetch("http://127.0.0.1:5000/auth", this.requestGenerator('POST', 'application/json', {
				token: couple.token,
				password: couple.password
			}));
			const response = await resp.json();
			if (response['auth'] === false) {
				BrowserWindow.getAllWindows().forEach((win) => {
					win.destroy();
				});
				app.quit();
			} else {
				this.win.webContents.send("authresp", response['token'])

			}

		})


	}


	requestGenerator(method, contentType, body) {
		return {
			method: method,
			mode: 'cors',
			cache: 'no-cache',
			credentials: 'same-origin',
			headers: {
				'Content-Type': contentType

			},
			redirect: 'follow',
			referrerPolicy: 'no-referrer',
			body: JSON.stringify(body)
		};
	}


	tokenGenerator() {
		let result = "";
		const characters = "0123456789";
		const charactersLength = characters.length;
		for (let i = 0; i < 40; i++) {
			result += characters.charAt(Math.floor(Math.random() * charactersLength));
		}
		return {
			"token": result
		};
	}

}


app.whenReady().then(() => {
	window = new Windows()
	window.createWindow()

	app.on('activate', () => {
		if (BrowserWindow.getAllWindows().length === 0) {
			window.createWindow()
			window.loadChat()
		}
	})
})



