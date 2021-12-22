$(document).ready(function(){
    $('.album-carousel').slick({
        dots: true,
        slidesToShow: 3,
        arrows: true,
        centerMode: true,

    });
    $('.album-carousel').slick('refresh');

    $('.carousel').slick({
        slidesToShow: 1,
        dots:true,
        centerMode: true,
        arrows: true,
        });

    var grid = new Masonry( '#grid', {
        percentPosition: true
    });
    //keep a list of images
    //(needs the least amount of images/prolly do this) option 1: "randomly" add a new image and then fade and layout keeping track of previous tiles
    //option 2: dynamically add backup images to all tiles and then randomly choose to fade and layout and layout keeping track of previous tiles
    //option 3: statically keep a list of images within html for all images, then randomly fade and layout, while keeping track of previous changes
    //(need alot of images, and randomness is a bit weird) option 4: statically add images then use slick for transitioning
    $('#test-card').click(function(){
        document.getElementById("test-card").src="https://c4.wallpaperflare.com/wallpaper/238/241/106/shakira-singer-grayscale-of-woman-wallpaper-preview.jpg";
        window.setTimeout(function(){
            grid.layout();
        }, 100);
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
