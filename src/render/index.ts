"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("bootstrap/dist/js/bootstrap.bundle.min.js");
const $ = require("jquery");
const OS_1 = require("./../util/OS");
const os = require('os');
const powershell = require('powershell');
const hddserial = require('hddserial');
const si = require('systeminformation');


var stringHash = require("@sindresorhus/string-hash");
var setupComplete = $('#setupComplete');
const { exec } = require('child_process');
hddserial.first(function (err, serial) {
    $('#deviceId').val(stringHash(serial));
});
si.getAllData(function (data) {
    $('#model').val(data.system.model);
    $('#serialNumber').val(data.system.serial);
});
document.addEventListener("DOMContentLoaded", () => {
    initListeners();
});
function initListeners() {
    $("#button-id").click(() => {
        handlePostLogin();
    });
}
function handleDarwinSetup(sid, port, did) {
    var authString = btoa(did);
    var pacUrl = `https://${sid}.enxo.co?port=${port}?a=${authString}`;
    exec(`curl -o /tmp/cert.crt https://s3.us-east-2.amazonaws.com/enxo-assets-public/cert.crt && osascript -e 'do shell script "sudo security add-trusted-cert -d -r trustRoot -k /Library/Keychains/System.keychain /tmp/cert.crt" with administrator privileges'`, (error, stdOut, stdErr) => {
      if (error) {
        console.log(error)
      }
      exec(`for nport in $(networksetup -listallnetworkservices | tail +2); do networksetup -setautoproxyurl $nport ${pacUrl}; done`);
      var messageDiv = $('#message');
      messageDiv.removeClass('danger')
      messageDiv.html('<img src="http://203.0.113.1/shieldtop.png" width="250px" height="auto"><br /><p class="message">Guardrails protection has been enabled!<br />You may close out of this app now.');

    });

}
function handleWindowsSetup(sid, port, did) {
    var authString = btoa(`${did}:${did}`);
    var pacUrl = `https://${sid}.enxo.co/proxy.pac?port=${port}?a=${authString}`;
    let cert = `-----BEGIN CERTIFICATE-----
    MIID9zCCAt+gAwIBAgIJAN4UZHAxP3sXMA0GCSqGSIb3DQEBCwUAMIGRMQswCQYD
    VQQGEwJVUzESMBAGA1UECAwJVGVubmVzc2VlMRQwEgYDVQQHDAtDaGF0dGFub29n
    YTENMAsGA1UECgwERU5YTzEXMBUGA1UECwwORWFybHkgQWRvcHRlcnMxEzARBgNV
    BAMMCnAxLmVueG8uY28xGzAZBgkqhkiG9w0BCQEWDG1pa2VAZW54by5jbzAeFw0x
    NzEyMjQxODM3MTZaFw0xODEyMjQxODM3MTZaMIGRMQswCQYDVQQGEwJVUzESMBAG
    A1UECAwJVGVubmVzc2VlMRQwEgYDVQQHDAtDaGF0dGFub29nYTENMAsGA1UECgwE
    RU5YTzEXMBUGA1UECwwORWFybHkgQWRvcHRlcnMxEzARBgNVBAMMCnAxLmVueG8u
    Y28xGzAZBgkqhkiG9w0BCQEWDG1pa2VAZW54by5jbzCCASIwDQYJKoZIhvcNAQEB
    BQADggEPADCCAQoCggEBAMisgmER9SP7vzQHCvyXunCYVL8PzN6wobTHIKAU2CeF
    mo+tR3wJKmfOOnYGiYIjPwuf2bRBa4oAVr4XQONXZolQXnleXAcb25UsuhHVtJ+y
    lw1cninPDkzeTspnoRS5TyiH4WLF328G8hw4+1pXxyT9VBdLRzRsD7gvR5eYFXgS
    7FEqina5j0tyV11ESGSD8wrjrWQ8qxaJr8GuSH8+/3Pp5bET1w/j8wYbKxtfZkua
    UDHgN11Re1ev4y2HbSkCDCbFheI9FOKGu6JiVDiApuXiXQhqqcHOlg+bcl7NzWaQ
    BR8ksEPm6DvK6k6h9LePioNROnmN2fObrWtuBZCAv7cCAwEAAaNQME4wHQYDVR0O
    BBYEFA1nhyfbF4/GDoMDRkRNCjx8L9GcMB8GA1UdIwQYMBaAFA1nhyfbF4/GDoMD
    RkRNCjx8L9GcMAwGA1UdEwQFMAMBAf8wDQYJKoZIhvcNAQELBQADggEBAAceQ1tv
    nQSWpgSb8dKEk4GkEYVyhX1AlnXO8aDpsA4PdNlZKzR3NT4WYcFhJmVBOqw9kSEl
    L50bZaOuXCk3ynnUbPricI3VuDG+lcwjeuaes2ZwpRCpXKNZMoQ6MFtfGxkSnj9N
    BNdRCUPzXkdMvV1aEuHDkRc09VlPOHoyBa02TCO6XY0cfQ1qt3y8ndyXkEaurZmO
    0lBAi8JjkkmUi49qCZ6M7V5eGNUYJhLnJ+00z+pG/nxS9xcCSsOQko3lY1MjsLYe
    4T87aULlaUkGVvQeC/eOJZ732L/NcZuLy6zhSsZ6d3z9fcPHsXulatRGXe/npsvY
    CVkeuenJ0N2JmIo=
    -----END CERTIFICATE-----`;
    let scriptRefresh = ` $signature = @'
    [DllImport("wininet.dll", SetLastError = true, CharSet=CharSet.Auto)]
    public static extern bool InternetSetOption(IntPtr hInternet, int dwOption, IntPtr lpBuffer, int dwBufferLength);
    '@

        $INTERNET_OPTION_SETTINGS_CHANGED   = 39
        $INTERNET_OPTION_REFRESH            = 37
        $type = Add-Type -MemberDefinition $signature -Name wininet -Namespace pinvoke -PassThru
        $a = $type::InternetSetOption(0, $INTERNET_OPTION_SETTINGS_CHANGED, 0, 0)
        $b = $type::InternetSetOption(0, $INTERNET_OPTION_REFRESH, 0, 0)
        return $a -and $b

    `;
    let addCert = new powershell(`Add-Content -Path "$(echo $env:TEMP)/cert.crt" -Value "${cert}"`);
    let obj = { noprofile: 1, executionpolicy: "Bypass" };
    let installCert = new powershell(`Import-Certificate -FilePath "$($env:TEMP)/cert.crt" -CertStoreLocation Cert:/CurrentUser/Root >$null`, obj);
    let autoConfigSetup = new powershell(`Set-ItemProperty "HKCU:/Software/Microsoft/Windows/CurrentVersion/Internet Settings" -Name AutoConfigURL -Value "${pacUrl}"`);
    let enableProxy = new powershell(`Set-ItemProperty "HKCU:/Software/Microsoft/Windows/CurrentVersion/Internet Settings" -Name ProxyEnable -value 1`);
    let refreshScript = new powershell(`scriptRefresh`);
    enableProxy.on('output', data => {
        setupComplete.val('1');
        var messageDiv = $('#message');
        messageDiv.html('Guardrails protection has been enabled.  Click here to make sure everything is working.<br /> <button id="check" type="button" class="btn btn-default center-block">Check protection</button>');
        $('#check').click(() => {
            window.open('https://blocked.enxo.co', 'check.enxo.co');
        });
    });
    enableProxy.on('error-output', data => {
    });
}
function handlePostLogin() {
    console.log('handleOsDivClick called');
    var emailTextField = $('#email-field');
    var passTextField = $('#password-field');
    var deviceIdField = $('#deviceId');
    var modelField = $('#model');
    $.post("https://enxo.co/api/login", {
        email: emailTextField.val(),
        password: passTextField.val(),
        deviceId: deviceIdField.val(),
        model: modelField.val()
    }, function (data, status) {
        var portNum = $('#portNum');
        var sid = $('#sid');
        portNum.val(data.port);
        sid.val(data.sid);
        var messageDiv = $('#message');
        messageDiv.show();
        messageDiv.addClass('danger');
        if (data.error) {
            messageDiv.html(data.error);
            setTimeout(function () {
                messageDiv.removeClass('danger');
                messageDiv.hide();
                initListeners();
            }, 5000);
        }
        else {
            messageDiv.addClass('success');
            $('.form-wrapper').hide();
            messageDiv.html('Thanks for logging in.  Click the button below to begin setting up your device<br /><button id="setup" type="button" class="btn btn-default center-block">Setup</button>');
            $("#setup").click(() => {
                if (process.platform == "darwin") {
                    handleDarwinSetup(sid.val(), portNum.val(), deviceIdField.val());
                }
                else if (process.platform == "win32") {
                    handleWindowsSetup(sid.val(), portNum.val(), deviceIdField.val());
                }
            });
        }
    });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvcmVuZGVyL2luZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLFlBQVksQ0FBQztBQUNiLE1BQU0sQ0FBQyxjQUFjLENBQUMsT0FBTyxFQUFFLFlBQVksRUFBRSxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDO0FBQzlELE9BQU8sQ0FBQywyQ0FBMkMsQ0FBQyxDQUFDO0FBQ3JELE1BQU0sQ0FBQyxHQUFHLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQztBQUM1QixNQUFNLElBQUksR0FBRyxPQUFPLENBQUMsY0FBYyxDQUFDLENBQUM7QUFDckMsTUFBTSxFQUFFLEdBQUcsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFBO0FBQ3hCLE1BQU0sVUFBVSxHQUFHLE9BQU8sQ0FBQyxZQUFZLENBQUMsQ0FBQTtBQUN4QyxNQUFNLFNBQVMsR0FBRyxPQUFPLENBQUMsV0FBVyxDQUFDLENBQUE7QUFDdEMsTUFBTSxFQUFFLEdBQUcsT0FBTyxDQUFDLG1CQUFtQixDQUFDLENBQUE7QUFFdkMsSUFBSSxFQUFFLEdBQUcsSUFBSSxVQUFVLENBQUM7SUFDcEIsZUFBZSxFQUFFLFFBQVE7SUFDekIsU0FBUyxFQUFFLElBQUk7Q0FDbEIsQ0FBQyxDQUFBO0FBR0YsSUFBSSxVQUFVLEdBQUcsT0FBTyxDQUFDLDJCQUEyQixDQUFDLENBQUE7QUFDckQsSUFBSSxhQUFhLEdBQUcsQ0FBQyxDQUFDLGdCQUFnQixDQUFDLENBQUE7QUFHdkMsTUFBTSxFQUFFLElBQUksRUFBRSxHQUFHLE9BQU8sQ0FBQyxlQUFlLENBQUMsQ0FBQztBQUUxQyxTQUFTLENBQUMsS0FBSyxDQUFDLFVBQVMsR0FBRyxFQUFFLE1BQU07SUFDbEMsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQTtBQUN4QyxDQUFDLENBQUMsQ0FBQTtB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
