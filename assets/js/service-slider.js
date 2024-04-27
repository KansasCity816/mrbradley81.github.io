/*--------------- Service Slider ---------------*/ 
var swiper = new Swiper(".service-slider", {

  spaceBetween: 10, // Space between slides
  loop:true, // Enable looping of slides

  autoplay: {
    delay: 5000, // Delay between slide transitions
    disableOnInteraction: false, // Allow autoplay on user interaction
  },
 
  breakpoints: {
    450: {
      slidesPerView: 1,
    },
    768: {
      slidesPerView: 2,
    },
    990: {
      slidesPerView: 3,
    },
  },

}); 
  