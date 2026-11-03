const burger = document.querySelector(".burger");
const nav = document.querySelector(".nav");
const body = document.body;

if (burger && nav) {
  burger.addEventListener("click", () => {
    burger.classList.toggle("active");
    nav.classList.toggle("active");
    body.classList.toggle("menu-open");

    if (nav.classList.contains("active")) {
      body.style.overflow = "hidden";
    } else {
      body.style.overflow = "";
    }
  });

  document.querySelectorAll(".nav__list a").forEach((link) => {
    link.addEventListener("click", () => {
      burger.classList.remove("active");
      nav.classList.remove("active");
      body.classList.remove("menu-open");
      body.style.overflow = "";
    });
  });

  document.addEventListener("click", (e) => {
    if (
      !nav.contains(e.target) &&
      !burger.contains(e.target) &&
      nav.classList.contains("active")
    ) {
      burger.classList.remove("active");
      nav.classList.remove("active");
      body.classList.remove("menu-open");
      body.style.overflow = "";
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  const modal = document.getElementById("modal");
  const modalClose = document.querySelector(".modal__close");
  const modalForm = document.getElementById("modalForm");
  const serviceNameSpan = document.getElementById("modalServiceName");

  function openModal(e) {
    e.preventDefault();
    modal.classList.add("active");
    document.body.style.overflow = "hidden";

    const privacyCheckbox = document.getElementById("privacyCheckbox");
    const submitBtn = document.getElementById("submitBtn");

    if (privacyCheckbox && submitBtn) {
      privacyCheckbox.checked = false;
      submitBtn.disabled = true;

      if (!privacyCheckbox.dataset.handlerAdded) {
        privacyCheckbox.addEventListener("change", () => {
          submitBtn.disabled = !privacyCheckbox.checked;
        });
        privacyCheckbox.dataset.handlerAdded = "true";
      }
    }

    const service = e.currentTarget.getAttribute("data-service") || "услугу";
    const calUrl = e.currentTarget.getAttribute("data-cal-url");
    if (serviceNameSpan) {
      serviceNameSpan.textContent = service;
    }
    if (calUrl) {
      const iframe = document.getElementById("bookingIframe");
      if (iframe) {
        iframe.src = calUrl;
      }
    }

    calLoaded = false;

    if (privacyCheckbox) {
      privacyCheckbox.checked = false;
    }
    if (submitBtn) {
      submitBtn.disabled = true;
    }
  }

  function closeModal() {
    modal.classList.remove("active");
    document.body.style.overflow = "";
    modalForm.reset();
  }

  const openModalButtons = document.querySelectorAll('[data-modal="open"]');
  openModalButtons.forEach((button) => {
    button.addEventListener("click", openModal);
  });

  modalClose.addEventListener("click", closeModal);

  modal.addEventListener("click", (e) => {
    if (e.target === modal || e.target.classList.contains("modal__overlay")) {
      closeModal();
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal.classList.contains("active")) {
      closeModal();
    }
  });

  modalForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const privacyCheckbox = document.getElementById("privacyCheckbox");
    if (privacyCheckbox && !privacyCheckbox.checked) {
      alert("Пожалуйста, согласитесь с политикой конфиденциальности");
      return;
    }
    const formData = new FormData(modalForm);
    const data = Object.fromEntries(formData);

    const serviceName =
      document.getElementById("modalServiceName")?.textContent || "Не указана";
    data.service = serviceName;

    const now = new Date();
    data.date = now.toLocaleString("ru-RU", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

    console.log("Отправляем данные:", data);

    try {
      await fetch(
        "https://h.albato.ru/wh/38/1lf2q2t/BVm5_IH5dy2itqhdUW6Rz62GJ3a0m-NohxbLDV59gFQ/",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        },
      );

      alert("Спасибо! Мы перезвоним вам в течение 15 минут.");
      closeModal();
      modalForm.reset();
    } catch (error) {
      console.error("Ошибка:", error);
      alert("Ошибка отправки. Позвоните нам напрямую.");
    }
  });

  const tabButtons = document.querySelectorAll(".tabs__btn");
  const tabContents = document.querySelectorAll(".tabs__content");

  tabButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      tabButtons.forEach((b) => b.classList.remove("tabs__btn—active"));

      tabContents.forEach((c) => c.classList.remove("tabs__content—active"));

      btn.classList.add("tabs__btn—active");

      const tabId = btn.getAttribute("data-tab");
      const targetContent = document.getElementById("tab-" + tabId);
      if (targetContent) {
        targetContent.classList.add("tabs__content—active");
      }

      if (tabId === "calendar") {
      }
    });
  });
});

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll("[data-comparison]").forEach((slider) => {
    const afterImage = slider.querySelector(".comparison-slider__image--after");
    const handle = slider.querySelector(".comparison-slider__handle");
    let isDragging = false;

    function updateSlider(x) {
      const rect = slider.getBoundingClientRect();
      let position = ((x - rect.left) / rect.width) * 100;

      position = Math.max(0, Math.min(100, position));

      handle.style.left = `${position}%`;

      afterImage.style.clipPath = `inset(0 ${100 - position}% 0 0)`;
    }

    slider.addEventListener("mousedown", (e) => {
      isDragging = true;
      updateSlider(e.clientX);
    });

    document.addEventListener("mousemove", (e) => {
      if (isDragging) {
        e.preventDefault();
        updateSlider(e.clientX);
      }
    });

    document.addEventListener("mouseup", () => {
      isDragging = false;
    });

    slider.addEventListener("touchstart", (e) => {
      isDragging = true;
      updateSlider(e.touches[0].clientX);
    });

    slider.addEventListener("touchmove", (e) => {
      if (isDragging) {
        updateSlider(e.touches[0].clientX);
      }
    });

    slider.addEventListener("touchend", () => {
      isDragging = false;
    });

    // Клик по слайдеру — перемещает ползунок
    slider.addEventListener("click", (e) => {
      updateSlider(e.clientX);
    });
  });
});

const reviewsTrack = document.querySelector(".reviews__track");
const prevBtn = document.querySelector(".reviews__nav--prev");
const nextBtn = document.querySelector(".reviews__nav--next");
const indicators = document.querySelectorAll(".reviews__indicator");
const cards = document.querySelectorAll(".review-card");

let currentIndex = 0;

function updateCarousel() {
  const cardWidth = cards[0].offsetWidth + 32; // ширина + gap
  reviewsTrack.scrollTo({
    left: currentIndex * cardWidth,
    behavior: "smooth",
  });

  indicators.forEach((ind, idx) => {
    ind.classList.toggle("active", idx === currentIndex);
  });
}

prevBtn.addEventListener("click", () => {
  currentIndex = (currentIndex - 1 + cards.length) % cards.length;
  updateCarousel();
});

nextBtn.addEventListener("click", () => {
  currentIndex = (currentIndex + 1) % cards.length;
  updateCarousel();
});

indicators.forEach((ind, idx) => {
  ind.addEventListener("click", () => {
    currentIndex = idx;
    updateCarousel();
  });
});

setInterval(() => {
  currentIndex = (currentIndex + 1) % cards.length;
  updateCarousel();
}, 5000);

document.addEventListener("DOMContentLoaded", () => {
  const fadeElements = document.querySelectorAll(
    ".fade-in, .fade-in-left, .fade-in-right, .fade-in-scale",
  );

  const observerOptions = {
    root: null,
    rootMargin: "0px",
    threshold: 0.15,
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target); // перестаем следить после появления
      }
    });
  }, observerOptions);

  fadeElements.forEach((el) => observer.observe(el));
});
