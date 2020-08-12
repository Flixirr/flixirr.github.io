window.fbAsyncInit = function() {
    FB.init({
      appId      : '309464026839831',
      cookie     : true,
      xfbml      : true,
      version    : 'v8.0'
    });
    
    FB.login(function(response) {
      checkLoginState();
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
    let name;
    FB.api(
      "/me", (response) => {
        name = response.name;
      }
    );
    userToken = response.authResponse.accessToken;
    var htmlStuff="<div class=\"centered\"><span class=\"noselect txtclrpnk\">1. Select account or page</span>"
            +"</br>"
            +"<form action=\"\" method=\"post\">"
            +"<select name=\"dropdown\" id=\"acc-select\">"
            +"<option value=\"1\" selected>"+name+"</option>"
            +"</select>"+"<input type=\"submit\" value =\"Submit\"/>"
            +"</form></div>";

    $('.centered').replaceWith(htmlStuff);
    getAccounts();
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

function getAccounts() {
  FB.api(
    "/me/accounts", (response) => {
      if(response && !response.error) {
        let accounts = response.data;
        for(let i = 0; i < accounts.length; i++) {
          $("#acc-select").append("<option value="+(i+2)+">"+accounts[i].name+"</option>");
        }
      }
    }
  );
}

function postTo(group, accToken, imgSource) {
  var testMsg = "aaa";
  if(accToken == null) {
    accToken = userToken;
  }
  var data = { 
    message: testMsg, 
    access_token: accToken 
  }
  var loc = imgSource==null ? "/"+group+"/photos" : "/"+group+"/feed";
  FB.api(
    loc, "post", data, (response) => {
        if(!response || response.error) {
          console.log("problem");
          console.log(response.error);
        } else {
          console.log("no problem, id " + response.id);
        }
    }
  )
}

