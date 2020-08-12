window.fbAsyncInit = function() {
    FB.init({
      appId      : '309464026839831',
      cookie     : true,
      xfbml      : true,
      version    : 'v8.0'
    });
    
    FB.login(function(response) {

    });

    FB.AppEvents.logPageView();  

  };

(function(d, s, id){
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) {return;}
    js = d.createElement(s); js.id = id;
    js.src = "https://connect.facebook.net/en_US/sdk.js";
    fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));

var userToken;

function checkLoginState() {
  FB.getLoginStatus(function(response) {
    userToken = response.authResponse.accessToken;
    console.log(userToken);
  });
}

function groupManagement() {
  FB.api(
    "/me/groups", (response) => {
      if(response && !response.error) {
        console.log(response);
      }
    }
  );
}

function postTo(group, accToken, imgSource) {
  var testMsg = "aaa";
  if(accToken == null) {
    accToken = userToken;
  }
  FB.api(
    "/"+group+"/feed", "post", { message: testMsg, source:imgSource, access_token: accToken }, (response) => {
        if(!response || response.error) {
          console.log("problem");
          console.log(response.error);
        } else {
          console.log("no problem, id " + response.id);
        }
    }
  )
}

