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

    var image_list = [
        'https://theglobal-post.com/wp-content/uploads/2021/01/5ea30d348dcb7.image_.jpg',
        'https://cdn.wallpapersafari.com/37/29/4lR2sb.jpg',
        'https://d18ufwot1963hr.cloudfront.net/wp-content-production/uploads/2021/03/Web_Photo_Editor-14.png',
        'https://w0.peakpx.com/wallpaper/254/789/HD-wallpaper-black-and-white-of-j-balvin-is-facing-one-side-wearing-rings-and-having-tattoos-on-hands-music.jpg',
        'https://cdn.wallpapersafari.com/63/25/QWLRut.jpg',
        'https://wp.stanforddaily.com/wp-content/uploads/2021/05/JCole.png',
        'https://www.billboard.com/wp-content/uploads/2021/11/adele-2021-billboar-1548.jpg',
        'https://static01.nyt.com/images/2018/05/08/opinion/08Hampton1/08Hampton1-videoSixteenByNineJumbo1600.jpg'
    ];

    var card_num = 8;

    var used_index = [];
    var used_images = [];
    function getRandomInt(max) {
        return Math.floor(Math.random() * max);
    }

    function createImage(src){
        var image = new Image();
        image.src = src;
        return image
    }


    function fadeOutImage(index, image){
        index += 1;
        console.log(`Fading out: card-image-${index}`)
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

    async function startGridCarousel(){
        console.log('Starting carousel')
        console.log(`Used_Images: ${used_index}`)
        list_length = image_list.length
        console.log(image_list);
        var flag = true;
        while(flag){
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
            fadeNextImage()
            await new Promise(r => setTimeout(r, 2000));
            console.log("Faded image and waited. Processing next image...");
        }
    }

    //Gotta worry about sizing when absolute positioning which is a pain and fixed sizes kinda destroy defeat the point
    var temp_image = new Image();
    temp_image.src = "https://c4.wallpaperflare.com/wallpaper/238/241/106/shakira-singer-grayscale-of-woman-wallpaper-preview.jpg";
    temp_image.id= 'new_image';

    $('#card-image-3').click(function(){
        startGridCarousel();
        var test = [1,2,3,4];
        console.log(test)
        test.push(123);
        console.log(test);
        /*
        $('#test-card').fadeOut(600,function(){
            $('#test-card').attr("src", temp_image.src);
            window.setTimeout(function(){
                grid.layout();
            },200)
            $('#test-card').fadeIn(600,function(){

            })

        
        });*/








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
