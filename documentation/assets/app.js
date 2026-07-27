/* Blueprint Harness docs — client-side app (no build step required). */

(function () {
  "use strict";

  mermaid.initialize({
    startOnLoad: false,
    theme: "dark",
    themeVariables: {
      darkMode: true,
      background: "#101114",
      primaryColor: "#151619",
      primaryTextColor: "#e9e9ea",
      primaryBorderColor: "#3fe0b6",
      lineColor: "#6c6c74",
      secondaryColor: "#151619",
      tertiaryColor: "#101114",
      fontFamily: "Inter, sans-serif",
    },
    flowchart: { curve: "basis" },
  });

  marked.setOptions({ gfm: true, breaks: false, headerIds: false, mangle: false });

  var NAV = window.HARNESS_NAV;
  var PAGES = window.HARNESS_PAGES;

  var FLAT_ORDER = [];
  NAV.forEach(function (group) {
    group.items.forEach(function (item) {
      FLAT_ORDER.push(item);
    });
  });

  var sidebarNavEl = document.getElementById("sidebarNav");
  var pageEl = document.getElementById("page");
  var breadcrumbEl = document.getElementById("breadcrumb");
  var tocEl = document.getElementById("toc");
  var pagerEl = document.getElementById("pagerNav");
  var searchInput = document.getElementById("searchInput");

  function renderSidebar(filter) {
    var q = (filter || "").trim().toLowerCase();
    var html = "";
    NAV.forEach(function (group) {
      var visibleItems = group.items.filter(function (item) {
        if (!q) return true;
        return (
          item.title.toLowerCase().indexOf(q) !== -1 ||
          (PAGES[item.id] || "").toLowerCase().indexOf(q) !== -1
        );
      });
      if (!visibleItems.length) return;
      html += '<div class="nav-group"><div class="nav-group-title">' + escapeHtml(group.title) + "</div>";
      visibleItems.forEach(function (item) {
        html +=
          '<a class="nav-item" data-id="' +
          item.id +
          '" href="#/' +
          item.id +
          '"><span class="dot"></span>' +
          escapeHtml(item.title) +
          "</a>";
      });
      html += "</div>";
    });
    sidebarNavEl.innerHTML = html || '<div class="nav-group-title">Brak wyników</div>';
  }

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  function findItem(id) {
    for (var i = 0; i < FLAT_ORDER.length; i++) {
      if (FLAT_ORDER[i].id === id) return FLAT_ORDER[i];
    }
    return null;
  }

  function groupOf(id) {
    for (var g = 0; g < NAV.length; g++) {
      for (var i = 0; i < NAV[g].items.length; i++) {
        if (NAV[g].items[i].id === id) return NAV[g];
      }
    }
    return null;
  }

  var mermaidCounter = 0;

  function renderMarkdown(md) {
    var renderer = new marked.Renderer();
    renderer.code = function (codeOrToken, infostring) {
      var code, lang;
      if (typeof codeOrToken === "object" && codeOrToken !== null) {
        code = codeOrToken.text != null ? codeOrToken.text : "";
        lang = (codeOrToken.lang || "").trim();
      } else {
        code = codeOrToken;
        lang = (infostring || "").trim();
      }
      lang = lang.split(/\s+/)[0] || "";
      if (lang === "mermaid") {
        mermaidCounter++;
        var id = "mmd-" + mermaidCounter;
        return (
          '<div class="mermaid-wrap"><div class="mermaid" id="' +
          id +
          '">' +
          code.replace(/</g, "&lt;") +
          "</div></div>"
        );
      }
      var escaped = escapeHtml(code);
      return (
        '<div class="code-block"><div class="code-lang">' +
        (lang || "text") +
        '</div><button class="copy-btn" type="button">Kopiuj</button><pre><code>' +
        escaped +
        "</code></pre></div>"
      );
    };
    renderer.link = function (hrefOrToken, title, text) {
      var href;
      if (typeof hrefOrToken === "object" && hrefOrToken !== null) {
        href = hrefOrToken.href || "";
        text = hrefOrToken.text || href;
      } else {
        href = hrefOrToken || "";
      }
      var external = /^https?:\/\//.test(href);
      return (
        '<a class="md-link" href="' +
        href +
        '"' +
        (external ? ' target="_blank" rel="noopener"' : "") +
        ">" +
        text +
        "</a>"
      );
    };
    return marked.parse(md, { renderer: renderer });
  }

  function buildToc() {
    var headings = pageEl.querySelectorAll("h2, h3");
    if (!headings.length) {
      tocEl.innerHTML = "";
      return;
    }
    var html = '<div class="toc-title">Na tej stronie</div>';
    headings.forEach(function (h, i) {
      var id = "sec-" + i;
      h.id = id;
      var indent = h.tagName === "H3" ? ' style="padding-left:24px;font-size:12px;"' : "";
      html += '<a href="#' + id + '" data-target="' + id + '"' + indent + ">" + h.textContent + "</a>";
    });
    tocEl.innerHTML = html;

    var links = tocEl.querySelectorAll("a");
    function onScroll() {
      var pos = window.scrollY + 100;
      var current = null;
      headings.forEach(function (h) {
        if (h.offsetTop <= pos) current = h.id;
      });
      links.forEach(function (l) {
        l.classList.toggle("active", l.getAttribute("data-target") === current);
      });
    }
    window.removeEventListener("scroll", window.__docScrollHandler || function () {});
    window.__docScrollHandler = onScroll;
    window.addEventListener("scroll", onScroll);
    onScroll();
  }

  function buildBreadcrumb(item, group) {
    breadcrumbEl.innerHTML =
      '<span>Dokumentacja</span><span class="sep">/</span><span>' +
      escapeHtml(group ? group.title : "") +
      '</span><span class="sep">/</span><span class="current">' +
      escapeHtml(item.title) +
      "</span>";
  }

  function buildPager(id) {
    var idx = -1;
    for (var i = 0; i < FLAT_ORDER.length; i++) {
      if (FLAT_ORDER[i].id === id) idx = i;
    }
    var prev = idx > 0 ? FLAT_ORDER[idx - 1] : null;
    var next = idx >= 0 && idx < FLAT_ORDER.length - 1 ? FLAT_ORDER[idx + 1] : null;
    var html = "";
    if (prev) {
      html +=
        '<a class="pager-link prev" href="#/' +
        prev.id +
        '"><span class="pager-dir">← Poprzednia</span>' +
        escapeHtml(prev.title) +
        "</a>";
    } else {
      html += "<div></div>";
    }
    if (next) {
      html +=
        '<a class="pager-link next" href="#/' +
        next.id +
        '"><span class="pager-dir">Następna →</span>' +
        escapeHtml(next.title) +
        "</a>";
    }
    pagerEl.innerHTML = html;
  }

  function attachCopyButtons() {
    pageEl.querySelectorAll(".copy-btn").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var codeEl = btn.parentElement.querySelector("code");
        navigator.clipboard.writeText(codeEl.textContent).then(function () {
          var original = btn.textContent;
          btn.textContent = "Skopiowano ✓";
          setTimeout(function () {
            btn.textContent = original;
          }, 1400);
        });
      });
    });
  }

  function highlightActiveNav(id) {
    sidebarNavEl.querySelectorAll(".nav-item").forEach(function (el) {
      el.classList.toggle("active", el.getAttribute("data-id") === id);
    });
  }

  function render(id) {
    var item = findItem(id);
    if (!item) {
      id = FLAT_ORDER[0].id;
      item = FLAT_ORDER[0];
    }
    var md = PAGES[id] || "# Brak treści\n\nTa strona nie została jeszcze uzupełniona.";
    pageEl.innerHTML = renderMarkdown(md);

    try {
      mermaid.run({ querySelector: "#page .mermaid" });
    } catch (e) {
      /* mermaid syntax issues should not break the page */
      console.warn("mermaid render issue", e);
    }

    attachCopyButtons();
    buildToc();
    buildBreadcrumb(item, groupOf(id));
    buildPager(id);
    highlightActiveNav(id);
    document.title = item.title + " · Blueprint Harness Docs";
    window.scrollTo(0, 0);

    document.getElementById("sidebar").classList.remove("open");
    document.getElementById("sidebarScrim").classList.remove("show");
  }

  function currentHashId() {
    var h = window.location.hash || "";
    var m = h.match(/^#\/(.+)$/);
    return m ? m[1] : FLAT_ORDER[0].id;
  }

  window.addEventListener("hashchange", function () {
    render(currentHashId());
  });

  searchInput.addEventListener("input", function () {
    renderSidebar(searchInput.value);
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "/" && document.activeElement !== searchInput) {
      e.preventDefault();
      searchInput.focus();
    }
  });

  document.getElementById("navToggle").addEventListener("click", function () {
    document.getElementById("sidebar").classList.add("open");
    document.getElementById("sidebarScrim").classList.add("show");
  });
  document.getElementById("sidebarScrim").addEventListener("click", function () {
    document.getElementById("sidebar").classList.remove("open");
    document.getElementById("sidebarScrim").classList.remove("show");
  });

  renderSidebar("");
  render(currentHashId());
})();
