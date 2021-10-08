const BASE_URL = 'https://movie-list.alphacamp.io'
const INDEX_URL = BASE_URL + '/api/v1/movies/'
const POSTER_URL = BASE_URL + '/posters/'
const datapanel = document.querySelector("#data-panel")
const modalDate = document.querySelector("#movie-modal-date")
const modalDescription = document.querySelector("#movie-modal-description")
const modalTitle = document.querySelector("#movie-modal-title")
const modalImage = document.querySelector("#movie-modal-image")

let myFavoriteMovie = JSON.parse(localStorage.getItem("favorite")) || []

renderMovieList(myFavoriteMovie)

function renderMovieList(movies) {

  let content = ""

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
              <button class="btn btn-info btn-delete-favorite" data-id="${movies[i].id}">X</button>
            </div>
          </div>
        </div>
      </div>
    </div>`
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
  else if (target.classList.contains("btn-delete-favorite")) {
    //如果使用者按移除收藏

    let removeIndex = myFavoriteMovie.findIndex(movie => movie.id === id)

    myFavoriteMovie.splice(removeIndex, 1)

    renderMovieList(myFavoriteMovie)

    //更新最新的favorite陣列至local Storage


    localStorage.setItem("favorite", JSON.stringify(myFavoriteMovie))

  }

})