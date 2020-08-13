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
    userToken = response.authResponse.accessToken;
    var htmlStuff="<div class=\"centered\"><div class=\"centered-text\"><span class=\"noselect txtclrpnk\">1. Select account or page</span>"
            +"</br>"
            +"<form>"
            +"<select name=\"dropdown\" id=\"acc-select\">"
            +"</select>"+"<button onclick=\"setAccount();\" value =\"Submit\"/>"
            +"</form></div></div>";

    $('.centered').replaceWith(htmlStuff);
    getAccounts();
  });
}

function groupManagement() {

  var htmlStuff="<div class=\"centered\">"+
  "<div class=\"centered-text\">"+
      "<span class=\"noselect txtclrpnk\">2. Select groups</span>"+
      "<span class=\"warning noselect\">WARNING! If you're posting as a page, be sure you can post as a page on the groups you've selected.</span>"+ 
  "</div>"+
  "<div id=\"group-box\">"+
      "<div class=\"groups\">"+

      "</div>"+
          
      "<div class=\"group-options\">"+
          "<select id=\"testSelect\">"+
              "<option value=\"1\">test1</option>"+
              "<option value=\"2\">test2</option>"+
          "</select>"+
          "<div class=\"group-btn\" onclick=\"addElem()\">"+
              "<span class=\"noselect group-bt-txt\">ADD GROUP</span>"+
          "</div>"+
          "<div class=\"grp-rem\">"+
              "<span class=\"noselect group-bt-txt\">REMOVE GROUP</span>"+
          "</div>"+
      "</div>"+
  "</div>";

  $('.centered').replaceWith(htmlStuff);

  FB.api(
    "/me/groups", (response) => {
      if(response && !response.error) {
        console.log(response);
      }
    }
  );
}

var accounts;

function getAccounts() {
  FB.api(
    "/me", (response) => {
      $("#acc-select").append("<option value=\"1\">"+response.name+"</option>");
    }
  );
  FB.api(
    "/me/accounts", (response) => {
      if(response && !response.error) {
        accounts = response.data;
        for(let i = 0; i < accounts.length; i++) {
          $("#acc-select").append("<option value="+(i+2)+">"+accounts[i].name+"</option>");
        }
      }
    }
  );
}

var choosenAcc;

function setAccount() {
  let formVal = $('#acc-select option:selected').val();
  window.alert("selected "+formVal);

  groupManagement();
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

