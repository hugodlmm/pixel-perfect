var overlay = null,
  frame = null;

window.__PREVYOU_LOADED = true;

// Event send by the inner `<object>` script
window.addEventListener("message", (e) => {
  console.log(e);
  console.log(e.data);
  if (e.data && e.data.type === "find_card") {
    findCard(e.data.view);
  }
  const imgComparation = document.querySelector("body .pp-comparator > img");
  imgComparation.style.opacity = e.data.opacity;
});

// Event send by the extension popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type == "popup") {
    //console.log(request);
    showPopup();
  } else if (request.type === "close_popup") {
    hidePopup();
  }
  return true;
});

function onScroll() {
  // On cible le body, pour interagir avec sa hauteur
  console.log("ouioui");
  // On cible notre progress_bar
  const imgComparation = document.querySelector("body .pp-comparator > img");

  // inputRange.addEventListener("")

  window.addEventListener("scroll", () => {
    let scroll = window.scrollY;
    imgComparation.style.marginTop = "-" + scroll + "px";
  });
}

function showPopup() {
  if (document.querySelector(".py-popup-overlay")) {
    hidePopup();
    return false;
  }

  overlay = document.createElement("div");
  frame = document.createElement("object");

  overlay.className = "py-popup-overlay";
  frame.className = "py-popup-container";
  frame.setAttribute("scrolling", "no");
  frame.setAttribute("frameborder", "0");

  // file need to be added in manifest web_accessible_resources
  frame.data = chrome.runtime.getURL("popup.html");
  overlay.appendChild(frame);
  document.body.appendChild(overlay);

  overlay.addEventListener("click", hidePopup);
}

function hidePopup() {
  // Remove EventListener
  overlay.removeEventListener("click", hidePopup);

  // Remove the elements:
  document.querySelector(".py-popup-overlay").remove();

  // Clean up references:
  overlay = null;
  frame = null;
}

function findCard(view) {
  let oldComparator = document.querySelector(".pp-comparator");
  if (oldComparator) document.querySelector(".pp-comparator").remove();;
  console.log("test");
  const body = document.body;
  body.classList.add("image-slider");
  const imgDesign = document.createElement("img");
  const div = document.createElement("div");

  if (view == "border-left") div.className = "pp-comparator border-left";
  if (view == "border-top") div.className = "pp-comparator border-top";
  body.insertAdjacentElement("afterbegin", div).appendChild(imgDesign);

  const img = document.querySelector("body .pp-comparator > img");

  chrome.storage.local.get("thumbnailProperties", (result) => {
    let thumbnail = result.thumbnailProperties.thumbnail;
    imgDesign.src = thumbnail;
    img.src = thumbnail;
    hidePopup();
  });
  // document.querySelector('.pp-popup-overlay').classList.add('pp-hide')
  onScroll();
}

showPopup();
