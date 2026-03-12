import { USER_POSTS_PAGE } from "../routes.js";
import { renderHeaderComponent } from "./header-component.js";
import { posts, goToPage } from "../index.js";

/*import { formatDistanceToNow } from "/date-fns";
//import { ru } from "/date-fns/locale";
function formatDate(date) {
  const nearDate = date;
  nearDate.setSeconds(nearDate.getSeconds() - 15);
  console.log(formatDistanceToNow(nearDate, { includeSeconds: true }));
}
formatDate(newDate())*/

export function renderPostsPageComponent(/*{ appEl }*/) {
  // @TODO: реализовать рендер постов из api
  //console.log("Актуальный список постов:", posts);
  const appEl = document.getElementById("app");

  /**
   * @TODO: чтобы отформатировать дату создания поста в виде "19 минут назад"
   * можно использовать https://date-fns.org/v2.29.3/docs/formatDistanceToNow
   */

  const postsHtml = posts
    .map((post) => {
      return `<li class="post">
                    <div class="post-header" data-user-id="${post.userId}">
                        <img src="${post.userImageUrl}" class="post-header__user-image">
                        <p class="post-header__user-name">${post.userName}</p>
                    </div>
                    <div class="post-image-container">
                      <img class="post-image" src="${post.imageUrl}">
                    </div>
                    <div class="post-likes">
                      <button data-post-id="642d00579b190443860c2f32" class="like-button">
                        <img src="./assets/images/like-active.svg">
                      </button>
                      <p class="post-likes-text">
                        Нравится: <strong>${post.likes}</strong>
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
      console.log(userEl.dataset.userId);
      const userId = userEl.dataset.userId;
      goToPage(USER_POSTS_PAGE, {
        userId,
      });
    });
  }
}
