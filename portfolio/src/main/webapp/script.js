// Copyright 2019 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     https://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

/*
* Scrolls to top of element with id "top"- top of page. Adjusts scroll position to account for
* height for header/navigation bar
*/
function scrollToID(id) {
  var y = document.getElementById(id).offsetTop - document.getElementById("header").offsetHeight;
  console.log("top of elm " + document.getElementById(id).offsetTop);
  window.scrollTo({top: y, behavior: 'smooth'});
}

window.onscroll = function() {
  highlightTab();
};

/*
* Highlights current tab on nav bar
*/
function highlightTab() {
  if (window.pageYOffset < document.getElementById("project").offsetTop - document.getElementById("header").offsetHeight) {
    document.getElementById("about-btn").classList.add("curr-selection");
    document.getElementById("project-btn").classList.remove("curr-selection");
  } else {
    document.getElementById("about-btn").classList.remove("curr-selection");
    document.getElementById("project-btn").classList.add("curr-selection");
  }
}

function fetchComments() {
  // get num of comments to query
  const selectBar = document.getElementById("numComments");
  const maxComments = selectBar.options[selectBar.selectedIndex].value;

  fetch('/comments?numComments=' + maxComments).then(response => response.json()).then((comments) => {
    // clear data-container
    const container = document.getElementById("data-container")
    container.innerHTML = '';

    // fill data-container
    for (const comment of comments) {
      const div = document.createElement("div");
      div.setAttribute("class", "comment");
      
      const user = document.createElement("div");
      user.setAttribute("class", "user");
      user.textContent = comment.user + " said:";

      const message = document.createElement("div");
      message.setAttribute("class", "message");
      message.textContent = comment.message;

      div.appendChild(user);
      div.appendChild(message);
      container.appendChild(div);
    }
  });
}

window.onload = (event) => {
  fetchComments();
  changeCommentFormDisplay();
};

function onSignIn(googleUser) {
  changeCommentFormDisplay(); 
}

function signOut() {
  const auth2 = gapi.auth2.getAuthInstance();
  auth2.signOut().then(function() {
    changeCommentFormDisplay();
  });
}

/*
* Hides comment when not signed in and shows comments form when
* signed in with your google account
*/
function changeCommentFormDisplay() {
  const auth2 = gapi.auth2.getAuthInstance();
  if (auth2.isSignedIn.get()) {
    document.getElementById("comment-form").style.display = "block";
  } else {
    document.getElementById("comment-form").style.display = "none";
  }
}

  
function uploadComment() {
  const id_token = gapi.auth2.getAuthInstance().currentUser.get().getAuthResponse().id_token;
  const textbox = document.getElementById("text_input");
  fetch('/comments', {
    method: 'POST',
    body: "idtoken="+id_token + "&comment="+ textbox.value,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    }
  }).then(function(response) {
    if (!response.ok) {
      // TODO: handle case when verification fails
    }
  })
}