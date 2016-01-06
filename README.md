#AccessControlTestModule

##Description:
This is a authentication module to be used for testing access control of the QV product. This should never be used in production scenarios as it is lacking security.

##Installation:
*	Install nodejs found at http://nodejs.org/
*	Download the AccessControlTestModule.zip
*	Unzip AccessControlTestModule
*	From the command prompt go to the directory where you unzipped AccessControTestModule
*	Enter npm install in the command prompt to install the dependencies for the module.
*	Go to the Qlik Management Console (QMC) and export certificates for the host that AccessControlTestModule is running on with a password (check secrets key checkbox) of your choosing.
*	Copy client.pfx and server.pfx certificates from C:\ProgramData\Qlik\Sense\Repository\Exported Certificates\[host] to the directory where you unzipped AccessControlTestModule. Note, if you are not using the Qlik Self Signed Certificate, then export your server.pfx from your OS's Certificate Manager program.
*	Edit config.js with the password, config.port, config.RESTURI, and config.REDIRECT of your choice
*	From the command prompt go to the directory where you unzipped AccessControTestModule and enter "node AccessControlTestModule.js"
*	Add a virtual proxy to the proxy with prefix "custom", Authentication module redirect URI "https://[server]:[port], (default port is 8185) Session cookie header name to "X-Qlik-Session-custom" and press OK and then Save.
*	Access the platform on https://[Qlik Sense proxy server]/custom/hub or https://[Qlik Sense proxy server]/custom/qmc and you will be redirected to the authentication module where login will become possible.
*	Add a User or Login security access rule for your userDirectory. The default userDirectory='QVNCYCLES'

##Setup:
To add or change users edit the SelectUser.htm file.

To add a new user add this section in the table, userid is the "value" attribute:
```
 <option value="bbr">Bryan Baker (bbr) - Vice President of Sales</option>
```

value = userID
Text = What is displayed in the drop down

To change the userDirectory name, change the "name" attribute of the following line:
```
<select id="UserList" class="UserLogin" name="QVNCYCLES" onchange="doLogin(this);">
```

