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

function getDataFromServlet() {
  fetch('/data').then(response => response.text()).then((quote) => {
    document.getElementById('data-container').innerText = quote;
  });
}

function getJson() {
    (fetch('/data').then(response => response.json()).then((list) => {
        console.log(list);
        for (let i = 0; i < list.length; i++) {
            document.getElementById("data-container").innerText += list[i] + "\n";
        }
    }));
}