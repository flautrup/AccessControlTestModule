AccessControlTestModule

Description:
This is a authentication module to be used for testing access control of the QV product. This should never be used in production scenarios as it is lacking security.

Installation:
	Install nodejs found at http://nodejs.org/
	Download the AccessControlTestModule.zip 
	Unzip AccessControlTestModule
	From the command prompt go to the directory where you unzipped AccessControTestModule
	Run npm install
	Go to QVC and export certificate for host that AccessControlTestModule is running on with password test
	Copy certificates from C:\ProgramData\QlikTech\QlikView12\Repository\Exported Certificates\[host] to the directory where you unzipped AccessControlTestModule
	From the directory where you unzipped AccessControlTestModule run "node AccessControlTestModule.js"
	Add a virtual proxy to the proxy with prefix "custom", Authentication module redirect URI "https://[server]:8185, Session cookie header name to "X-QlikView-Session-custom" and press OK and then Save.
	Access the platform on https://[QV proxy server]/custom/hub or https://[QV proxy server]/custom/qmc and you will be authenticated with the new module

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


