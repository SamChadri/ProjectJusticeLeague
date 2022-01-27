import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import Button from 'react-bootstrap/Button';
import ReactDOMServer from 'react-dom/server';
import { Container } from 'react-bootstrap';
import { Col, Row, } from "react-bootstrap";



const title = 'React with Webpack and Babel';
let instanceCounter = 0;
let vidItems = 3;

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
                {'id': 1, 'video_code': 'jkh9B7qqPt4', 'local': false},
                {'id': 2, 'video_code': 'B2G9-KhBek8', 'local': false},
                {'id': 3, 'video_code': 'iM2RqOd0eEo', 'local': false},
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

class MovieInfoContainer extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            id: 1,
            items:[
                {
                    'id': 1,
                    'name': 'Rumor Has It...',
                    'director': 'Rob Reiner',
                    'release_date': 'December 25, 2005',
                    'producers': 'Ben Cosgrove Paula Weinstein',
                    'screenplay':'Ted Griffin',
                    'music':'Marc Shaiman',
                    'cast':[
                        {'name': 'Jennifer Aniston', 'image': 'https://cdn.justjared.com/wp-content/uploads/headlines/2016/08/aniston-eye.jpg'},
                        {'name': 'Kevin Costner', 'image': 'https://pyxis.nymag.com/v1/imgs/ead/14d/ede84b0345bdfb70291cabe65e227bfd30-23-encounter-kevin-costner.rvertical.w330.jpg'},
                        {'name': 'Shirley Maclaine ','image':'https://upload.wikimedia.org/wikipedia/commons/a/a9/Shirley_MacLaine_-_1960.jpg'},
                        {'name': 'Mark Ruffalo', 'image': 'https://i.pinimg.com/originals/ae/fa/35/aefa3513a35e2416313d9211f532baab.jpg'},
                    ],
                    'imdb_score': '5.5/10',
                    'rt_score': '20%',
                    'mt_score': 'Sips Tea...😗'

                },
                {
                    'id': 2,
                    'name': 'On the Rocks',
                    'director': 'Sofia Coppola',
                    'release_date': 'September 22, 2020',
                    'producers': 'American Zoetrope',
                    'music':'Phoenix',
                    'screenplay':'Sofia Coppola',
                    'cast':[
                        {'name': 'Rashida Jones', 'image': 'https://data.whicdn.com/images/7106785/original.png'},
                        {'name': 'Bill Murray', 'image': 'https://movies-b26f.kxcdn.com/wp-content/uploads/2014/08/Bill-Murray-New-York-Times-e1407027143318.jpg'},
                        {'name': 'Marlon Wayans','image':'https://pbs.twimg.com/media/DhMWU2FWsAEqW2j.jpg'},
                        {'name': 'Jessica Henwick', 'image': 'https://64.media.tumblr.com/273341fb1c48751090d73633f6ccfd50/tumblr_otk6lrBiVJ1tdz49po7_1280.jpg'},
                    ],
                    'imdb_score': '6.5/10',
                    'rt_score': '87%',
                    'mt_score': '😌'

                },
                {
                    'id': 3,
                    'name': 'Love and Monsters',
                    'director': 'Michael Matthews',
                    'release_date': 'October 16, 2020',
                    'producers': 'Shawn Levy; Dan Cohen',
                    'music':'Marco Beltrami & Marcus Trumpp',
                    'screenplay':'Brian Duffield, Matthew Robinson',
                    'cast':[
                        {'name': "Dylan O'Brien", 'image': 'https://pbs.twimg.com/profile_images/441438607828451328/g24eSR4S_400x400.jpeg'},
                        {'name': 'Jessica Henwick', 'image': 'https://m.media-amazon.com/images/M/MV5BYTk2NmFjNzQtYTNiNy00ODk5LWE4NGUtZTFjNjI4N2JjZDMxXkEyXkFqcGdeQXVyMTAwODk1MDk@._V1_.jpg'},
                        {'name': 'Ariana Greenblatt ','image':'https://m.media-amazon.com/images/M/MV5BZTIxMmYyNTYtYzY5Yy00OWZhLTkxN2QtNmY2NzJmNTgyZjVmXkEyXkFqcGdeQXVyNDM1NjQzOQ@@._V1_.jpg'},
                        {'name': 'Yahya Abdul-Mateen II', 'image': 'https://content.api.news/v3/images/bin/326cdb4d60ebf2e146b4972c0e7be99e'},
                    ],
                    'imdb_score': '7/10',
                    'rt_score': '94%',
                    'mt_score': 'n/a'

                },
                {
                    'id': 4,
                    'name': 'Tenet',
                    'director': 'Christopher Nolan',
                    'release_date': 'August 12, 2020',
                    'producers': 'Christopher Nolan; Emma Thomas',
                    'music':'Ludwig Göransson',
                    'screenplay':'Christopher Nolan',
                    'cast':[
                        {'name': "Elizabeth Debicki", 'image': 'https://celebmafia.com/wp-content/uploads/2015/12/elizabeth-debicki-b-w-photo-shoot-for-the-last-2015-1.jpg'},
                        {'name': 'Robert Pattinson', 'image': 'http://images4.fanpop.com/image/photos/24100000/robert-pattinson-robert-pattinson-24105926-1154-1280.jpg'},
                        {'name': 'John David Washington ','image':'https://cdn.celpox.com/bby_uploads/celeb/cb3e9aac7445113a2200aa8aea678228.jpg'},
                        {'name': 'Kenneth Branagh', 'image': 'https://i.pinimg.com/736x/eb/3d/9e/eb3d9e17f6e82f3271d1204007cbecd5--kenneth-branagh-tv-star.jpg'},
                    ],
                    'imdb_score': '7.4/10',
                    'rt_score': '69%',
                    'mt_score': '69%'

                },
                {
                    'id': 5,
                    'name': 'The Last Duel',
                    'director': 'Ridley Scott',
                    'release_date': 'October 15, 2021',
                    'producers': 'Christopher Nolan; Emma Thomas',
                    'music':'Harry Gregson-Williams',
                    'screenplay':'Eric Jager',
                    'cast':[
                        {'name': "Jodie Comer", 'image': 'http://images6.fanpop.com/image/photos/43300000/Jodie-Comer-jodie-comer-43353198-1080-1350.jpg'},
                        {'name': 'Matt Damon', 'image': 'https://data.whicdn.com/images/88994055/original.jpg'},
                        {'name': 'Ben Affleck','image':'https://actorheadshot.files.wordpress.com/2013/02/affleck1-e1361822631156.jpg?w=450'},
                        {'name': 'Kenneth Branagh', 'image': 'https://i.pinimg.com/736x/eb/3d/9e/eb3d9e17f6e82f3271d1204007cbecd5--kenneth-branagh-tv-star.jpg'},
                    ],
                    'imdb_score': '7.4/10',
                    'rt_score': '86%',
                    'mt_score': 'n/a'

                },
            ],

            curr_item: {
                'id': 1,
                'name': 'Spiderman No Way Home',
                'director': 'Jon Watts',
                'release_date': 'December 17, 2021',
                'producers': 'Kevin Feige; Amy Pascal',
                'music':' Michael Giacchino',
                'screenplay':'Erik Sommers, Chris McKenna',
                'cast':[
                    {'name': 'Tom Holland', 'image': 'https://i.pinimg.com/originals/67/a0/5d/67a05dcce41c8172c9ce644ede67274e.jpg'},
                    {'name': 'Tobey Maguire', 'image': 'https://wallpaperaccess.com/full/2136145.jpg'},
                    {'name': 'Andrew Garfield','image':'https://i.pinimg.com/originals/95/99/43/95994348a11cfe9d01c0ac1951a906c4.jpg'},
                    {'name': 'Zendaya', 'image': 'https://i.pinimg.com/564x/87/4a/6c/874a6cb28ca2c0950df7303325273001.jpg'},
                ],
                'imdb_score': '9.9/10',
                'rt_score': '80%',
                'mt_score': '70%'
            }
        }
        this.updateData = this.updateData.bind(this);


    }
    componentDidMount(){
        this.setState(function(state, props) {
            return {
              curr_item: this.state.items[0]
            };
          });
        
    }

    updateData(index){
        this.setState(function(state, props) {
            return {
              curr_item: this.state.items[index]
            };
          });
    }


    render(){
        return(
            <Container>
                    <Row>
                        <Col md="6" >
                            <p style={{fontSize:'small'}}>Director: <span style={{fontWeight:'lighter'}} >{this.state.curr_item.director}</span></p>
                            <p style={{fontSize:'small'}}>Screenplay:<span  style={{fontWeight:'lighter'}}> {this.state.curr_item.screenplay} </span> </p>
                            <p style={{fontSize:'small'}}>Music by:<span  style={{fontWeight:'lighter'}}> {this.state.curr_item.music}</span></p>

                        </Col>
                        <Col md="5">
                            <Row className="my-0">
                                <Col>
                                    <img  className="w-75 h-50" src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/IMDB_Logo_2016.svg/320px-IMDB_Logo_2016.svg.png"/>
                                </Col>
                                <Col className="text-center">
                                    <p className="my-2" style={{fontSize:'small'}}>{this.state.curr_item.imdb_score}</p>

                                </Col>
                            </Row>
                            <Row className="my-1 ">
                                <Col>
                                    <img className="w-75 h-50" src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Rotten_Tomatoes_logo.svg/320px-Rotten_Tomatoes_logo.svg.png"/>
                                </Col>
                                <Col className="text-center">
                                    <p className="my-2 w-75 h-75" style={{fontSize:'small'}}>{this.state.curr_item.rt_score}</p>
                                </Col>
                            </Row>
                            <Row className="my-1">
                                <Col>
                                    <img className="w-100 h-100" src="https://upload.wikimedia.org/wikipedia/commons/f/f3/Metacritic_logo.png"/> 
                                </Col>
                                <Col className="text-center">
                                    <p style={{fontSize:'small'}}>{this.state.curr_item.mt_score}</p>
                                </Col>
                            </Row>

                        </Col>

                    </Row>
                    <div className="cast-carousel my-2">
                        <div className="member-slide">
                            <img className="headshot" src={this.state.curr_item.cast[0].image}/>
                            <p style={{fontSize:'small', display:'inline'}} >{this.state.curr_item.cast[0].name}</p>
                        </div>
                        <div class="member-slide">
                            <img className="headshot" src={this.state.curr_item.cast[1].image}/>
                            <p style={{fontSize:'small', display:'inline'}} >{this.state.curr_item.cast[1].name}</p>
                        </div>
                        <div class="member-slide">
                            <img className="headshot" src={this.state.curr_item.cast[2].image}/>
                            <p style={{fontSize:'small', display:'inline'}} >{this.state.curr_item.cast[2].name}</p>
                        </div>
                        <div class="member-slide">
                            <img className="headshot" src={this.state.curr_item.cast[3].image}/>
                            <p style={{fontSize:'small', display:'inline'}} >{this.state.curr_item.cast[3].name}</p>
                        </div>

                    </div>
            </Container>
        );

        
    }

}



var rMovieElement = ReactDOM.render(
    <MovieInfoContainer/>,
    document.getElementById(`info-container`)
);

var $carousel= $('.movie-carousel').flickity({
    // options
    cellAlign: 'center',
    wrapAround: true,
    imagesLoaded: true,
    percentPosition: false, 
  });
var $castCarousel = $('.cast-carousel').flickity({
    cellAlign: 'left',
    wrapAround: true,
    pageDots: false
});


var movieElements = 5;
var movieInstances = 0;
var last_index = 0

class MovieContainer extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            'id': 1,
            items:[
            {'id': 1, 'video_code': 'QWYqikq6YuE', 'local': false},
            {'id': 2, 'video_code': '_qawW01eTG0', 'local': false},
            {'id': 3, 'video_code': '-19tBHrZwOM', 'local': false},
            {'id': 4, 'video_code': 'AZGcmvrTX9M', 'local': false},
            {'id': 5, 'video_code': 'mgygUwPJvYk', 'local': false},
            ],
            playback: false
        }
        this.handleClick = this.handleClick.bind(this);
        this.triggerEvent = this.triggerEvent.bind(this);
    }
    componentDidMount(){
        movieInstances += 1;
  
        this.setState(function(state, props) {
          return {
            id: movieInstances,
          };
        });
        console.log(`Mounting ID: ${this.state.id}`);
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

    handleClick(){
        if(this.state.playback){
            this.setState(function(state, props) {
                return {
                    playback: false
                };
                });
        }else{
            this.setState(function(state, props) {
                return {
                    playback: true
                };
                });

        }
        $(".movie-info").fadeOut(600, function(){
            console.log("fadeout Trigger");
            var id = $('.is-selected').attr('id');
            $(`#${id}`).mouseenter(function(){
                $(".movie-info").fadeOut(600,function(){console.log("Hover in")});
            });
            $(`#${id}`).mouseleave( function(){
                $(".movie-info").fadeIn(600,function(){console.log("Hover out")});
                }
            );
        });

        var vidItem = this.state.items[this.state.id -1];
        var num_id = vidItem.id;
        var id = `mvdiv-${num_id}`;
        var pic_id = `mpic-${num_id}`;
        var vid_id = `mvid-${num_id}`;
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

    triggerEvent(){
        if(this.state.playback){
            var id = this.state.id;
            
            $('.is-selected').trigger('mouseenter');
            // 
            //Autoplay feature seems to work with keyboard keys, but problem with youtube fast foward feature
            //When using flickity buttons(prolly the feds again -_-), hover effect kicks in, causing audio with no video
            // I could write a flickity-button hover: show player-vid, however I like the default pause onHover feature without transition
            // Also seems to be a another mouseleave trigger when approaching the sides of the movie-slide. Which can create some edge cases(litterally) when transitioning
            //Bit of lag when transitioning but I'm pretty sure thats just my cpu.
            // I will probably end up up going with just the arrow feature no keyboard autoplay.
            $(`#mvdiv-${this.state.id}`).trigger('mouseenter');
            /*
            Doesn't work
            $(`#mvdiv-${this.state.id}`).hide().fadeIn(600,function(){});
            */
            $(`#slide-${this.state.id}`).trigger('mouseenter');
            //$(`.flickity-button`).trigger('mouseleave');
            console.log(`Triggering mouseleave for mvdiv-${last_index + 1}`);
            $(`#mvdiv-${last_index +1}`).trigger('mouseleave');

        }else{
            $('.movie-info').fadeIn(600,function(){});
            console.log(`Triggering mouseleave for mvdiv-${last_index + 1}`);
            $(`#mvdiv-${last_index +1}`).trigger('mouseleave');
            //$(`#mvdiv-${this.state.id}`).trigger('mouseenter');
        }

    }

    render(){
        return(
            <>
            <Button id={`mb-${this.state.id}`} onClick={this.handleClick} variant="outline-light" style={{borderRadius:'50%'}}  type="button" className="movie-button">
                <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" fill="currentColor" className="bi bi-play" viewBox="0 0 16 16">
                    <path d="M10.804 8 5 4.633v6.734L10.804 8zm.792-.696a.802.802 0 0 1 0 1.392l-6.363 3.692C4.713 12.69 4 12.345 4 11.692V4.308c0-.653.713-.998 1.233-.696l6.363 3.692z"/>
                </svg>
            </Button>
            </>
        );
    }
}
//store these in a dictionary
var mContainerDict = {}
for(let i =1; i < movieElements+1; i++){
    mContainerDict[`mc-${i}`] = ReactDOM.render(
        <MovieContainer/>,
        document.getElementById(`mdiv-${i}`)
    );
}

$carousel.on( 'change.flickity', function( event, index ) {
    rMovieElement.updateData(index);
    $castCarousel.flickity('destroy');
    $castCarousel.flickity({
        cellAlign: 'left',
        wrapAround: true,
        pageDots: false
    });
    var mContainer = mContainerDict[`mc-${index+1}`];
    console.log(`Triggering mc-${index+1}`);
    mContainer.triggerEvent();
    last_index = index


});

let cardCount = 0;

let aInfoItems = 9;

class ArtistInfo extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            'id': 1,
            'items':[
                {
                    'id': 1,
                    'name': 'Will Smith',
                    'occupation': 'Actor',
                    'description':'Willard Carroll Smith II, also known by his stage name The Fresh Prince, is an American actor, rapper, and film producer. Primarily known for comedic and dramatic acting roles, Smith is the recipient of numerous accolades, including four Grammy Awards, one Golden Globe Award, and two Academy Award nominations.',
                    'movies':[
                        {'name': 'Pursuit of Happiness', 'image':'https://m.media-amazon.com/images/M/MV5BYTcyNmY4ZGEtYmE4Zi00ZDViLTlmYzMtMmQ4ZTM4OWNmZjQxXkEyXkFqcGdeQXVyMTkxNjUyNQ@@._V1_FMjpg_UX1000_.jpg'},
                        {'name': 'King Richard', 'image': 'https://www.sonypictures.com/sites/default/files/styles/max_560x840/public/title-key-art/thepursuitofhappyness_onesheet_1400x2100.png?itok=BSpvsOsJ'},
                        {'name': 'Hancock','image':'https://m.media-amazon.com/images/M/MV5BMTgyMzc4ODU3NV5BMl5BanBnXkFtZTcwNjk5Mzc1MQ@@._V1_FMjpg_UX1000_.jpg'}
                    ]
                },
                {
                    'id': 2,
                    'name': 'Christopher Nolan',
                    'occupation': 'Director',
                    'description':'Christopher Edward Nolan CBE is a British-American film director, producer, and screenwriter. His films have grossed more than US$5 billion worldwide, and have garnered 11 Academy Awards from 36 nominations. Born and raised in London, Nolan developed an interest in filmmaking from a young age.',
                    'movies':[
                        {'name': 'The Dark Knight', 'image':'https://m.media-amazon.com/images/M/MV5BMTMxNTMwODM0NF5BMl5BanBnXkFtZTcwODAyMTk2Mw@@._V1_FMjpg_UX1000_.jpg'},
                        {'name': 'Interstellar', 'image': 'https://m.media-amazon.com/images/M/MV5BZjdkOTU3MDktN2IxOS00OGEyLWFmMjktY2FiMmZkNWIyODZiXkEyXkFqcGdeQXVyMTMxODk2OTU@._V1_.jpg'},
                        {'name': 'Inception','image':'https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_FMjpg_UX1000_.jpg'}
                    ]
                },
                {
                    'id': 3,
                    'name': 'Jessica Henwick',
                    'occupation': 'Actor-Screenwriter-Director',
                    'description':"Jessica Yu-Li Henwick is a British actress and writer. She is known for her roles as Nymeria Sand in the HBO series Game of Thrones, X-wing pilot Jessika Pava in Star Wars: The Force Awakens, the character Colleen Wing in Marvel's Netflix television series and her role as Bugs in The Matrix Resurrections.",
                    'movies':[
                        {'name': 'Bus Girl', 'image':'https://m.media-amazon.com/images/M/MV5BMTkwZjM0NzEtNzQ1Mi00OGM5LWI0YTYtYmUyZDBiN2QxYmFmXkEyXkFqcGdeQXVyMTIzODYxODgz._V1_.jpg'},
                        {'name': 'The Matrix Resurrections', 'image': 'https://m.media-amazon.com/images/M/MV5BMGJkNDJlZWUtOGM1Ny00YjNkLThiM2QtY2ZjMzQxMTIxNWNmXkEyXkFqcGdeQXVyMDM2NDM2MQ@@._V1_.jpg'},
                        {'name': 'Love and Monsters','image':'https://m.media-amazon.com/images/M/MV5BYWVkMWEyMDUtZTVmOC00MTYxLWE1ZTUtNjk4M2IzMjY2OTIxXkEyXkFqcGdeQXVyMDk5Mzc5MQ@@._V1_.jpg'}
                    ]
                },
                {
                    'id': 4,
                    'name': 'Yoshihiro Togashi',
                    'occupation': 'Screenwriter',
                    'description':"Yoshihiro Togashi is a Japanese manga artist. He began drawing manga at an early age; while he attended college, the publishing company Shueisha recognized his talent. Togashi has authored numerous manga series in different genres during the past three decades.",
                    'movies':[
                        {'name': 'Hunter X Hunter', 'image':'https://m.media-amazon.com/images/M/MV5BZjNmZDhkN2QtNDYyZC00YzJmLTg0ODUtN2FjNjhhMzE3ZmUxXkEyXkFqcGdeQXVyNjc2NjA5MTU@._V1_FMjpg_UX1000_.jpg'},
                        {'name': 'Level E', 'image': 'https://m.media-amazon.com/images/M/MV5BZDAyZTU4MDItMzc2ZC00MjgyLWI5OWMtMzNjNzkyYzZiNDgyXkEyXkFqcGdeQXVyMjc4OTQ1OTA@._V1_.jpg'},
                        {'name': 'Yu Yu Hakusho','image':'https://m.media-amazon.com/images/M/MV5BYjBlYmVmNzYtZTY5Ni00NTc0LTljODMtMzExMGRiY2YxYzcyXkEyXkFqcGdeQXVyMzM4MjM0Nzg@._V1_FMjpg_UX1000_.jpg'}
                    ]
                },
                {
                    'id': 5,
                    'name': 'Tom Hardy',
                    'occupation': 'Actor',
                    'description':'Edward Thomas Hardy CBE is an English actor, producer, writer and former model. After studying acting at the Drama Centre London, he made his film debut in Ridley Scotts Black Hawk Down.',
                    'movies':[
                        {'name': 'The Dark Knight Rises', 'image':'https://m.media-amazon.com/images/M/MV5BMTk4ODQzNDY3Ml5BMl5BanBnXkFtZTcwODA0NTM4Nw@@._V1_FMjpg_UX1000_.jpg'},
                        {'name': 'Legend', 'image': 'https://m.media-amazon.com/images/M/MV5BMjE0MjkyODQ3NF5BMl5BanBnXkFtZTgwNDM1OTk1NjE@._V1_.jpg'},
                        {'name': 'This Means War','image':'https://m.media-amazon.com/images/M/MV5BMTYyOTQ4MDE2MV5BMl5BanBnXkFtZTcwOTE0MTgwNw@@._V1_FMjpg_UX1000_.jpg'}
                    ]
                },
                {
                    'id': 6,
                    'name': 'Jodie Comer',
                    'occupation': 'Actor-Screenwriter',
                    'description':'Jodie Marie Comer is an English actress. She plays Oksana Astankova / Villanelle in the British drama spy thriller Killing Eve, for which she has received critical acclaim and won the Primetime Emmy Award for Outstanding Lead Actress in a Drama Series and the British Academy Television Award for Best Actress.',
                    'movies':[
                        {'name': 'Free Guy', 'image':'https://m.media-amazon.com/images/M/MV5BOTY2NzFjODctOWUzMC00MGZhLTlhNjMtM2Y2ODBiNGY1ZWRiXkEyXkFqcGdeQXVyMDM2NDM2MQ@@._V1_.jpg'},
                        {'name': 'The Last Duel', 'image': 'https://m.media-amazon.com/images/M/MV5BZGExZTUzYWQtYWJjZi00OTI4LTk4OGYtNTA2YzcwMmNiZTMxXkEyXkFqcGdeQXVyMTEyMjM2NDc2._V1_FMjpg_UX1000_.jpg'},
                        {'name': 'Help','image':'https://m.media-amazon.com/images/M/MV5BNjI4ZDlmZmEtY2U1ZC00NTZmLWFhYjUtMTg2ZTIwNzZkNjM1XkEyXkFqcGdeQXVyOTMyODgwOTQ@._V1_.jpg'}
                    ]
                },
                {
                    'id': 7,
                    'name': 'Taika Waititi',
                    'occupation': 'Actor-Filmmaker',
                    'description':'Taika David Cohen ONZM, known professionally as Taika Waititi, is a New Zealand filmmaker, actor, and comedian. He is a recipient of an Academy Award, a BAFTA Award, and a Grammy Award, and has received two nominations at the Primetime Emmy Awards',
                    'movies':[
                        {'name': 'Thor: Ragnarok', 'image':'https://www.themoviedb.org/t/p/w500/rzRwTcFvttcN1ZpX2xv4j3tSdJu.jpg'},
                        {'name': 'Jojo Rabbit', 'image': 'https://m.media-amazon.com/images/M/MV5BZjU0Yzk2MzEtMjAzYy00MzY0LTg2YmItM2RkNzdkY2ZhN2JkXkEyXkFqcGdeQXVyNDg4NjY5OTQ@._V1_.jpg'},
                        {'name': 'What We Do in the Shadows','image':'https://m.media-amazon.com/images/M/MV5BMjAwNDA5NzEwM15BMl5BanBnXkFtZTgwMTA1MDUyNDE@._V1_FMjpg_UX1000_.jpg'}
                    ]
                },
                {
                    'id': 8,
                    'name': 'Patty Jenkins',
                    'occupation': 'Director',
                    'description':'Patricia Lea Jenkins is an American film director, screenwriter, and producer. She has directed the feature films Monster, Wonder Woman, and Wonder Woman 1984. For the film Monster, she won the Independent Spirit Award for Best First Feature and the Franklin J. Schaffner Award from the American Film Institute.',
                    'movies':[
                        {'name': 'Wonder Woman', 'image':'https://m.media-amazon.com/images/M/MV5BMTYzODQzYjQtNTczNC00MzZhLTg1ZWYtZDUxYmQ3ZTY4NzA1XkEyXkFqcGdeQXVyODE5NzE3OTE@._V1_.jpg'},
                        {'name': 'Monster', 'image': 'https://m.media-amazon.com/images/M/MV5BMTI4NzI5NzEwNl5BMl5BanBnXkFtZTcwNjc1NjQyMQ@@._V1_FMjpg_UX1000_.jpg'},
                        {'name': 'Wonder Woman 1984','image':'https://images.moviesanywhere.com/607cde33edb94043a969a6594c536c82/474bedac-a2cc-466c-8133-aaadefece01f.jpg'}
                    ]
                },
            ],
            'curr_item': {
                'id': 1,
                'name': 'Will Smith',
                'occupation': 'Actor',
                'description':'Willard Carroll Smith II, also known by his stage name The Fresh Prince, is an American actor, rapper, and film producer. Primarily known for comedic and dramatic acting roles, Smith is the recipient of numerous accolades, including four Grammy Awards, one Golden Globe Award, and two Academy Award nominations.',
                'movies':[
                    {'name': 'Pursuit of Happiness', 'image':'https://m.media-amazon.com/images/M/MV5BYTcyNmY4ZGEtYmE4Zi00ZDViLTlmYzMtMmQ4ZTM4OWNmZjQxXkEyXkFqcGdeQXVyMTkxNjUyNQ@@._V1_FMjpg_UX1000_.jpg'},
                    {'name': 'King Richard', 'image': 'https://www.sonypictures.com/sites/default/files/styles/max_560x840/public/title-key-art/thepursuitofhappyness_onesheet_1400x2100.png?itok=BSpvsOsJ'},
                    {'name': 'Hancock','image':'https://m.media-amazon.com/images/M/MV5BMTgyMzc4ODU3NV5BMl5BanBnXkFtZTcwNjk5Mzc1MQ@@._V1_FMjpg_UX1000_.jpg'}
                ]
            },
            'isCard': true
        }

        this.handleClick = this.handleClick.bind(this);
    }
    componentDidMount(){
        if(cardCount == 0){
            this.setState(function(state,props){
                return{
                    isCard: false
                }
            });

            var instance = this;
            $(`.artist-card`).mouseenter(function(){
                var id  = $(this).find('img').attr('id');
                id = parseInt(id.substring(id.length - 1));
                instance.setState(function(state, props) {
                    return {
                        curr_item: this.state.items[id - 1]
                    };
                });
                $(`#artist-detail`).fadeIn(600);
                console.log('Fade in Artist Detail')
            });
            $(`.artist-card`).mouseleave( function(){

                $(`#artist-detail`).fadeOut(600);
            });
            cardCount += 1;
        }else{
            var item = this.state.items[cardCount - 1];
            this.setState(function(state,props){
                return{
                    curr_item: item
                }
            });
            cardCount += 1;
        }

    }

    handleClick(){

    }

    render(){
        const isCard = this.state.isCard;
        let content;
        if(isCard){
            content = 
                    <div className="text-center w-100 acard-info">
                        <h3 style={{fontWeight: '100'}}> {this.state.curr_item.name}</h3>
                        <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="#ffb3de" className="bi bi-x-diamond-fill " viewBox="0 0 16 16">
                            <path d="M9.05.435c-.58-.58-1.52-.58-2.1 0L4.047 3.339 8 7.293l3.954-3.954L9.049.435zm3.61 3.611L8.708 8l3.954 3.954 2.904-2.905c.58-.58.58-1.519 0-2.098l-2.904-2.905zm-.706 8.614L8 8.708l-3.954 3.954 2.905 2.904c.58.58 1.519.58 2.098 0l2.905-2.904zm-8.614-.706L7.292 8 3.339 4.046.435 6.951c-.58.58-.58 1.519 0 2.098l2.904 2.905z"/>
                        </svg>
                        <p>{this.state.curr_item.occupation}</p>
                    </div>
        }else{
            content =
                    <>
                        <h3 className="fw-lighter mt-4">About</h3>
                        <div className="catalouge-display text-center"> 
                            <Row class="row">
                                <Col class=" ccard">
                                    <img className="cmovie rounded h-100 w-100 " src={this.state.curr_item.movies[0].image}/>
                                </Col>
                                <Col class=" ccard ">
                                    <img className="cmovie rounded h-100 w-100 " src={this.state.curr_item.movies[1].image}/>
                                </Col>
                                <Col class=" ccard">
                                    <img className="cmovie rounded h-100 w-100 " src={this.state.curr_item.movies[2].image}/>

                                </Col>

                            </Row>


                        </div>


                        <h3 className="fw-lighter mt-4"></h3>
                        <p style={{fontSize:'small'}} className="lead">{this.state.curr_item.description}.</p>
                    </>


        }
        return(
            <>
                {content}
            </>
            

        );
    }
}
for(let i = 0; i < aInfoItems; i++){
    if(i == 0){
        ReactDOM.render(
            <ArtistInfo/>,
            document.getElementById(`artist-detail`)
        );
    }else{
        ReactDOM.render(
            <ArtistInfo/>,
            document.getElementById(`cc-card-${i}`)
        );

    }
}

