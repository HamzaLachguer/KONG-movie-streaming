import {slidesData} from './data.js';


// Constants
const API_KEY = "bb28b6615bf6d0de7b544cd679643b59";
const BASE_URL = "https://api.themoviedb.org/3/";
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';



// Caching DOM elements (as an object: menu, slider, grid)
const header = {
  menuBtn: document.querySelector("#toggle-menu-btn"),
  navMenu: document.querySelector("#nav-menu"),
  searchBtn: document.querySelector("#search-btn"),
  searchForm: document.querySelector("#search-form"),
  body: document.querySelector("body")
}

const slider = {
  nextBtn: document.querySelector("#next-slide"),
  prevBtn: document.querySelector("#previous-slide"),
  dotsContainer: document.querySelector("#slider-dots"),
  slideContainer: document.querySelector("#slide-data"),
}

const grid = {
  streamsGrid: document.querySelector("#data-grid"),
  genreGrid: document.querySelector("#genres-grid"),
  filterStramBtns: document.querySelectorAll("#movies-series button"),
  nextPage: document.querySelector("#next-page"),
  prevPage: document.querySelector("#previous-page"),
  pageCount: document.querySelector("#page-number"),
}


let state = {
  isMenuOpen: false,
  currentSlideIndex: 0,
  sliderInterval: null,
  currentStreamingType: "movie",
  activeGenres: new Set(),
  currentPage: 1,
}


/* ============ HEADER FUNCTIONS ============== */

function toggleNavigationMenu() {
  state.isMenuOpen = !state.isMenuOpen;
  header.menuBtn.classList.toggle("closed");
  
  header.body.classList.toggle("overflow-hidden", state.isMenuOpen);
  header.navMenu.classList.toggle("h-0", !state.isMenuOpen);
  header.navMenu.classList.toggle("h-screen", state.isMenuOpen);
  
  // update aria attributes
  header.menuBtn.setAttribute("aria-expanded", state.isMenuOpen);
  header.navMenu.setAttribute("aria-hidden", !state.isMenuOpen);
}

// Search field
function openSearchForm() {
  header.searchForm.classList.remove("hidden");
  header.body.classList.add("overflow-hidden");

  // Update aria attributes
  header.searchBtn.setAttribute("aria-expanded", true);
  header.searchForm.setAttribute("aria-hidden", false);
}

function hideSearchForm(e) {
    const searchInput = e.target.closest("input");
    if (e.target === searchInput) return;
    header.searchForm.classList.add("hidden");
    if (!state.isMenuOpen) header.body.classList.remove("overflow-hidden");

  // Update aria attributes
  header.searchBtn.setAttribute("aria-expanded", false);
  header.searchForm.setAttribute("aria-hidden", true);
}


function initHeader() {
  header.menuBtn.addEventListener('click', toggleNavigationMenu);
  header.searchBtn.addEventListener('click', openSearchForm);
  header.searchForm.addEventListener('click', (e) => {
    hideSearchForm(e)
  });
}


/* ============ SLIDER FUNCTIONS ============== */

// get next slide index
function getNextSlideIndex() {
  state.currentSlideIndex = (state.currentSlideIndex + 1) % slidesData.length;
}


// get previous slide index
function getPreviousSlideIndex() {
  state.currentSlideIndex = (slidesData.length + state.currentSlideIndex - 1) % slidesData.length;
}


// update slider data
function updateSliderContent(slideIndex) {
  const slideContent = slidesData[slideIndex];

  slider.slideContainer.innerHTML = `
  <div class="h-screen overflow-hidden">
    <img class="w-full h-full object-cover object-center animate-[opacity_1.5s_ease-in-out]" src=${slideContent.back_drop} alt=${slideContent.slogan} loading="lazy">
  </div> 

  <div id="hero-content" class="text-white flex flex-col gap-5 absolute z-[] bottom-9 left-0 p-5">

    <div class="h-[100px] w-full overflow-hidden animate-[heroSlider_1s_ease-in-out]">
      <img class="h-full object-cover object-center animate-[heroSlider_1s_ease-in-out]" src=${slideContent.logo} alt="" loading="lazy">
    </div>

    <div class="flex flex-col gap-5">
      <p class="max-w-[560px] animate-[heroSlider_1.5s_ease-in-out]">${slideContent.overview}</p>

      <div class="flex flex-col gap-5 md:flex-row md:items-center animate-[heroSlider_2s_ease-in-out]">
        <button class="w-fit flex items-center text-[15px] text-black gap-[10px] px-4 capitalize font-medium py-2 bg-white rounded-3xl">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M5 4.98951C5 4.01835 5 3.53277 5.20249 3.2651C5.37889 3.03191 5.64852 2.88761 5.9404 2.87018C6.27544 2.85017 6.67946 3.11953 7.48752 3.65823L18.0031 10.6686C18.6708 11.1137 19.0046 11.3363 19.1209 11.6168C19.2227 11.8621 19.2227 12.1377 19.1209 12.383C19.0046 12.6635 18.6708 12.886 18.0031 13.3312L7.48752 20.3415C6.67946 20.8802 6.27544 21.1496 5.9404 21.1296C5.64852 21.1122 5.37889 20.9679 5.20249 20.7347C5 20.467 5 19.9814 5 19.0103V4.98951Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          watch now
        </button>
        <p class="text-yellow-500">${slideContent.slogan}</p>
      </div>
    </div>
  </div>
  `;
}

// Toggle slider
function updateSlider(slideIndex) {
  updateSliderContent(slideIndex)
  updateSliderDots(slideIndex);
}

function updateSliderDots(slideIndex) {
  slider.dotsContainer.querySelectorAll("button")
    .forEach((dot, index) => {
      dot.classList.toggle("bg-white", index === slideIndex);
      dot.classList.toggle("w-6", index === slideIndex);
      dot.classList.toggle("bg-[#ffffff50]", index !== slideIndex);
    })
}



// render slider dots 
function renderDot(index) {
  const dot = document.createElement("button");
  dot.setAttribute("data-slide-id", index);
  dot.className = `h-2 w-2 transition-all ease-in-out duration-300 rounded-2xl cursor-pointer ${index === 0 ? "bg-white w-6" : "bg-[#ffffff50]"}`;
  
  dot.addEventListener('click', () => updateSlider(index));
  return dot;
}

function renderDots() {
  slider.dotsContainer.innerHTML = '';

  slidesData.forEach((_, index) => {
    slider.dotsContainer.appendChild(renderDot(index));
  })
}

// next slide
function nextSlide() {
  getNextSlideIndex();
  updateSlider(state.currentSlideIndex);
}

// previous slide
function previousSlide() {
  getPreviousSlideIndex();
  updateSlider(state.currentSlideIndex);
}

// init slider
function initSlider() {
  slider.nextBtn.addEventListener('click', nextSlide);
  slider.prevBtn.addEventListener('click', previousSlide);
  updateSlider(0)
  renderDots();
  resetSliderInterval();
}


// slider interval
function resetSliderInterval() {
  clearInterval(state.sliderInterval);
  state.sliderInterval = setInterval(() => {
    getNextSlideIndex();
    updateSlider(state.currentSlideIndex);
  }, 5000)
}




/* ============ FETCHING FUNCTIONS ============== */

// Global function for fetching APIs that takes a pram "url"
async function fetchURL(url) {
  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error("Couldn't fetch the API");
    }

    const data = await response.json();
    return data;
  }

  catch(error) {
    console.error(error)
  }
}

// Fetch streaming
async function fetchStreaming(streamingType, page) {
  let url = `${BASE_URL}${streamingType}/popular?api_key=${API_KEY}&page=${page}`;

  const data = await fetchURL(url);
  //console.log(data.results)
  return data?.results || [];
}


async function fetchGenres(streamingType) {
  let url = `${BASE_URL}genre/${streamingType}/list?api_key=${API_KEY}&language=en-US`;

  const data = await fetchURL(url);
  // console.log(data.genres)
  return data?.genres || [];
}



async function fetchFilterStream(streamingType, genreId, page) {
  let url = `${BASE_URL}discover/${streamingType}?api_key=${API_KEY}&with_genres=${genreId}&page=${page}`;

  const data = await fetchURL(url);
  // console.log(data.results)
  return data?.results || [];
}

// fetchStreaming(state.currentStreamingType)
// fetchGenres(state.currentStreamingType)


// movie card
function renderStreamCard(stream) {
  const {id, title, original_name, release_date, first_air_date, poster_path} = stream;

  const streamTitle = title || original_name || "untitled";
  const streamDate = release_date || first_air_date || "No date";

  return `
    <li data-stream-id="${id}" class="group-card flex flex-col gap-1 cursor-pointer">
      <div class="w-full overflow-hidden">
        <img class="h-full w-full object-cover object-center transition-transform duration-300 ease-in-out group-hover/card:scale-110" src="${IMAGE_BASE_URL}${poster_path}" alt="${streamTitle}">
      </div>

      <div class="flex flex-col gap-1 text-white">
        <h2 class="text-sm ">${streamTitle}</h2>
        <h4 class="text-sm text-[#ffffff75]">${streamDate.split("-")[0]}</h4>
      </div>
    </li>
  `
}

// Genre card
function renderGenreCard(genre) {
  const {id, name} = genre;

  const li = document.createElement("li");
  const button = document.createElement("button");
  button.setAttribute("data-genre-id", id);
  button.className = "bg-[#ffffff50] text-nowrap px-3 py-1 grid place-items-center";
  button.textContent = name;

  button.addEventListener('click', () => {
    button.classList.toggle("bg-[#ff0000]");
    button.classList.toggle("bg-[#ffffff50]");

    if (state.activeGenres.has(id)) {
      state.activeGenres.delete(id);
    } else {
      state.activeGenres.add(id);
    }
    
    state.currentPage = 1;
    updatePageCount(state.currentPage);
    disablePrevious();
    // rendering new grid
    const activeGenres = [...state.activeGenres].map(x => `${x}`).join(",");
    renderFilteredStreamGrid(state.currentStreamingType, activeGenres, state.currentPage);
  })

  li.appendChild(button);
  return li;
}

// render stream grid
async function renderFilteredStreamGrid(streamType, activeGenres, page) {
  const streamList = await fetchFilterStream(streamType, activeGenres, page);
  if (!streamList.length) return;

  grid.streamsGrid.innerHTML = '';
  streamList.forEach(stream => {
    grid.streamsGrid.innerHTML += renderStreamCard(stream);
  })
}

// render stream grid
async function renderStreamGrid(streamType, page) {
  const streamList = await fetchStreaming(streamType, page);
  if (!streamList.length) return;

  grid.streamsGrid.innerHTML = '';
  streamList.forEach(stream => {
    grid.streamsGrid.innerHTML += renderStreamCard(stream);
  })
}

// render genre grid
async function renderGenresGrid(streamType) {
  const genresList = await fetchGenres(streamType);
  if (!genresList.length) return;
  grid.genreGrid.innerHTML = '';
  genresList.forEach(genre => {
    grid.genreGrid.append(renderGenreCard(genre));
  })
}


// Filter streams
function filterStream() {
  grid.filterStramBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      grid.filterStramBtns.forEach(b => b.classList.remove("bg-[#ff0000]"));
      btn.classList.add("bg-[#ff0000]");
      let stream = btn.dataset.category;
      //streamingType === state.currentStreamingType;
      state.currentPage = 1;
      updatePageCount(state.currentPage);
      disablePrevious();

      state.currentStreamingType = stream;
      renderStreamGrid(state.currentStreamingType, state.currentPage);
      renderGenresGrid(state.currentStreamingType);

      state.activeGenres.clear();
    })
  })
}

// toggle pages
function loadNextPage() {
  state.currentPage += 1;
  updatePageCount(state.currentPage);

  enablePrevious()

  window.scrollTo({
    top: window.innerHeight,
    behavior: 'smooth' // optional smooth scrolling
  });

  const activeGenres = [...state.activeGenres].map(x => `${x}`).join(",");

  if (!state.activeGenres.size) {
    renderStreamGrid(state.currentStreamingType, state.currentPage);
  } else {
    renderFilteredStreamGrid(state.currentStreamingType, activeGenres, state.currentPage);
  }
}


function loadPreviousPage() {
  if (state.currentPage == 1) return;

  if (state.currentPage == 2) {
    disablePrevious()
  };

  state.currentPage -= 1;
  updatePageCount(state.currentPage);

  window.scrollTo({
    top: window.innerHeight,
    behavior: 'smooth' // optional smooth scrolling
  });

  const activeGenres = [...state.activeGenres].map(x => `${x}`).join(",");

  if (!state.activeGenres.size) {
    renderStreamGrid(state.currentStreamingType, state.currentPage);
  } else {
    renderFilteredStreamGrid(state.currentStreamingType, activeGenres, state.currentPage);
  }
}

function updatePageCount(p) {
  grid.pageCount.textContent = String(p).padStart('2', 0);
} 

function enablePrevious() {
  grid.prevPage.classList.remove("bg-[#ffffff50]");
  grid.prevPage.classList.add("bg-[#ff0000]");
}

function disablePrevious() {
  grid.prevPage.classList.add("bg-[#ffffff50]");
  grid.prevPage.classList.remove("bg-[#ff0000]");
}

// event listeners
function pagesEvents() {
  grid.nextPage.addEventListener('click', loadNextPage);
  grid.prevPage.addEventListener('click', loadPreviousPage);
}


function initGrid() {
  pagesEvents();

  filterStream();
  renderStreamGrid(state.currentStreamingType, state.currentPage);
  renderGenresGrid(state.currentStreamingType);
}






// call functions after DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  initSlider();
  initHeader();
  initGrid();
})