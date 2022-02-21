import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import Button from 'react-bootstrap/Button';


import styles from './bc_style.css'
const title = 'React with Webpack and Babel';
let instanceCounter = 0;
var featurette_width = $('.feature-pic').width();

let localFlag = false;

class VidButton extends React.Component{
  render(){
    return{

    }
  }
}

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
              {'id': 1, 'video_code': '1ZHTurVaGus'},
              {'id': 2, 'video_code': '5ngeO703yA4'},
          ],
          local: false,
          playerState: 'PAUSED',
          showVid: false
      }
      this.handleClick = this.handleClick.bind(this);
  }

  createLocalVideo(width, height){
    var video = document.createElement('video');
    var source = document.createElement('source');

    source.type = 'video/mp4';
    source.src = '../media/video/XO_TRAILER20.mp4';

    video.setAttribute("controls", "controls");
    video.height = height;
    video.width = width;
    video.id = 'vidId1'
    video.style.objectFit = 'fill';

    video.appendChild(source)
    return video
  }

  componentDidMount(){
    instanceCounter += 1;
    if(instanceCounter == 1){
      localFlag = true;
    }else{
      localFlag = false;
    }
    this.setState(function(state, props) {
      return {
        id: instanceCounter,
        local: localFlag
      };
    });
    console.log(`Mounting ID: ${this.state.id}`);
  }


  handleClick(){
    //Change this later if removing local videos
    var vidItem = this.state.items[this.state.id -2];
    var fheight = $('.feature-pic').height();
    var fwidth = $('.feature-pic').width();
    var id = `vid-test${this.state.id}`
    console.log(id);
    
    if(this.state.local){
      var video = this.createLocalVideo(fwidth, fheight);
      var vidContainer = document.getElementById(id)
      vidContainer.innerHTML = video.outerHTML;
      this.setState(function(state, props) {
        document.getElementById(video.id).play();
        return {
          playerState: 'PLAYING'
        };
      });
      
      vidContainer.addEventListener('mouseenter', e => {
        if (this.state.playerState == 'PAUSED'){
          console.log('PLaying Video');
          this.setState(function(state, props) {
            document.getElementById(video.id).play();
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
            document.getElementById(video.id).pause();
            return {
              playerState: 'PAUSED'
            };
          });
        }
      });
      /*
      $(`vid-test1`).hover(
        function(){
            if (this.state.playerState == 'PAUSED'){
                video.play();
                console.log('playing video');
                this.setState(function(state, props) {
                  return {
                    playerState: 'PLAYING'
                  };
                });
            }
        },
        function(){
            if(this.state.playerState == 'PLAYING'){
                video.pause();
                console.log('pausing video');
                this.setState(function(state, props) {
                  return {
                    playerState: 'PAUSED'
                  };
                });
            }
        });
        */
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
        <>
          {this.state.showVid ?
            <video controls width={this.state.width} height={this.state.height}>
              <source src="../media/video/XO_TRAILER20.mp4" type="video/mp4"></source>
            </video>
          :
          <Button id={`bf-${this.state.id}`} onClick={this.handleClick} variant="outline-light" style={{borderRadius:'50%', color:'white'}}  type="button" className="feature-button">
            <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" fill="currentColor" className="bi bi-play" viewBox="0 0 16 16">
                <path d="M10.804 8 5 4.633v6.734L10.804 8zm.792-.696a.802.802 0 0 1 0 1.392l-6.363 3.692C4.713 12.69 4 12.345 4 11.692V4.308c0-.653.713-.998 1.233-.696l6.363 3.692z"/>
            </svg>
          </Button>
          }
        </>
          


      );

  }
}

//Merge this into on big repeating one later i think?

ReactDOM.render(
  <VidContainer/>,
  document.getElementById('vid-test1')
);

ReactDOM.render(
  <VidContainer/>,
  document.getElementById('vid-test2')
)
ReactDOM.render(
  <VidContainer/>,
  document.getElementById('vid-test3')
)

