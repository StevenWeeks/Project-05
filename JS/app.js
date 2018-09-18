// Grab the gallery to append to it
let gallery = document.getElementById('gallery')
// create a variable to later put each profile into
let cardContent = ''

// fetching the data from randomuser api

fetch('https://randomuser.me/api?results=12&nat=US')
// the response is then turned into json so it can be easier to work with
  .then(response => response.json())
  // the json data is now used to make the profile cards
  .then(data => {
    profileMaker(data.results)
    // this adds a click listener to the document
    document.addEventListener('click', (e) => {
      // this then limits the clicks to children of the card div closest() targets the closest parent/ancestor
      if (e.target.closest('.card')) {
        //
        let index = (e.target.closest('.card').id)
        let person = data.results
        // pass in json info from api, and the id of the card clicked.
        modalMaker(index, person)
      }
    }, false)
  })

// Create the profiles that will be displayed when page loads.
function profileMaker (infos) {
  // goes through each person object and displays the requested info on the cards, and gives each card an id number
  infos.forEach((person, index) => {
    cardContent += `<div class="card" id="${index}">
    <div class="card-img-container">
        <img class="card-img" src="${person.picture.thumbnail}" alt="profile picture">
    </div>
    <div class="card-info-container">
        <h3 id="name" class="card-name cap">${person.name.first} ${person.name.last}</h3>
        <p class="card-text">${person.email}</p>
        <p class="card-text cap">${person.location.city}</p>
    </div>
    </div>`
  })
  // once done filling each card, it then gets put on the gallery to display
  gallery.innerHTML = cardContent
}
// function that makes the modals; more detailed version of the cards.
// passes index and an array people objects to make going through them easier.
function modalMaker( index, peopleArr) {
  // just some css fluff to make the background behind the current modal appear blurry
document.querySelector('.gallery').classList.add('blur')
document.querySelector('header').classList.add('blur')
// person variable to make it easier to use template literals
let person = peopleArr[index]
// these two variables set up the birthdate to match with the mockups
let noTime = `${person.dob.date}`
let reverseDate = `${noTime.charAt(5)}${noTime.charAt(6)}/${noTime.charAt(8)}${noTime.charAt(9)}/${noTime.charAt(2)}${noTime.charAt(3)}`
// these three variables make the phone number appear as in the mockups
let cell = `${person.cell}`.split("").splice(0,5).join("")
let cellTwo = `${person.cell}`.split("").splice(6,10).join("")
let cellThree = `${cell} ${cellTwo}`
// variable that serves as a template for what a modal should have inside of it, using template literals to use info gained from the api
let modal =
`<div class="modal-container">
      <div class="modal">
          <button type="button" id="modal-close-btn" class="modal-close-btn"><strong>X</strong></button>
          <div class="modal-info-container">
              <img class="modal-img" src="${person.picture.medium}" alt="profile picture">
              <h3 id="name" class="modal-name cap">${person.name.first} ${person.name.last}</h3>
              <p class="modal-text">${person.email}</p>
              <p class="modal-text cap">${person.location.city}</p>
              <hr>
              <p class="modal-text">${cellThree}</p>
              <p class="modal-text cap">${person.location.street}  ${person.location.city}, ${person.location.state}   ${person.location.postcode}
              <p class="modal-text">Birthday: ${reverseDate}</p>
          </div>
      </div>
      <div class="modal-btn-container">
          <button type="button" id="modal-prev" class="modal-prev btn">Prev</button>
          <button type="button" id="modal-next" class="modal-next btn">Next</button>
      </div>
  </div>`
  // gotta make a new div, then append it to the body then make it's innerHTML become the modal template.
  let mody = document.createElement('div')
  document.body.appendChild(mody)
  mody.innerHTML = modal
// click listeners for the next, prev and close btns.  Stops user from continuing if index is at either end of the index.
  document.getElementById('modal-next').addEventListener('click', (e) => {
    // had to use == instead of ===, === would allow attempts to go back or forward if you started at 0 or 11.
    if (index == 11) { return }
    let indexAdd = parseInt(index) + 1;
    e.target.closest('.modal-container').remove()
    modalMaker(indexAdd, peopleArr)

  })
  document.getElementById('modal-prev').addEventListener('click', (e) => {
    if (index == 0) { return }
    let indexAdd = parseInt(index) - 1;
    e.target.closest('.modal-container').remove()
    modalMaker(indexAdd, peopleArr)
  })
  // closes the current modal and removes the background blur.
  document.getElementById('modal-close-btn').addEventListener('click', (e) => {
    e.target.closest('.modal-container').remove()
    document.querySelector('.gallery').classList.remove('blur')
    document.querySelector('header').classList.remove('blur')
  })
}

// Search bar
// takes values from the search input, makes them all lower case to easier match
// feeds the values into the search function
let searchBar = document.querySelector('.search-container')
searchBar.innerHTML =
`<form action="#" method="get">
    <input type="search" id="search-input" class="search-input" placeholder="Search...">
    <input type="submit" value="&#x1F50D;" id="search-submit" class="search-submit">
</form>`
document.getElementById('search-submit').addEventListener('click', (e) => {
  let searchLetters = document.querySelector('.search-input')
  let searchy = searchLetters.value.toLowerCase()
  searcher(searchy)
}, false)


// uses RegExp to search the values provided, and does so globally so it doesn't just return the first one found.
// forEach goes through each name on the cards profiles, and compares it to the RegExp of the values provides from the search input
// leaves the display as is for matching, and none for non-matching.
  function searcher (letts) {
    let regEx = new RegExp(letts, 'gi')
    let named = Array.from(document.querySelectorAll('.card-name'))
    named.forEach(namer => {
      let compareName = namer.innerHTML
      if (compareName.match(regEx)) {
        namer.closest('.card').style.display = ""
      } else {
        namer.closest('.card').style.display = "none"
      }
    })
  }
