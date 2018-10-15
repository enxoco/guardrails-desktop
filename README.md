Intro:
======
This is an example of a desktop app using jQuery, and Bootstrap.  The purpose of the app is to setup a users computer to connect to Enxo.  It is a good example of what you can do with an Electron app.  Here are some of the elements included:

* Use of jQuery in an Electron app.
* A form that connects to a REST API backend server for authentication
* Interaction with AppleScript and BASH to download/install/trust a root certificate on MacOS.
* Interaction with BASH to modify system proxy settings on MacOS and Powershell to do the same on Windows.

Prerequisites:
==============
* nodejs is required https://nodejs.org/en/download/
* Prebuilt Electron `npm install -g electron`

For the first time setup:
=========================
Issue the following commands after having the prerequisites:
* `git clone https://github.com/enxoco/guardrails-desktop.git`
* `cd guardrails-desktop`
* `npm install`
* `electron`

After first setup:
==================
After closing the app for the first time, it can be restarted via `electron`.

Linting:
========
`npm run lint`
[VS Code](https://code.visualstudio.com/download) should provide real-time linting if you use this editor.

Building:
=========
(Needed after modifcation to *.ts files) `npm run build` or `tsc` or `tsc --watch` for compile on save and launch the app (assuming you have the typescript compiler globally installed - `npm install -g typescript`).

Overview:
=========
`main.ts` loads the main html file `index.html`.  `index.html` is a fairly standard bootstrap-looking html file which
`requires` our `lib/render/index.js`.

Packaging Releases:
==============
* Electron Builder is included in order to package binaries for MacOS and Windows.
* On MacOS modify package.json accordingly then run `npm run dist` to have a binary built in the dist/ folder
