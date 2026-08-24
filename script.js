(function () {
  document.documentElement.classList.add("js");

  const loader = document.getElementById("loader");
  const nav = document.getElementById("nav");
  const ham = document.getElementById("ham");
  const mob = document.getElementById("mob");
  const accent = document.getElementById("accentCycle");
  const form = document.getElementById("cForm");
  const canvas = document.getElementById("pcanvas");

  window.addEventListener("load", () => {
    window.setTimeout(() => loader && loader.classList.add("done"), 450);
  });

  const setNavState = () => {
    if (!nav) return;
    nav.classList.toggle("scrolled", window.scrollY > 16);
  };

  setNavState();
  window.addEventListener("scroll", setNavState, { passive: true });

  if (ham && mob) {
    ham.addEventListener("click", () => {
      const open = !mob.classList.contains("open");
      mob.classList.toggle("open", open);
      ham.classList.toggle("open", open);
      ham.setAttribute("aria-expanded", String(open));
    });

    mob.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        mob.classList.remove("open");
        ham.classList.remove("open");
        ham.setAttribute("aria-expanded", "false");
      });
    });
  }

  const words = ["seguridad", "puntualidad", "cobertura"];
  let wordIndex = 0;
  if (accent) {
    window.setInterval(() => {
      wordIndex = (wordIndex + 1) % words.length;
      accent.style.opacity = "0";
      window.setTimeout(() => {
        accent.textContent = words[wordIndex];
        accent.style.opacity = "1";
      }, 180);
    }, 2600);
  }

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("show");
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.16 });

  document.querySelectorAll(".rev").forEach((el) => revealObserver.observe(el));

  const countObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      animateCount(entry.target);
      countObserver.unobserve(entry.target);
    });
  }, { threshold: 0.6 });

  document.querySelectorAll("[data-count], [data-hero-count]").forEach((el) => {
    countObserver.observe(el);
  });

  function animateCount(el) {
    const target = Number(el.dataset.count || el.dataset.heroCount || 0);
    const prefix = el.dataset.prefix || "";
    const suffix = el.dataset.suffix || "";
    const start = performance.now();
    const duration = 900;

    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = `${prefix}${Math.round(target * eased)}${suffix}`;
      if (progress < 1) requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
  }

  if (form) {
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const required = Array.from(form.querySelectorAll("[required]"));
      let valid = true;

      required.forEach((field) => {
        const empty = !field.value.trim();
        field.classList.toggle("error", empty);
        if (empty) valid = false;
      });

      if (!valid) {
        const firstError = form.querySelector(".error");
        firstError && firstError.focus();
        return;
      }

      const data = new FormData(form);
      const lines = [
        "Solicitud de cotizacion TEF Transportes",
        "",
        `Nombre: ${data.get("nombre") || ""}`,
        `Empresa: ${data.get("empresa") || ""}`,
        `Telefono: ${data.get("telefono") || ""}`,
        `Correo: ${data.get("email") || ""}`,
        `Origen: ${data.get("origen") || ""}`,
        `Destino: ${data.get("destino") || ""}`,
        `Fecha de carga: ${data.get("fecha_carga") || ""}`,
        `Fecha requerida de entrega: ${data.get("fecha_entrega") || ""}`,
        `Tipo de carga: ${data.get("tipo_carga") || ""}`,
        `Modalidad: ${data.get("modalidad") || ""}`,
        "",
        `Comentarios: ${data.get("mensaje") || ""}`
      ];

      const subject = encodeURIComponent("Cotizacion de transporte de carga TEF");
      const body = encodeURIComponent(lines.join("\n"));
      window.location.href = `mailto:logistica.fuentes@outlook.com?subject=${subject}&body=${body}`;
    });

    form.querySelectorAll(".fi").forEach((field) => {
      field.addEventListener("input", () => field.classList.remove("error"));
    });
  }

  if (canvas) {
    const ctx = canvas.getContext("2d");
    let width = 0;
    let height = 0;
    let particles = [];

    const resize = () => {
      const ratio = window.devicePixelRatio || 1;
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      canvas.width = Math.floor(width * ratio);
      canvas.height = Math.floor(height * ratio);
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
      particles = Array.from({ length: Math.min(80, Math.floor(width / 16)) }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        s: 1 + Math.random() * 2.5,
        v: .25 + Math.random() * .8
      }));
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      ctx.strokeStyle = "rgba(255,255,255,.12)";
      ctx.lineWidth = 1;

      for (let y = 90; y < height; y += 90) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y - 70);
        ctx.stroke();
      }

      particles.forEach((p) => {
        p.x += p.v;
        p.y -= p.v * .28;
        if (p.x > width + 12) p.x = -12;
        if (p.y < -12) p.y = height + 12;
        ctx.fillStyle = p.s > 2.7 ? "rgba(229,33,46,.58)" : "rgba(255,255,255,.38)";
        ctx.fillRect(p.x, p.y, p.s * 5, p.s);
      });

      requestAnimationFrame(draw);
    };

    resize();
    draw();
    window.addEventListener("resize", resize);
  }
})();
