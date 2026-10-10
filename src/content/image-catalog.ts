/**
 * Ілюстративні зображення (public/images/) — не публікувати як доказ подій.
 * Офіційне фото: brand/hero.jpg
 */
export const siteImages = {
  /** Головний екран — атмосферний кадр без AI-шевронів/водяних знаків (не замінює офіційну хроніку). */
  homeHero: {
    /** JPEG — менше артефактів на великому екрані ніж агресивний WebP */
    src: "/images/sections/hero-home.jpg",
    alt: "14 ОРБ — головний кадр (ілюстративна графіка, не документальне фото операції)",
    priority: true,
  },
  official: {
    /** Архів з попереднього сайту; на Hero не використовується (AI-графіка з watermark). */
    heroArchive: {
      src: "/brand/hero.jpg",
      alt: "Архівне зображення з попередньої версії сайту",
    },
  },
  illustrative: {
    directionsField: {
      src: "/images/sections/directions-field.webp",
      alt: "Ілюстративний кадр: відкритий ландшафт, атмосфера спостереження (не бойовий документ)",
    },
    teamCoordination: {
      src: "/images/sections/team-coordination.webp",
      alt: "Ілюстративний кадр: координація групи під час підготовки, без ідентифікації осіб",
    },
    technologyUav: {
      src: "/images/sections/technology-uav.webp",
      alt: "Ілюстративний кадр: польова техніка та БпЛА, без маркувань і тексту",
    },
    recruitingPath: {
      src: "/images/sections/recruiting-path.webp",
      alt: "Ілюстративний кадр: шлях до служби, символічний настрій набору",
    },
    historyArchive: {
      src: "/images/sections/history-archive.webp",
      alt: "Ілюстративний кадр, не історичний документ",
    },
    backgroundMist: {
      src: "/images/sections/background-mist.webp",
      alt: "",
      decorative: true,
    },
    heroAtmosphere: {
      src: "/images/sections/hero-atmosphere.webp",
      alt: "Ілюстративний широкий кадр для оформлення сторінок рекрутингу",
    },
    /** Fallback, якщо hero-home ще не згенеровано */
    heroHomeFallback: {
      src: "/images/sections/hero-atmosphere.webp",
      alt: "Атмосферний широкий кадр для головного екрана",
    },
  },
} as const;

export type SiteImageKey = keyof typeof siteImages.illustrative;
