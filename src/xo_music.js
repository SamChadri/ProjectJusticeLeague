$(document).ready(function(){
    $('.album-carousel').slick({
        dots: true,
        slidesToShow: 3,
        arrows: true,
        centerMode: true,

    });
    $('.album-carousel').slick('refresh');

    $('.media-carousel').slick({
        slidesToShow: 1,
        dots:true,
        arrows: true,
        fade: true,
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
        'https://static01.nyt.com/images/2018/05/08/opinion/08Hampton1/08Hampton1-videoSixteenByNineJumbo1600.jpg',
        'https://i.pinimg.com/originals/0d/a1/fb/0da1fbc2544a74f7d7c016746439cfd0.jpg'
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
                startGridCarousel();
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

    $('#card-image-3').click(function(){
        //NOTE: hover to start
       // startGridCarousel();
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
    var featurette_height = $('.feature-pic').height();
    var featurette_width = $('.feature-pic').width();
    var player_ready = false;
    var player_state = 'PLAYING';

   // $('#bf-1').click(function(){ playerButtonOnClick(this,true); });
   // $('#bf-2').click(function(){ playerButtonOnClick(this,false); });
   // $('#bf-3').click(function(){ playerButtonOnClick(this,false); });
   // $('#bf-4').click(function(){ playerButtonOnClick(this,true); });

    function onPlayerReady(event){
        var id = event.target.getIframe().id;
        var num_id = id.substring(id.length - 1);
        console.log('Playing video');
        console.log(event.target);
        event.target.playVideo();
        $(`#${id}`).hover(
            function(){
                if (event.target.getPlayerState() == YT.PlayerState.PAUSED){
                    event.target.playVideo();
                }
            },
            function(){
                if(event.target.getPlayerState() == YT.PlayerState.PLAYING){
                    event.target.pauseVideo();
                }
            });
    }
    function onPlayerStateChange(event){}

    function createLocalVideo(width, height, id=null){
        var video = document.createElement('video');
        var source = document.createElement('source');

        source.type = 'video/mp4';
        source.src = '../pics/XO_MUSIC_TRAILER_MP4.mp4';

        video.autoplay = true;
        if(id == '1'){
            source.src = '../pics/XO_MUSIC_TRAILER_MP4.mp4';
        }else{
            source.src = '../pics/XO_GEMS_I.mp4';
        }
        video.setAttribute("controls", "controls");
        video.height = height;
        video.width = width;
        video.style.objectFit = 'fill';

        video.appendChild(source)
        return video
    }

    function playerButtonOnClick(curr_obj, local_vid){
        //TODO: Add in functionality for React later on.
        
        var id = $(curr_obj).attr('id');
        var num_id = id.substring(id.length - 1);
        id = `vdiv-${num_id}`;
        var pic_id = `fpic-${num_id}`;
        var fheight = $(`#${pic_id}`).height();
        var fwidth = $(`#${pic_id}`).width();
        console.log(`Height: ${fheight}, `);
        console.log(`Width: ${fwidth}`);
        if (local_vid == true){
            var video = createLocalVideo(fwidth, fheight, num_id);
            $(`#${id}`).html(video);
            player_state = 'PLAYING';
            $(`#${id}`).hover(
                function(){
                    if (player_state == 'PAUSED'){
                        video.play();
                        player_state = 'PLAYING';
                    }
                },
                function(){
                    if(player_state == 'PLAYING'){
                        video.pause();
                        player_state = 'PAUSED';
                    }
                });
            
        }else{
            console.log(id);
            if (id == 'vdiv-2'){
                videoId = 'gSOFQN0UKpk';
            }else{
                videoId = 'D7nj1mPkLzc';
            }  
            var player = new YT.Player(id, {
                height: fheight,
                width: fwidth,
                host:`${window.location.protocol}//www.youtube.com`,
                videoId: videoId,//TrailerCode Goes here,
                events: {
                    'onReady': onPlayerReady,
                    'onStateChange': onPlayerStateChange
                }
            });

        }
    }
    


    $(window).scroll(function() {
        var scrollBottom = window.scrollY + window.innerHeight;
        if($(this).scrollTop() > 500) { 
            $('.navbar').addClass('nav-trans');
        } else {
            $('.navbar').removeClass('nav-trans');
        }
    
    
    });

});
