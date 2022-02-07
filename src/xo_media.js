$(document).ready(function(){
    
    $('.media-carousel').slick({
        dots: true,
        slidesToShow: 1,
        arrows: true,
        infinite: true,



    });
    $(window).scroll(function() {
        var scrollBottom = window.scrollY + window.innerHeight;
        if($(this).scrollTop() > 500) { 
            $('.navbar').addClass('nav-trans');
        } else {
            $('.navbar').removeClass('nav-trans');
        }
    
    
    });
});