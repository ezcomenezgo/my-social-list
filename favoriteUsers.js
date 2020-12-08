const BASE_URL = 'https://lighthouse-user-api.herokuapp.com'
const INDEX_URL = BASE_URL + '/api/v1/users'
const POSTER_URL = BASE_URL + '/posters/'
const users = JSON.parse(localStorage.getItem('favoriteUsers'))
let filteredUsers = []

const dataPanel = document.querySelector('#data-panel')
const searchForm = document.querySelector('#search-form')
const searchInput = document.querySelector('#search-input')

// 把資料放進網頁

function renderUserList(data) {
  let rawHTML = ''
  data.forEach(item => {
    rawHTML += `
    <div class="col-sm-2">
        <div class="my-2">
          <div class="card" style="width: 12rem;">
            <a data-toggle="modal" data-target="#userInfo-modal">
              <img src="${item.avatar}" class="card-img-top user-info" alt="user-avatar" data-id="${item.id}">
            </a>
            <div>
              <span class="card-text">${item.name}</span>
              <button class=".btn btn-info btn-add-favorite" data-id="${item.id}">+</button>
            </div>
          </div>
        </div>
      </div>
    `
    dataPanel.innerHTML = rawHTML
  })
}

// 監聽data-panel找出照片相對應的id然後傳入下面的showUserModal跟addToFavorite函式
dataPanel.addEventListener('click', function onPanelClicked(event) {
  if (event.target.matches('.user-info')) {
    showUserModal(Number(event.target.dataset.id))
    // console.log(event.target.dataset.id)
  } else if (event.target.matches('.btn-add-favorite')) {
    addToFavorite(Number(event.target.dataset.id))
  }
})



function showUserModal(id) {
  const modalName = document.querySelector('#user-modal-name')
  const modalDescription = document.querySelector('#user-modal-description')
  // 一開始卡在這邊的data是undefined，後來慢慢找才發現回傳的資料沒有result只有到data而已
  axios.get(INDEX_URL + '/' + id).then((response) => {
    const data = response.data
    console.log(data)
    modalName.innerText = data.name + ' ' + data.surname
    modalDescription.innerHTML = `
      <pre>${data.email}</pre>
      <pre>gender: ${data.gender}</pre>
      <pre>age: ${data.age}</pre>
      <pre>region: ${data.region}</pre>
      <pre>birthday: ${data.birthday}</pre>
    `
  })
}

renderUserList(users)