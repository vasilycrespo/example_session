angular.module('app.googleUser', []).service('googleService', function() {
  var setUser = function(user_data) {
    window.localStorage.starter_google_user = JSON.stringify(user_data);
  };
  var getUser = function(){
    return JSON.parse(window.localStorage.starter_google_user || '{}');
  };
  return {
    getUser: getUser,
    setUser: setUser
  };
});