
$(document).ready(function () {
    $(".owl-carousel").owlCarousel();
});

$('.owl-carousel').owlCarousel({
    loop: false,
    margin: 10,
    nav: false,
    dots : false,
    responsiveClass: true,
    responsive: {
        0: {
            items: 1,
            margin: 10,
        },
        843: {
            items: 1,
        },
        1000: {
            items: 3,
        },
        1500: {
            items: 4,
        },
        2000: {
            items: 5,
        }
    }
})