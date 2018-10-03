"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("bootstrap/dist/js/bootstrap.bundle.min.js");
const $ = require("jquery");
const OS_1 = require("./../util/OS");
const os = require('os')


const { exec } = require('child_process');


var stringHash = require("@sindresorhus/string-hash")

document.addEventListener("DOMContentLoaded", () => {
  alert('hello')
    initListeners();
});
function initListeners() {
    $("#button-id").click(() => {
      console.log(getOs())
        handlePostLogin();
    });

    $("#setup").click(() => {
      // if(process.platform === "")
    })
}

  //Mac specific code

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



function handlePostLogin() {
    console.log('handleOsDivClick called');
    var emailTextField = $('#email')
    var passTextField = $('#password')
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
          messageDiv.html('Thanks for logging in.  Click the button below to begin setting up your device<br /><button id="setup" type="button" class="btn btn-default center-block">Setup</button>')
      });

}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvcmVuZGVyL2luZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBRUEscURBQW1EO0FBQ25ELDRCQUE0QjtBQUc1QixxQ0FBa0M7QUFFbEMsUUFBUSxDQUFDLGdCQUFnQixDQUFDLGtCQUFrQixFQUFFLEdBQUcsRUFBRTtJQUcvQyxhQUFhLEVBQUUsQ0FBQztBQUVwQixDQUFDLENBQUMsQ0FBQztBQUVIO0lBQ0ksT0FBTyxDQUFDLEdBQUcsQ0FBQyxzQkFBc0IsQ0FBQyxDQUFDO0lBRXBDLENBQUMsQ0FBQyxZQUFZLENBQUMsQ0FBQyxLQUFLLENBQUUsR0FBRyxFQUFFO1FBQ3hCLGdCQUFnQixFQUFFLENBQUM7SUFDdkIsQ0FBQyxDQUFDLENBQUM7QUFDUCxDQUFDO0FBRUQ7SUFDSSxPQUFPLENBQUMsR0FBRyxDQUFDLHlCQUF5QixDQUFDLENBQUM7SUFHdkMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLElBQUksQ0FBQyxPQUFFLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQztBQUNsQyxDQUFDIn0=
