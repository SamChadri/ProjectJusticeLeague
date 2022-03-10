import React, { useState }  from 'react';
import ReactDOM from 'react-dom';
import Button from 'react-bootstrap/Button';
import ReactDOMServer from 'react-dom/server';
import { Offcanvas} from "react-bootstrap";


const title = 'React with Webpack and Babel';
let instanceCounter = 0;
let vidItems = 5;

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
                {'id': 1, 'video_code': '../media/video/XO_MUSIC_TRAILER_MP4.mp4', 'local': true},
                {'id': 2, 'video_code': '16PdQtsygTU', 'local': false},
                {'id': 3, 'video_code': 'QYSQszM0-u4', 'local': false},
                {'id': 4, 'video_code': '../media/video/XO_YM_B.mp4', 'local': true},
                {'id': 5, 'video_code': '9MX1ffVUeas', 'local': false},
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
                    'description':"Christian Walcott Webster, better known by his stage name Chris Webby, is an American rapper from Norwalk, Connecticut. Chris Webby has released many mixtapes such as the DJ Drama-hosted Bars On Me and his EP There Goes the Neighborhood, which peaked at number 101 on the Billboard 200.",
                    'demo_url': 'https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/1188656497&color=%23ffb3de&auto_play=false&hide_related=true&show_comments=false&show_user=false&show_reposts=false&show_teaser=false&visual=true',
                },
                {
                    'id': 9,
                    'name':'Eminem',
                    'occupation': 'Rapper',
                    'description':"Marshall Bruce Mathers III, known professionally as Eminem, is an American rapper, songwriter, and record producer. Eminem is among the best-selling music artists of all time, with estimated worldwide sales of over 220 million records",
                    'demo_url': 'https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/1188656497&color=%23ffb3de&auto_play=false&hide_related=true&show_comments=false&show_user=false&show_reposts=false&show_teaser=false&visual=true',
                },
                {
                    'id': 10,
                    'name':'Pharrell Williams',
                    'occupation': 'Rapper Producer',
                    'description':"Pharrell Lanscilo Williams, is an American rapper, record producer, singer, songwriter, and entrepreneur. Alongside close colleague Chad Hugo, he formed the hip hop and R&B production duo The Neptunes in the early 1990s, with whom he has produced songs for various recording artists.",
                    'demo_url': '',
                },
                {
                    'id': 11,
                    'name':'Bad Bunny',
                    'occupation': 'Puerto Rican rapper',
                    'description':"Benito Antonio Martínez Ocasio, known by his stage name Bad Bunny, is a Puerto Rican rapper, singer, and songwriter. His music is often defined as Latin trap and reggaeton, but he has incorporated various other genres into his music, including rock, bachata, and soul.",
                    'demo_url': '',
                },
                {
                    'id': 12,
                    'name':'J Balvin',
                    'occupation': 'Colombian singer',
                    'description':"José Álvaro Osorio 'J' Balvín is a Colombian singer and rapper. He has been referred to as the 'Prince of Reggaeton', and is one of the best-selling Latin music artists with sales of more than 35 million records worldwide. Balvin was born in Medellín, Colombia.",
                    'demo_url': '',
                },
                {
                    'id': 13,
                    'name':'Ariana Grande',
                    'occupation': 'Singer',
                    'description':"Ariana Grande-Butera is an American singer, songwriter, and actress. Her four-octave vocal range has received critical acclaim, and her personal life has been the subject of widespread media attention.",
                    'demo_url': 'https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/1188656497&color=%23ffb3de&auto_play=false&hide_related=true&show_comments=false&show_user=false&show_reposts=false&show_teaser=false&visual=true',
                },
                {
                    'id': 14,
                    'name':'JCole',
                    'occupation': 'Rapper Songwriter',
                    'description':"Jermaine Lamarr Cole is an American rapper, singer, songwriter, and record producer. Cole is regarded as one of the most influential rappers of his generation.",
                    'demo_url': 'https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/1188656497&color=%23ffb3de&auto_play=false&hide_related=true&show_comments=false&show_user=false&show_reposts=false&show_teaser=false&visual=true',
                },
                {
                    'id': 15,
                    'name':'Adele',
                    'occupation': 'English Singer-Songwriter',
                    'description':"Adele Laurie Blue Adkins MBE is an English singer and songwriter. She is one of the world's best-selling music artists, with sales of over 120 million records. After graduating in arts from the BRIT School in 2006, Adele signed a record deal with XL Recordings.",
                    'demo_url': '',

                },
                {
                    'id': 16,
                    'name':'Kanye West',
                    'occupation': 'Rapper Producer',
                    'description':"Ye, commonly known by his birth name Kanye West, is an American rapper, record producer, and fashion designer. He is regarded as one of the most influential musicians of all time.",
                    'demo_url': '',

                },
                {
                    'id': 17,
                    'name':'The Weeknd',
                    'occupation': 'Canadian Singer',
                    'description':"Abel Makkonen Tesfaye, known professionally as the Weeknd, is a Canadian singer-songwriter and record producer. Known for his sonic versatility and dark lyricism, Tesfaye's music explores escapism, romance, and melancholia, and is often inspired by personal experiences.",
                    'demo_url': '',

                }

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
        this.updateCard = this.updateCard.bind(this);
        
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

    updateCard(id){
        var item = this.state.items[id -1];
        this.setState(function(state,props){
            return{
                curr_item: item
            }
        });
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
                <div id={this.state.curr_item.id} className="text-center w-100 acard-info">
                    <h3 id='artist-name' style={{fontWeight: '100'}}> {this.state.curr_item.name}</h3>
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
var artistCardDict = {};
for(let i=1; i< artistCards + 1; i++){
    
    artistCardDict[i] = ReactDOM.render(
            <ArtistCard/>,
            document.getElementById(`artist-card-${i}`)
        );
    
}

var grid = new Masonry( '#grid', {
    percentPosition: true
});
//keep a list of images
//(needs the least amount of images/prolly do this) option 1: "randomly" add a new image and then fade and layout keeping track of previous tiles
//option 2: dynamically add backup images to all tiles and then randomly choose to fade and layout and layout keeping track of previous tiles
//option 3: statically keep a list of images within html for all images, then randomly fade and layout, while keeping track of previous changes
//(need alot of images, and randomness is a bit weird) option 4: statically add images then use slick for transitioning

var image_list = [
    {'id':9,'name':'Eminem','image':'https://theglobal-post.com/wp-content/uploads/2021/01/5ea30d348dcb7.image_.jpg'},
    {'id':10,'name':'Pharell Williams', 'image': 'https://cdn.wallpapersafari.com/37/29/4lR2sb.jpg'},
    {'id': 11, 'name':'Bad Bunny','image':'https://d18ufwot1963hr.cloudfront.net/wp-content-production/uploads/2021/03/Web_Photo_Editor-14.png'},
    {'id': 12, 'name':'J Balvin','image':'https://w0.peakpx.com/wallpaper/254/789/HD-wallpaper-black-and-white-of-j-balvin-is-facing-one-side-wearing-rings-and-having-tattoos-on-hands-music.jpg'},
    {'id': 13, 'name':'Ariana Grande', 'image':'https://cdn.wallpapersafari.com/63/25/QWLRut.jpg'},
    {'id': 14, 'name':'JCole','image':'https://wp.stanforddaily.com/wp-content/uploads/2021/05/JCole.png'},
    {'id': 15, 'name':'Adele', 'image':'https://www.billboard.com/wp-content/uploads/2021/11/adele-2021-billboar-1548.jpg'},
    {'id': 16, 'name':'Kanye West', 'image': 'https://static01.nyt.com/images/2018/05/08/opinion/08Hampton1/08Hampton1-videoSixteenByNineJumbo1600.jpg'},
    {'id': 17, 'name':'The Weeknd', 'image': 'https://i.pinimg.com/originals/0d/a1/fb/0da1fbc2544a74f7d7c016746439cfd0.jpg'}
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

function fadeOutImage(index, item){
    index += 1;
    console.log(`Fading out: card-image-${index}`);
    //edge case appears here when I leave windows and come back, duplicate images start occurring. Might have to do with hover idk
    //Test this more later when I feel like it.
    console.log(item);
    var currCardId = parseInt($(`#artist-card-${index}`).children(':first').attr("id"));
    var artistName = $(`#artist-card-${index}`).find(`h3#artist-name`).text();
    var image = $(`#card-image-${index}`).attr('src');
    var used_entry = {'id': currCardId,'name': artistName,'image':image};
    console.log('Used Entry')
    console.log(used_entry);
    used_images.push(used_entry);
    var nextImage = createImage(item.image);
    nextImage.onload = function() {
        console.log(this.naturalHeight);
        var width = document.getElementById(`card-image-${index}`).clientWidth;
        console.log(`Client Width: ${width}`);
        var naturalWidth = this.naturalWidth;
        var naturalHeight = this.naturalHeight;
        console.log(`Natural Width: ${naturalWidth}`);
        var ratio = naturalHeight / naturalWidth;

        console.log(`Ratio: ${ratio}`);
        var nHeight = width * ratio;

        $(`#card-image-${index}`).parent().animate({
            opacity: `0`
        }, 500, function(){
            $(`#card-image-${index}`).animate({
                height: `${nHeight}px`
            }, 500, function(){
                $(`#card-image-${index}`).attr("src", nextImage.src);
                console.log('Next Item');
                console.log(item);
                artistCardDict[index].updateCard(item.id);
                $(`#card-image-${index}`).parent().animate({opacity: '1'},500);;

                
                window.setTimeout(function(){
                    grid.layout();
                },100)
            });




    
        });

    }


}

function fadeNextImage(){
    var nextPic= image_list.pop();
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
    var list_length = image_list.length
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


