(function () {
  "use strict";

  const data = window.SITE_DATA;
  if (!data) return;

  const translations = {
    en: {
      "nav.about": "About",
      "nav.news": "News",
      "nav.publications": "Publications",
      "news.kicker": "Updates",
      "news.title": "News",
      "publications.title": "Publications",
      "publications.note": "The highlighted name denotes the homepage owner.",
      "honors.title": "Honors and Awards",
      "education.title": "Education",
      "footer.credit": "Visual style aligned with the iLearn academic homepage family.",
      empty: "No publications match the selected filters.",
      email: "Email",
      github: "GitHub",
      scholar: "Google Scholar",
    },
    zh: {
      "nav.about": "关于我",
      "nav.news": "动态",
      "nav.publications": "论文",
      "news.kicker": "最新动态",
      "news.title": "新闻动态",
      "publications.title": "论文成果",
      "publications.note": "高亮姓名表示主页作者。",
      "honors.title": "荣誉与奖励",
      "education.title": "教育经历",
      "footer.credit": "视觉风格与 iLearn 学术主页系列保持一致。",
      empty: "没有符合当前筛选条件的论文。",
      email: "邮箱",
      github: "GitHub",
      scholar: "Google Scholar",
    },
  };

  let language = "en";
  let activeFilters = new Set();

  const escapeHtml = (value) =>
    String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");

  const refreshIcons = () => {
    if (window.lucide) window.lucide.createIcons({ attrs: { "stroke-width": 1.9 } });
  };

  function renderProfile() {
    const profile = data.profile;
    const displayName = language === "zh" && profile.nameZh ? profile.nameZh : profile.name;
    const fullHeading = language === "zh"
      ? `你好，我是 ${displayName}。`
      : `Hi, I am ${displayName}.`;

    document.documentElement.lang = language === "zh" ? "zh-CN" : "en";
    document.title = `${profile.name} | Academic Homepage`;
    document.querySelector("[data-site-title]").textContent = `${profile.name}'s Homepage`;
    document.querySelector("[data-profile-name]").textContent = displayName;
    document.querySelector("[data-about-heading]").textContent = fullHeading;
    document.querySelector("[data-footer-name]").textContent = profile.name;
    document.querySelector("[data-profile-photo]").alt = `Portrait of ${profile.name}`;

    const role = profile.role?.[language] || "";
    document.querySelector("[data-profile-role]").textContent = role;

    const links = [];
    if (profile.location) {
      links.push(`<li><i data-lucide="map-pin" aria-hidden="true"></i><span>${escapeHtml(profile.location)}</span></li>`);
    }
    if (profile.email) {
      links.push(`<li><a href="mailto:${escapeHtml(profile.email)}"><i data-lucide="mail" aria-hidden="true"></i><span>${translations[language].email}</span></a></li>`);
    }
    if (profile.github) {
      links.push(`<li><a href="https://github.com/${escapeHtml(profile.github)}" target="_blank" rel="noreferrer"><i data-lucide="github" aria-hidden="true"></i><span>${translations[language].github}</span></a></li>`);
    }
    if (profile.scholar) {
      links.push(`<li><a href="${escapeHtml(profile.scholar)}" target="_blank" rel="noreferrer"><i data-lucide="graduation-cap" aria-hidden="true"></i><span>${translations[language].scholar}</span></a></li>`);
    }
    document.querySelector("[data-profile-links]").innerHTML = links.join("");
  }

  function renderTranslations() {
    document.querySelectorAll("[data-i18n]").forEach((element) => {
      const key = element.dataset.i18n;
      if (translations[language][key]) element.textContent = translations[language][key];
    });
    document.querySelector("[data-empty-state]").textContent = translations[language].empty;
  }

  function renderIntro() {
    const paragraphs = data.intro[language] || [];
    document.querySelector("[data-intro-copy]").innerHTML = paragraphs
      .map((paragraph) => `<p>${paragraph}</p>`)
      .join("");
    document.querySelector("[data-research-note]").innerHTML = `<p>${data.intro.note[language]}</p>`;
  }

  function renderNews() {
    const newsList = document.querySelector("[data-news-list]");
    newsList.innerHTML = data.news
      .map((item) => `
        <article class="news-item">
          <time datetime="${escapeHtml(item.date.replaceAll(".", "-"))}">${escapeHtml(item.date)}</time>
          <div>${item[language]}</div>
        </article>
      `)
      .join("");
  }

  function renderAuthors(authors) {
    return authors
      .map((author) => {
        const classes = author.self ? "publication-author publication-author--self" : "publication-author";
        const name = escapeHtml(author.name);
        const content = author.url
          ? `<a class="${classes}" href="${escapeHtml(author.url)}" target="_blank" rel="noreferrer">${name}</a>`
          : `<span class="${classes}">${name}</span>`;
        const marker = author.corresponding
          ? `<span class="author-marker" title="Corresponding author" aria-label="Corresponding author">✉</span>`
          : "";
        return `${content}${marker}`;
      })
      .join(", ");
  }

  function publicationMatches(publication) {
    return [...activeFilters].every((tag) => publication.tags.includes(tag));
  }

  function renderPublications() {
    const list = document.querySelector("[data-publication-list]");
    const visible = data.publications.filter(publicationMatches);

    list.innerHTML = visible
      .map((publication) => {
        const links = publication.links
          .map((link) => link.disabled
            ? `<span class="publication-link publication-link--disabled" aria-disabled="true">${escapeHtml(link.label)}</span>`
            : `<a class="publication-link" href="${escapeHtml(link.url)}" target="_blank" rel="noreferrer">${escapeHtml(link.label)}</a>`)
          .join("");
        const tags = publication.tags
          .map((tag) => `<span class="publication-tag${activeFilters.has(tag) ? " is-active" : ""}">${escapeHtml(tag)}</span>`)
          .join("");

        return `
          <article class="publication-card" id="paper-${escapeHtml(publication.id)}">
            <div class="publication-card__media">
              <span class="publication-badge">${escapeHtml(publication.badge)}</span>
              <img src="${escapeHtml(publication.image)}" alt="${escapeHtml(publication.imageAlt)}">
            </div>
            <div class="publication-card__body">
              <h3>${escapeHtml(publication.title)}</h3>
              <p class="publication-venue">${escapeHtml(publication.venue)}</p>
              <p class="publication-authors">${renderAuthors(publication.authors)}</p>
              <div class="publication-tags">${tags}</div>
              <div class="publication-links">${links}</div>
            </div>
          </article>
        `;
      })
      .join("");

    document.querySelector("[data-empty-state]").hidden = visible.length !== 0;
  }

  function renderFilters() {
    const counts = new Map();
    data.publications.forEach((publication) => {
      publication.tags.forEach((tag) => counts.set(tag, (counts.get(tag) || 0) + 1));
    });

    const preferredOrder = ["First Author", "Project Leader", "Core Contributor", "ACM MM 2026", "CCF A", "Multimodal Understanding"];
    const tags = [...counts.keys()].sort((a, b) => {
      const aIndex = preferredOrder.indexOf(a);
      const bIndex = preferredOrder.indexOf(b);
      if (aIndex === -1 && bIndex === -1) return a.localeCompare(b);
      if (aIndex === -1) return 1;
      if (bIndex === -1) return -1;
      return aIndex - bIndex;
    });

    const container = document.querySelector("[data-filter-list]");
    container.innerHTML = tags
      .map((tag) => `
        <button class="filter-button${activeFilters.has(tag) ? " is-active" : ""}" type="button" data-filter="${escapeHtml(tag)}" aria-pressed="${activeFilters.has(tag)}">
          ${escapeHtml(tag)} (${counts.get(tag)})
        </button>
      `)
      .join("");

    container.querySelectorAll("[data-filter]").forEach((button) => {
      button.addEventListener("click", () => {
        const tag = button.dataset.filter;
        if (activeFilters.has(tag)) activeFilters.delete(tag);
        else activeFilters.add(tag);
        renderFilters();
        renderPublications();
      });
    });
  }

  function renderOptionalSection(key, iconSelector, listSelector) {
    const items = data[key] || [];
    const section = document.querySelector(`[data-optional-section="${key}"]`);
    section.hidden = items.length === 0;
    if (!items.length) return;
    document.querySelector(listSelector).innerHTML = items
      .map((item) => `<li>${item[language] || item.en || ""}</li>`)
      .join("");
  }

  function setLanguage(nextLanguage) {
    language = nextLanguage;
    try { localStorage.setItem("homepage-language", language); } catch (_) {}

    document.querySelectorAll("[data-language]").forEach((button) => {
      const active = button.dataset.language === language;
      button.classList.toggle("is-active", active);
      button.setAttribute("aria-selected", String(active));
      button.tabIndex = active ? 0 : -1;
    });

    renderTranslations();
    renderProfile();
    renderIntro();
    renderNews();
    renderPublications();
    renderOptionalSection("honors", "trophy", "[data-honors-list]");
    renderOptionalSection("education", "book-open", "[data-education-list]");
    refreshIcons();
  }

  document.querySelector("[data-current-year]").textContent = new Date().getFullYear();
  document.querySelectorAll("[data-language]").forEach((button) => {
    button.addEventListener("click", () => setLanguage(button.dataset.language));
  });

  let savedLanguage = "en";
  try { savedLanguage = localStorage.getItem("homepage-language") || "en"; } catch (_) {}
  renderFilters();
  setLanguage(savedLanguage === "zh" ? "zh" : "en");
})();
