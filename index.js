const BASE_URL = 'https://lighthouse-user-api.herokuapp.com'
const INDEX_URL = BASE_URL + '/api/v1/users'
const POSTER_URL = BASE_URL + '/posters/'
const users = []
let filteredUsers = []

const dataPanel = document.querySelector('#data-panel')
const searchForm = document.querySelector('#search-form')
const searchInput = document.querySelector('#search-input')
const USERS_PER_PAGE = 12
const paginator = document.querySelector('#paginator')

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

// render paginator
function renderPaginator(amount) {
  // 計算總頁數
  const numberOfPage = Math.ceil(amount / USERS_PER_PAGE)
  // 製作Template
  let rawHTML = ''

  for (let page = 1; page <= numberOfPage; page++) {
    rawHTML += `<li class="page-item"><a class="page-link" href="#" data-page=${page}>${page}</a></li>`
  }
  // 放回HTML
  paginator.innerHTML = rawHTML
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

paginator.addEventListener('click', function onPaginetorClicked(event) {
  // 如果點擊的不是a標籤，結束
  if (event.target.tagName !== 'A') return

  // 透過dataset取得被點擊的頁數
  const page = Number(event.target.dataset.page)
  // 更新畫面
  renderUserList(getUsersBypage(page))
})

// 取出特定頁面的資料
function getUsersBypage(page) {
  const data = filteredUsers.length ? filteredUsers : users
  // 計算起始的index
  const startIndex = (page - 1) * USERS_PER_PAGE
  // 回傳切割後的新陣列
  return data.slice(startIndex, startIndex + USERS_PER_PAGE)
}

// 監聽search form抓出輸入內容
searchForm.addEventListener('submit', function onSearchFormSubmitted(event) {
  event.preventDefault() // 請瀏覽器終止元件的預設行為
  // console.log(searchForm)
  const keyword = searchInput.value.trim().toLowerCase() // 取得關鍵字
  console.log(keyword)

  if (!keyword.length) {
    return alert('請輸入有效字串!')
  } // 錯誤處理：輸入無效字串

  for (const user of users) {
    if (user.name.toLowerCase().includes(keyword) || user.surname.toLowerCase().includes(keyword)) {
      filteredUsers.push(user)
      console.log(filteredUsers)
      renderPaginator(filteredUsers.length)
      renderUserList(getUsersBypage(1))
    }
  }
  // 抓這裡的bug
  // function filterUserName(firstName) {
  //   console.log(firstName.name.toLowerCase().includes(keyword))
  // }
  // function filterUserSurname(secondName) {
  //   return secondName.surname.toLowerCase().includes(keyword)
  // }
  // filteredUsers = users.filter(filterUserName) // + users.filter(filterUserSurname)


})

// 顯示Modal的資料
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

function addToFavorite(id) {
  const list = JSON.parse(localStorage.getItem('favoriteUsers')) || []
  const user = users.find((user) => user.id === id)

  // 收藏重複錯誤處理
  if (list.some((user) => user.id === id)) {
    return alert('該用戶已在名單內！')
  }

  list.push(user)
  console.log(list)
  localStorage.setItem('favoriteUsers', JSON.stringify(list))
}

axios
  .get(INDEX_URL)
  .then((response) => {
    users.push(...response.data.results)
    // console.log(users)
    renderPaginator(users.length)
    renderUserList(getUsersBypage(1))
  })
  .catch((err) => console.log(err))