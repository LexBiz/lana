// Smooth scroll to section
function scrollToTarget(selector) {
  const target =
    typeof selector === "string"
      ? document.querySelector(selector)
      : selector;
  if (!target) return;

  const rect = target.getBoundingClientRect();
  const offset = window.pageYOffset || document.documentElement.scrollTop;
  const header = document.querySelector(".site-header");
  const headerHeight = header ? header.offsetHeight : 0;

  const top = rect.top + offset - headerHeight - 12;
  window.scrollTo({
    top: top < 0 ? 0 : top,
    behavior: "smooth",
  });
}

// Reveal on scroll
function setupRevealOnScroll() {
  const elements = document.querySelectorAll(".reveal-on-scroll");
  if (!("IntersectionObserver" in window)) {
    elements.forEach((el) => el.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.18,
    }
  );

  elements.forEach((el) => observer.observe(el));
}

// Mobile navigation
function setupNavigation() {
  const toggle = document.querySelector(".nav-toggle");
  const nav = document.querySelector(".main-nav");

  if (!toggle || !nav) return;

  toggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("is-open");
    toggle.classList.toggle("is-open", isOpen);
  });

  nav.addEventListener("click", (event) => {
    const link = event.target.closest("a");
    if (!link) return;
    nav.classList.remove("is-open");
    toggle.classList.remove("is-open");
  });
}

// CTA buttons scroll
function setupScrollButtons() {
  document.addEventListener("click", (event) => {
    const btn = event.target.closest("[data-scroll-to]");
    if (!btn) return;
    const target = btn.getAttribute("data-scroll-to");
    if (!target) return;
    event.preventDefault();
    scrollToTarget(target);
  });
}

// Payment logic placeholders
function setupPurchaseButtons() {
  document.addEventListener("click", (event) => {
    const btn = event.target.closest("[data-purchase]");
    if (!btn) return;

    const type = btn.getAttribute("data-purchase");
    const tier = btn.getAttribute("data-tier");
    const service = btn.getAttribute("data-service");

    // Курси: перехід на placeholder-URL оплати (href у розмітці)
    if (type === "course") {
      // Платіжний сервіс після оплати налаштовує redirect
      // на Telegram-бот / групу (placeholder-лінк в особистому кабінеті).
      return;
    }

    // Додаткові послуги: redirect на псевдо-сторінку "Заявку прийнято"
    if (type === "service") {
      event.preventDefault();

      // У продакшн-сценарії платіжний сервіс після успішної оплати
      // має перенаправляти на URL типу: https://yourdomain.com/?status=success
      const url = new URL(window.location.href);
      url.searchParams.set("status", "success");
      url.searchParams.set("request", service || tier || "service");
      url.searchParams.set("type", type);
      if (service) {
        url.searchParams.set("service", service);
      }
      window.location.href = url.toString();
    }
  });
}

// Thank-you pseudo page
function handleThankYouView() {
  const params = new URLSearchParams(window.location.search);
  const status = params.get("status");
  const thankYouSection = document.getElementById("thank-you");
  if (!thankYouSection) return;

  if (status === "success") {
    thankYouSection.style.display = "flex";
    document.body.classList.add("thank-you-visible");
    // Показуємо тільки блок "дякуємо" та прокручуємо сторінку вгору
    window.scrollTo({ top: 0, behavior: "auto" });

    // Налаштування контенту "спасибі" в залежності від пакета / послуги
    const type = params.get("type"); // course | service
    const tier = params.get("tier"); // Basic | Pro | Premium
    const service = params.get("service"); // consultation | audit | mentorship
    const request = params.get("request");

    const key =
      (type && tier && `${type}:${tier}`) ||
      (type && service && `${type}:${service}`) ||
      request ||
      "generic";

    const configMap = {
      "course:Basic": {
        title: "Доступ до курсу LANA BOOST BAZA оформлено",
        text:
          "Перейдіть у Telegram‑канал «Басік Лана клаб», щоб отримати матеріали курсу LANA BOOST BAZA.",
        telegramUrl: "https://t.me/+IXwagqxdGgY4NThi",
        telegramLabel: "Перейти в канал «Басік Лана клаб»",
      },
      "course:Pro": {
        title: "Доступ до курсу Pro оформлено",
        text: "Перейдіть у Telegram, щоб отримати матеріали курсу Pro.",
        telegramUrl: "https://t.me/+pD8bA6lpTsJhODE6",
      },
      "course:Premium": {
        title: "Доступ до курсу Premium оформлено",
        text: "Перейдіть у VIP‑клуб та зв’яжіться з автором у Telegram.",
        telegramUrl: "https://t.me/+pD8bA6lpTsJhODE6",
        telegramUrlSecondary: "https://t.me/Pologenko",
        telegramLabelSecondary: "Написати автору в Telegram",
      },
      "service:consultation": {
        title: "Заявку на консультацію прийнято",
        text: "Перейдіть у Telegram, щоб узгодити час консультації.",
        telegramUrl: "https://t.me/Pologenko",
      },
      "service:audit": {
        title: "Заявку на розбір акаунту прийнято",
        text: "Перейдіть у Telegram, щоб надіслати посилання на акаунт.",
        telegramUrl: "https://t.me/Pologenko",
      },
      "service:monetized_tiktok": {
        title: "Оплату за монетизований акаунт TikTok прийнято",
        text:
          "Перейдіть до автора в Telegram, щоб отримати доступ до монетизованого акаунту TikTok та інструкції з використання.",
        telegramUrl: "https://t.me/Pologenko",
      },
      "service:monetized_triple": {
        title: "Оплату за пакет із 3 монетизованих акаунтів прийнято",
        text:
          "Перейдіть до автора в Telegram, щоб отримати доступ до акаунтів TikTok, Telegram та YouTube та подальші інструкції.",
        telegramUrl: "https://t.me/Pologenko",
      },
      "service:mentorship": {
        title: "Заявку на індивідуальний супровід прийнято",
        text:
          "Перейдіть у VIP‑клуб та напишіть автору в Telegram, щоб узгодити деталі супроводу.",
        telegramUrl: "https://t.me/+pD8bA6lpTsJhODE6",
        telegramLabel: "Перейти у VIP CLUB LANA",
        telegramUrlSecondary: "https://t.me/Pologenko",
        telegramLabelSecondary: "Написати автору в Telegram",
      },
      "service:test": {
        title: "Тестова оплата пройшла успішно",
        text:
          "Це тестова сторінка «Дякуємо». Тут ви бачите, як виглядає доступ до Telegram після успішної оплати.",
        telegramUrl: "https://t.me/+pD8bA6lpTsJhODE6",
        telegramLabel: "Відкрити VIP CLUB LANA",
        telegramUrlSecondary: "https://t.me/Pologenko",
        telegramLabelSecondary: "Написати автору в Telegram",
      },
      generic: {
        title: "Заявку прийнято",
        text: "Дякуємо! Інформацію про оплату отримано. Менеджер звʼяжеться з вами найближчим часом, щоб підтвердити деталі та дати подальші інструкції.",
        telegramUrl: "",
      },
    };

    const config = configMap[key] || configMap.generic;

    const titleEl = thankYouSection.querySelector("[data-thank-you-title]");
    const textEl = thankYouSection.querySelector("[data-thank-you-text]");
    const linkEl = thankYouSection.querySelector("[data-thank-you-link]");
    const linkSecondaryEl = thankYouSection.querySelector(
      "[data-thank-you-link-secondary]",
    );
    const linkPrimaryLabel = thankYouSection.querySelector(
      "[data-btn-label-primary]",
    );
    const linkSecondaryLabel = thankYouSection.querySelector(
      "[data-btn-label-secondary]",
    );

    if (titleEl && config.title) {
      titleEl.textContent = config.title;
    }
    if (textEl && config.text) {
      textEl.textContent = config.text;
    }

    if (linkEl) {
      if (config.telegramUrl) {
        linkEl.href = config.telegramUrl;
        if (linkPrimaryLabel) {
          linkPrimaryLabel.textContent =
            config.telegramLabel || "Перейти в Telegram";
        }
        linkEl.style.display = "inline-flex";
      } else {
        linkEl.style.display = "none";
      }
    }

    if (linkSecondaryEl) {
      if (config.telegramUrlSecondary) {
        linkSecondaryEl.href = config.telegramUrlSecondary;
        if (linkSecondaryLabel) {
          linkSecondaryLabel.textContent =
            config.telegramLabelSecondary || "Написати автору в Telegram";
        }
        linkSecondaryEl.style.display = "inline-flex";
      } else {
        linkSecondaryEl.style.display = "none";
      }
    }
  } else {
    thankYouSection.style.display = "none";
    document.body.classList.remove("thank-you-visible");
  }
}

document.addEventListener("DOMContentLoaded", () => {
  setupRevealOnScroll();
  setupNavigation();
  setupScrollButtons();
  setupPurchaseButtons();
  handleThankYouView();
});


