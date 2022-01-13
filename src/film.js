import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import Button from 'react-bootstrap/Button';
import ReactDOMServer from 'react-dom/server';


const title = 'React with Webpack and Babel';
let instanceCounter = 0;
let vidItems = 2;

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
                {'id': 1, 'video_code': 'vvo3TTfgQ_0', 'local': false},
                {'id': 2, 'video_code': '4xVVFJuycww', 'local': false},
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

class MovieContainer extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            id: 1,
            items:[
                {
                    'id': 1,
                    'name': 'Spiderman No Way Home',
                    'director': 'Jon Watts',
                    'release_date': 'December 17, 2021',
                    'producers': 'Kevin Feige; Amy Pascal',
                    'cast':[
                        {'name': 'Tom Holland', 'image': 'https://i.pinimg.com/originals/67/a0/5d/67a05dcce41c8172c9ce644ede67274e.jpg'},
                        {'name': 'Tobey Maguire', 'image': 'https://wallpaperaccess.com/full/2136145.jp'},
                        {'name': 'Andrew Garfield','image':'https://i.pinimg.com/originals/95/99/43/95994348a11cfe9d01c0ac1951a906c4.jpg'},
                        {'name': 'Zendaya', 'image': 'https://i.pinimg.com/564x/87/4a/6c/874a6cb28ca2c0950df7303325273001.jpg'},
                    ],
                    'imdb_score': '9.9/10',
                    'rt_score': '80%',
                    'mt_score': '70%'

                },
                {
                    'id': 2,
                    'name': 'The Matrix Resurrections',
                    'director': 'Lana Wachowski',
                    'release_date': 'December 22, 2021',
                    'producers': 'Village Roadshow Pictures; Venus Castina Productions',
                    'music by':'Johnny Klimek; Tom Tykwer',
                    'cast':[
                        {'name': 'Keanu Reeves', 'image': 'https://i.pinimg.com/originals/93/b4/31/93b4312aafe30f96d3c33334c839c669.jpg'},
                        {'name': 'Jessica Henwick', 'image': 'https://m.media-amazon.com/images/M/MV5BYTk2NmFjNzQtYTNiNy00ODk5LWE4NGUtZTFjNjI4N2JjZDMxXkEyXkFqcGdeQXVyMTAwODk1MDk@._V1_.jpg'},
                        {'name': 'Carrie-Anne Moss','image':'https://i.pinimg.com/originals/54/7e/91/547e91e336263192b1324df89ada658b.jpg'},
                        {'name': 'Yahya Abdul-Mateen II', 'image': 'https://content.api.news/v3/images/bin/326cdb4d60ebf2e146b4972c0e7be99e'},
                    ],
                    'imdb_score': 'n/a',
                    'rt_score': '64%',
                    'mt_score': '63%'

                },
                {
                    'id': 3,
                    'name': 'Love and Monsters',
                    'director': 'Michael Matthews',
                    'release_date': 'October 16, 2020',
                    'producers': 'Shawn Levy; Dan Cohen',
                    'music by':'Marco Beltrami & Marcus Trumpp',
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
                    'music by':'Ludwig Göransson',
                    'cast':[
                        {'name': "Elizabeth Debicki", 'image': 'https://static.wikia.nocookie.net/people-dont-have-to-be-anything-else/images/1/1c/4c56fb6a4168db05e5df6423405cb364.jpg/revision/latest?cb=20140629181816'},
                        {'name': 'Robert Pattinson', 'image': 'http://images4.fanpop.com/image/photos/24100000/robert-pattinson-robert-pattinson-24105926-1154-1280.jpg'},
                        {'name': 'John David Washington ','image':'https://cdn.celpox.com/bby_uploads/celeb/cb3e9aac7445113a2200aa8aea678228.jpg'},
                        {'name': 'Kenneth Branagh', 'image': 'https://i.pinimg.com/736x/eb/3d/9e/eb3d9e17f6e82f3271d1204007cbecd5--kenneth-branagh-tv-star.jpg'},
                    ],
                    'imdb_score': '7.4/10',
                    'rt_score': '69%',
                    'mt_score': '69%'

                },
            ],
        }

    }

    render(){

        
    }

}