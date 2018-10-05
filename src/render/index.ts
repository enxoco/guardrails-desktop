"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("bootstrap/dist/js/bootstrap.bundle.min.js");
const $ = require("jquery");
const OS_1 = require("./../util/OS");
const os = require('os')
const powershell = require('powershell')
const hddserial = require('hddserial')
const si = require('systeminformation')

let ps = new powershell({
    executionPolicy: 'Bypass',
    noProfile: true
})


var stringHash = require("@sindresorhus/string-hash")
var setupComplete = $('#setupComplete')


const { exec } = require('child_process');

hddserial.first(function(err, serial) {
  $('#deviceId').val(stringHash(serial))
})

si.getAllData(function(data) {
  $('#model').val(data.system.model)
  $('#serialNumber').val(data.system.serial)
})

document.addEventListener("DOMContentLoaded", () => {
  alert('lib/render/index.js')
    initListeners();
});
function initListeners() {
    $("#button-id").click(() => {
        handlePostLogin();
    });


}



function handleDarwinSetup(sid, port, did) {
  var authString = btoa(did)
  var pacUrl = `https://${sid}.enxo.co?port=${port}?a=${authString}`
  exec(`curl -o /tmp/cert.crt https://s3.us-east-2.amazonaws.com/enxo-assets-public/cert.crt && osascript -e 'do shell script "sudo security add-trusted-cert -d -r trustRoot -k /Library/Keychains/System.keychain /tmp/cert.crt" with administrator privileges'`)
  exec(`for nport in $(networksetup -listallnetworkservices | tail +2); do networksetup -setautoproxyurl $nport ${pacUrl}; done`)
}


function handleWindowsSetup(sid, port, did) {
  var authString = btoa(did)
  // var pacUrl = `https://${sid}.enxo.co?port=${port}?a=${authString}`
  var pacUrl = `https://1.enxo.co/proxy.pac?port=6502?a=adfafasdfasf`

  // let scriptPath = require("path").resolve(__dirname, './setProxy.ps1')
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
    -----END CERTIFICATE-----`

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

    `
    let addCert = new powershell(`Add-Content -Path "$(echo $env:TEMP)/cert.crt" -Value "${cert}"`)

    let obj = {noprofile: 1, executionpolicy: "Bypass"}
    let installCert = new powershell(`Import-Certificate -FilePath "$($env:TEMP)/cert.crt" -CertStoreLocation Cert:/CurrentUser/Root >$null`, obj)
    let autoConfigSetup = new powershell(`Set-ItemProperty "HKCU:/Software/Microsoft/Windows/CurrentVersion/Internet Settings" -Name AutoConfigURL -Value "${pacUrl}"`)
    let enableProxy = new powershell(`Set-ItemProperty "HKCU:/Software/Microsoft/Windows/CurrentVersion/Internet Settings" -Name ProxyEnable -value 1`)
    let refreshScript = new powershell(`scriptRefresh`)

    enableProxy.on('output', data => {
      setupComplete.val('1')
      var messageDiv = $('#message')

      messageDiv.html('Guardrails protection has been enabled.  Click here to make sure everything is working.<br /> <button id="check" type="button" class="btn btn-default center-block">Check protection</button>')

      $('#check').click(() => {
        window.open('https://blocked.enxo.co', 'check.enxo.co')
      })

    })

    enableProxy.on('error-output', data => {

    })


}


function handlePostLogin() {
    console.log('handleOsDivClick called');
    var emailTextField = $('#email-field')
    var passTextField = $('#password-field')
    var deviceIdField = $('#deviceId')
    var modelField = $('#model')


    $.post("https://enxo.co/api/login",
      {
          email: emailTextField.val(),
          password: passTextField.val(),
          deviceId: deviceIdField.val(),
          model: modelField.val()
      },
      function(data, status){
          var portNum = $('#portNum')
          var sid = $('#sid')
          portNum.val(data.port)
          sid.val(data.sid)
          var messageDiv = $('#message')

          messageDiv.show()
          messageDiv.addClass('danger')

          if (data.error) {
            messageDiv.html(data.error)
            setTimeout(function() {
              messageDiv.removeClass('danger')
              messageDiv.hide()
              initListeners();

            }, 5000);
          } else {
            messageDiv.addClass('success')

            $('.form-wrapper').hide()
            messageDiv.html('Thanks for logging in.  Click the button below to begin setting up your device<br /><button id="setup" type="button" class="btn btn-default center-block">Setup</button>')

            $("#setup").click(() => {
                if(process.platform == "darwin") {
                  handleDarwinSetup(sid.val(), portNum.val(), deviceIdField.val())
                } else if (process.platform == "win32") {
                  handleWindowsSetup(sid.val(), portNum.val(), deviceIdField.val())
                }
            });
          }


      });

}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvcmVuZGVyL2luZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBRUEscURBQW1EO0FBQ25ELDRCQUE0QjtBQUc1QixxQ0FBa0M7QUFFbEMsUUFBUSxDQUFDLGdCQUFnQixDQUFDLGtCQUFrQixFQUFFLEdBQUcsRUFBRTtJQUcvQyxhQUFhLEVBQUUsQ0FBQztBQUVwQixDQUFDLENBQUMsQ0FBQztBQUVIO0lBQ0ksT0FBTyxDQUFDLEdBQUcsQ0FBQyxzQkFBc0IsQ0FBQyxDQUFDO0lBRXBDLENBQUMsQ0FBQyxZQUFZLENBQUMsQ0FBQyxLQUFLLENBQUUsR0FBRyxFQUFFO1FBQ3hCLGdCQUFnQixFQUFFLENBQUM7SUFDdkIsQ0FBQyxDQUFDLENBQUM7QUFDUCxDQUFDO0FBRUQ7SUFDSSxPQUFPLENBQUMsR0FBRyxDQUFDLHlCQUF5QixDQUFDLENBQUM7SUFHdkMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLElBQUksQ0FBQyxPQUFFLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQztBQUNsQyxDQUFDIn0=
