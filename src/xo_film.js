$(document).ready(function(){
    /*
    $('.movie-carousel').slick({
        dots: true,
        slidesToShow: 3,
        slidesToScroll: 1,
        arrows: true,
        centerMode: true,
        infinite: true,
        centerPadding: '30px',



    });
*/
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

    
    var $imgs = $carousel.find('.movie-slide img');
    // get transform property
    var docStyle = document.documentElement.style;
    var transformProp = typeof docStyle.transform == 'string' ?
        'transform' : 'WebkitTransform';
    // get Flickity instance
    var flkty = $carousel.data('flickity');
    
    $carousel.on( 'scroll.flickity', function() {
        flkty.slides.forEach( function( slide, i ) {
        var img = $imgs[i];
        var x = ( slide.target + flkty.x ) * -1/3;
        });
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