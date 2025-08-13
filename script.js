// IMPORTING
import {slidesData} from './data.js';


/* 
  *** HEADER CODE ***
  
*/

// Caching DOM elements
const menuBtn = document.querySelector("#toggle-menu-btn");
const navMenu = document.querySelector("#nav-menu");
const header = document.querySelector("header");

let isMenuOpen = false;

// Toggle navigation menu function
function toggleNavigationMenu() {
  if (!isMenuOpen) {
    menuBtn.classList.toggle("closed")
    navMenu.classList.toggle("hide-menu");
  }

  // update aria attributes
  menuBtn.setAttribute("aria-expanded", !isMenuOpen);
  navMenu.setAttribute("aria-hidden", isMenuOpen);
}

// Menu button eventListener
menuBtn.addEventListener('click', toggleNavigationMenu)







/* 
  *** SLIDER CODE ***
  
*/

// Caching DOM elements
const slideContainer = document.querySelector("#slide-data");
const next = document.querySelector("#next-slide");
const prev = document.querySelector("#previous-slide");
const sliderDots = document.querySelector("#slider-dots");



// Generate content | Dot on click
function renderSliderDots() {
  slidesData.forEach((_, index) => {
    const button = document.createElement("button");
    button.setAttribute("data-slide-id", index);
    button.classList = "h-2 w-2 transition-all ease-in-out duration-600 bg-[#ffffff50] rounded-2xl";

    if (index === 0) {
      button.classList.add("bg-white");
      button.classList.add("w-[20px]");
    }

    sliderDots.append(button);
    button.addEventListener('click', () => {
      updateSlider(index);
    })
  })
}


let currentSlide = 0;
updateSlider(currentSlide)

// Next slide
function nextSlide() {
  currentSlide = (currentSlide + 1) % slidesData.length;
  updateSlider(currentSlide)
  console.log("next")
}

// Previous slide
function prevSlide() {
  currentSlide = (slidesData.length + (currentSlide - 1)) % slidesData.length;
  updateSlider(currentSlide)
  console.log("previous")
}

// Update slider
function updateSlider(currentSlide) {
  const slideData = slidesData[currentSlide];

  slideContainer.innerHTML = `
  <div class="h-screen overflow-hidden">
    <img class="w-full h-full object-cover object-center animate-[opacity_1s_ease-in-out]" src=${slideData.back_drop} alt="Ballerina (2025)" loading="lazy">
  </div> 

  <div id="hero-content" class="text-white flex flex-col gap-5 absolute z-[8888] bottom-9 left-0 p-5">

    <div class="h-[100px] w-full overflow-hidden">
      <img class="h-full object-cover object-center animate-[heroSlider_1s_ease-in-out]" src=${slideData.log} alt="" loading="lazy">
    </div>

    <div class="flex flex-col gap-5">
      <p class="max-w-[560px] animate-[heroSlider_1.5s_ease-in-out]">${slideData.overview}</p>

      <div class="flex flex-col gap-5 md:flex-row md:items-center  animate-[heroSlider_2s_ease-in-out]">
        <button class="w-fit flex items-center text-[15px] text-black gap-[10px] px-4 capitalize font-medium py-2 bg-white rounded-3xl">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M5 4.98951C5 4.01835 5 3.53277 5.20249 3.2651C5.37889 3.03191 5.64852 2.88761 5.9404 2.87018C6.27544 2.85017 6.67946 3.11953 7.48752 3.65823L18.0031 10.6686C18.6708 11.1137 19.0046 11.3363 19.1209 11.6168C19.2227 11.8621 19.2227 12.1377 19.1209 12.383C19.0046 12.6635 18.6708 12.886 18.0031 13.3312L7.48752 20.3415C6.67946 20.8802 6.27544 21.1496 5.9404 21.1296C5.64852 21.1122 5.37889 20.9679 5.20249 20.7347C5 20.467 5 19.9814 5 19.0103V4.98951Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          watch now
        </button>
        <p class="text-yellow-500">${slideData.slogan}</p>
      </div>
    </div>
  </div>
  `

  sliderDots.querySelectorAll("button")
    .forEach((dot, index) => {
      dot.classList.toggle("bg-white", index === currentSlide);
      dot.classList.toggle("w-[20px]", index === currentSlide);
    })
}
// set intervale each 3s
let interval = setInterval(() => {
  
  nextSlide()
  // clearInterval(interval);
}, 5000)


function initSlider() {
  renderSliderDots()
  next.addEventListener('click', nextSlide);
  prev.addEventListener('click', prevSlide);
}

initSlider()



/* 
  *** THE MOVIE GRID | FETCHING API ***
  
*/
const displayBtns = document.querySelectorAll("#movies-series button");
const gridContainer = document.querySelector("#data-grid");

const API_KEY = "bb28b6615bf6d0de7b544cd679643b59";

const GENRE_URL = "https://api.themoviedb.org/3/genre/movie/list";
const BASE_URL = "https://api.themoviedb.org/3";
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';


// FETCHING API
async function fetchAPI(type) {
  const response = await fetch(`${BASE_URL}/${type}/popular?api_key=${API_KEY}`);
  const data = await response.json();
  return data.results;
}
fetchAPI()

// Render grid
async function renderDataGrid(type) {
  const dataList = await fetchAPI(type);
  
  dataList.map(x => {
    
    console.log(x)
    return gridContainer.innerHTML += `
      <li class="group-card flex flex-col gap-1 cursor-pointer" data-stream-id=${x.id}>
        <div class="w-full overflow-hidden">
          <img class="h-full w-full object-cover object-center transition-transform duration-300 ease-in-out group-hover/card:scale-110" src="${IMAGE_BASE_URL}${x.poster_path}"alt="Mission: Impossible - The Final Reckoning (2025)">
        </div>

        <div class="flex flex-col gap-1 text-white">
          <h2 class="text-sm ">${x.original_title || x.original_name}</h2>
          <h4 class="text-sm text-[#ffffff75]">2025</h4>
        </div>
      </li>
    `
  }).join
}

renderDataGrid("movie")

displayBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    displayBtns.forEach(b => b.classList.toggle("bg-[#ff0000]"));

    // display id
    const displayId = btn.dataset.category;
    gridContainer.innerHTML = '';

    renderDataGrid(displayId)
    console.log(displayId);
  })
})