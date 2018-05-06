// A 100% javascript facebook/gmail style web chat.
// (c) 2014-2015 Ezequiel Lovelle [ezequiellovelle@gmail.com]
// released under the MIT license
'use strict';

var Chat = (function () {
  var socketIOUrl;

  var TOTAL_RECONNECT_ATTEMPTS = 3;

  var chatStat,
    chatReconnect,
    chatNumberOfUsers,
    socket,
    user,
    previousMessage,
    attempts;

  function init(chatUser) {
    chatStat = 0;
    chatReconnect = 0;
    chatNumberOfUsers = 0;
    previousMessage = "";
    attempts = 0;
    user = chatUser;

    var xhrToolbar = $.get("toolbar.html", function (toolbar) {
      $(".mainContainer").after(toolbar);
    });

    var xhrMainChat = $.get("mainChat.html", function (mainChat) {
      $(".mainContainer").append(mainChat);
    });

    $.when(xhrToolbar, xhrMainChat).done(initChatDependencies).fail(function () {
      console.log('fail');
    }).always(function () {
      $('.main-chat-container').show();
    });
  }

  /**
   * Initialize all the dependencies for the chat
   */
  function initChatDependencies() {

    setSocketIOUrl();

    // Main chat title bar
    mainChatStatus("offline");

    $(".main-chat-container").addClass("toolbar");

    initChat();

    initEvents();

    //Main hide
    $("#main-users-resizer").hide();
  }

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
      socketIOUrl = '/'; //FIXME add full url environment variable CHAT_CORE_SERVER_URL
    }
  }

  function mainChatStatus(status) {
    //if was disconnected, do reconnect
    if (chatReconnect === 1) {
      socketReconnect();
    }

    $("#chat-title-button").find("li").first().removeClass().addClass(status);
  }

  /**
   * Init chat
   */
  function initChat() {
    if (chatStat === 0) {

      //Just in case, close dialogs open
      $(".ui-dialog-content").dialog("close");

      //set to 1 to avoid reinitialize the connection with the server
      chatStat = 1;

      socketConnect();

      socketReconnectAutomatically();

      socketHandle();
    }
  }

  /**
   * Try to reconnect socket each every 1 minute if it is disconnected
   */
  function socketReconnectAutomatically() {
    setInterval(function () {
      if (socket.disconnected) {
        mainChatStatus('online');
      }
    }, 60000);
  }

  /**
   * Init events for the chat
   * @return {void}
   */
  function initEvents() {

    /**
     * Open new chat
     */
    $(document).on("click", ".user-button", openNewChatHandler);

    /**
     * Show the close button on hover on the user avatar
     */
    $(document).on("mouseover", '.user-button', showCloseButtonHandler);

    /**
     * Hide the close button on hover on the user avatar
     */
    $(document).on("mouseout", '.user-button', hideCloseButtonHandler);

    $(document).on("click", '.close-button', closeButtonHandler);

    /**
     * Click on user in chat box
     */
    $(document).on("click", ".user", userClickHandler);

    /**
     * Bar text button open chat
     */
    $(document).on("click", "#chat-title-button", openCharListHandler);

    /**
     * Minus icon in main chat
     */
    $(document).on("click", "#min-main-chat", minimizeChat);

    $(document).on("click", ".reconnectLink", reconnectLinkHandler);
  }

  function destroyEvents () {
    /**
     * Open new chat
     */
    $(document).off("click", ".user-button", openNewChatHandler);

    /**
     * Show the close button on hover on the user avatar
     */
    $(document).off("mouseover", '.user-button', showCloseButtonHandler);

    /**
     * Hide the close button on hover on the user avatar
     */
    $(document).off("mouseout", '.user-button', hideCloseButtonHandler);

    $(document).off("click", '.close-button', closeButtonHandler);

    /**
     * Click in user in chat box
     */
    $(document).off("click", ".user", userClickHandler);

    /**
     * Bar text button open chat
     */
    $(document).off("click", "#chat-title-button", openCharListHandler);

    /**
     * Minus icon in main chat
     */
    $(document).off("click", "#min-main-chat", minimizeChat);

    $(document).off("click", ".reconnectLink", reconnectLinkHandler);
  }

  /** Event handlers */
  function openNewChatHandler () {
    var $mainUsersResizer = $('#main-users-resizer');
    $mainUsersResizer.hide();

    var prefix = "user-button-";
    var userId = $(this).attr("id").substring((prefix.length));

    // Del notification if exist
    mainChatUserAlert(userId, 1);

    $('#' + prefix + userId).toggleClass('open');

    openChatBox(userId);
    //Set position
    $("#Dialog" + userId).dialog({
      position: {
        my: "right+13 bottom-20",
        at: "right top",
        of: this,
        collision: "flip, none"
      },
      classes: {
        "ui-dialog": "user-dialog" + userId
      }
    });
  }

  function showCloseButtonHandler () {
    $(this).find('.close-button').show();
  }

  function hideCloseButtonHandler () {
    $(this).find('.close-button').hide();
  }

  function closeButtonHandler (e) {
    var userId = $(this).parent().attr("id").substring("user-button-".length);

    $("#Dialog" + userId).dialog('close');
    $("#user-button-" + userId).remove();

    e.stopPropagation();
  }

  function userClickHandler () {
    var $mainUsersResizer = $('#main-users-resizer');
    $mainUsersResizer.hide();

    //Do nothing if user is offline
    if ($(this).hasClass("offline")) {
      return false;
    }

    var prefix = "user-";
    var userId = $(this).attr("id").substring((prefix.length));

    //Append div user in the bar if is not appended
    if ($("#users-button-bar").parent().find("#user-button-" + userId).length === 0) {
      var avatar = $('#user-' + userId + ' .user-avatar').attr('src');
      var avatarContainer = "<img class='user-avatar' src='" + avatar + "'/>";

      $("#users-button-bar").append("<div id='user-button-" + userId + "' class='user-button'>" +
        avatarContainer +
        "                               <span data-toggle='tooltip' class='new-messages'>0</span>" +
        "                               <span class='close-button'></span>" +
        "                          </div>");
    }
    //Do the same as clicking the user in the bar
    $("#user-button-" + userId).trigger("click");

    return false;
  }

  function openCharListHandler () {
    var $mainUsersResizer = $('#main-users-resizer');
    $mainUsersResizer.toggle();

    $(".ui-dialog-content").dialog("close");

    // avoid triggering updateCharListScroll when $('#main-users-resizer') become hidden
    if ($mainUsersResizer.is(':visible')) {
      updateChatListScroll();
    }
  }

  function minimizeChat () {
    $("#main-users-resizer").hide();
  }

  function reconnectLinkHandler () {
    mainChatStatus('online');
  }

  /** End event handlers */

  /**
   * Box Dialog for new user
   * @param id
   * @param userExtId
   */
  function mainSetDialog(id, userExtId) {

    $("#Dialog" + id).dialog({
      draggable: false,
      autoOpen: false,
      closeOnEscape: true,
      resizable: false,
      modal: false,
      minHeight: 200,
      maxHeight: 400,
      height: "auto",
      width: 350,

      open: function (event, ui) {

        if ($(this).data("init") !== 1) {

          //Save the top of dialog
          var main = $(this);
          var name = $('#user-' + id).text();

          $('.ui-dialog-titlebar-close').remove();
          main.removeClass('ui-corner-all');

          var $mainParent = main.parent();

          //Toolbar buttons
          $mainParent.find(".ui-dialog-titlebar").append("<span class='toolbar-window'><span class='minimize-window'></span><span class='close-window'></span></span>");

          //Name
          $mainParent.find(".ui-dialog-title").append("<span>" + name + "</span>");

          //Set hide 'is writing...'
          $mainParent.find(".iswriting").first().addClass("no-display");

          //Change flag at init option
          main.data("init", 1);

          //Textarea click
          $mainParent.find("input").click(function () {
            mainChatUserAlert(id, 1);
          });

          //Minimize button
          $mainParent.find(".minimize-window").click(function () {
            main.dialog("close");
            $('#user-button-' + id).toggleClass('open');
          });

          //Fancy scrollbar
          newScroll(main.parent().find(".direct-chat-messages"));

          //Close button
          $mainParent.find(".close-window").click(function () {
            main.dialog("close");
            //reset open class
            $('#user-button-' + id).toggleClass('open');
            $("#user-button-" + id).remove();
          });

          var typingTimeout;
          main.find("input.textarea-msg").keyup(function (e) {

            if (typingTimeout !== 'undefined') {
              clearTimeout(typingTimeout);
            }

            if (e.which !== 13) {
              typingTimeout = setTimeout(function () {
                callUserIsWriting(userExtId);
              }, 100);
            }

            //fill the input with the previous message when the user press arrow up key
            if (e.which === 38 && previousMessage) {
              $(this).val(previousMessage);
            }

            //send the message by pressing ENTER
            if ((e.which === 13) && !e.shiftKey) {
              var msg = cleanMsg($(this).val());
              previousMessage = msg;
              $(this).val("");
              if (msg !== "") {
                socket.emit('message', {'extId': userExtId, 'msg': msg}, function (data) {
                  var recv = JSON.parse(data);
                  recv.date = moment(recv.date).format('MMMM Do YYYY, h:mm:ss a');
                  appendMsgMe(msg, main, recv.date);
                  // Set dialog position
                  main.dialog({
                    position: {
                      my: "right+13 bottom-20",
                      at: "right top",
                      of: "#user-button-" + id,
                      collision: "flip, none"
                    },
                    classes: {
                      "ui-dialog": "user-dialog" + id
                    }
                  });
                });
              }
            }
            return false;
          });
        }

        //Go to bottom
        newScroll($(this).parent().find(".direct-chat-messages"));
      },

      show: {
        effect: "none"
      },
      hide: {
        effect: "none"
      }
    });
  }

  function callUserIsWriting(userExtId) {
    socket.emit('user_typing', {'extId': userExtId});
  }

  /**
   * Clean text received
   * @param text
   */
  function cleanMsg(text) {
    //Clean html tags
    var msgHtml = text.replace(/(<([^>]+)>)/ig, "");
    //Clean html tabs and new line
    var msgDone = msgHtml.replace(/(\n|\r|\r\n)$/, '');
    return msgDone;
  }

  /**
   * Append my messages
   * @param msg
   * @param main
   * @param date
   */
  function appendMsgMe(msg, main, date) {
    var box = main.parent().find(".box-body");
    var me = box.find('.direct-chat-messages').last();
    var $messagesArea = main.parent().find(".direct-chat-messages");

    if (me.children().last().attr('id') === 'me') {
      me.children().find('.direct-chat-text').last().append("<div>" + msg + "</div>")
    } else {
      me.append("<div class='direct-chat-msg right' id='me'>" +
        "           <div class='direct-chat-info'>" +
        "               <span class='direct-chat-timestamp'>" + date + "</span>" +
        "           </div>" +
        "           <div class='direct-chat-text'>" +
        "               <div>" + msg + "</div>" +
        "           </div>" +
        "      </div>");
    }

    // Go to bottom
    newScroll($messagesArea);
  }

  /**
   * Append messages received
   * @param msg
   * @param main
   * @param date
   */
  function appendMsgHe(msg, main, date) {
    var box = main.parent().find(".box-body");
    var he = box.find('.direct-chat-messages').last();
    var $messagesArea = main.parent().find(".direct-chat-messages");

    if (he.children().last().attr('id') === 'he') {
      he.children().find('.direct-chat-text').last().append("<div>" + msg + "</div>")
    } else {
      he.append("<div class='direct-chat-msg left' id='he'>" +
        "           <div class='direct-chat-info'>" +
        "               <span class='direct-chat-timestamp'>" + date + "</span>" +
        "           </div>" +
        "           <div class='direct-chat-text'>" +
        "               <div>" + msg + "</div>" +
        "           </div>" +
        "      </div>");
    }

    // Go to bottom
    newScroll($messagesArea);
  }

  function newScroll($messagesArea) {
    $messagesArea.slimScroll({
      size: '5px',
      scrollTo: $messagesArea[0].scrollHeight,
      height: 'auto',
      start: 'bottom'
    });
  }

  /**
   * Function for Open chat box
   * @param userId
   */
  function openChatBox(userId) {
    if ($("#Dialog" + userId).dialog("isOpen") === false) {
      //Close all dialogs
      $(".ui-dialog-content").dialog("close");
      $('.user-button').removeClass('open');
      $('#user-button-' + userId).toggleClass('open');
      $("#Dialog" + userId).dialog("open");
    } else {
      $("#Dialog" + userId).dialog("close");
    }
  }

  /**
   * Delete the user in main chat
   * @param {Integer} id - user id
   * @return {void}
   */
  function mainChatUserOfflineNew(id) {
    //Disable send msg
    $("#Dialog" + id).parent().find(".textarea-msg").first().attr("disabled", "disabled");

    //Remove the disconnected user from toolbar
    $('#user-button-' + id).remove();

    //Remove the disconnected user dialog
    $("#Dialog" + id).dialog('destroy').remove();

    $("#main-list-chat").find("#user-" + id).remove();

    //Add label of no users connected
    if (chatNumberOfUsers === 0) {
      if ($("#chat-main-title-label").length === 0) {
        $("#main-list-chat").append("<div id='chat-main-title-label'>" + i18n.noUsers + "</div>");
      }
    }
  }

  function mainChatUserNew(id, status, name, avatar) {
    //Append in the chat!
    var avatarContainer = "<img class='user-avatar' src='" + avatar + "'/>";

    $("#main-list-chat").append("<div id='user-" + id + "' class='user user-pad scroll-content-item'>" +
      avatarContainer +
      "                           <span>" + name + "</span>" +
      "                       </div>");

    //Remove label of no users connected
    if (chatNumberOfUsers === 0) {
      if ($("#chat-main-title-label").length === 1) {
        $("#chat-main-title-label").remove();
      }
    }

    //Set status in dialog
    $("#Dialog" + id).data("status", status);

    //Open the chat for styling things
    if ($("#main-users-resizer").is(":hidden")) {
      $("#main-users-resizer").show();
      var wasclose = 1;
    }

    //Close because was closed
    if (wasclose === 1) {
      $("#main-users-resizer").hide();
    }
  }

  function mainAppendDialog(id, userExtId) {
    var typeMessagePlaceholder = i18n.typeMessage;

    if ($("#Dialog" + id).length === 0) {
      $("body").append("<div id='Dialog" + id + "' user='" + userExtId + "'>" +
        "               <div class='box direct-chat direct-chat-info'>" +
        "                   <div class='box-body'>" +
        "                       <div class='direct-chat-messages'></div>" +
        "                   </div>" +
        "                   <div class='iswriting'></div>" +
        "                   <div>" +
        "                       <input class='textarea-msg' name='message' placeholder='" + typeMessagePlaceholder + "'>" +
        "                   </div>" +
        "               </div>" +
        "           </div>");
    }
  }

  function mainChatTitle(action) {
    //action == 0, connected
    //action == 1, disconnected
    //action == 2, loading
    var label;
    var $mainListChat = $("#main-list-chat");
    var $chatTitle = $('#chat-title');
    var $progressBar = $("#progressbar");

    switch (action) {
      case 0:
        label = i18n.no_users;
        $progressBar.remove();
        break;
      case 1:
        label = i18n.disconnected;
        $progressBar.remove();
        $mainListChat.empty();
        //reset the number of users
        chatNumberOfUsers = 0;
        break;
      case 2:
        attempts++;
        label = i18n.loading + " " + i18n.pleaseWait + " <div class='attempts'>" + i18n.attempts + ": " + attempts + " " + i18n.of + " " + TOTAL_RECONNECT_ATTEMPTS + "</div>";
        $mainListChat.empty();
        break;
      default:
        console.log("Error, invalid action '" + action + "'");
    }

    //Label of users
    if ($mainListChat.children().length === 0) {
      $mainListChat.append("<div id='chat-main-title-label'></div>");
    }

    var $mainTitleLabelChat = $("#chat-main-title-label");
    $mainTitleLabelChat.html(label);

    // add link to have the possibility to reconnect when the user is disconnected
    if (action === 1) {
      $mainTitleLabelChat.append("<div class='reconnectLink'>" + i18n.reconnect + "</div>");
    }

    // Fancy progress bar
    if (action === 2) {

      if ($chatTitle.find('#chat-main-title-ui').length === 1) {
        $("#chat-main-title-ui").remove();
      }

      if ($chatTitle.find('#progressbar').length === 0) {
        $chatTitle.append("<div id='progressbar'></div>");
        $progressBar = $("#progressbar");
        $progressBar.progressbar({value: false});//Loading
      }
    } else {
      if ($chatTitle.find('#chat-main-title-ui').length === 0)
        $chatTitle.append("<div id='chat-main-title-ui' >" +
          "                   <div id='chat-main-title-id' class='chat-main-title'>" + i18n.chat +
          "                       <span class='number_of_online_users'>(" + chatNumberOfUsers + ")</span>" +
          "                   </div>" +
          "              </div>");
    }

    updateNumberOfOnlineUsers();
  }

  function mainChatNewMessages(action, main) {
    // action: 0 set to 0 count of messages no read
    // action: 1 increment count of messages no read
    var newMessages = 0;
    if (action === 0) {
      newMessages = 0;
    } else {
      var msgs = parseInt(main.find(".new-messages").text());
      newMessages = msgs + 1;
    }

    var txt = newMessages + " " + i18n.newMessages;
    main.find(".new-messages").text(newMessages);
    main.find(".new-messages").prop("title", txt);
  }

  function mainChatUserAlert(id, action) {
    //action = 0, add notification if not already have one
    //action = 1, del notification if already have one
    var main = $("#user-button-" + id);

    if (action === 0) {

      main.find(".new-messages").show();
      //Increment number of new messages not read
      mainChatNewMessages(1, main);

    } else if (action === 1) {

      main.find(".new-messages").hide();
      //Set to 0 number of new messages not read
      mainChatNewMessages(0, main);

    } else
      console.log("main_chat_user_alert() unexpected action '" + action + "', please report this");
  }

  /**
   * Disconnect
   */
  function mainChatDisconnect() {
    chatNumberOfUsers = 0;
    chatStat = 0;
    mainChatTitle(1);
    mainChatStatus("offline");

    destroyEvents();

    $(".ui-dialog-content").dialog("destroy").remove();

    //remove all open users
    $(".user-button").remove();

    // show the chat list if is not visible
    var isChatListVisible = $('#main-users-resizer').is(':visible');
    if (!isChatListVisible) {
      $('#chat-title-button').trigger('click');
    }

    //Disconnect session
    if (socket) {
      socketDisconnect();
    }

    updateChatListScroll();
  }

  function socketConnect() {
    socket = io.connect(socketIOUrl, {
      'timeout': 30000,
      'reconnectionusers-button-barAttempts': TOTAL_RECONNECT_ATTEMPTS //after 3 attempts the reconnection_failed event is triggered
    });
  }

  function socketDisconnect() {
    socket.io.disconnect();
    chatReconnect = 1;
  }

  function socketReconnect() {
    socket.io.connect();
    chatReconnect = 0;
  }

  function socketHandle() {

    socket.on('connect_failed', function (data) {
      mainChatDisconnect();
    });

    socket.on('reconnect_failed', function (data) {
      attempts = 0;
      mainChatDisconnect();
    });

    socket.on('error', function (data) {
      mainChatDisconnect();
    });

    socket.on('custom_error', function (data) {
      console.log(data.message);
    });

    socket.on('disconnect', function (data) {
      mainChatDisconnect();
    });

    socket.on('connect_timeout', function (data) {
      mainChatDisconnect();
    });

    socket.on('reconnecting', function (data) {
      mainChatTitle(2);
    });

    socket.on('connecting', function (data) {
      // Main chat title, add the loading bar and text
      mainChatTitle(2);
    });

    socket.on('connect', function (data) {
      attempts = 0;

      chatJoin();
    });

    socket.on('chat', function (recv) {
      var message = JSON.parse(recv);
      handleIncoming(message);
    });
  }

  function chatJoin() {
    socket.emit('join', user, function (data) {
      var recv = JSON.parse(data);

      if (recv.login === 'successful') {
        user.name = recv.details.name;
        user.avatar = recv.details.avatar;

        setTimeout(function () {
          mainChatTitle(0);
          mainChatStatus('online');
        }, 700);
      }
    });
  }

  /***************** incoming events **************************/
  function handleIncoming(recv) {
    var action = recv.action;

    switch (action) {
      case "message":
        var date = moment(recv.date).format('MMMM Do YYYY, h:mm:ss a');
        var userId = recv.data.user.userId;
        var avatar = recv.data.user.avatar;
        var msg = recv.data.msg;
        var main = $("#Dialog" + userId);

        //Append div user in the bar if is not appended
        if ($("#users-button-bar").parent().find("#user-button-" + userId).length === 0) {
          var avatarContainer = "<img class='user-avatar' src='" + avatar + "'/>";

          $("#users-button-bar").append("<div id='user-button-" + userId + "' class='user-button'>" +
            avatarContainer +
            "                               <span data-toggle='tooltip' class='new-messages'>0</span>" +
            "                               <span class='close-button'></span>" +
            "                          </div>");
        }

        //Check focus state and focus document to do sound and alert
        if (!$(document).is(document.activeElement) || !main.find(".textarea-msg").is(document.activeElement)) {

          //Add notification if not exist
          mainChatUserAlert(userId, 0);
        }

        appendMsgHe(msg, main, date);
        // Set dialog position
        main.dialog({
          position: {
            my: "right+13 bottom-20",
            at: "right top",
            of: "#user-button-" + userId,
            collision: "flip, none"
          },
          classes: {
            "ui-dialog": "user-dialog" + userId
          }
        });
        break;
      case "newuser":
        //Append the Dialogid
        mainAppendDialog(recv.user.userId, recv.user.extId);
        mainSetDialog(recv.user.userId, recv.user.extId);

        //Append the user to chat
        mainChatUserNew(recv.user.userId, recv.user.status, recv.user.name, recv.user.avatar);

        updateChatListScroll();
        break;
      case "disconnect":
        //Delete the user to chat
        mainChatUserOfflineNew(recv.user.userId);

        updateChatListScroll();
        break;
      case "user_typing":
        var userId = recv.data.userId;
        var main = $("#Dialog" + userId);

        if (main.parent().find(".iswriting").first().hasClass("no-display")) {

          main.parent().find(".iswriting").first().removeClass("no-display");

          setTimeout(function () {
            main.parent().find(".iswriting").first().addClass("no-display");
          }, 1500);
        }
        break;
      case "userlist":
        for (var i in recv.users) {

          //Append the Dialogid
          mainAppendDialog(recv.users[i].userId, recv.users[i].extId);
          mainSetDialog(recv.users[i].userId, recv.users[i].extId);

          //Append the user to chat
          mainChatUserNew(recv.users[i].userId, recv.users[i].status, recv.users[i].name, recv.users[i].avatar);
        }

        updateChatListScroll();
        break;
      default:
        console.log('ERROR');
    }

    if (recv.numberOfUsers) {
      chatNumberOfUsers = recv.numberOfUsers;
    }

    //Update number of online users in title
    updateNumberOfOnlineUsers();
  }

  /**
   * Update the number of online users
   */
  function updateNumberOfOnlineUsers() {
    $('.number_of_online_users').text('(' + chatNumberOfUsers + ')');
  }

  /**
   * Update char list scroll each time when
   * - the list is opened
   * - the socket "disconnect" event is triggered
   * - the "userlist" event is triggered
   * - the user "disconnect" event is triggered
   * - the "newuser" event is triggered
   */
  function updateChatListScroll() {

    var $mainUsersResizer = $('#main-users-resizer');
    var $chatTitle = $('#chat-title');
    var $mainListChat = $('#main-list-chat');
    var $usersWindowChat = $('#users-window-chat');

    var mainUsersResizerHeight = $mainUsersResizer.outerHeight(true);
    var chatTitleHeight = $chatTitle.outerHeight(true);
    var mainListChatHeight = $mainListChat.outerHeight(true);

    var scrollOptions = {
      size: '5px',
      height: mainUsersResizerHeight - chatTitleHeight + 'px'
    };

    if (mainListChatHeight < mainUsersResizerHeight - chatTitleHeight) {
      // setting the height property with '' makes the slimScroll plugin to takes into consideration the max-height and min-height set on the $('#main-users-resizer')
      // https://github.com/rochal/jQuery-slimScroll/issues/70#issuecomment-281975173
      scrollOptions['height'] = '';
    }

    $usersWindowChat.slimScroll(scrollOptions);
  }

  return {
    init: init,
    mainChatDisconnect: mainChatDisconnect
  }
})();
