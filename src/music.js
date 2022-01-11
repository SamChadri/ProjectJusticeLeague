import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import Button from 'react-bootstrap/Button';
import ReactDOMServer from 'react-dom/server';


import styles from './xo_music.css'
const title = 'React with Webpack and Babel';
let instanceCounter = 0;
let vidItems = 4;

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

class VidContainer extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            id: 1,
            items:[
                {'id': 1, 'video_code': '../pics/XO_MUSIC_TRAILER_MP4.mp4', 'local': true},
                {'id': 2, 'video_code': 'gSOFQN0UKpk', 'local': false},
                {'id': 3, 'video_code': 'K9l8wmyfKDU', 'local': false},
                {'id': 4, 'video_code': '../pics/XO_NIKE_TRAILER.mp4', 'local': true},
            ],
            playerState: 'PAUSED',
            showVid: false
        }
        this.handleClick = this.handleClick.bind(this);
    }
  
    createLocalVideo(width, height, src, id){
      var video = document.createElement('video');
      var source = document.createElement('source');
  
      source.type = 'video/mp4';
      source.src = src
  
      video.setAttribute("controls", "controls");
      video.height = height;
      video.width = width;
      video.id = id
      video.style.objectFit = 'fill';
  
      video.appendChild(source)
      return video
    }
  
    componentDidMount(){
      instanceCounter += 1;

      this.setState(function(state, props) {
        return {
          id: instanceCounter,
        };
      });
      console.log(`Mounting ID: ${this.state.id}`);
    }
  
  
    handleClick(){
      //Change this later if removing local videos
      var vidItem = this.state.items[this.state.id -1];
      var num_id = vidItem.id;
      var id = `vdiv-${num_id}`;
      var pic_id = `fpic-${num_id}`;
      var vid_id = `vid-${num_id}`;
      var fheight = $(`#${pic_id}`).height();
      var fwidth = $(`#${pic_id}`).width();
      console.log(id);
      
      if(vidItem.local){
        var video = this.createLocalVideo(fwidth, fheight, vidItem.video_code, vid_id);
        var vidContainer = document.getElementById(id)
        vidContainer.innerHTML = video.outerHTML;
        this.setState(function(state, props) {
          document.getElementById(vid_id).play();
          return {
            playerState: 'PLAYING'
          };
        });
        
        vidContainer.addEventListener('mouseenter', e => {
          if (this.state.playerState == 'PAUSED'){
            console.log('PLaying Video');
            this.setState(function(state, props) {
              document.getElementById(vid_id).play();
              return {
                playerState: 'PLAYING'
              };
            });
          }
        });
        vidContainer.addEventListener('mouseleave', e => {
          if (this.state.playerState == 'PLAYING'){
            console.log('Pausing Video');
            this.setState(function(state, props) {
              document.getElementById(vid_id).pause();
              return {
                playerState: 'PAUSED'
              };
            });
          }
        });
      }else{
        console.log(`id is : ${this.state.id}`);
        var player = new YT.Player(id, {
          height: fheight,
          width: fwidth,
          host:`${window.location.protocol}//www.youtube.com`,
          videoId: vidItem.video_code,//TrailerCode Goes here,
          events: {
              'onReady': onPlayerReady,
              'onStateChange': onPlayerStateChange
          }
      });
  
      }
  
    }
  
    
  
    render(){
  
        return(
            <Button id={`bf-${this.state.id}`} onClick={this.handleClick} variant="outline-light" style={{borderRadius:'50%'}}  type="button" className="feature-button">
                <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" fill="currentColor" className="bi bi-play" viewBox="0 0 16 16">
                    <path d="M10.804 8 5 4.633v6.734L10.804 8zm.792-.696a.802.802 0 0 1 0 1.392l-6.363 3.692C4.713 12.69 4 12.345 4 11.692V4.308c0-.653.713-.998 1.233-.696l6.363 3.692z"/>
                </svg>
            </Button>

  
        );
  
    }
  }

  for(let i=1; i< vidItems + 1; i++){
    ReactDOM.render(
        <VidContainer/>,
        document.getElementById(`vdiv-${i}`)
      );
      
  }

  let spotifyCounter = 0;
  let spotifyItems = 10;

  class SpotifyContainer extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            id: 1,
            items:[
                {'id': 1, 'spotify_code': '2nLOHgzXzwFEpl62zAgCEC', 'showPlayer': true},
                {'id': 2, 'spotify_code': '5B6W3GmGmcCktXVFLfOsfI', 'showPlayer': true},
                {'id': 3, 'spotify_code': '06nzu940k6jhkJ5TacM6y5', 'showPlayer': true},
                {'id': 4, 'spotify_code': '6tJKIc90Q5FuHbAWsrBPkI', 'showPlayer': true},
                {'id': 5, 'spotify_code': '39hdawySriH7efjFpv9v3q', 'showPlayer': true},
                {'id': 6, 'spotify_code': '2Wiyo7LzdeBCsVZiRA6vVZ', 'showPlayer': true},
                {'id': 7, 'spotify_code': '4cGY0jqWYTCIPwQRXHgKvy', 'showPlayer': true},
                {'id': 8, 'spotify_code': '59Y3t7Q4Vf8pw8STJ6fogW', 'showPlayer': true},
                {'id': 9, 'spotify_code': '32nTKqfSS7ONFEdwV6mVjY', 'showPlayer': true},
                {'id': 10, 'spotify_code': '26LTl351R5RC8NwHJkGV6P', 'showPlayer': true},





            ],
            playerState: 'PAUSED',
            currCode: '',
            showPlayer: true,
        }
        this.handleClick = this.handleClick.bind(this);
    }
    componentDidMount(){
        spotifyCounter += 1;
        var code = this.state.items[spotifyCounter -1].spotify_code;
        var show = this.state.items[spotifyCounter -1].showPlayer;
        this.setState(function(state, props) {
          return {
            id: spotifyCounter,
            currCode: code,
            showPlayer: false
          };
        });
        console.log(`Mounting ID: ${this.state.id}`);
    }
    componentDidUpdate(prevProps, prevState) {
        
        
        console.log(`component: ${this.state.id} updated....`);
    }

    
    handleClick(){
        //tested it not the problem.
        var id = `adiv-${this.state.id}`
        var albumContainer = document.getElementById(id);
        var content = ReactDOMServer.renderToStaticMarkup(
                        <iframe src={`https://open.spotify.com/embed/album/${this.state.currCode}?utm_source=generator`} width="100%" height="100%" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"></iframe>
                    )
        //albumContainer.innerHTML = content;   
        
        this.setState(function(state, props){
            return{
                showPlayer: true,
            };
        });
        
    }

    render(){
        const showPlayer = this.state.showPlayer;
        let content;
        console.log(`Show Player ${showPlayer}`)
        if (showPlayer){
            content =  <iframe src={`https://open.spotify.com/embed/album/${this.state.currCode}?utm_source=generator`} width="100%" height="100%" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"></iframe>

        }else{
            content =<Button id={`sb-${this.state.id}`} onClick={this.handleClick} variant="outline-light"  type="button" className="album-button">
                        <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" class="bi bi-spotify" viewBox="0 0 16 16">
                            <path d="M8 0a8 8 0 1 0 0 16A8 8 0 0 0 8 0zm3.669 11.538a.498.498 0 0 1-.686.165c-1.879-1.147-4.243-1.407-7.028-.77a.499.499 0 0 1-.222-.973c3.048-.696 5.662-.397 7.77.892a.5.5 0 0 1 .166.686zm.979-2.178a.624.624 0 0 1-.858.205c-2.15-1.321-5.428-1.704-7.972-.932a.625.625 0 0 1-.362-1.194c2.905-.881 6.517-.454 8.986 1.063a.624.624 0 0 1 .206.858zm.084-2.268C10.154 5.56 5.9 5.419 3.438 6.166a.748.748 0 1 1-.434-1.432c2.825-.857 7.523-.692 10.492 1.07a.747.747 0 1 1-.764 1.288z"/>
                        </svg>
                    </Button>
        }

        return(
            <>
                {content}
           </>

  
        );
  
    }
  }
  for(let i=1; i< spotifyItems + 1; i++){
    ReactDOM.render(
        <SpotifyContainer/>,
        document.getElementById(`adiv-${i}`)
      );
      
  }
