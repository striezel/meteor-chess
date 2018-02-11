Template.connectionStatus.helpers({
  connected: function() {
    return Meteor.status().connected;
  },
  status: function() {
    var status = Meteor.status().status;
    switch (status)
    {
      case "connected":
           return {icon: "glyphicon-ok", title: 'connected', status: status,
                   alertType: 'alert-success'};
      case "failed":
           return {icon: "glyphicon-remove", title: 'Connection failed.',
                   status: status, alertType: 'alert-danger'};
      case "connecting":
           return {icon: "glyphicon-refresh", title: 'Trying to open a new connection...',
                   status: status, alertType: 'alert-warning'};
      case "waiting":
           var next = moment(new Date(Meteor.status().retryTime));
           return {icon: "glyphicon-time",
                   title: 'Waiting for next re-connection ('
                         + Meteor.status().retryCount + ' attempts so far, '
                         + 'next try at ' + next.format('HH:mm:ss')
                         + ')',
                   status: status,
                   alertType: 'alert-danger'};
      case "offline":
           return {icon: "glyphicon-off",
                   title: 'Disconnected by user.',
                   status: status, alertType: 'alert-success'};
      default:
           return {icon: "glyphicon-question-sign",
                   title: "unknown ('" + status + "')",
                   status: status, alertType: 'alert-info'};
    } // switch
  }
});
