$(document).ready(function(){
    
    $('.media-carousel').slick({
        dots: true,
        slidesToShow: 1,
        arrows: true,
        infinite: true,



    });

    $('.cast-carousel').flickity({
        cellAlign: 'left',
        wrapAround: true,
        pageDots: false
    });

    var $carousel= $('.movie-carousel').flickity({
        // options
        cellAlign: 'center',
        wrapAround: true,
        imagesLoaded: true,
        percentPosition: false, 
      });
      $('.nav-carousel').flickity({
        asNavFor: '.movie-carousel',
        contain: true,
        pageDots: false
      });

    


    $carousel.on( 'select.flickity', function( event, index ) {
        var img = $imgs[index];
        img.addClass('movie-slideNew');
    });


    //Maybe another smaller slider on the bottom or maybe on both sides
    //flickr: https://flickity.metafizzy.co/api.html

    $(window).scroll(function() {
        var scrollBottom = window.scrollY + window.innerHeight;
        if($(this).scrollTop() > 500) { 
            $('.navbar').addClass('nav-trans');
        } else {
            $('.navbar').removeClass('nav-trans');
        }
    
    
    });
});