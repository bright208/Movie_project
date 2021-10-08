const BASE_URL = 'https://movie-list.alphacamp.io'
const INDEX_URL = BASE_URL + '/api/v1/movies/'
const POSTER_URL = BASE_URL + '/posters/'
const datapanel = document.querySelector("#data-panel")
const modalDate = document.querySelector("#movie-modal-date")
const modalDescription = document.querySelector("#movie-modal-description")
const modalTitle = document.querySelector("#movie-modal-title")
const modalImage = document.querySelector("#movie-modal-image")
const searchInput = document.querySelector("#search-input")
const searchForm = document.querySelector("#search-form")
const paginator = document.querySelector("#paginator")
const renderStyle = document.querySelector("#render-style")
const numbers = 12
const movies = []
let filteredMovies = []
const listButton = document.querySelector("#list-button")//新增部分先選取list元素
function getMoviesByPage(page) {

  const data = (filteredMovies.length !== 0) ? filteredMovies : movies
  //三元運算子
  let startIndex = (page - 1) * numbers

  let endIndex = startIndex + numbers

  return data.slice(startIndex, endIndex)
}



function renderPageList(movies) {

  let numberOfPage = Math.ceil(movies.length / numbers)
  //無條件進位

  let content = ""

  for (i = 0; i < numberOfPage; i = i + 1) {
    content += `<li class="page-item"><a class="page-link" href="#" data-id="${i + 1}">${i + 1}</a></li>`
  }

  paginator.innerHTML = content
}



function renderMovieList(movies) {
  let content = ""
  if (listButton.dataset.id === "list-style") {
    //如果list按鈕上的id等於代號list-style
    for (i = 0; i < movies.length; i = i + 1) {
      content += `<div class="col-8 border-top py-3">
        <h5 class="card-title">${movies[i].title}</h5>
      </div>
      <div class="col-4 border-top py-3">
        <button class="btn btn-primary btn-show-movie" data-toggle="modal" data-target="#exampleModal"
          data-id="${movies[i].id}">More</button>
        <button class="btn btn-info btn-add-favorite" data-id="${movies[i].id}">+</button>
      </div>`
    }
  }
  else {

    for (i = 0; i < movies.length; i = i + 1) {

      content += `
    <div class="col-sm-3">
        <div class="mb-2">
          <div class="card">
            <img
              src="${POSTER_URL}${movies[i].image}"
              class="card-img-top" alt="Movie Poster" />
            <div class="card-body">
              <h5 class="card-title">${movies[i].title}</h5>
            </div>
            <div class="card-footer">
              <button class="btn btn-primary btn-show-movie" data-toggle="modal"
                data-target="#exampleModal" data-id="${movies[i].id}">More</button>
              <button class="btn btn-info btn-add-favorite" data-id="${movies[i].id}">+</button>
            </div>
          </div>
        </div>
      </div>
    </div>`
    }
  }
  datapanel.innerHTML = content
}

function showMovieModal(movie) {

  modalDate.innerHTML = `release date:${movie.release_date}`
  modalDescription.innerHTML = movie.description
  modalTitle.innerHTML = movie.title
  modalImage.innerHTML = `<img
    src="${POSTER_URL}${movie.image}"
    alt="movie-poster" class="img-fluid">`

}

axios.get(INDEX_URL)
  .then(function (response) {

    movies.push(...response.data.results)
    //先把從API載下來的資料儲存到空陣列
    renderMovieList(getMoviesByPage(1))
    //將80部電影的陣列渲染到頁面

    renderPageList(movies)
    //將頁面標籤渲染
  }
  )
  .catch(error => console.log(error))


datapanel.addEventListener("click", function (event) {

  let target = event.target
  //找出panel中被點擊的元素
  let id = parseInt(target.dataset.id)
  //找出more按鈕上被標記的id
  if (target.classList.contains("btn-show-movie")) {
    //確認被按的是"more"按鈕
    axios.get(`https://movie-list.alphacamp.io/api/v1/movies/${id}`)
      .then(function (response) {
        //用axios發送請求請求給show API
        let movie = response.data.results
        //從showAPI載下來的資料轉成單一電影的物件

        showMovieModal(movie)
        //把movie帶入涵式，調用modal涵式渲染
      }
      )
  }
  else if (target.classList.contains("btn-add-favorite")) {
    //如果按+按鈕，新增制我的最愛
    let myFavoriteList = JSON.parse(localStorage.getItem("favorite")) || []
    //如果之前從未建立收藏則使用空陣列[]，如果之前已經有收藏則從localstorage讀取資料並轉成javascript語言
    if (myFavoriteList.some(movie => movie.id === id)) {
      return alert("此電影已在收藏清單")
    }//需要新增避免按到重複電影，return在這裡的意思是終止函式執行

    myFavoriteList.push(movies.find(movie => movie.id === id))
    //需要將找到的電影，推進我的最愛陣列
    localStorage.setItem("favorite", JSON.stringify(myFavoriteList))
    //將更新後的資料轉成JSON文字檔並且上傳到localstorage
  }

})

searchForm.addEventListener("submit", function (event) {
  event.preventDefault()
  //避免重新整理導致input的值刪除

  let keyword = searchInput.value.toLowerCase().trim()

  filteredMovies = movies.filter(movie => movie.title.toLowerCase().trim().includes(keyword))
  //把filteredMovie從區域變數變成global變數
  if (keyword.length === 0) {
    alert("請勿輸入空白字串")
  }//加入錯誤處理：若使用者沒輸入東西就送出，會跳出警告訊息。

  if (filteredMovies.length === 0) {
    return alert(`您所搜尋的" ${keyword} "找不到相關電影`)
  }

  renderMovieList(getMoviesByPage(1))
  //將過濾好的電影重新渲染至頁面

  renderPageList(filteredMovies)

  //重新製作頁面標籤
})


paginator.addEventListener("click", function (event) {

  let target = event.target
  if (target.classList.contains("page-link")) {

    let selectedPage = parseInt(target.dataset.id)
    //取出按鈕的id=第幾頁
    renderMovieList(getMoviesByPage(selectedPage))
  } //把頁數帶入pageForMovie取得切割後的陣列，再帶進render重新渲染頁面
})

renderStyle.addEventListener("click", function (event) {

  let target = event.target

  if (target.classList.contains("fa-bars")) {
    //確認點擊的是list button
    listButton.dataset.id = "list-style"
    //將button元素上的data-id 標註為list-style
    renderMovieList(getMoviesByPage(1))
    //重新整理頁面，render函數會使用第一種的scenario
  }

  else if (target.classList.contains("fa-th")) {
    listButton.dataset.id = "card-style"
     //將list button上的data-id變為card-style
    renderMovieList(getMoviesByPage(1))
    //重新整理頁面
  }
})