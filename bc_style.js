$(document).ready(function(){
    // Transition effect for navbar 
    $('#bf-1').click(function(){ playerButtonOnClick(this,true); });
    $('#bf-2').click(function(){playerButtonOnClick(this,false)})
    var vk_visible = true;

    var featurette_height = $('.feature-pic').height();
    var featurette_width = $('.feature-pic').width();
    var player_ready = false;
    var player_state = 'PLAYING';
    window.onYouTubeIframeAPIReady = function() {
        player_ready = true;
        console.log('PlayerReady')
    }

    function onPlayerReady(event){
        var id = event.target.getIframe().id;
        var num_id = id.substring(id.length - 1);
        console.log('Playing video');
        console.log(event.target);
        event.target.playVideo();
        $("#vid-test2").hover(
            function(){
                if (player_state == 'PAUSED'){
                    event.target.playVideo();
                    player_state = 'PLAYING';
                }
            },
            function(){
                if(player_state == 'PLAYING'){
                    event.target.pauseVideo();
                    player_state = 'PAUSED';
                }
            });
    }
    function onPlayerStateChange(event){}

    function createLocalVideo(width, height){
        var video = document.createElement('video');
        var source = document.createElement('source');

        source.type = 'video/mp4';
        source.src = 'XO_TRAILER20.mp4';

        video.autoplay = true;
        video.setAttribute("controls", "controls");
        video.height = height;
        video.width = featurette_width;
        video.style.objectFit = 'fill';

        video.appendChild(source)
        return video
    }


    function playerButtonOnClick(curr_obj, local_vid){
        //TODO: Add in functionality for React later on.
        
        var id = $(curr_obj).attr('id');
        var fheight = $('.feature-pic').height();
        var fwidth = $('.feature-pic').width();
        console.log(`Height: ${fheight}, `);
        console.log(`Width: ${fwidth}`);
        if (local_vid == true){
            var video = createLocalVideo(fwidth, fheight);
            $('#vid-test').html(video);
            player_state = 'PLAYING';
            $("#vid-test").hover(
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
            var player = new YT.Player('vid-test2', {
                height: fheight,
                width: fwidth,
                host:`${window.location.protocol}//www.youtube.com`,
                videoId: '1ZHTurVaGus',//TrailerCode Goes here,
                events: {
                    'onReady': onPlayerReady,
                    'onStateChange': onPlayerStateChange
                }
            });

        }




        /*
        var num_id = id.substring(id.length - 1);
        console.log(`Button id: ${id}, num_id: ${num_id}, image_${num_id}`);
        console.log(`Protocal:${window.location.protocol}`);
        console.log(`PlayerReady: ${player_ready}`);
        var player = new YT.Player(id, {
            height: featurette_height,
            width: featurette_width,
            host:`${window.location.protocol}//www.youtube.com`,
            videoId: 'PSz5I8mcDmk',//TrailerCode Goes here,
            events: {
                'onReady': onPlayerReady,
                'onStateChange': onPlayerStateChange
            }
        });*/
    }
    /*Deal with edge cases for fast strolling later */
    var counter = 1;
    var av_counter = 0
    var observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                let elem = entry.target;
                var timeout = counter * 100;
                window.setTimeout(function(){
                    if(elem.tagName == 'HR'){
                        elem.classList.add('zoom-in-ani');
                        timeout = 0;
                    }else{
                        elem.classList.add('fade-in-ani');

                    }
                    console.log(elem.tagName)
                    elem.style.visibility = 'visible';
                },timeout)
                counter += 1;
            
            }else{
                let elem = entry.target;
                if(elem.tagName == 'HR'){
                    elem.classList.remove('zoom-in-ani');
                }else{
                    elem.classList.remove('fade-in-ani');
                }
                elem.style.visibility = 'hidden';
                counter = 0;
            }
        });
    },);

    var av_observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                let elem = entry.target;
                var timeout = av_counter * 1000;
                window.setTimeout(function(){
                    elem.classList.add('fade-in-ani');
                    elem.style.visibility = 'visible';
                },timeout);
                av_counter += 1;
                console.log(`intersecting entry: ${counter}`)

            
            }else{
                console.log('not_intersecting')
                let elem = entry.target;
                elem.classList.remove('fade-in-ani');
                elem.style.visibility = 'hidden';
                av_counter = 0;
            }
        });
    },);

    var intro_kids = $('#d-intro').children();
    for(let i =0; i < intro_kids.length; i++){
        observer.observe(intro_kids[i]);
    }
    var avenue_kids = $('#d-avenues').children();
    for(let i =0; i < avenue_kids.length; i++){
        av_observer.observe(avenue_kids[i]);
    }
    //observer.observe(document.querySelector("#d-intro"));


    
    $(window).scroll(function() {
        // checks if window is scrolled more than 500px, adds/removes solid class
        //add some flags in here so it doesn't keep adding stuff
        var scrollBottom = window.scrollY + window.innerHeight;
        if($(this).scrollTop() > 500) { 
            $('.navbar').addClass('nav-trans');
        } else {
            $('.navbar').removeClass('nav-trans');
        }
        /*
        if(scrollBottom > $('#d-content').offset().top){
            var intro_kids = $('#d-intro').children();
            $('#d-intro').css('visibility', 'visible');
            for(let i = 0; i < intro_kids.length; i++){
                var timeout = i * 300;
                if(scrollBottom > intro_kids[i].offsetTop){
                    window.setTimeout(function(){
                        intro_kids[i].classList.add('fade-in-ani');
                        intro_kids[i].style.visibility = 'visible';
                    },timeout);
                }

            }
            var avenue_kids = $('#d-avenues').children();
            for(let i = 0; i < avenue_kids.length; i++){
                var timeout = i * 1000;
                var position = avenue_kids[i].getBoundingClientRect();
                if(position.top < window.innerHeight && position.bottom >= 0){
                    window.setTimeout(function(){
                        avenue_kids[i].classList.add('fade-in-ani');
                        avenue_kids[i].style.visibility = 'visible';
                        console.log(`error:, scrollBottom: ${scrollBottom} offsetTop;${position}`)
                        console.log

                    },timeout);
                }
            }
            vk_visible = true
        }else{
            var intro_kids = $('#d-intro').children();
            for(let i = 0; i < intro_kids.length; i++){
                intro_kids[i].style.visibility = 'hidden';
                intro_kids[i].classList.remove('fade-in-ani');
            }
            var avenue_kids = $('#d-avenues').children();
            for(let i = 0; i < avenue_kids.length; i++){
                console.log(`Removing avenue kids, Length: ${avenue_kids.length}`);
                avenue_kids[i].style.visibility = 'hidden';
                avenue_kids[i].classList.remove('fade-in-ani');
            }
            vk_visible = false;


        }
        */
    });
    

});
