import { getToken } from "./index.js";

// Замени на свой, чтобы получить независимый от других набор данных.
// "боевая" версия инстапро лежит в ключе prod
const personalKey = "tatiana-alekseeva";
const baseHost = "https://webdev-hw-api.vercel.app";
const postsHost = `https://wedev-api.sky.pro/api/v1/:${personalKey}/instapro`;

export function getPosts({ token }) {
  return fetch(postsHost, {
    method: "GET",
    headers: {
      Authorization: token,
    },
  })
    .then((response) => {
      if (response.status === 401) {
        throw new Error("Нет авторизации");
      }

      return response.json();
    })
    .then((data) => {
      const appPosts = data.posts.map((post) => {
        return {
          id: post.id,
          imageUrl: post.imageUrl,
          createdAt: post.createdAt,
          description: post.description,
          userId: post.user.id,
          userName: post.user.name,
          userLogin: post.user.login,
          userImg: post.user.imageUrl,
          likes: post.likes,
          isLiked: false,
        };
      });

      return appPosts;
    });
}

export function fetchUserPosts(userId) {
  return fetch(postsHost + `/user-posts/${userId}`)
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      const appPosts = data.posts.map((post) => {
        return {
          id: post.id,
          imageUrl: post.imageUrl,
          createdAt: post.createdAt,
          description: post.description,
          userId: post.user.id,
          userName: post.user.name,
          userLogin: post.user.login,
          userImg: post.user.imageUrl,
          likes: post.likes,
          isLiked: false,
        };
      });

      return appPosts;
    });
}

export function onAddPostClick(description, imageUrl) {
  return fetch(postsHost, {
    method: "POST",
    headers: {
      Authorization: getToken(),
    },
    body: JSON.stringify({
      description,
      imageUrl,
    }),
  }).then((response) => {
    if (response.status === 500) {
      throw new Error("Ошибка сервера");
    }
    if (response.status === 401) {
      throw new Error("Нет авторизации");
    }
    if (response.status === 400) {
      throw new Error("Неверный запрос");
    }
    if (response.status === 201) {
      return response.json();
    }
  });
}

export function registerUser({ login, password, name, imageUrl }) {
  return fetch(baseHost + "/api/user", {
    method: "POST",
    body: JSON.stringify({
      login,
      password,
      name,
      imageUrl,
    }),
  }).then((response) => {
    if (response.status === 400) {
      throw new Error("Такой пользователь уже существует");
    }
    return response.json();
  });
}

export function loginUser({ login, password }) {
  return fetch(baseHost + "/api/user/login", {
    method: "POST",
    body: JSON.stringify({
      login,
      password,
    }),
  }).then((response) => {
    if (response.status === 400) {
      throw new Error("Неверный логин или пароль");
    }
    return response.json();
  });
}

// Загружает картинку в облако, возвращает url загруженной картинки
export function uploadImage({ file }) {
  const data = new FormData();
  data.append("file", file);

  return fetch(baseHost + "/api/upload/image", {
    method: "POST",
    body: data,
  }).then((response) => {
    return response.json();
  });
}
