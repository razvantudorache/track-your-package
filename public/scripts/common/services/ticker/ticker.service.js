'use strict';

(function () {
  angular.module('trackYourPackage')
    .service('tickerService', tickerService);

  tickerService.$inject = ['notificationMessage'];
  function tickerService(notificationMessage) {
    var me = this;

    var socketIOUrl;
    var socket = null;
    var previousLocation = null;

    me.init = function () {
      setSocketIOUrl();

      socketConnect();

      initSocketEvents();

      getLocation();

      setInterval(getLocation, 60000);
    };

    function setSocketIOUrl() {
      var serverProtocol = 'http',
        serverAddress = 'localhost',
        serverPort = '3000';

      var ipClass = '192.168';
      var localHost = "localhost";
      var localHostIp = "127.0.0.1";
      var platformArray = [localHost, localHostIp];
      var isLocalEnvironment = platformArray.indexOf(location.hostname) !== -1 || location.hostname.indexOf(ipClass) !== -1;

      if (isLocalEnvironment) {
        socketIOUrl = serverProtocol + '://' + serverAddress + ':' + serverPort
      } else {
        socketIOUrl = '/';
      }
    }

    function socketConnect() {
      socket = io.connect(socketIOUrl, {
        'timeout': 30000,
        'reconnectionAttempts': 3
      });
    }

    function initSocketEvents() {
      socket.on('connect', function () {
      });

      socket.on('disconnect', function () {
        socketDisconnect();
        //show noty message with possibility to reconnect
      });

      socket.on('connect_failed', function () {
        socketDisconnect();
        //show noty message with possibility to reconnect
      });

      socket.on('reconnect_failed', function () {
        socketDisconnect();
        //show noty message with possibility to reconnect
      });

      socket.on('reconnecting', function () {
        //show loading or spinner
      });
    }

    function socketDisconnect() {
      socket.io.disconnect();
    }

    function socketReconnect() {
      socket.io.connect();
    }

    function getLocation() {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(sendLocationToServer, locationErrorHandler);
      } else {
        var errorMessage = "Geolocation is not supported by this browser.";

        notificationMessage.showNotificationMessage(errorMessage, 'ERROR');
      }
    }

    function sendLocationToServer(position) {
      var currentLocation = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude
      };

      if (!_.isEqual(previousLocation, currentLocation)) {
        previousLocation = currentLocation;

        socket.emit('userLocation', currentLocation);
      }
    }

    function locationErrorHandler(error) {
      var errorMessage = '';

      switch(error.code) {
        case error.PERMISSION_DENIED:
          errorMessage = "User denied the request for Geolocation.";
          break;
        case error.POSITION_UNAVAILABLE:
          errorMessage = "Location information is unavailable.";
          break;
        case error.TIMEOUT:
          errorMessage = "The request to get user location timed out.";
          break;
        case error.UNKNOWN_ERROR:
          errorMessage = "An unknown error occurred.";
          break;
      }

      if (errorMessage) {
        notificationMessage.showNotificationMessage(errorMessage, 'ERROR');
      }
    }
  }
})();
