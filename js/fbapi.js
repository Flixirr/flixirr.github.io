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

function checkLoginState() {
  FB.getLoginStatus(function(response) {
    console.log(response);
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

function postTo(group) {
  var testMsg = "aaa";
  FB.api(
    "/"+group+"/feed", "post", { message: testMsg }, (response) => {
        if(!response || response.error) {
          console.log("problem");
        } else {
          console.log("no problem, id " + response.id);
        }
    }
  )
}