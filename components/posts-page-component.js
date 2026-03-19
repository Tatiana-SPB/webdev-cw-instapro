import { USER_POSTS_PAGE } from "../routes.js";
import { renderHeaderComponent } from "./header-component.js";
import { posts, user } from "../index.js";
import { renderUserPostsPageComponent } from "./user-posts-page-component.js";
import { fetchLikePosts } from "../api.js";

/*import { formatDistanceToNow } from "/date-fns";
//import { ru } from "/date-fns/locale";
function formatDate(date) {
  const nearDate = date;
  nearDate.setSeconds(nearDate.getSeconds() - 15);
  console.log(formatDistanceToNow(nearDate, { includeSeconds: true }));
}
formatDate(newDate())*/

export function renderPostsPageComponent() {
  // @TODO: реализовать рендер постов из api
  const appEl = document.getElementById("app");

  /**
   * @TODO: чтобы отформатировать дату создания поста в виде "19 минут назад"
   * можно использовать https://date-fns.org/v2.29.3/docs/formatDistanceToNow
   */
  console.log(posts);

  const postsHtml = posts
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
                      <button class="like-button" data-post-id="${post.id}">
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

      fetchLikePosts(postId, !post.isLiked).catch((error) => {
        console.error("Ошибка при обработке лайка:", error);
      });

      /*let isLiked = post.isLiked;
      console.log(postId);
      console.log(isLiked);
      const index = posts.findIndex((user) => postId === user.id);
      console.log(index);

      if (!isLiked) {
        post.likes.push({ id: user._id, name: user.name });
        isLiked = true;
        fetchLikePosts(postId, isLiked, user._id, user.name);
        //goToPage;
      } else {
        post.likes.splice(index, 1);
        post.isLiked = false;
        fetchDislikePosts(postId, isLiked, user._id, user.name);
        //goToPage;
      }
      renderPostsPageComponent();*/
    });
  }
}
