$(document).ready(function(){
    // Transition effect for navbar 
    $('#bf-1').click(function(){ playerButtonOnClick(this); });

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


    function playerButtonOnClick(curr_obj){
        //TODO: Add in functionality for React later on.
        var id = $(curr_obj).attr('id');
        var fheight = $('.feature-pic').height();
        var fwidth = $('.feature-pic').width();
        console.log(`Height: ${fheight}, `);
        console.log(`Width: ${fwidth}`);
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

    
    $(window).scroll(function() {
        // checks if window is scrolled more than 500px, adds/removes solid class
        if($(this).scrollTop() > 500) { 
            $('.navbar').addClass('nav-trans');
        } else {
            $('.navbar').removeClass('nav-trans');
        }
    });
    

});
