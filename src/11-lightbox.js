/* lightbox */
!function () {
  "use strict";
  const e = document.querySelector(".popup-overlay");
  if (!e) return;
  const t = e.querySelector(".close-svg"),
    i = e.querySelector(".product--gallery-wrapper"),
    r = e.querySelector(".gallery-image-1"),
    o = e.querySelector(".gallery-image-2"),
    n = e.querySelector(".popup--content-right .small-text"),
    s = e.querySelector(".gallery-slide"),
    a = e.querySelectorAll(".slide-line"),
    u = e.querySelector(".popup-caret.left"),
    l = e.querySelector(".popup-caret.right"),
    c = e.querySelector(".lightbox-content"),
    p = e.querySelector(".news--lightbox-content"),
    d = e.querySelector(".news--lightbox-content .heading-small"),
    m = e.querySelector(".news--content-left .small-text"),
    y = e.querySelector(".news--info-image"),
    f = e.querySelector(".news--info-wrapper"),
    g = f?.querySelector(".small-text"),
    pI = (function () { var el = e.querySelector('[data-popup="ingredient-image"]'); if (el) el.removeAttribute('loading'); return el; })(),
    pN = e.querySelector('[data-popup="perfume-name"]'),
    pF = e.querySelector('[data-popup="fragrance-type"]'),
    pT = e.querySelector('[data-popup="top-note"]'),
    pM = e.querySelector('[data-popup="middle-note"]'),
    pL = e.querySelector('[data-popup="last-note"]'),
    pD = e.querySelector('[data-popup="full-description"]'),
    pK = e.querySelector('[data-popup="sku"]'),
    pZ = e.querySelector('[data-popup="size"]'),
    x = document.querySelectorAll(".product-wrapper"),
    v = document.querySelectorAll(".news-row"),
    h = "cubic-bezier(0.33,0,0.67,1)",
    w = "cubic-bezier(0.25,0.1,0.25,1)",
    T = "cubic-bezier(0.25,0.1,0.25,1)",
    q = 700,
    E = 700,
    b = 1.6,
    tp = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";

  let S = null, A = 0, P = 0, _ = false, L = false, R = false, D = null, ne = null, se = null, ae = 0;
  const iiCache = new Map();

  function le(e) {
    ne && (ne.raf(e), se = requestAnimationFrame(le));
  }

  function I(e) {
    const t = e.target;
    if ("news" === S) {
      let n = t;
      for (; n && n !== document;) {
        if (n === p) return;
        n = n.parentNode;
      }
    }
    if ("product" === S) {
      let n = t;
      for (; n && n !== document;) {
        if (n.classList && n.classList.contains("popup--content-right")) return;
        n = n.parentNode;
      }
    }
    e.preventDefault();
    e.stopPropagation();
  }

  const N = "precision mediump float;attribute vec3 position;attribute vec2 texcoord;uniform mat4 uMatrix;uniform mat4 uTmatrix;uniform float uTime;uniform vec2 uOffset;uniform float uPower;varying vec2 vTexcoord;void main(){vec3 pos=position.xzy;float dist=distance(uOffset,vec2(pos.x,pos.y));float rippleEffect=cos(15.0*(dist-(uTime/60.0)));float distortionEffect=rippleEffect*uPower;pos.x+=(distortionEffect/30.0*(uOffset.x-pos.x));pos.y+=distortionEffect/30.0*(uOffset.y-pos.y);gl_Position=uMatrix*vec4(pos,1.0);vTexcoord=(uTmatrix*vec4(texcoord-vec2(.5),0,1)).xy+vec2(.5);}",
    U = "precision mediump float;uniform sampler2D uTexOne;uniform sampler2D uTexTwo;uniform float uWipeProgress;varying vec2 vTexcoord;void main(){vec2 uv=vTexcoord;vec4 texOne=texture2D(uTexOne,uv);vec4 texTwo=texture2D(uTexTwo,uv);gl_FragColor=mix(texOne,texTwo,uWipeProgress);}";

  let O = false, C = null, B = null, X = null, $ = null, k = null, F = false;

  const G = {
    power: 0, wipeProgress: 0, time: 0, offset: [0, 0],
    textures: { current: null, next: null },
    textureInfos: { current: { width: 1, height: 1 }, next: { width: 1, height: 1 } },
    pendingNextSrc: null, pendingNextAlt: null, preloadedNextImage: null,
  };

  function M(e, t, n = false) {
    const i = B.createTexture();
    B.bindTexture(B.TEXTURE_2D, i);
    B.texImage2D(B.TEXTURE_2D, 0, B.RGBA, 1, 1, 0, B.RGBA, B.UNSIGNED_BYTE, new Uint8Array([0, 0, 0, 255]));
    B.texParameteri(B.TEXTURE_2D, B.TEXTURE_WRAP_S, B.CLAMP_TO_EDGE);
    B.texParameteri(B.TEXTURE_2D, B.TEXTURE_WRAP_T, B.CLAMP_TO_EDGE);
    B.texParameteri(B.TEXTURE_2D, B.TEXTURE_MIN_FILTER, B.LINEAR);
    B.texParameteri(B.TEXTURE_2D, B.TEXTURE_MAG_FILTER, B.LINEAR);
    const s = new Image;
    s.crossOrigin = "anonymous";
    s.onload = () => {
      B.bindTexture(B.TEXTURE_2D, i);
      B.texImage2D(B.TEXTURE_2D, 0, B.RGBA, B.RGBA, B.UNSIGNED_BYTE, s);
      n && (G.preloadedNextImage = s);
      t({ texture: i, width: s.width, height: s.height });
    };
    s.onerror = () => t({ texture: i, width: 1, height: 1 });
    s.src = e;
    return i;
  }

  function coverMatrix(m4, containerW, containerH, texW, texH) {
    var mat = m4.identity();
    var cr = containerW / containerH, tr = texW / texH;
    var s = 1, a = 1;
    if (cr > tr) a = tr / cr; else s = cr / tr;
    s *= b; a *= b;
    m4.scale(mat, [s, a, 1], mat);
    return mat;
  }

  function z() {
    if (!B || !C) return;
    if (twgl.resizeCanvasToDisplaySize(C), B.viewport(0, 0, B.drawingBufferWidth, B.drawingBufferHeight), B.clearColor(0, 0, 0, 0), B.clear(B.COLOR_BUFFER_BIT), !G.textures.current || !G.textures.next) return;
    const e = twgl.m4;
    let t = e.identity();
    var cw = C.width / b, ch = C.height / b;
    var tNext = G.textureInfos.next;
    var mat = coverMatrix(e, cw, ch, tNext.width, tNext.height);
    G.time++;
    e.ortho(0, C.width, C.height, 0, -1, 1, t);
    e.translate(t, [C.width / 2, C.height / 2, 1], t);
    e.scale(t, [C.width, C.height, 1], t);
    B.useProgram(X.program);
    twgl.setBuffersAndAttributes(B, X, $);
    twgl.setUniforms(X, { uMatrix: t, uTmatrix: mat, uTexOne: G.textures.current, uTexTwo: G.textures.next, uTime: G.time, uPower: G.power, uWipeProgress: G.wipeProgress, uOffset: G.offset });
    twgl.drawBufferInfo(B, $);
    F && (k = requestAnimationFrame(z));
  }

  function W() {
    F = false;
    k && (cancelAnimationFrame(k), k = null);
  }

  function oe() {
    W();
    G.textures.current && (B.deleteTexture(G.textures.current), G.textures.current = null);
    G.textures.next && (B.deleteTexture(G.textures.next), G.textures.next = null);
    G.preloadedNextImage = null;
  }

  function H(e, t, i, n) {
    if (!O) return void n();
    const ue = ++ae;
    G.pendingNextSrc = t;
    G.pendingNextAlt = i;
    G.power = 0;
    G.wipeProgress = 0;
    G.time = 0;
    G.offset = [1, 0];
    G.preloadedNextImage = null;
    let s = 0;
    const a = () => {
      s++;
      2 === s && function (e) {
        k && cancelAnimationFrame(k);
        F = true;
        z();
        requestAnimationFrame(() => {
          C.style.opacity = "1";
          r && (r.style.opacity = "0");
          o && (o.style.opacity = "0");
          if (G.preloadedNextImage) {
            r.src = G.preloadedNextImage.src;
            r.alt = G.pendingNextAlt || "";
          }
        });
        const t = 1.5, i = gsap.timeline({ paused: true });
        i.to(G, { power: .3, duration: .4, ease: "none" }).to(G, { power: 0, duration: .8, ease: "none" });
        gsap.timeline({
          onComplete: () => {
            if (ue !== ae) return void oe();
            const t = () => {
              r && (r.style.opacity = "1");
              C.style.opacity = "0";
              oe();
              e();
            };
            r.decode ? r.decode().then(t).catch(t) : requestAnimationFrame(t);
          },
        }).to(i, { progress: 1, duration: t, ease: "power2.inOut" }, 0).to(G, { wipeProgress: 1, duration: 1, ease: "none" }, .5);
      }(n);
    };
    G.textures.current = M(e, (e) => { G.textureInfos.current = e; a(); }, false);
    G.textures.next = M(t, (e) => { G.textureInfos.next = e; a(); }, true);
  }

  const Y = Array.from(x).map((e) => {
    const t = e.querySelector(".product-data"),
      i = e.querySelector(".product-image")?.src || "",
      g1 = t?.dataset["gallery-1"] || "",
      r = t?.dataset["gallery-2"] || "",
      o = t?.dataset["gallery-3"] || "",
      n = [g1 || i];
    r && n.push(r);
    o && n.push(o);
    return {
      name: e.querySelector(".product-title")?.textContent || "",
      gallery: n,
      description: t?.dataset.description || "",
      ingredientImage: t?.dataset.ingredientImage || "",
      perfumeName: e.dataset.perfumeName || e.querySelector(".product-title")?.textContent || "",
      fragranceType: e.dataset.fragranceType || "",
      topNote: e.dataset.topNote || "",
      middleNote: e.dataset.middleNote || "",
      lastNote: e.dataset.lastNote || "",
      fullDescription: e.dataset.fullDescription || "",
      sku: e.dataset.sku || "",
      size: e.dataset.size || "",
    };
  }),
    j = Array.from(v).map((e) => {
      const t = e.querySelector(".news--date-container .small-text"),
        i = e.querySelector(".medium-text"),
        n = e.querySelector(".news-data"),
        b = e.querySelector(".news-body-content");
      return {
        date: t?.textContent || "",
        title: i?.textContent || "",
        image: n?.dataset.newsImage || "",
        body: b?.innerHTML || "",
      };
    });

  function Q() {
    a.forEach((e) => {
      const t = e.querySelector(".slide--line-fill");
      t && (gsap.killTweensOf(t), gsap.set(t, { x: "-100%" }));
    });
  }

  function J(e, t, i = false) {
    if (L || e === P) return;
    const n = P,
      s = n >= 0 ? t.gallery[n] : t.gallery[0],
      a = t.gallery[e];
    if (P = e, i || n < 0)
      return Q(), r && t.gallery[e] && (r.src = t.gallery[e], r.alt = t.name, gsap.set(r, { opacity: 1 }), gsap.set(o, { opacity: 0 })), void K(e, t);
    L = true;
    gsap.delayedCall(.75, () => { Q(); K(e, t); });
    H(s, a, t.name, () => { L = false; });
  }

  function K(e, t) {
    const i = a[e];
    if (i && t.gallery.length > 1) {
      const e = i.querySelector(".slide--line-fill");
      e && (D = gsap.fromTo(e, { x: "-100%" }, {
        x: "0%", duration: 5, ease: "linear", onComplete: () =>
          function (e) { if (L) return; J((P + 1) % e.gallery.length, e); }(t),
      }));
    }
  }

  function V(e) {
    Z();
    e.gallery.length <= 1 || (P = -1, J(0, e, true));
  }

  function Z() {
    D && (D.kill(), D = null);
    L = false;
    W();
    Q();
    gsap.killTweensOf(G);
    G.preloadedNextImage = null;
    G.pendingNextSrc = null;
    C && (C.style.opacity = "0");
  }

  function ee(e) {
    r && (r.src = e.gallery[0], r.alt = e.name, gsap.set(r, { opacity: 1 }));
    o && gsap.set(o, { opacity: 0 });
    n && (n.textContent = e.description);
    if (pI) {
      pI.src = tp; pI.alt = "";
      if (e.ingredientImage) {
        if (iiCache.has(e.ingredientImage)) {
          pI.src = e.ingredientImage; pI.alt = e.perfumeName || e.name;
        } else {
          var ii = new Image();
          ii.src = e.ingredientImage;
          var setII = function () { iiCache.set(e.ingredientImage, true); pI.src = e.ingredientImage; pI.alt = e.perfumeName || e.name; };
          ii.decode ? ii.decode().then(setII).catch(setII) : (ii.onload = setII);
        }
      }
    }
    pN && (pN.textContent = e.perfumeName || e.name);
    pF && (pF.textContent = e.fragranceType);
    pT && (pT.textContent = e.topNote);
    pM && (pM.textContent = e.middleNote);
    pL && (pL.textContent = e.lastNote);
    pD && (pD.textContent = e.fullDescription);
    pK && (pK.textContent = e.sku);
    pZ && (pZ.textContent = e.size);
    (function (e) {
      const t = e.gallery.length;
      s && (s.style.display = t <= 1 ? "none" : "");
      a.forEach((e, i) => e.style.display = i < t ? "" : "none");
      Q();
    })(e);
  }

  function te(r, o) {
    if (_ || S) return;
    _ = true; S = r; A = o;
    const n = "product" === r ? c : p;
    var s;
    "product" === r ? (P = 0, ee(Y[o]), O || C || function () {
      if (!i || "undefined" == typeof twgl) return false;
      if (C = document.createElement("canvas"), C.style.cssText = "position:absolute;top:-30%;left:-30%;width:160%;height:160%;z-index:1;pointer-events:none;opacity:0", i.insertBefore(C, i.querySelector(".gallery-slide")), B = C.getContext("webgl", { alpha: true, premultipliedAlpha: false, antialias: true }), !B) return C.remove(), false;
      try { X = twgl.createProgramInfo(B, [N, U]); $ = twgl.primitives.createPlaneBufferInfo(B, 1, 1, 30, 30); } catch (e) { return C.remove(), false; }
      O = true;
    }(), e.classList.add("show-product")) : (s = j[o], d && (d.textContent = s.title), m && (m.textContent = s.date), y && (y.src = s.image, y.alt = s.title), g && (g.innerHTML = s.body), e.classList.add("show-news"));
    n && (n.style.display = "grid", n.style.opacity = "0", n.scrollTop = 0);

    if ("news" === r && p && typeof Lenis !== "undefined")
      ne = new Lenis({ wrapper: p, content: p.children[0], duration: 2, easing: (t) => t === 1 ? 1 : 1 - Math.pow(2, -10 * t), smoothWheel: true, smoothTouch: false }), window.popupLenis = ne, se = requestAnimationFrame(le);
    else if ("product" === r && typeof Lenis !== "undefined") {
      var pcr = c?.querySelector(".popup--content-right");
      if (pcr) pcr.scrollTop = 0, ne = new Lenis({ wrapper: pcr, content: pcr.children[0], duration: 2, easing: (t) => t === 1 ? 1 : 1 - Math.pow(2, -10 * t), smoothWheel: true, smoothTouch: false }), window.popupLenis = ne, se = requestAnimationFrame(le);
    }

    t && (t.style.opacity = "0");
    "undefined" != typeof SScroll ? SScroll.stop() : (document.documentElement.style.overflow = "hidden", document.body.style.overflow = "hidden");
    document.addEventListener("wheel", I, { passive: false, capture: true });
    document.addEventListener("touchmove", I, { passive: false, capture: true });
    e.style.transition = `opacity 800ms ${h},visibility 800ms ${h}`;
    e.classList.add("is-active");

    setTimeout(() => {
      e.style.transition = "";
      n && (n.style.transition = `opacity 700ms ${w}`, n.style.opacity = "1");
      t && (t.style.transition = `opacity 700ms ${w}`, t.style.opacity = "1");
      e.classList.add("content-visible");
      setTimeout(() => {
        n && (n.style.transition = "");
        t && (t.style.transition = "");
        _ = false;
        "product" === r && V(Y[o]);
      }, q);
    }, 1e3);
  }

  function ie() {
    if (_ || !S) return;
    _ = true;
    "product" === S && Z();
    const i = "product" === S ? c : p;
    e.style.transition = `opacity 700ms ${T},visibility 700ms ${T}`;
    i && (i.style.transition = `opacity 700ms ${T}`);
    t && (t.style.transition = `opacity 700ms ${T}`);
    e.classList.remove("content-visible");
    i && (i.style.opacity = "0");
    t && (t.style.opacity = "0");
    e.classList.remove("is-active");

    setTimeout(() => {
      e.classList.remove("show-product", "show-news");
      i && (i.style.transition = "", i.style.opacity = "", i.style.display = "");
      t && (t.style.transition = "", t.style.opacity = "");
      "undefined" != typeof SScroll ? SScroll.start() : (document.documentElement.style.overflow = "", document.body.style.overflow = "");
      document.removeEventListener("wheel", I, { capture: true });
      document.removeEventListener("touchmove", I, { capture: true });
      e.style.transition = "";
      _ = false; R = false; S = null;
      se && (cancelAnimationFrame(se), se = null);
      ne && (ne.destroy(), ne = null);
    }, E);
  }

  function re(e) {
    if (_ || R || "product" !== S) return;
    R = true; ae++;
    D && (D.kill(), D = null);
    Q();

    var nextData = Y[e];
    var preloads = [];

    if (nextData.ingredientImage && !iiCache.has(nextData.ingredientImage)) {
      preloads.push(new Promise(function (resolve) {
        var ii = new Image();
        ii.src = nextData.ingredientImage;
        var done = function () { iiCache.set(nextData.ingredientImage, true); resolve(); };
        ii.decode ? ii.decode().then(done).catch(done) : (ii.onload = done, ii.onerror = done);
      }));
    }

    if (nextData.gallery[0] && !iiCache.has(nextData.gallery[0])) {
      preloads.push(new Promise(function (resolve) {
        var gi = new Image();
        gi.src = nextData.gallery[0];
        var done = function () { iiCache.set(nextData.gallery[0], true); resolve(); };
        gi.decode ? gi.decode().then(done).catch(done) : (gi.onload = done, gi.onerror = done);
      }));
    }

    c && (c.style.transition = `opacity 700ms ${T}`, c.style.opacity = "0");
    t && (t.style.transition = `opacity 700ms ${T}`, t.style.opacity = "0");

    var fadeOutDone = new Promise(function (resolve) { setTimeout(resolve, q); });

    Promise.all([fadeOutDone].concat(preloads)).then(function () {
      W();
      gsap.killTweensOf(G);
      C && (C.style.opacity = "0");
      G.preloadedNextImage = null;
      G.pendingNextSrc = null;
      A = e; P = 0;
      ee(Y[A]);
      se && (cancelAnimationFrame(se), se = null);
      ne && (ne.destroy(), ne = null);
      var pcr = c?.querySelector(".popup--content-right");
      if (pcr && typeof Lenis !== "undefined")
        pcr.scrollTop = 0, ne = new Lenis({ wrapper: pcr, content: pcr.children[0], duration: 2, easing: function (t) { return t === 1 ? 1 : 1 - Math.pow(2, -10 * t); }, smoothWheel: true, smoothTouch: false }), window.popupLenis = ne, se = requestAnimationFrame(le);
      var showContent = function () {
        requestAnimationFrame(function () {
          requestAnimationFrame(function () {
            c && (c.style.transition = `opacity 700ms ${w}`, c.style.opacity = "1");
            t && (t.style.transition = `opacity 700ms ${w}`, t.style.opacity = "1");
          });
        });
      };
      r && r.decode ? r.decode().then(showContent).catch(showContent) : showContent();
      setTimeout(function () {
        c && (c.style.transition = "");
        t && (t.style.transition = "");
        R = false;
        V(Y[A]);
      }, q);
    });
  }

  x.forEach((e, t) => { e.style.cursor = "pointer"; e.addEventListener("click", () => te("product", t)); });
  v.forEach((e, t) => { e.style.cursor = "pointer"; e.addEventListener("click", () => te("news", t)); });
  t?.addEventListener("click", (e) => { e.stopPropagation(); ie(); });
  e.addEventListener("click", (t) => { t.target === e && ie(); });
  a.forEach((e, t) => {
    e.style.cursor = "pointer";
    e.addEventListener("click", () => {
      if (_ || L || "product" !== S) return;
      const e = Y[A];
      t < e.gallery.length && t !== P && (D && (D.kill(), D = null), setTimeout(() => J(t, e), 300));
    });
  });
  u?.addEventListener("click", (e) => { e.stopPropagation(); re((A - 1 + Y.length) % Y.length); });
  l?.addEventListener("click", (e) => { e.stopPropagation(); re((A + 1) % Y.length); });
  u && (u.style.cursor = "pointer");
  l && (l.style.cursor = "pointer");
  window.lightbox = { openProduct: (e) => te("product", e), openNews: (e) => te("news", e), close: ie, nextProduct: () => re((A + 1) % Y.length), prevProduct: () => re((A - 1 + Y.length) % Y.length) };
}();
