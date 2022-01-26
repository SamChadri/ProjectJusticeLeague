import React, { useState }  from 'react';
import ReactDOM from 'react-dom';
import Button from 'react-bootstrap/Button';
import ReactDOMServer from 'react-dom/server';
import { Offcanvas} from "react-bootstrap";


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
                {'id': 2, 'video_code': 'qqGsOVDj2K0', 'local': false},
                {'id': 3, 'video_code': 'R6NF49HeiaU', 'local': false},
                {'id': 4, 'video_code': '../pics/XO_B_LMYB.mp4', 'local': true},
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

let acardCounter = 0;
let artistCards = 8;

class ArtistCard extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            id: 1,
            items:[
                {
                    'id': 1,
                    'name':'Hans Zimmer',
                    'occupation': 'Film Score Composer',
                    'description':"Hans Florian Zimmer is a German film score composer and record producer. His works are notable for integrating electronic music sounds with traditional orchestral arrangements. Since the 1980s, Zimmer has composed music for over 150 films.",
                    'demo_url':'https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/179526871&color=%23ffb3de&auto_play=false&hide_related=true&show_comments=false&show_user=false&show_reposts=false&show_teaser=false&visual=true'
                },
                {
                    'id': 2,
                    'name':'Drake',
                    'occupation': 'Rapper Songwriter',
                    'description':"Aubrey Drake Graham is a Canadian rapper, singer, and actor. Gaining recognition by starring in the teen drama series Degrassi: The Next Generation, Drake pursued a career in music releasing his debut mixtape Room for Improvement in 2006; he subsequently released the mixtapes Comeback Season (2007) and So Far Gone (2009) before signing with Young Money Entertainment.",
                    'demo_url': 'https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/396615804&color=%23ffb3de&auto_play=false&hide_related=true&show_comments=false&show_user=false&show_reposts=false&show_teaser=true&visual=true',
                },
                {
                    'id': 3,
                    'name':'Shakira',
                    'occupation': 'Singer Songwriter',
                    'description':"Shakira Isabel Mebarak Ripoll, known mononymously as Shakira, is a Colombian singer and songwriter. Born and raised in Barranquilla, Shakira has been referred to as the 'Queen of Latin Music'and is noted for her versatility in music.",
                    'demo_url': 'https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/140377856&color=%23ffb3de&auto_play=false&hide_related=true&show_comments=false&show_user=false&show_reposts=false&show_teaser=false&visual=true',
                },

                {
                    'id': 4,
                    'name':'Beyoncé',
                    'occupation': 'Singer Songwriter',
                    'description':"Beyoncé Giselle Knowles-Carter is an American singer, songwriter, and actress. Born and raised in Houston, Texas, Beyoncé performed in various singing and dancing competitions as a child. She rose to fame in the late 1990s as the lead singer of Destiny's Child, one of the best-selling girl groups of all time.",
                    'demo_url': 'https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/125172547&color=%23ffb3de&auto_play=false&hide_related=true&show_comments=true&show_user=false&show_reposts=false&show_teaser=false&visual=true',
                },
                {
                    'id': 5,
                    'name':'Chris Brown',
                    'occupation': 'Singer Songwriter',
                    'description':"Christopher Maurice Brown is an American singer, songwriter, dancer and actor. According to Billboard, Brown is one of the most influential and successful R&B singers ever, with several considering him the 'King of R&B' alongside Usher and R. Kelly.",
                    'demo_url': 'https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/247978957&color=%23ffb3de&auto_play=false&hide_related=true&show_comments=false&show_user=false&show_reposts=false&show_teaser=false&visual=true',
                },
                {
                    'id': 6,
                    'name':'Bryson Tiller',
                    'occupation': 'Singer Songwriter',
                    'description':"Bryson Djuan Tiller is an American singer, songwriter and rapper. Born in Louisville, Kentucky, he began his career in 2011 with a mixtape entitled Killer Instinct Vol. 1. Tiller initially gained mainstream success in 2015 following the release of the single, 'Don't', which reached the top 20 on the Billboard Hot 100.",
                    'demo_url': 'https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/322173885&color=%23ffb3de&auto_play=false&hide_related=true&show_comments=false&show_user=false&show_reposts=false&show_teaser=false&visual=true',
                },
                {
                    'id': 7,
                    'name':'Col3trane',
                    'occupation': 'Singer Songwriter',
                    'description':"Col3trane aka. Cole Basta is an American singer and song-writer. He is famous for his genre R&B and Dance/ Electric. He recently released his song Penelope in association with COLORS SHOW.",
                    'demo_url': 'https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/708454342&color=%23ffb3de&auto_play=false&hide_related=true&show_comments=false&show_user=false&show_reposts=false&show_teaser=false&visual=true',
                },
                {
                    'id': 8,
                    'name':'Chris Webby',
                    'occupation': 'Rapper Songwriter',
                    'description':"Known Christian Walcott Webster, better known by his stage name Chris Webby, is an American rapper from Norwalk, Connecticut. Chris Webby has released many mixtapes such as the DJ Drama-hosted Bars On Me and his EP There Goes the Neighborhood, which peaked at number 101 on the Billboard 200.",
                    'demo_url': 'https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/1188656497&color=%23ffb3de&auto_play=false&hide_related=true&show_comments=false&show_user=false&show_reposts=false&show_teaser=false&visual=true',
                },
                

            ],
            showInfo: false,
            curr_item:
                {
                    'id': 1,
                    'name':'Beyoncé',
                    'occupation': 'Singer-Songwriter',
                    'description':"Beyoncé Giselle Knowles-Carter is an American singer, songwriter, and actress. Born and raised in Houston, Texas, Beyoncé performed in various singing and dancing competitions as a child. She rose to fame in the late 1990s as the lead singer of Destiny's Child, one of the best-selling girl groups of all time.",
                    'demo_url': 'https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/125172547&color=%23ffb3de&auto_play=false&hide_related=true&show_comments=false&show_user=false&show_reposts=false&show_teaser=false&&player_type=tiny',
                }
        }

        this.handleClick = this.handleClick.bind(this);
        this.handleShow = this.handleShow.bind(this);
        this.handleClose = this.handleClose.bind(this);
        
    }


    componentDidMount(){
        acardCounter += 1;
        var item = this.state.items[acardCounter - 1];
        this.setState(function(state, props){
            return{
                curr_item: item,
            };
        });


    }

    handleClick(){
        $(`.acard-info`).fadeOut(600);
        this.setState(function(state, props){
            return{
                showInfo: true,
            };
        });
        $(`.acard-info`).fadeIn(600);

    }

    handleShow(){
        this.setState(function(state, props){
            return{
                showInfo: true,
            };
        });
    }

    handleClose(){
        this.setState(function(state, props){
            return{
                showInfo: false,
            };
        });

    }


    render(){
 

        return(
            <>
                <div className="text-center w-100 acard-info">
                    <h3 style={{fontWeight: '100'}}> {this.state.curr_item.name}</h3>
                    <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="#ffb3de" className="bi bi-x-diamond-fill " viewBox="0 0 16 16">
                        <path d="M9.05.435c-.58-.58-1.52-.58-2.1 0L4.047 3.339 8 7.293l3.954-3.954L9.049.435zm3.61 3.611L8.708 8l3.954 3.954 2.904-2.905c.58-.58.58-1.519 0-2.098l-2.904-2.905zm-.706 8.614L8 8.708l-3.954 3.954 2.905 2.904c.58.58 1.519.58 2.098 0l2.905-2.904zm-8.614-.706L7.292 8 3.339 4.046.435 6.951c-.58.58-.58 1.519 0 2.098l2.904 2.905z"/>
                    </svg>
                    <p>{this.state.curr_item.occupation}</p>
                    <Button onClick={this.handleShow} variant="outline-light" size="sm">Learn More &raquo;</Button>
                </div>
                <Offcanvas style={{height: '40vh', backgroundColor: 'black'}} placement='bottom' scroll='true' show={this.state.showInfo} onHide={this.handleClose}>
                    <div className="text-center w-75 mx-auto">
                        <h3 className="fw-lighter my-2">About</h3>
                        <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="#ffb3de" className="bi bi-x-diamond-fill " viewBox="0 0 16 16">
                            <path d="M9.05.435c-.58-.58-1.52-.58-2.1 0L4.047 3.339 8 7.293l3.954-3.954L9.049.435zm3.61 3.611L8.708 8l3.954 3.954 2.904-2.905c.58-.58.58-1.519 0-2.098l-2.904-2.905zm-.706 8.614L8 8.708l-3.954 3.954 2.905 2.904c.58.58 1.519.58 2.098 0l2.905-2.904zm-8.614-.706L7.292 8 3.339 4.046.435 6.951c-.58.58-.58 1.519 0 2.098l2.904 2.905z"/>
                        </svg>

                        <p style={{fontSize:'small'}} className="lead my-2">{this.state.curr_item.description}</p>

                    </div>
                    <div class="artist-demo w-100">
                        <iframe width="100%" height="80" scrolling="no" frameborder="no" allow="autoplay" src={this.state.curr_item.demo_url}></iframe>
                    </div>
                </Offcanvas>

            </>
        );

    }
}
for(let i=1; i< artistCards + 1; i++){
    ReactDOM.render(
        <ArtistCard/>,
        document.getElementById(`artist-card-${i}`)
      );
      
}


