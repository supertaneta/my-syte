// Lightweight motion for a richer, "live" landing experience.
document.addEventListener("DOMContentLoaded", () => {
  cycleBadge();
  sparkleBackground();
  sectionReveal();
  photoParallax();
  heroFadeOut();
  scrollHint();
  heroParallaxBg();
});

function cycleBadge() {
  const badge = document.querySelector(".badge");
  if (!badge) return;

  const phrases = [
    "実践型1DAY / ケース面接×IR読み解き",
    "フェルミ推定・有報ワーク・懇親会",
    "元KPMG・PwC代表取締役 椎名が直指導"
  ];

  let i = 0;
  setInterval(() => {
    i = (i + 1) % phrases.length;
    badge.style.opacity = "0";
    setTimeout(() => {
      badge.textContent = phrases[i];
      badge.style.opacity = "1";
    }, 180);
  }, 3200);
}

function sparkleBackground() {
  const canvas = document.getElementById("sparkle");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");

  const particles = [];
  const max = 60;

  function resize() {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  }
  resize();
  window.addEventListener("resize", resize);

  for (let i = 0; i < max; i++) {
    particles.push(makeParticle(canvas));
  }

  function tick() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach((p) => {
      p.x += p.vx;
      p.y += p.vy;
      p.life -= 0.002;
      if (p.life <= 0 || p.y > canvas.height + 20) Object.assign(p, makeParticle(canvas));
      drawParticle(ctx, p);
    });
    requestAnimationFrame(tick);
  }
  tick();
}

function makeParticle(canvas) {
  const speed = Math.random() * 0.3 + 0.15;
  return {
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    vx: (Math.random() - 0.5) * 0.2,
    vy: -speed,
    r: Math.random() * 1.8 + 0.6,
    life: Math.random() * 0.8 + 0.2,
  };
}

function drawParticle(ctx, p) {
  const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 4);
  gradient.addColorStop(0, "rgba(130, 243, 208, 0.9)");
  gradient.addColorStop(1, "rgba(130, 243, 208, 0)");
  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.arc(p.x, p.y, p.r * 4, 0, Math.PI * 2);
  ctx.fill();
}

function sectionReveal() {
  const targets = document.querySelectorAll("header.hero, section");
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.18 }
  );

  targets.forEach((el) => {
    if (!el.classList.contains("landing-hero")) {
      el.classList.add("reveal");
      io.observe(el);
    }
  });
}

function photoParallax() {
  const frame = document.querySelector(".photo-frame");
  if (!frame) return;

  const bounds = frame.getBoundingClientRect();
  const maxTilt = 6;

  frame.addEventListener("mousemove", (e) => {
    const x = (e.clientX - bounds.left) / bounds.width - 0.5;
    const y = (e.clientY - bounds.top) / bounds.height - 0.5;
    frame.style.transform = `rotateX(${y * -maxTilt}deg) rotateY(${x * maxTilt}deg) scale(1.01)`;
  });

  frame.addEventListener("mouseleave", () => {
    frame.style.transform = "rotateX(0) rotateY(0)";
  });
}

function heroFadeOut() {
  const hero = document.querySelector(".landing-hero");
  if (!hero) return;

  const max = hero.offsetHeight * 0.8;

  const update = () => {
    const y = window.scrollY;
    const t = Math.min(1, Math.max(0, y / max));
    hero.style.opacity = `${1 - t}`;
    hero.style.transform = `translateY(${t * -40}px) scale(${1 - t * 0.04})`;
  };

  window.addEventListener("scroll", update, { passive: true });
  update();
}

function scrollHint() {
  const hint = document.querySelector(".scroll-hint");
  const targetSel = hint?.dataset.target || "#details";
  const target = document.querySelector(targetSel);
  if (!hint || !target) return;

  const scrollToTarget = () => target.scrollIntoView({ behavior: "smooth" });
  hint.addEventListener("click", scrollToTarget);
  hint.addEventListener("keypress", (e) => {
    if (e.key === "Enter") scrollToTarget();
  });
}

function heroParallaxBg() {
  const hero = document.querySelector(".landing-hero");
  if (!hero) return;

  let currentX = 0;
  let currentY = 0;
  let targetX = 0;
  let targetY = 0;

  const update = () => {
    currentX += (targetX - currentX) * 0.08;
    currentY += (targetY - currentY) * 0.08;
    hero.style.setProperty("--hero-pan-x", `${currentX}px`);
    hero.style.setProperty("--hero-pan-y", `${currentY}px`);
    requestAnimationFrame(update);
  };

  hero.addEventListener("mousemove", (e) => {
    const rect = hero.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    targetX = x * 22;
    targetY = y * 18;
  });

  hero.addEventListener("mouseleave", () => {
    targetX = 0;
    targetY = 0;
  });

  update();
}
