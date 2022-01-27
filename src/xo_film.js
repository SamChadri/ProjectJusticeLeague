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

/* CAROUSEL CODE START 
var image_list = [
    'https://static01.nyt.com/images/2015/09/13/arts/13ELBA2/13ELBA2-articleLarge.jpg?quality=75&auto=webp&disable=upscale',
    'https://c4.wallpaperflare.com/wallpaper/819/363/588/jennifer-aniston-black-and-white-hd-wallpaper-preview.jpg',
    'https://cache.net-a-porter.com/content/images/story-body-content-v1-0-1519750866935.jpeg/w1900_q65.jpeg',
    'https://api.time.com/wp-content/uploads/2013/10/resized-for-lb.jpg',
];

var card_num = 8;

var used_index = [];
var used_images = [];

var timerTestFlag = false;
var cFlag = true;
var hoverId = null;
var hoverWait = true;
var currCardId = null;

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}
var Timer = function(callback, delay) {
    var timerId, start, remaining = delay;
    this.paused = false;
    this.pause = function() {
        window.clearTimeout(timerId);
        timerId = null;
        this.paused = true;
        console.log(`Paused timer with time remaining: ${remaining}`);
    };

    this.resume = function(callback) {
        if (timerId) {
            return;
        }

        start = Date.now();
        timerId = window.setTimeout(callback,remaining);
        console.log(`Resumed timer with time remaining: ${remaining}`);
    };
    this.reset = function(){
        timerId = null;
        remaining = delay;

    }

};
//Make this longer.
var timer = new Timer(function() {
    console.log("Done Waiting!");
}, 2000);

function createImage(src){
    var image = new Image();
    image.src = src;
    return image
}


function fadeOutImage(index, image){
    index += 1;
    console.log(`Fading out: card-image-${index}`);
    //edge case appears here when I leave windows and come back, duplicate images start occurring. Might have to do with hover idk
    //Test this more later when I feel like it.
    used_images.push($(`#card-image-${index}`).attr('src'));
    $(`#card-image-${index}`).fadeOut(600,function(){
        $(`#card-image-${index}`).attr("src", image.src);
        window.setTimeout(function(){
            grid.layout();
        },100)
        $(`#card-image-${index}`).fadeIn(600,function(){
        })

    });

}

function fadeNextImage(){
    var nextPic= createImage(image_list.pop());
    var nextIndex = getRandomInt(card_num);
    console.log("Checking next Index")
    //used_images.push(i)
    //console.log( used_images);
    var elem = {index: nextIndex, image: nextPic}
    var result = used_index.indexOf(nextIndex);
    var counter = 0
    console.log(`result: ${result}`)
    while(result != -1 ){
        console.log('Looping for unique random...')
        nextIndex = getRandomInt(card_num);
        result = used_index.indexOf(nextIndex);
        console.log(result);
        console.log(nextIndex);
        counter += 1;
    }
    console.log("Found valid index")
    fadeOutImage(nextIndex, nextPic);
    used_index.push(nextIndex)
    console.log(used_index)
    //console.log(`NextIndex: ${nextIndex}`);
    //console.log(`NextPic: ${nextPic}`);

}
//Add image ID to tag so that I can track it using React.
async function startGridCarousel(){
    console.log('Starting carousel')
    console.log(`Used_Images: ${used_index}`)
    list_length = image_list.length
    console.log(image_list);

    while(cFlag){
        if(card_num == used_index.length){
            console.log('Resetting index list...')
            used_index= [];
        }
        if(image_list.length == 0){
            image_list = used_images;
            used_images = [];
            //flag = false;
            console.log('Resetting Image list...');
            console.log(image_list)
        }
        if(!timer.paused){
            fadeNextImage();
        }
        await new Promise(r => {
            timer.resume(r);
        });
        timer.reset();
        console.log("Faded image and waited.");
    }
}

//Gotta worry about sizing when absolute positioning which is a pain and fixed sizes kinda destroy defeat the point
var temp_image = new Image();
temp_image.src = "https://c4.wallpaperflare.com/wallpaper/238/241/106/shakira-singer-grayscale-of-woman-wallpaper-preview.jpg";
temp_image.id= 'new_image';

$('#g-test').click(function(){
    if(!timer.paused){
        timer.pause()
        cFlag = false;
    }else{
        cFlag = true;
        timer.paused = false;
        startGridCarousel();
    }
});


$('.artist-card').hover(
    function(){
        console.log("Setting mouse hover over image")
        hoverId = window.setTimeout(function(){
            if(!timer.paused){
                timer.pause()
                cFlag = false;
                hoverWait = false;
                console.log("Executing timeout")
            }
        },500)

    },
    function(){
        if(timer.paused && hoverWait == false){
            cFlag = true;
            timer.paused = false;
            hoverWait = null;
            console.log("Finished timeout, resuming carousel.");
            //startGridCarousel();
            return
        }else {
            window.clearTimeout(hoverId)
            console.log("Did not finish timeout, not resuming carousel.");
            hoverId = null;
            hoverWait = true;
            return

        }

    }
);

 CAROUSEL CODE END */

    

 

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