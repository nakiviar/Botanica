// Back-to-top button behavior with robust visibility handling and smooth scroll
const scrollUpButton = document.getElementById("scrollupBtn");

// Guard if the element is missing
if (scrollUpButton) {
  // Ensure hidden on load
  scrollUpButton.classList.remove("show-scroll");

  const handleScrollVisibility = () => {
    const scrolledY = window.scrollY || document.documentElement.scrollTop || document.body.scrollTop || 0;
    if (scrolledY > 200) {
      scrollUpButton.classList.add("show-scroll");
    } else {
      scrollUpButton.classList.remove("show-scroll");
    }
  };

  // Initialize and listen
  window.addEventListener("scroll", handleScrollVisibility, { passive: true });
  window.addEventListener("load", handleScrollVisibility);

  // Simple smooth scroll to top on click
  window.topFunction = function topFunction() {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
}
