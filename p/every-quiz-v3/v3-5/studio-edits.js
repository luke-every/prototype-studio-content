(function (edits) {
  var rules = edits.filter(function (e) { return e.kind === "style"; }).map(function (e) {
    return e.selector + "{" + Object.keys(e.css).map(function (p) { return p + ":" + e.css[p] + " !important"; }).join(";") + "}";
  }).join("\n");
  var style = document.createElement("style");
  style.textContent = rules;
  document.head.appendChild(style);

  function read(el) {
    var out = "";
    el.childNodes.forEach(function (n) { out += n.nodeName === "BR" ? "\n" : n.textContent; });
    return out;
  }
  function write(el, text) {
    el.replaceChildren.apply(el, text.split("\n").flatMap(function (line, i) {
      return i ? [document.createElement("br"), document.createTextNode(line)] : [document.createTextNode(line)];
    }));
  }
  function apply() {
    edits.forEach(function (e) {
      var el = document.querySelector(e.selector);
      if (!el) return;
      if (e.kind === "text" && read(el) !== e.text) write(el, e.text);
      if (e.kind === "image") {
        if (el.tagName === "IMG") {
          if (el.getAttribute("src") !== e.src) { el.removeAttribute("srcset"); el.setAttribute("src", e.src); }
        } else {
          el.style.setProperty("background-image", 'url("' + e.src + '")', "important");
        }
      }
    });
  }
  var queued = 0;
  function soon() { if (!queued) queued = requestAnimationFrame(function () { queued = 0; apply(); }); }
  apply();
  document.addEventListener("DOMContentLoaded", apply);
  new MutationObserver(soon).observe(document.documentElement, { childList: true, subtree: true });
})([{"kind":"text","selector":"body > div:nth-of-type(2) > div:nth-of-type(4) > div:nth-of-type(1) > div:nth-of-type(2) > div > div > div > h1","text":"Let's start with a few questions."}]);
