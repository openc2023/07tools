/* 07 Tools — 沿用 STUDIO 7 desk 的控制台界面与开场动画（背景字符场、乱码解码、boot 复制自 web-media/personal/desk/app.js） */
(function () {
  "use strict";

  var TOOLS = window.TOOLS, UI = window.TOOLS_UI;
  function detectLanguage() {
    try { var saved = localStorage.getItem("desk-lang"); if (UI[saved]) return saved; } catch (e) {}
    var preferred = navigator.languages && navigator.languages.length ? navigator.languages : [navigator.language || ""];
    for (var i = 0; i < preferred.length; i++) { var code = String(preferred[i]).toLowerCase().split(/[-_]/)[0]; if (UI[code]) return code; }
    return "en";
  }
  var lang = detectLanguage(), T = UI[lang];

  var root = document.documentElement;
  var $ = function (id) { return document.getElementById(id); };
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function pad(n) { return (n < 10 ? "0" : "") + n; }
  var stageScroll = $("stageScroll"), active = "top";
  var ORDER = TOOLS.map(function (t) { return t.slug; }).concat(["readme"]);

  /* theme */
  function setTheme(t) { root.dataset.theme = t; $("statusTheme").textContent = "theme: " + t; try { localStorage.setItem("07tools-theme", t); } catch (e) {} }
  try { var savedTheme = localStorage.getItem("07tools-theme"); if (savedTheme === "dark" || savedTheme === "light") root.dataset.theme = savedTheme; } catch (e) {}
  $("statusTheme").textContent = "theme: " + root.dataset.theme;
  $("themeBtn").addEventListener("click", function () { setTheme(root.dataset.theme === "dark" ? "light" : "dark"); });
  $("statusTheme").addEventListener("click", function () { setTheme(root.dataset.theme === "dark" ? "light" : "dark"); });

  function readColors() {
    var cs = getComputedStyle(root), v = function (n) { return cs.getPropertyValue(n).trim(); };
    return { g1: v("--g1"), g2: v("--g2"), hot: v("--hot"), dot: v("--accent"), char: v("--ink-2") };
  }
  var colors = readColors();
  new MutationObserver(function () { colors = readColors(); }).observe(root, { attributes: true, attributeFilter: ["data-theme"] });

  function hash(x, y) { var h = Math.sin(x * 127.1 + y * 311.7) * 43758.5453; return h - Math.floor(h); }
  function smooth(t) { return t <= 0 ? 0 : t >= 1 ? 1 : t * t * (3 - 2 * t); }
  function noise(x, y) {
    var ix = Math.floor(x), iy = Math.floor(y), fx = smooth(x - ix), fy = smooth(y - iy);
    var a = hash(ix, iy), b = hash(ix + 1, iy), c = hash(ix, iy + 1), d = hash(ix + 1, iy + 1);
    return a + (b - a) * fx + (c - a) * fy + (a - b - c + d) * fx * fy;
  }

  function mountBg(canvas, opts) {
    var RAMP = ".·:-=+*xo%#@", BRAND = "07S", GLITCH = "07S#%/\\<>=+*";
    var ctx = canvas.getContext("2d"), W = 0, H = 0, dpr = 1, cell = 16, fs = 11;
    var pointer = { x: -999, y: -999, on: false }, light = 0, lastY = 0, vel = 0, last = 0;
    var touch = matchMedia("(hover: none)").matches;
    function resize() {
      W = window.innerWidth; H = window.innerHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      cell = W < 640 ? 18 : 16; fs = W < 640 ? 10 : 11;
      canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", function (e) { if (e.pointerType !== "touch") { pointer.x = e.clientX; pointer.y = e.clientY; pointer.on = true; } }, { passive: true });
    document.addEventListener("pointerleave", function () { pointer.on = false; });
    function frame(now) {
      requestAnimationFrame(frame);
      if (now - last < 32) return; last = now;
      if (canvas.style.opacity === "0") return;
      var t = now / 1000, sy = opts.getScrollY();
      vel += ((sy - lastY) - vel) * 0.25; lastY = sy;
      var speed = Math.min(1, Math.abs(vel) / 45);
      light += ((pointer.on && !touch ? 1 : 0) - light) * 0.08;
      var C = opts.getColors();
      ctx.clearRect(0, 0, W, H);
      var par = sy * 0.5, rowShift = Math.floor(par / cell), off = par - rowShift * cell;
      var cols = Math.ceil(W / cell) + 1, rows = Math.ceil(H / cell) + 2, R = 190, dots = [], chars = [];
      for (var r = 0; r < rows; r++) {
        var gy = r + rowShift, py = r * cell - off;
        for (var c = 0; c < cols; c++) {
          var px = c * cell, n = noise(c * 0.07 + t * 0.04, gy * 0.07 - t * 0.03), v = (n - 0.56) * 2.6;
          if (speed > 0.02) v += speed * 0.55 * hash(c, gy + Math.floor(t * 8));
          var f = 0;
          if (light > 0.01) { var d = Math.hypot(px + cell / 2 - pointer.x, py + cell / 2 - pointer.y); f = smooth(1 - d / R) * light; v += f * (0.55 + 0.45 * hash(c * 3.1, gy * 1.7)); }
          if (v < 0.06) continue;
          if (f > 0.12) chars.push(px, py, Math.min(1, v), f);
          else if (v > 0.42) chars.push(px, py, Math.min(1, v), 0.3 + (v - 0.42) * 0.4);
          else dots.push(px + cell / 2 - 1, py + cell / 2 - 1, Math.min(1, v));
        }
      }
      ctx.fillStyle = C.dot;
      for (var i = 0; i < dots.length; i += 3) { ctx.globalAlpha = 0.18 + dots[i + 2] * 0.5; ctx.fillRect(dots[i], dots[i + 1], 2, 2); }
      ctx.font = "400 " + fs + 'px "IBM Plex Mono", ui-monospace, monospace'; ctx.textBaseline = "top";
      var lastIdx = RAMP.length - 1, slot = Math.floor(t * 1.5), marks = [];
      ctx.fillStyle = C.char;
      for (var j = 0; j < chars.length; j += 4) {
        var cx = chars[j], cy = chars[j + 1], k = hash(cx * 0.119 + slot * 3.7, (cy + par) * 0.143);
        if (k > 0.74) { marks.push(cx, cy, chars[j + 3], BRAND.charAt(Math.floor(k * 1000) % 3)); continue; }
        ctx.globalAlpha = Math.min(0.55, chars[j + 3] * 0.7);
        ctx.fillText(RAMP.charAt(Math.floor(chars[j + 2] * lastIdx)), cx + cell * 0.2, cy + cell * 0.12);
      }
      ctx.fillStyle = C.dot;
      for (var q = 0; q < marks.length; q += 4) { ctx.globalAlpha = Math.min(0.8, marks[q + 2] * 1.05); ctx.fillText(marks[q + 3], marks[q] + cell * 0.2, marks[q + 1] + cell * 0.12); }
      for (var wr = 0; wr < rows; wr++) {
        var wy = wr + rowShift;
        for (var wc = 0; wc + 2 < cols; wc += 3) {
          var seed = hash(wc * 0.31, wy * 0.57), life = t / 5 + seed * 9, gen = Math.floor(life);
          if (hash(wc * 1.7 + gen * 5.3, wy * 2.9) < 0.986) continue;
          var ph = life - gen, a = Math.sin(ph * Math.PI), wx = wc * cell, wpy = wr * cell - off;
          ctx.globalAlpha = Math.min(0.85, a * 0.5);
          for (var w = 0; w < 3; w++) {
            var settled = ph > 0.18 + w * 0.06;
            var chw = settled ? BRAND.charAt(w) : GLITCH.charAt(Math.floor(hash(wc + w, wy + Math.floor(t * 12)) * GLITCH.length));
            ctx.fillText(chw, wx + w * cell + cell * 0.2, wpy + cell * 0.12);
          }
        }
      }
      ctx.globalAlpha = 1;
    }
    requestAnimationFrame(frame);
    return { setOpacity: function (o) { canvas.style.opacity = o <= 0.01 ? "0" : String(o); } };
  }
  /* ---------- scramble / clock ---------- */
  /* 逐字由乱码收敛到原文：原字透明占位，乱码用 ::after 叠在上面，版面不跳 */
  var scrambling = new WeakMap();
  function scramble(el, opts) {
    if (!el) return;
    opts = opts || {};
    var prev = scrambling.get(el);
    if (prev) { cancelAnimationFrame(prev.raf); el.textContent = prev.text; }
    var text = el.textContent;
    if (!text.trim()) return;
    var dur = opts.duration || 700, set = opts.digits ? "0123456789" : "!<>-_\/[]{}=+*^?#%01░▒▓";
    var pick = function () { return set.charAt(Math.floor(Math.random() * set.length)); };
    var chars = Array.from(text);
    el.textContent = "";
    var spans = chars.map(function (ch, i) {
      var sp = document.createElement("span");
      sp.textContent = ch;
      if (ch.trim()) { sp.className = "sc on"; sp.dataset.c = pick(); sp._at = (i / chars.length) * dur * 0.6 + Math.random() * dur * 0.4; }
      el.appendChild(sp);
      return sp;
    });
    var start = performance.now() + (opts.delay || 0), last = 0, job = { text: text, raf: 0 };
    scrambling.set(el, job);
    (function step(now) {
      var t = now - start, swap = now - last > 45, left = 0;
      if (swap) last = now;
      for (var i = 0; i < spans.length; i++) {
        var sp = spans[i];
        if (!sp._at) continue;
        if (t >= sp._at) { sp.className = ""; sp._at = 0; continue; }
        left++;
        if (swap && t > -200) sp.dataset.c = pick();
      }
      if (left) job.raf = requestAnimationFrame(step);
      else { el.textContent = text; scrambling.delete(el); }
    })(performance.now());
  }
  var fmt = new Intl.DateTimeFormat("en-GB", { timeZone: "Asia/Seoul", hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false });
  function tick() { $("statusClock").textContent = fmt.format(new Date()) + " KST"; }
  tick(); setInterval(tick, 1000);

  /* ---------- render ---------- */
  function toolPanel(t, i) {
    var feats = (t.features[lang] || t.features.en).map(function (f, k) { return '<li><span class="ln" aria-hidden="true">' + pad(k + 1) + '</span><span>' + esc(f) + '</span></li>'; }).join("");
    return '<section class="panel" id="s-' + esc(t.slug) + '"><div class="panel-title"><span class="pdots"><i></i><i></i><i></i></span><span class="pt">~/tools/' + esc(t.slug) + '/index.html</span></div>' +
      '<div class="panel-body"><h2 class="pane-h"><span class="n">' + pad(i + 1) + '</span><span class="t">' + esc(t.name) + '</span><span class="rule" aria-hidden="true"></span></h2>' +
      '<div class="tool"><div>' +
        '<p class="tool-desc">' + esc(t.desc[lang] || t.desc.en) + '</p>' +
        '<p class="tool-meta"><span><b>' + esc(t.ver) + '</b></span><span>' + esc(T.updated) + ' <b>' + esc(t.updated) + '</b></span><span>single-file · offline</span></p>' +
        '<ul class="tool-tags">' + t.tags.map(function (g) { return '<li>[ ' + esc(g) + ' ]</li>'; }).join("") + '</ul>' +
        '<div class="tool-actions"><a class="btn primary" href="' + esc(t.slug) + '/">' + esc(T.open) + ' <span class="arrow">→</span></a>' +
        '<a class="btn" href="' + esc(t.slug) + '/index.html" download="' + esc(t.slug) + '.html">' + esc(T.download) + '</a></div>' +
      '</div><ol class="feat">' + feats + '</ol></div></div></section>';
  }
  function readmePanel() {
    var items = T.readme.map(function (p, k) { return '<li><span class="ln" aria-hidden="true">' + pad(k + 1) + '</span><span>' + esc(p) + '</span></li>'; }).join("");
    items += '<li><span class="ln" aria-hidden="true">' + pad(T.readme.length + 1) + '</span><span><a href="https://openc2023.github.io/web-media/">' + esc(T.home) + ' ↗</a></span></li>';
    return '<section class="panel" id="s-readme"><div class="panel-title"><span class="pdots"><i></i><i></i><i></i></span><span class="pt">~/tools/README.md</span></div>' +
      '<div class="panel-body"><h2 class="pane-h"><span class="n">' + pad(TOOLS.length + 1) + '</span><span class="t">' + esc(T.readmeTitle) + '</span><span class="rule" aria-hidden="true"></span></h2><ol class="readme">' + items + '</ol></div></section>';
  }
  function render() {
    root.lang = T.htmlLang;
    $("alias").textContent = T.alias;
    $("lead").textContent = T.lead;
    $("hint").textContent = T.hint;
    $("stats").innerHTML = '<div><dt>' + pad(TOOLS.length) + '</dt><dd>' + esc(T.statTools) + '</dd></div><div><dt>100%</dt><dd>' + esc(T.statOffline) + '</dd></div><div><dt>0</dt><dd>' + esc(T.statUpload) + '</dd></div>';
    $("sections").innerHTML = TOOLS.map(toolPanel).join("") + readmePanel();
    $("statusCount").textContent = "tools: " + TOOLS.length;
    $("homeBtn").title = T.home;
    document.querySelectorAll("#languageSwitch [data-lang]").forEach(function (b) { b.setAttribute("aria-pressed", String(b.dataset.lang === lang)); });
    var skip = $("spSkip");
    if (skip) { skip.textContent = T.skip; skip.setAttribute("aria-label", T.skipLabel); $("boot").setAttribute("aria-label", "07 Tools " + T.boot); }
  }
  function setLanguage(next) {
    if (!UI[next] || next === lang) return;
    lang = next; T = UI[lang];
    try { localStorage.setItem("desk-lang", lang); } catch (e) {}
    render(); updateNav(); onScroll();
  }
  $("languageSwitch").addEventListener("click", function (e) { var b = e.target.closest("[data-lang]"); if (b) setLanguage(b.dataset.lang); });

  /* ---------- navigation ---------- */
  function fileName(id) { return id === "top" ? "terminal.sh" : id === "readme" ? "README.md" : id + ".html"; }
  $("tabs").innerHTML = ["top"].concat(ORDER).map(function (k) { return '<div class="tab" data-file="' + k + '">' + (k === "top" ? '<span class="dot"></span>' : "") + fileName(k) + '</div>'; }).join("");
  $("tree").innerHTML = '<div class="tree-row" data-file="top"><span class="ico">▸</span><span>~/tools</span></div>' +
    ORDER.map(function (k) { return '<div class="tree-row sub" data-file="' + k + '"><span class="ico">·</span><span>' + fileName(k) + '</span></div>'; }).join("");
  document.querySelectorAll(".tab, .tree-row").forEach(function (el) { el.addEventListener("click", function () { navigate(el.dataset.file); }); });

  var lastNav = null;
  function updateNav() {
    document.querySelectorAll(".tab").forEach(function (tab) {
      var on = tab.dataset.file === active;
      tab.classList.toggle("active", on);
      if (on) tab.setAttribute("aria-current", "page"); else tab.removeAttribute("aria-current");
    });
    document.querySelectorAll(".tree-row").forEach(function (row) { row.classList.toggle("active", row.dataset.file === active); });
    if (lastNav !== active) {
      lastNav = active;
      var strip = $("tabs"), tab = strip.querySelector(".tab.active");
      if (tab) {
        var outer = strip.getBoundingClientRect(), inner = tab.getBoundingClientRect();
        if (inner.left < outer.left + 12 || inner.right > outer.right - 12) strip.scrollTo({ left: strip.scrollLeft + inner.left - outer.left - (outer.width - inner.width) / 2, behavior: "smooth" });
      }
    }
  }
  function navigate(id) {
    active = id; updateNav();
    if (id === "top") stageScroll.scrollTo({ top: 0, behavior: "smooth" });
    else { var el = $("s-" + id); if (el) el.scrollIntoView({ behavior: "smooth", block: "start" }); }
  }
  function syncScrollSection() {
    var bounds = stageScroll.getBoundingClientRect(), probe = bounds.top + Math.min(160, bounds.height * 0.28), next = "top";
    document.querySelectorAll(".panel").forEach(function (p) { if (p.getBoundingClientRect().top <= probe) next = p.id.replace("s-", ""); });
    if (stageScroll.scrollTop > 0 && stageScroll.scrollTop + stageScroll.clientHeight >= stageScroll.scrollHeight - 2) next = ORDER[ORDER.length - 1];
    if (next !== active) { active = next; updateNav(); }
  }

  /* ---------- scroll ---------- */
  var bg = mountBg($("bgField"), { getColors: function () { return colors; }, getScrollY: function () { return stageScroll.scrollTop; } });
  bg.setOpacity(1);
  function onScroll() {
    var y = stageScroll.scrollTop, max = stageScroll.scrollHeight - stageScroll.clientHeight;
    $("statusPct").textContent = Math.round((max > 0 ? Math.min(1, y / max) : 0) * 100) + "%";
    syncScrollSection();
  }
  var ticking = false;
  stageScroll.addEventListener("scroll", function () { if (!ticking) { ticking = true; requestAnimationFrame(function () { ticking = false; onScroll(); }); } }, { passive: true });
  window.addEventListener("resize", function () { lastNav = null; updateNav(); onScroll(); });

  /* ---------- command line ---------- */
  function print(outEl, cmd, msg) {
    var p = document.createElement("p");
    p.innerHTML = '<span class="ps1">$</span> ' + esc(cmd) + (msg ? '<br><span class="res">' + esc(msg) + '</span>' : "");
    outEl.appendChild(p);
    while (outEl.children.length > 4) outEl.removeChild(outEl.firstChild);
    outEl.scrollTop = outEl.scrollHeight;
  }
  function findTool(q) {
    q = q.replace(/^~\/tools\//, "").replace(/\/(index\.html)?$/, "").replace(/\.html$/, "");
    for (var i = 0; i < TOOLS.length; i++) if (TOOLS[i].slug === q || TOOLS[i].name.toLowerCase() === q) return TOOLS[i];
    return null;
  }
  function exec(raw, outEl) {
    var cmd = raw.trim().toLowerCase();
    if (!cmd) return;
    if (cmd === "help" || cmd === "?") return print(outEl, raw, T.help);
    if (UI[cmd]) { setLanguage(cmd); return print(outEl, raw, T.lang + " → " + lang); }
    if (cmd === "clear") { outEl.innerHTML = ""; return; }
    if (cmd === "light" || cmd === "dark") { setTheme(cmd); return print(outEl, raw, "theme → " + cmd); }
    if (cmd === "ls" || cmd === "ls ~/tools") return print(outEl, raw, TOOLS.map(function (t) { return t.slug + "/"; }).join("  ") + "  README.md");
    if (cmd === "home" || cmd === "cd ~/desk" || cmd === "cd .." || cmd === "whoami") { print(outEl, raw, "→ ~/desk"); location.href = "https://openc2023.github.io/web-media/"; return; }
    if (cmd === "readme" || cmd === "cat readme.md") { navigate("readme"); return print(outEl, raw); }
    var m = cmd.match(/^(open|run|cd|cat)\s+(.+)$/);
    if (m) {
      var tool = findTool(m[2]);
      if (!tool) return print(outEl, raw, T.unknown + m[2]);
      if (m[1] === "cd" || m[1] === "cat") { navigate(tool.slug); return print(outEl, raw); }
      print(outEl, raw, T.opened + tool.name); location.href = tool.slug + "/"; return;
    }
    var direct = findTool(cmd);
    if (direct) { navigate(direct.slug); return print(outEl, raw); }
    if (/^[1-9]$/.test(cmd) && ORDER[+cmd - 1]) { navigate(ORDER[+cmd - 1]); return print(outEl, raw); }
    print(outEl, raw, T.unknown + raw);
  }
  $("termForm").addEventListener("submit", function (e) { e.preventDefault(); exec($("termIn").value, $("termOut")); $("termIn").value = ""; });

  document.addEventListener("keydown", function (e) {
    if (e.metaKey || e.ctrlKey || e.altKey || $("boot")) return;
    var typing = /^(INPUT|TEXTAREA)$/.test(document.activeElement.tagName);
    if (typing) { if (e.key === "Escape") document.activeElement.blur(); return; }
    if (/^[1-9]$/.test(e.key) && ORDER[+e.key - 1]) { navigate(ORDER[+e.key - 1]); e.preventDefault(); }
    else if (e.key === "/" || e.key === ":") { $("termIn").focus(); e.preventDefault(); }
  });

  /* ---------- boot splash（与主页同款，完整播放约 4 秒，不因“减少动画”设置缩短） ---------- */
  function intro() {
    scramble($("nameMain"), { duration: 900, delay: 700 });
    document.querySelectorAll("#stats dt").forEach(function (dt, i) { scramble(dt, { digits: true, duration: 900, delay: 1300 + i * 90 }); });
  }
  (function boot() {
    var el = $("boot"), status = $("spStatus"), bar = $("spBar"), count = $("spCount"), log = $("spLog"), title = $("spTitle");
    var done = false, raf = 0, start = performance.now(), lastPhase = -1;
    root.classList.add("booting");
    var names = esc(TOOLS.slice(0, 2).map(function (t) { return t.slug; }).join(" · "));
    var phases = [
      { at: 0, name: "access", label: "REQUESTING ACCESS", title: "07 TOOLS", lines: ["<span>00</span><b>$</b> connect ~/tools", "<span>01</span>initializing toolbox..."] },
      { at: 1050, name: "identity", label: "ID CONFIRMED : STUDIO 7", title: "IDENTITY VERIFIED", lines: ["<span>00</span><b>[ok]</b> signature / studio7", "<span>01</span><b>[ok]</b> runtime / local browser", "<span>02</span>request received_"] },
      { at: 2150, name: "scan", label: "LOADING TOOLS...", title: "MOUNTING TOOLS", lines: ["<span>00</span><b>[ok]</b> " + names + " / ready", "<span>01</span><b>[ok]</b> uploads / disabled", "<span>02</span>opening toolbox terminal_"] },
      { at: 3400, name: "ready", label: "PERMISSION AUTHORIZED", title: "WELCOME TO 07 TOOLS", lines: ["<span>00</span><b>[ok]</b> " + pad(TOOLS.length) + " tools / mounted", "<span>01</span><b>[ok]</b> offline mode / on", "<span>02</span><b>$</b> ls ~/tools"] }
    ];
    var stops = [[0, 0], [300, 4], [1050, 24], [2150, 53], [3400, 94], [4000, 100]];
    function finish() {
      if (done) return;
      done = true; cancelAnimationFrame(raf);
      window.removeEventListener("keydown", skipKey);
      el.classList.add("out"); root.classList.remove("booting"); intro();
      setTimeout(function () { el.remove(); }, 560);
    }
    function skipKey(e) { if (e.key === "Escape" || e.key === "Enter" || e.key === " ") { e.preventDefault(); finish(); } }
    $("spSkip").addEventListener("click", finish);
    window.addEventListener("keydown", skipKey);
    function frame(now) {
      if (done) return;
      var t = now - start, phase = 0;
      for (var i = 1; i < phases.length; i++) if (t >= phases[i].at) phase = i;
      var current = phases[phase];
      if (phase !== lastPhase) {
        lastPhase = phase; el.dataset.phase = current.name;
        title.textContent = current.title;
        log.innerHTML = current.lines.map(function (line) { return "<p>" + line + "</p>"; }).join("");
        el.querySelectorAll(".boot-rail span").forEach(function (node, index) { node.classList.toggle("active", index <= phase); });
      }
      status.textContent = current.label.slice(0, Math.min(current.label.length, Math.floor((t - current.at) / 20)));
      var pct = 100;
      for (var j = 1; j < stops.length; j++) if (t < stops[j][0]) { var a = stops[j - 1], b = stops[j]; pct = a[1] + (b[1] - a[1]) * (t - a[0]) / (b[0] - a[0]); break; }
      bar.style.width = pct + "%"; count.textContent = String(Math.floor(pct)).padStart(3, "0");
      if (t >= 4350) finish(); else raf = requestAnimationFrame(frame);
    }
    raf = requestAnimationFrame(frame);
  })();

  render();
  updateNav();
  onScroll();
})();
