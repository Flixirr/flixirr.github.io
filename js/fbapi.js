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
    function groupManagement() {
      FB.api(
        "/me/groups", (respose) => {
          if(response && !response.error) {
            let groups = JSON.parse(response);
            console.log(groups);
          }
        }
      );
    }

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