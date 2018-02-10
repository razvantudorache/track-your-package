'use strict';

(function () {
  angular.module('trackYourPackage')
    .service('notificationMessage', notificationMessage);

  function notificationMessage() {
    var me = this;

    // override the default configuration of the Noty
    var configurationNotificationMessage = function () {
      Noty.overrideDefaults({
        theme: 'nest',
        killer: true,
        closeWith: ['button'],
        timeout: 1000
      });
    };

    // show the notification message based on message and type
    me.showNotificationMessage = function (message, type) {
      configurationNotificationMessage();

      new Noty({
        text: message,
        type: type
      }).show();
    };
  }
})();
