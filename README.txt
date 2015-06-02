AccessControlTestModule

Description:
This is a authentication module to be used for testing access control of the QV product. This should never be used in production scenarios as it is lacking security.

<ol>Installation:
	<li>Install nodejs found at http://nodejs.org/</li>
	<li>Download the AccessControlTestModule.zip</li>
	<li>Unzip AccessControlTestModule</li>
	<li>From the command prompt go to the directory where you unzipped AccessControTestModule</li>
	<li>Enter npm install in the command prompt to install the dependencies for the module.</li>
	<li>Go to the Qlik Management Console (QMC) and export certificates for the host that AccessControlTestModule is running on with a password (check secrets key checkbox) of your choosing.</li>
	<li>Copy certificates from C:\ProgramData\Qlik\Sense\Repository\Exported Certificates\[host] to the directory where you unzipped AccessControlTestModule</li>
	<li>Edit AccessControlTestModule.js with your favorite text editor.  Search for <strong>enterYourCertificatePasswordHere</strong> and update the value with the password created during certificate export.</li>
	<li>From the command prompt go to the directory where you unzipped AccessControTestModule and enter "node AccessControlTestModule.js"</li>
	<li>Add a virtual proxy to the proxy with prefix "custom", Authentication module redirect URI "https://[server]:8185, Session cookie header name to "X-Qlik-Session-custom" and press OK and then Save.</li>
	<li>Access the platform on <strong>https://[Qlik Sense proxy server]/custom/hub</strong> or <strong>https://[Qlik Sense proxy server]/custom/qmc</strong> and you will be redirected to the authentication module where login will become possible.</li>
</ol>

Setup:
To add or change users edit the SelectUser.htm file.

To add a new user add this section in the table
<tr>
            <td><img src="resource/icon" /></td>
			<td>bbr</td>
			<td>Bryan Baker</td>
			<td>Vice President of Sales</td>
			<td><a href="/login?selectedUser=bbr&userDirectory=QVNCYCLES">Login</a> | <a href="/logout?selectedUser=bbr&userDirectory=QVNCYCLES">Logout</a></td>
</tr>

First cell defines an icon
Second the user id
Third the users full name
Fourth description of the user in this case Vice President of Sales
Fifth is the link to logging in and out. The parameter selectedUser is the user id (in this case bbr) of the user and userDirectory is the user directory (in this case QVNCYCLES the user belongs to.

Storing the file with the new section will let you log in as the new user.


