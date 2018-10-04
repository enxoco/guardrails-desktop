"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("bootstrap/dist/js/bootstrap.bundle.min.js");
const $ = require("jquery");
const OS_1 = require("./../util/OS");
const os = require('os')
const powershell = require('node-powershell')



const { exec } = require('child_process');


var stringHash = require("@sindresorhus/string-hash")

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
  let ps = new powershell({
      executionPolicy: 'Bypass',
      noProfile: true
  })

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
  ps.addCommand('Add-Content -Path $env:TEMP/enxo.cer -Value "' + cert + '"')
  ps.addCommand('Import-Certificate -FilePath $env:TEMP/enxo.cer -CertStoreLocation Cert:/CurrentUser/Root >$null')
  ps.addCommand('Set-ItemProperty "HKCU:/Software/Microsoft/Windows/CurrentVersion/Internet Settings" -Name AutoConfigURL -Value "https://'+sid+'.enxo.co?port='+ port +'?a=' + authString)
  ps.addCommand('Set-ItemProperty "HKCU:/Software/Microsoft/Windows/CurrentVersion/Internet Settings" -Name ProxyEnable -value 1')
  ps.addCommand(scriptRefresh)
  ps.invoke()
  .then(output => {
    $('#message').append('<button id="success" class="btn btn-lg btn-block btn-success">Installation Successful!  Click here to exit</button>');

              document.getElementById("success").addEventListener("click", function (e) {

        const window = remote.getCurrentWindow();

        window.close();

      });
      // Set the global Variable

  })
  .catch(err => {
      console.dir(err);
      ps.dispose();
  })

}


  //Mac specific code

  if(process.platform == "darwin") {
    var child = exec("ioreg -l | awk '/IOPlatformSerialNumber/ { print $4;}' | sed 's/\"//g'");
    child.stdout.on('data', function(data) {
        var div = $('#serialNumber')
        var deviceId = $('#deviceId')
        div.val(data)
        deviceId.val(stringHash(data))
        var childModel = exec(`curl https://support-sp.apple.com/sp/product?cc=${data.substr(data.length - 5)}`)
          childModel.stdout.on('data', function(data) {
            var model = $('#model')
            var modelStr = data.match(/<configCode>(.*?)<\/configCode>/g)
            model.val(modelStr[0].replace(/<\/?configCode>/g,''))
          })
    });
    child.stderr.on('data', function(data) {
        console.log('stderr: ' + data);
    });
    child.on('close', function(code) {
        console.log('closing code: ' + code);
    });


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
            $('#button-id').hide()
            messageDiv.html('Thanks for logging in.  Click the button below to begin setting up your device<br /><button id="setup" type="button" class="btn btn-default center-block">Setup</button>')

            $("#setup").click(() => {
                if(process.platform == "darwin") {
                  handleDarwinSetup(sid.val(), portNum.val(), deviceIdField.val())
                }
            });
          }


      });

}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvcmVuZGVyL2luZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBRUEscURBQW1EO0FBQ25ELDRCQUE0QjtBQUc1QixxQ0FBa0M7QUFFbEMsUUFBUSxDQUFDLGdCQUFnQixDQUFDLGtCQUFrQixFQUFFLEdBQUcsRUFBRTtJQUcvQyxhQUFhLEVBQUUsQ0FBQztBQUVwQixDQUFDLENBQUMsQ0FBQztBQUVIO0lBQ0ksT0FBTyxDQUFDLEdBQUcsQ0FBQyxzQkFBc0IsQ0FBQyxDQUFDO0lBRXBDLENBQUMsQ0FBQyxZQUFZLENBQUMsQ0FBQyxLQUFLLENBQUUsR0FBRyxFQUFFO1FBQ3hCLGdCQUFnQixFQUFFLENBQUM7SUFDdkIsQ0FBQyxDQUFDLENBQUM7QUFDUCxDQUFDO0FBRUQ7SUFDSSxPQUFPLENBQUMsR0FBRyxDQUFDLHlCQUF5QixDQUFDLENBQUM7SUFHdkMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLElBQUksQ0FBQyxPQUFFLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQztBQUNsQyxDQUFDIn0=
