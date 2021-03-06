app.controller('connectCtrl', function($scope, $timeout, $state, $q, facebookService, googleService, $ionicLoading, $ionicActionSheet) {
  
  $scope.api = {"facebook": false, "google": false };
  // This is the success callback from the login method
  var fbLoginSuccess = function(response) {
    if (!response.authResponse){
      fbLoginError("Cannot find the authResponse");
      return;
    }
    var authResponse = response.authResponse;

    getFacebookProfileInfo(authResponse)
    .then(function(profileInfo) {
      // For the purpose of this example I will store user data on local storage
      facebookService.setUser({
        authResponse: authResponse,
				userID: profileInfo.id,
				name: profileInfo.name,
				email: profileInfo.email,
        picture : "http://graph.facebook.com/" + authResponse.userID + "/picture?type=large"
      });
      $ionicLoading.hide();
      $scope.localConnect();
    }, function(fail){
      // Fail get profile info
      console.log('profile info fail', fail);
    });
  };

  // This is the fail callback from the login method
  var fbLoginError = function(error){
    console.log('fbLoginError', error);
    $ionicLoading.hide();
  };

  // This method is to get the user profile info from the facebook api
  var getFacebookProfileInfo = function (authResponse) {
    var info = $q.defer();

    facebookConnectPlugin.api('/me?fields=email,name&access_token=' + authResponse.accessToken, null,
      function (response) {
				console.log(response);
        info.resolve(response);
      },
      function (response) {
				console.log(response);
        info.reject(response);
      }
    );
    return info.promise;
  };

  $scope.localConnect = function () {
      $scope.api.facebook = true;
      $scope.facebookUser = facebookService.getUser();
      $scope.$apply();
  };


  //This method is executed when the user press the "Login with facebook" button
  $scope.facebookSignIn = function() {
    facebookConnectPlugin.getLoginStatus(function(success){
      if(success.status === 'connected'){
        // The user is logged in and has authenticated your app, and response.authResponse supplies
        // the user's ID, a valid access token, a signed request, and the time the access token
        // and signed request each expire
        console.log('getLoginStatus', success.status);
    		// Check if we have our user saved
    		var user = facebookService.getUser('facebook');

    		if(!user.userID){
					getFacebookProfileInfo(success.authResponse)
					.then(function(profileInfo) {
						// For the purpose of this example I will store user data on local storage
						facebookService.setUser({
							authResponse: success.authResponse,
							userID: profileInfo.id,
							name: profileInfo.name,
							email: profileInfo.email,
							picture : "http://graph.facebook.com/" + success.authResponse.userID + "/picture?type=large"
						});
						$scope.localConnect();
					}, function(fail){
						// Fail get profile info
						console.log('profile info fail', fail);
					});
				}else{
					$scope.localConnect();
				}
      } else {
        // If (success.status === 'not_authorized') the user is logged in to Facebook,
				// but has not authenticated your app
        // Else the person is not logged into Facebook,
				// so we're not sure if they are logged into this app or not.

				console.log('getLoginStatus', success.status);

		$ionicLoading.show({
          template: 'Logging in...'
        });

				// Ask the permissions you need. You can learn more about
				// FB permissions here: https://developers.facebook.com/docs/facebook-login/permissions/v2.4
        facebookConnectPlugin.login(['email', 'public_profile'], fbLoginSuccess, fbLoginError);
      }
    });
  };

  	$scope.showLogOutMenu = function() {
		var hideSheet = $ionicActionSheet.show({
			destructiveText: 'Logout',
			titleText: 'Are you sure you want to logout?',
			cancelText: 'Cancel',
			cancel: function() {},
			buttonClicked: function(index) {
				return true;
			},
			destructiveButtonClicked: function(){
				$ionicLoading.show({
				  template: 'Logging out...'
				});
				hideSheet();
		        // Facebook logout
		        facebookConnectPlugin.logout(function(){
		          $scope.api.facebook = false;
		          $scope.facebookUser = {};
              window.localStorage.facebookPermissions = JSON.stringify([]);
		           $timeout(function() {
				        $ionicLoading.hide();
				       }, 2000);

		        },
		        function(fail){
		          $ionicLoading.hide();
		        });
			}
		});
	};


  $scope.FBPermissionsPost = function () {
    facebookConnectPlugin.login(["publish_actions"],function (response){
        console.log("----------");
        console.log(JSON.stringify(response));
        if(response.status == "connected") {
          facebookService.setPermissions("post",true);
          $scope.FBPost();
        }
      }, function (error) {
        console.log("FB ERROR: " + JSON.stringify(error)); 
      }
    );
  };

  $scope.message = "Default message";

  $scope.FBAction = function () {
    facebookConnectPlugin.getLoginStatus( function(response) {
                var url = '/me/feed?method=post&message=' + encodeURIComponent($scope.message) + '&access_token=' + facebookService.getUser().authResponse.accessToken;
                facebookConnectPlugin.api(
                    url,
                    ['publish_actions'],
                function (response) { console.log(JSON.stringify(response)); },
                function (error) { console.error(JSON.stringify(error)); }
                );
            });
  }


  $scope.FBPost = function () {
    if(facebookService.inPermissions("post")) {
      $scope.FBAction();
      return;
    }
    facebookConnectPlugin.login(["publish_actions"],
        function (response){
            if(response.status == "connected")
                window.localStorage.setItem("fbtoken",response.authResponse.accessToken);
                console.log("FB to publish_actions: " + JSON.stringify(response));
                facebookService.setPermissions("post");
                $scope.FBAction();   
        }, 
            function (error) { console.log("FB ERROR: " + JSON.stringify(error)); }
    );
  }


  /* ----------------------------- GOOGLE --------------------------- */
  // This method is executed when the user press the "Sign in with Google" button

  $scope.googleSignIn = function() {
    $ionicLoading.show({
      template: 'Logging in...'
    });

    window.plugins.googleplus.login(
      {},
      function (user_data) {
        googleService.setUser({
          userID: user_data.userId,
          name: user_data.displayName,
          email: user_data.email,
          picture: user_data.imageUrl,
          accessToken: user_data.accessToken,
          idToken: user_data.idToken
        });
        $ionicLoading.hide();
        $scope.googleConnect();
      },
      function (msg) {
        $ionicLoading.hide();
      }
    );
  };

  $scope.googleConnect = function () {
      $scope.api.google = true;
      $scope.googleUser = googleService.getUser();
      $scope.$apply();                                                                                                                                                                                                                                                       
  };

  $scope.LogOutGoogle = function() {
    var hideSheet = $ionicActionSheet.show({
      destructiveText: 'Logout',
      titleText: 'Are you sure you want to logout from google + ?',
      cancelText: 'Cancel',
      cancel: function() {},
      buttonClicked: function(index) {
        return true;
      },
      destructiveButtonClicked: function(){
        $ionicLoading.show({
          template: 'Logging out...'
        });
        hideSheet();
        // Google logout
        window.plugins.googleplus.logout(
          function (msg) {
            $ionicLoading.hide();
            $scope.api.google = false;
            $scope.googleUser = {};
             $timeout(function() {
              $ionicLoading.hide();
             }, 2000);
          },
          function(fail){
            console.log(fail);
          }
        );
      }
    });
  };
})