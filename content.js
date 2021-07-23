var overlay = null,
  frame = null

window.__PREVYOU_LOADED = true

// Event send by the inner `<object>` script
window.addEventListener('message', (e) => {
  if (e.data && e.data.type === 'find_card') {
    console.log('addevenetlistener find_card')
    findCard()
  }
})

function onScroll() {
  // On cible le body, pour interagir avec sa hauteur
  console.log('ouioui')
  // On cible notre progress_bar
  const imgComparation = document.querySelector('body .pp-comparator > img')

  // On écoute le scroll
  window.addEventListener('scroll', () => {
    // On retient le calcul dans une variable : position dans la page - /hauteur totale du body - moins le viewport/
    //  (bodyComparator.clientHeight - window.innerHeight)
    let scroll = window.scrollY 
    console.log(scroll)
    // On fait l'opération, on indique le style de width avec le %
    imgComparation.style.marginTop = '-' + scroll + 'px'
  })
}

// Event send by the extension popup
// eslint-disable-next-line no-unused-vars
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log(request)
  if (request.type == 'popup') {
    //console.log(request);
    showPopup()
  } else if (request.type === 'close_popup') {
    hidePopup()
  }
  return true
})

function showPopup() {
  if (document.querySelector('.pp-popup-overlay')) {
    hidePopup()
    return false
  }
  overlay = document.createElement('div')
  frame = document.createElement('object')

  overlay.className = 'pp-popup-overlay'
  frame.className = 'pp-popup-container'
  frame.setAttribute('scrolling', 'no')
  frame.setAttribute('frameborder', '0')

  // file need to be added in manifest web_accessible_resources
  frame.data = chrome.runtime.getURL('popup.html')
  overlay.appendChild(frame)
  document.body.insertAdjacentElement('beforeend', overlay)
  overlay.addEventListener('click', hidePopup)
}

function hidePopup() {
  // Remove EventListener
  try {
    overlay.removeEventListener('click', hidePopup)
  } catch (error) {
    console.log(error)
  }
  // Clean up references:
  overlay = null
  frame = null

}

function findCard() {
  const body = document.body
  body.classList.add('image-slider')
  const imgDesign = document.createElement('img')
  const div = document.createElement('div')
  div.className = 'pp-comparator'
  body.insertAdjacentElement('afterbegin', div).appendChild(imgDesign)

  const img = document.querySelector('body .pp-comparator > img')

  chrome.storage.local.get('thumbnailProperties', (result) => {
    let thumbnail = result.thumbnailProperties.thumbnail
    imgDesign.src = thumbnail
    img.src = thumbnail

  })
  document.querySelector('.pp-popup-overlay').classList.add('pp-hide')
  onScroll()
}

showPopup()
