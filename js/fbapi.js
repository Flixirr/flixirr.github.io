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
            +"</select>"+"<button onclick=\"setAccount();\" > Continue </button>"
            +"</form></div></div>";

    $('.centered').replaceWith(htmlStuff);
    getAccounts();
  });
}

var allGroups;

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
          "<select id=\"grp-select\">"+
          "</select>"+
          "<div class=\"group-btn\" onclick=\"addGroup()\">"+
              "<span class=\"noselect group-bt-txt\">ADD GROUP</span>"+
          "</div>"+
          "<div class=\"grp-rem\" onclick=\"removeGroup()\">"+
              "<span class=\"noselect group-bt-txt\">REMOVE GROUP</span>"+
          "</div>"+
          "<div class=\"grp-cont\" onclick=\"continueToPost()\">"+
              "<span class=\"noselect group-bt-txt\">CONTINUE</span>"+
          "</div>"+
      "</div>"+
  "</div>";

  $('.centered').replaceWith(htmlStuff);

  FB.api(
    "/me/groups", (response) => {
      if(response && !response.error) {
        allGroups = response.data;
        for(let i = 0; i < allGroups.length; i++) {
          $('#grp-select').append("<option value="+i+">"+allGroups[i].name+"</option>");
        }
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
  if(formVal-2 >= 0) {
    choosenAcc = accounts[formVal-2];
  }
  if(choosenAcc != undefined) console.log(choosenAcc);

  groupManagement();
}

var groupList = [];

function addGroup() {
  let selected = allGroups[$('#grp-select option:selected').val()];
  if(!groupList.includes(selected)) {
    groupList.push(selected);
    $(".groups").append("<span id="+selected.id+">"+selected.name+"<br></span>");
  }
}

function removeGroup() {
  let selected = allGroups[$('#grp-select option:selected').val()];
  const index = groupList.indexOf(selected);
  if(index > -1) {
    groupList.splice(index,1);
    $("#"+selected.id+"").replaceWith("");
  }
}

function continueToPost() {
  var htmlStuff ="<div class=\"centered\">"+
    "<div class=\"centered-text\">"+
        "<span class=\"noselect txtclrpnk\">3. Create post</span>"+
        "<span class=\"warning noselect\">WARNING! You can't send link to an event you're not hosting. If your post includes an image, post URL's with your message as they won't appear if you post them as link</span>"+
        "<textarea id=\"post-msg\" name=\"message\" rows=\"10\" cols=\"50\" placeholder=\"Enter text here\" required></textarea>"+
        "<div>"+
            "<input id=\"link\" type=\"text\" placeholder=\"Link to group, page, event etc.\" />"+
        "</div>"+
        "<div>"+
            "<input type=\"file\" id=\"image-src\"/>"+
            "<button id=\"post-fb\" onclick=\"ajaxPost()\">POST</button>"+
        "</div>"+
    "</div>"+
  "</div>";

  $('.centered').replaceWith(htmlStuff);
}



// from https://vedmant.com/facebook-graph-api-upload-photo-using-javascript-local-computer/?fbclid=IwAR1pO_ZjEQXR_N6XHAxtSEHexArHWbc-gRxGismV0WIJq7B6yesoRjsSioA
// needed to convert image to formdata and found this script which also posts it automatically
function ajaxPost() {
  var message = $('#post-msg').val();
  var link = $('#link').val();
  var file = $('#image-src')[0].files[0];

  var data = new FormData();

  data.append('message', message);
  if(choosenAcc == undefined) {
    data.append('access_token', FB.getAccessToken());
  } else {
    data.append('access_token', choosenAcc.access_token);
  }
  if(link != "") {
    data.append('link', link);
  }

  if(file != undefined) {
    var reader = new FileReader();
    reader.onload = function (e) {
        var arrayBuffer = e.target.result;
        var blob = new Blob([arrayBuffer], { type: file.type });
        data.append('source', blob);
        for(let i = 0; i < groupList.length; i++) {
          ajaxPostPure(data, 'https://graph.facebook.com/'+groupList[i].id+'/photos');
        }
    };
    reader.readAsArrayBuffer(file);
  } else {
    for(let i = 0; i < groupList.length; i++) {
      ajaxPostPure(data, 'https://graph.facebook.com/'+groupList[i].id+'/feed');
    }
  }
}

function ajaxPostPure(data, procUrl) {
  $.ajax({
    url: procUrl,
    type: 'POST',
    data: data,
    processData: false,
    contentType: false,
    cache: false,
    success:function (data) {
        console.log(data)
    },
    error:function (data) {
        console.log(data);
    },
    complete: function () {
        console.log("Done");
    }
  });
}

function postTo(group, accToken, imgSource) {
  var testMsg = "aaa";
  if(accToken == undefined) {
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

