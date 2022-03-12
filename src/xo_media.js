$(document).ready(function(){
    
    $('.media-carousel').slick({
        dots: true,
        slidesToShow: 1,
        arrows: true,
        infinite: true,



    });


    function transitionImage(){
        
        $(`.top-image`).fadeOut(600, function(){
            for(let i=1;i<4; i++){
                var z_index = parseInt($(`#d-image-${i}`).css("z-index"));
                if(z_index == 3){
                    $(`#d-image-${i}`).css("z-index",`1`);
                    $(`#d-image-${i}`).addClass("bottom-image");
                    $(`#d-image-${i}`).removeClass("top-image");

                }else{
                    var new_z_index = z_index + 1;
                    $(`#d-image-${i}`).css("z-index",`${new_z_index}`);
                    if(new_z_index == 3){
                        $(`#d-image-${i}`).addClass("top-image");
                    }else{
                        $(`#d-image-${i}`).removeClass("bottom-image");
                    }
                }
            }
            $(`.bottom-image`).fadeIn(600);

        });
        

    }
    $('#test-button').click(function(){
        transitionImage();
    })

    //$(`#test-button`).click(transitionImage());

    $(window).scroll(function() {
        var scrollBottom = window.scrollY + window.innerHeight;
        if($(this).scrollTop() > 500) { 
            $('.navbar').addClass('nav-trans');
        } else {
            $('.navbar').removeClass('nav-trans');
        }
    
    
    });
    var $tvCarousel = $('.tv-carousel').flickity({
        cellAlign: 'left',
        wrapAround: true,
        pageDots: false
    });
});