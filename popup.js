// =============================================
// Elements from popup.html
let findCardBtn = document.querySelector('.js-find-card')
const thumbnailVideoDropzone = document.querySelector('.py-label-video-thumbnail')
const thumbnailInput = document.querySelector('.js-thumbnail-input')
const previewVideo = document.querySelector('.preview-video-thumbnail')

initInputs()

// Init value from chrome store
function initInputs() {
  chrome.storage.local.get('thumbnailProperties', (result) => {
    var storedThumbnail = result.thumbnailProperties

    // If valid data is stored
    if (typeof storedThumbnail !== 'undefined') {
      videoThumbnail = storedThumbnail.thumbnail
      if (videoThumbnail) {
        previewVideo.src = videoThumbnail
        thumbnailInput.classList.add('loaded')
      }
    }
  })
  // launchScript()
}

chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
  chrome.tabs.executeScript(tabs[0].id, { file: '/content.js' }, (res) => {
    console.log('flag 2 '+res)

    chrome.tabs.insertCSS(tabs[0].id, {
      file: '/content.css',
    })
    window.close()
  })
})

async function launchScript() {
  try {
    chrome.storage.local.set({
      thumbnailProperties: {
        thumbnail: videoThumbnail,
      },
    })
  } catch (e) {
    console.error('Error with the Youtube thumbnail extension : ' + e)
  }

  window.parent.postMessage({ type: 'find_card' }, '*')

  // Everything went smooth so we can close the popup to let the user enjoy
  window.close()
}

findCardBtn.addEventListener('click', async () => {
  await launchScript()
  //const activeScreen = document.querySelector('[role="main"]')
})

thumbnailInput.addEventListener('change', () => {
  const file = thumbnailInput.files[0]
  const reader = new FileReader()

  reader.addEventListener(
    'load',
    function () {
      // Convert image file to base64 string
      videoThumbnail = reader.result
      previewVideo.src = reader.result
    },
    false
  )

  if (file) {
    reader.readAsDataURL(file)
  }
})

thumbnailVideoDropzone.addEventListener('dragover', (e) => {
  e.preventDefault()
})

thumbnailVideoDropzone.addEventListener('drop', (e) => {
  e.preventDefault()

  if (e.dataTransfer.items.length) {
    const file = e.dataTransfer.items[0].getAsFile()
    const reader = new FileReader()
    const dtFile = new DataTransfer()
    dtFile.items.add(file)
    thumbnailInput.files = dtFile.files

    reader.addEventListener(
      'load',
      function () {
        // Convert image file to base64 string
        videoThumbnail = reader.result
        previewVideo.src = reader.result
        thumbnailInput.classList.add('loaded')
      },
      false
    )

    reader.readAsDataURL(file)
  }
})
