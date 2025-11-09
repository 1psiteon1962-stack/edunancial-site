// app.js – payment / newsletter placeholders

document.addEventListener("DOMContentLoaded", () => {
  // simulate Square/Block placeholder
  const payButtons = document.querySelectorAll('[data-pay="square"]');
  payButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      alert("Square/Block payment coming soon. Your membership level will unlock tools.");
    });
  });

  // newsletter
  const form = document.querySelector(".newsletter-form");
  if (form) {
    form.addEventListener("submit", (e) => {
      // remove this line when real endpoint is ready
      // e.preventDefault();
      // alert("Thank you. Newsletter captured.");
    });
  }
});
