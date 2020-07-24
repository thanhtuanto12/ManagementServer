const config = require('./config')
var FCM = require('fcm-node')
let serverKey = require('./shopping-server-project-firebase-adminsdk-cd9rr-db9f688854.json')

var fcm = new FCM(serverKey)
exports.pushNotification = (registrationToken, platform, id, title, body, type) => {
  var message
  if (platform.toString() === 'ios') {
    message = {
      to: registrationToken,

      notification: {
        "id": id,
        "title": title,
        "body": body,
        "type": type
      },

      data: {
        "id": id,
        "title": title,
        "body": body,
        "type": type
      }
    }
  } else {
    message = {
      to: registrationToken,

      data: {
        "id": id,
        "title": title,
        "body": body,
        "type": type
      }
    };
  }

  fcm.send(message, function (err, response) {
    if (err) {
      console.log('---> ERROR_PUSH_NOTIFICATION: token:  ' + registrationToken + "error: " + err);
    } else {
      console.log('---> SUCCESS_PUSH_NOTIFICATION: token:  ' + registrationToken);
      console.log(response);
    }
  })
}