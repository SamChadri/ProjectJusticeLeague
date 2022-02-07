$(document).ready(function(){
    
    $('.media-carousel').slick({
        dots: true,
        slidesToShow: 1,
        arrows: true,
        infinite: true,



    });
    console.log( $(`#cc-card-2`).children(':first').attr("id"));
    var newImage = new Image();
    newImage.src = '../pics/XO_RussoBros.jpeg';
    console.log(newImage.height)
    var height = newImage.getAttribute('height')  * .5
    newImage.setAttribute('height', height) 
    newImage.onload = function() {
        console.log(this.naturalHeight);
        var width = document.getElementById('card-image-1').clientWidth;
        console.log(`Client Width: ${width}`);
        var naturalWidth = this.naturalWidth;
        var naturalHeight = this.naturalHeight;

        console.log(`Natural Width: ${naturalWidth}`);
        var ratio = naturalHeight / naturalWidth;
        console.log(`Ratio: ${ratio}`);
        var nHeight = width * ratio
        $('#test-button').click(function(){
            $("#card-image-1").parent().animate({
                opacity: `0`
            }, 500, function(){
                $("#card-image-1").animate({
                    height: `${nHeight}px`
                }, 700, function(){
                    $(`#card-image-1`).attr("src", newImage.src);
                    $("#card-image-1").parent().animate({opacity: '1'},500);
                });

            });

        });
    }
    console.log(newImage.naturalHeight)
    


    $('.cast-carousel').flickity({
        cellAlign: 'left',
        wrapAround: true,
        pageDots: false,
        prevNextButtons: false,
    });

    var card_elems = $('.acard-image');
    console.log(card_elems);
    for(let i =0; i < card_elems.length; i++){
        var img = new Image();
        img.src = card_elems[i].src;
        var height = .5 * img.height;
        console.log(img);
        console.log(card_elems[i].parentElement);
        console.log(img.height);
        card_elems[i].parentElement.setAttribute('style',`height:${height}px`);
        card_elems[i].parentElement.style.width = img.width;
        console.log(card_elems[i].parentElement.style.height)
    }
/*
    var $carousel= $('.movie-carousel').flickity({
        // options
        cellAlign: 'center',
        wrapAround: true,
        imagesLoaded: true,
        percentPosition: false, 
      });*/
      $('.nav-carousel').flickity({
        asNavFor: '.movie-carousel',
        contain: true,
        pageDots: false,
        prevNextButtons: false,
      });



    

 

console.log($('.navbar').height())



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