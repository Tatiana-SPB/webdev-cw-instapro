import { USER_POSTS_PAGE } from "../routes.js";
import { renderHeaderComponent } from "./header-component.js";
import { posts, user } from "../index.js";
import { fetchUserPosts, fetchLikePosts } from "../api.js";

export function renderUserPostsPageComponent(userId) {
  // @TODO: реализовать рендер страницы с фотографиями отдельного пользвателя
  const appEl = document.getElementById("app");

  fetchUserPosts(userId).then((userPosts) => {
    const postsHtml = userPosts
      .map((post) => {
        return `<li class="post">
                    <div class="post-header" data-user-id="${post.userId}">
                        <img src="${post.userImg}" class="post-header__user-image">
                        <p class="post-header__user-name">${post.userName}</p>
                    </div>
                    <div class="post-image-container">
                      <img class="post-image" src="${post.imageUrl}">
                    </div>
                    <div class="post-likes">
                      <button data-post-id="${post.id}" class="like-button">
                        <img src="${post.isLiked ? "./assets/images/like-not-active.svg" : "./assets/images/like-active.svg"}">
                      </button>
                      <p class="post-likes-text">
                        Нравится: <strong>${post.likes.length}</strong>
                      </p>
                    </div>
                    <p class="post-text">
                      <span class="user-name">${post.userName}</span>
                      ${post.description}
                    </p>
                    <p class="post-date">
                      ${post.createdAt}
                    </p>
                  </li>`;
      })
      .join("");

    const appHtml = `
              <div class="page-container">
                <div class="header-container"></div>
                <ul class="posts">${postsHtml}
                </ul>
              </div>`;

    appEl.innerHTML = appHtml;

    renderHeaderComponent({
      element: document.querySelector(".header-container"),
    });

    for (let userEl of document.querySelectorAll(".post-header")) {
      userEl.addEventListener("click", () => {
        const userId = userEl.dataset.userId;
        renderUserPostsPageComponent(userId);
      });
    }

    for (let likeEl of document.querySelectorAll(".like-button")) {
      likeEl.addEventListener("click", () => {
        const postId = likeEl.dataset.postId;
        const post = posts.find((post) => post.id === postId);

        if (!post) {
          console.error("Пост не найден");
          return;
        }

        if (!user || !user._id) {
          alert("Пожалуйста, авторизуйтесь");
          return;
        }

        fetchLikePosts(postId, !post.isLiked)
          .then(() => {
            renderUserPostsPageComponent(userId);
          })
          .catch((error) => {
            console.error("Ошибка при обработке лайка:", error);
          });
      });
    }
  });
}
