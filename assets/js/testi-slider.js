/*--------------- Testimonial Slider ---------------*/ 
var swiper = new Swiper(".testimonial-slider", {

  spaceBetween: 15,
  loop:true,
  autoplay: {
    delay: 5000,
    disableOnInteraction: false, 
  }, 
  
  pagination: {
    el: ".swiper-pagination3",
    clickable:true,
  },

  breakpoints: { 
    450: {
      slidesPerView: 1,
    },
    768: {
      slidesPerView: 2,
    },
  },

}); 