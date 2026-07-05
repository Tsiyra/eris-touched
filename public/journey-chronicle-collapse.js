const STORY_CHAPTER_LIST_SELECTOR = "#story-chapter-list";
const STYLE_ID = "journey-chronicle-collapse-style";

let isEnhancingChronicles = false;
let enhanceQueued = false;

function addChronicleCollapseStyles() {
  if (document.getElementById(STYLE_ID)) return;

  const style = document.createElement("style");
  style.id = STYLE_ID;
  style.textContent = `
    .story-chapter-collapsible {
      padding: 0;
      overflow: hidden;
    }

    .story-chapter-collapsible > summary {
      list-style: none;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      padding: 12px;
      cursor: pointer;
      user-select: none;
    }

    .story-chapter-collapsible > summary::-webkit-details-marker {
      display: none;
    }

    .story-chapter-collapsible > summary h3 {
      margin: 0;
      font-size: 1rem;
      color: #3c210c;
    }

    .story-chapter-toggle-icon {
      flex: 0 0 auto;
      color: #6b421a;
      font-weight: 950;
      transition: transform 0.2s ease;
    }

    .story-chapter-collapsible[open] .story-chapter-toggle-icon {
      transform: rotate(90deg);
    }

    .story-chapter-collapsible-body {
      padding: 0 12px 12px;
    }

    .story-chapter-collapsible-body p {
      margin-bottom: 0;
    }
  `;
  document.head.appendChild(style);
}

function makeChronicleCollapsible(article) {
  const details = document.createElement("details");
  details.className = `${article.className} story-chapter-collapsible`.trim();

  const summary = document.createElement("summary");
  const title = article.querySelector("h3")?.cloneNode(true) ?? document.createElement("h3");
  if (!title.textContent.trim()) title.textContent = "Request Chapter";

  const icon = document.createElement("span");
  icon.className = "story-chapter-toggle-icon";
  icon.setAttribute("aria-hidden", "true");
  icon.textContent = "›";

  summary.appendChild(title);
  summary.appendChild(icon);

  const body = document.createElement("div");
  body.className = "story-chapter-collapsible-body";

  for (const child of Array.from(article.children)) {
    if (child.tagName.toLowerCase() !== "h3") {
      body.appendChild(child.cloneNode(true));
    }
  }

  details.appendChild(summary);
  details.appendChild(body);
  article.replaceWith(details);
}

function enhanceChronicles() {
  if (isEnhancingChronicles) return;

  const list = document.querySelector(STORY_CHAPTER_LIST_SELECTOR);
  if (!list || list.classList.contains("empty")) return;

  const articles = Array.from(list.querySelectorAll("article.story-chapter"));
  if (!articles.length) return;

  isEnhancingChronicles = true;
  addChronicleCollapseStyles();
  articles.forEach(makeChronicleCollapsible);
  isEnhancingChronicles = false;
}

function queueEnhanceChronicles() {
  if (enhanceQueued) return;

  enhanceQueued = true;
  requestAnimationFrame(() => {
    enhanceQueued = false;
    enhanceChronicles();
  });
}

function watchChronicles() {
  const list = document.querySelector(STORY_CHAPTER_LIST_SELECTOR);
  if (!list) return;

  new MutationObserver(queueEnhanceChronicles).observe(list, { childList: true });
  queueEnhanceChronicles();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", watchChronicles, { once: true });
} else {
  watchChronicles();
}
