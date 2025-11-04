const form = document.querySelector('form');
const idInput = document.querySelector('#user_id');
const passwordInput = document.querySelector('#user_password');
const loginButton = document.querySelector('#login_button');

const main = document.querySelector('main');
const userName = document.querySelector('#user_name');
const userInfo = document.querySelector('#user_info');
const logoutButton = document.querySelector('#logout_button');

const client = axios.create({
  baseURL: 'http://localhost:3000',
});
let accessToken = '';

form.addEventListener('submit', (e) => e.preventDefault());

function login() {
  const userId = idInput.value;
  const userPassword = passwordInput.value;

  return client
    .post('/', { userId, userPassword }) //
    .then((res) => (accessToken = res.data));
}

function logout() {
  accessToken = '';
}

function getUserInfo() {
  return client.get('/', {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
}

function renderUserInfo(user) {
  main.style.display = 'block';
  form.style.display = 'none';
  userName.textContent = user.name;
  userInfo.textContent = user.info;
}

function renderLoginForm() {
  main.style.display = 'none';
  form.style.display = 'grid';
  userName.textContent = '';
  userInfo.textContent = '';
}

loginButton.onclick = () => {
  login()
    .then(() => getUserInfo())
    .then((res) => renderUserInfo(res.data))
    .catch((res) => alert(res.response.data))
    .finally(() => form.reset());
};

logoutButton.onclick = () => {
  logout();
  renderLoginForm();
};
