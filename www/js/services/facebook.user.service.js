angular.module('app.facebookUser', []).service('facebookService', function() {

  var setUser = function(user_data) {
    window.localStorage.starter_facebook_user = JSON.stringify(user_data);
  };
  var getUser = function(){
    return JSON.parse(window.localStorage.starter_facebook_user || '{}');
  };

  var setPermissions = function (value) {
    var list;
    if (!window.localStorage.facebookPermissions) {
      list = [];
    } else {
      list = JSON.parse(window.localStorage.facebookPermissions);
    }
    list.push(value);
    window.localStorage.facebookPermissions = JSON.stringify(list);
  };
  
  var getPermissions = function (type, value) {
    return JSON.parse(window.localStorage.facebookPermissions) || [];
  };

  var inPermissions = function (value) {
     if (!window.localStorage.facebookPermissions) return false;
     if(JSON.parse(window.localStorage.facebookPermissions).indexOf(value) > -1) {
      return true;
     } else {
      return false;
     }
  }

  return {
    getUser: getUser,
    setUser: setUser,
    getPermissions: getPermissions,
    setPermissions: setPermissions,
    inPermissions: inPermissions
  };

});