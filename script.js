// ============================================================
// Nasim Eczanesi — single-page site
// Bilingual (TR/EN) text dictionary + toggle logic
// ============================================================

const i18n = {
  tr: {
    page_title: "Nasim Eczanesi",
    pharmacy_name: "Nasim Eczanesi",
    address: "Özkoç Plaza Dükkan No:5, Salamis Yolu, Mağusa",
    about_title: "Hakkımızda",
    about_text:
      "Nasim Eczanesi, Doğu Akdeniz Üniversitesi (DAÜ) kampüsüne yakın, Gazimağusa'da hizmet veren bir eczanedir. Eczanenin sorumlu eczacısı Ecz. Faysal Zeki'dir ve eczane Kıbrıs Türk Eczacılar Birliği'ne kayıtlıdır. Nasim Eczanesi, KKTC'deki nöbetçi eczane düzenine dahildir. Eczanede reçeteli ve reçetesiz ilaçlar, kişisel bakım ürünleri ile cilt ve vücut analizi hizmeti bulunmaktadır.",
    status_loading: "\u00A0",
    status_open: "Şu an açık",
    status_closed: "Şu an kapalı",
    hours_title: "Çalışma Saatleri",
    hours_days_1: "Pazartesi, Salı, Çarşamba, Cuma",
    hours_days_2: "Perşembe, Cumartesi",
    hours_days_3: "Pazar",
    closed: "Kapalı",
    map_title: "Konum",
    directions_link: "Yol tarifi al",
    contact_title: "İletişim",
    form_name_label: "Ad Soyad",
    form_email_label: "E-posta",
    form_message_label: "Mesaj",
    form_submit: "Mesaj Gönder",
    contact_direct_label: "Doğrudan ulaşın",
    whatsapp_label: "WhatsApp'tan yazın",
    instagram_label: "Instagram'da görüntüleyin",
    contact_note: "İçerik yalnızca bilgilendirme amaçlıdır.",
  },
  en: {
    page_title: "Nasim Pharmacy",
    pharmacy_name: "Nasim Pharmacy",
    address: "Özkoç Plaza Shop No:5, Salamis Road, Famagusta",
    about_title: "About Us",
    about_text:
      "Nasim Pharmacy operates in Gazimağusa (Famagusta), close to the Eastern Mediterranean University (EMU) campus. The pharmacy's responsible pharmacist is Ecz. Faysal Zeki, and it is registered with the Cyprus Turkish Pharmacists Association (KTEB). Nasim Pharmacy participates in the on-duty pharmacy rota in the TRNC. It carries prescription and over-the-counter medication, personal care products, and offers skin and body analysis services.",
    status_loading: "\u00A0",
    status_open: "Open now",
    status_closed: "Closed now",
    hours_title: "Working Hours",
    hours_days_1: "Mon, Tue, Wed, Fri",
    hours_days_2: "Thu, Sat",
    hours_days_3: "Sunday",
    closed: "Closed",
    map_title: "Location",
    directions_link: "Get directions",
    contact_title: "Contact",
    form_name_label: "Full name",
    form_email_label: "Email",
    form_message_label: "Message",
    form_submit: "Send message",
    contact_direct_label: "Reach us directly",
    whatsapp_label: "Message on WhatsApp",
    instagram_label: "View on Instagram",
    contact_note: "This content is for informational purposes only.",
  },
};

let currentLang = "tr";

// ============================================================
// Open / closed status — computed from real working hours
// Mon/Tue/Wed/Fri 08:00-17:30, Thu/Sat 08:00-13:30, closed Sunday
// Uses North Cyprus local time (Asia/Famagusta) regardless of visitor's clock
// ============================================================

const SCHEDULE = {
  Mon: [[8 * 60, 17 * 60 + 30]],
  Tue: [[8 * 60, 17 * 60 + 30]],
  Wed: [[8 * 60, 17 * 60 + 30]],
  Thu: [[8 * 60, 13 * 60 + 30]],
  Fri: [[8 * 60, 17 * 60 + 30]],
  Sat: [[8 * 60, 13 * 60 + 30]],
  Sun: [],
};

function getPharmacyOpenStatus() {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Famagusta",
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(new Date());

  const map = {};
  parts.forEach((p) => (map[p.type] = p.value));

  const weekday = map.weekday; // "Mon", "Tue", ...
  const hour = parseInt(map.hour, 10);
  const minute = parseInt(map.minute, 10);
  const minutesNow = hour * 60 + minute;

  const ranges = SCHEDULE[weekday] || [];
  const isOpen = ranges.some(
    ([start, end]) => minutesNow >= start && minutesNow < end,
  );

  return isOpen;
}

function updateStatusBadge() {
  const badge = document.getElementById("statusBadge");
  const textEl = document.getElementById("statusText");
  if (!badge || !textEl) return;

  const isOpen = getPharmacyOpenStatus();
  const key = isOpen ? "status_open" : "status_closed";

  textEl.setAttribute("data-i18n", key);
  textEl.textContent = i18n[currentLang][key];
  badge.classList.toggle("is-open", isOpen);
  badge.classList.toggle("is-closed", !isOpen);
}

function applyLanguage(lang) {
  currentLang = lang;
  document.documentElement.setAttribute("lang", lang);

  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.getAttribute("data-i18n");
    if (i18n[lang] && i18n[lang][key] !== undefined) {
      el.textContent = i18n[lang][key];
    }
  });

  document.querySelectorAll(".lang-option").forEach((el) => {
    el.classList.toggle("active", el.getAttribute("data-lang") === lang);
  });
}

function initLangToggle() {
  const toggleBtn = document.getElementById("langToggle");
  if (!toggleBtn) return;

  toggleBtn.addEventListener("click", () => {
    const nextLang = currentLang === "tr" ? "en" : "tr";
    applyLanguage(nextLang);
    updateStatusBadge();
  });
}

function initContactForm() {
  const form = document.getElementById("contactForm");
  if (!form) return;

  // Pharmacy contact email
  const PHARMACY_EMAIL = "nasimeczanesi@gmail.com";

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = document.getElementById("nameInput").value.trim();
    const email = document.getElementById("emailInput").value.trim();
    const message = document.getElementById("messageInput").value.trim();

    const subject = encodeURIComponent(`Website contact - ${name}`);
    const body = encodeURIComponent(`${message}\n\n---\n${name}\n${email}`);

    window.location.href = `mailto:${PHARMACY_EMAIL}?subject=${subject}&body=${body}`;
  });
}

function setFooterYear() {
  const el = document.getElementById("footerYear");
  if (el) el.textContent = new Date().getFullYear();
}

document.addEventListener("DOMContentLoaded", () => {
  initLangToggle();
  applyLanguage(currentLang);
  updateStatusBadge();
  initContactForm();
  setFooterYear();
  // Keep the badge accurate if the page is left open across a status change
  setInterval(updateStatusBadge, 60 * 1000);
});
