import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import Button from 'react-bootstrap/Button';
import ReactDOMServer from 'react-dom/server';
import { Container } from 'react-bootstrap';
import { Col, Row, } from "react-bootstrap";



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
                {'id': 1, 'video_code': 'aQnnpq1ZOTg', 'local': false},
                {'id': 2, 'video_code': '5r_E0bXF54U', 'local': false},
                {'id': 3, 'video_code': 'gBmkI4jlaIo', 'local': false},
                {'id': 4, 'video_code': '8F0L8F9V8js', 'local': false},
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



class StackDisplay extends React.Component{
  constructor(props){
    super(props);
    
    this.state = {
      'id': '1',
      'items': [
        {
          'name':'Amelia Clarke',
          'occupation':'Actor',
          'resume':[
            {
              'name':'Game of Thrones',
              'image': 'https://m.media-amazon.com/images/M/MV5BYTRiNDQwYzAtMzVlZS00NTI5LWJjYjUtMzkwNTUzMWMxZTllXkEyXkFqcGdeQXVyNDIzMzcwNjc@._V1_FMjpg_UX1000_.jpg',
            },
            {
              'name':'Me Before You',
              'image': 'https://m.media-amazon.com/images/M/MV5BMTQ2NjE4NDE2NV5BMl5BanBnXkFtZTgwOTcwNDE5NzE@._V1_.jpg',
            },
            {
              'name':'Last Christmas',
              'image': 'https://m.media-amazon.com/images/M/MV5BNTQ4ZmY0NjgtYzVhNy00NzhiLTk3YTYtNzM1MTdjM2VhZDA3XkEyXkFqcGdeQXVyMTkxNjUyNQ@@._V1_.jpg',
            },
          ],
          'detail':'Emilia Isobel Euphemia Rose Clarke is an English actress. She studied at the Drama Centre London, appearing in a number of stage productions. Her television debut was a guest appearance in the BBC One medical soap opera Doctors in 2009.',
        },
        {
          'name':'Kim Kardashian',
          'occupation':'American Socialite',
          'resume':[
            {
              'name':'Keeping Up With The Kardashians',
              'image': 'https://m.media-amazon.com/images/M/MV5BMjJhMzUyYzQtMWZmYy00MGQ0LTlhMjMtMDkxOTFiZjRjNmFiXkEyXkFqcGdeQXVyMTI5NzE3NDQ2._V1_.jpg',
            },
            {
              'name':'Paw Patrol: The Movie',
              'image': 'https://m.media-amazon.com/images/M/MV5BNzY2OTYwNjItYzczMC00YjYzLThmY2MtZGFhNmVmMzUzN2QyXkEyXkFqcGdeQXVyNjY1MTg4Mzc@._V1_.jpg',
            },
            {
              'name':'Temptation: Confessions of a Marriage Counselor',
              'image': 'https://m.media-amazon.com/images/M/MV5BMWNhZTQwMDQtZWY5NC00MThjLWEzNGUtMDM5NzgzM2MzNDVhXkEyXkFqcGdeQXVyMTkzODUwNzk@._V1_.jpg',
            },
          ],
          'detail':'Kimberly Noel Kardashian is an American media personality, socialite, model, and businesswoman. She first gained media attention as a friend and stylist of Paris Hilton, but received wider notice after the sex tape Kim Kardashian, Superstar, shot with her then-boyfriend Ray J, was released in 2007. ',
        },
        {
          'name':'Oprah Winfrey',
          'occupation':'American host',
          'resume':[
            {
              'name': 'The Oprah Winfrey Show',
              'image': 'https://m.media-amazon.com/images/M/MV5BMDA0ZDI5MDctMmMxNi00NmVhLTlmN2MtNzIyMzM1YTc3YjBiXkEyXkFqcGdeQXVyMTkzODUwNzk@._V1_FMjpg_UX1000_.jpg'
            },
            {
              'name': 'A Wrinkle in Time',
              'image': 'https://m.media-amazon.com/images/M/MV5BMjMxNjQ5MTI3MV5BMl5BanBnXkFtZTgwMjQ2MTAyNDM@._V1_FMjpg_UX1000_.jpg',
            },
            {
              'name': 'The Butler',
              'image': 'https://m.media-amazon.com/images/M/MV5BMjM2NDY3MjkyMF5BMl5BanBnXkFtZTcwMDM5Nzg5OQ@@._V1_FMjpg_UX1000_.jpg',
            },
          ],
          'detail':'Oprah Gail Winfrey is an American talk show host, television producer, actress, author, and philanthropist.',
        },

      ],
      'curr_item':
      {
        'name':'Amelia Clarke',
        'occupation':'Actor',
        'resume':[
          {
            'name':'Game of Thrones',
            'image': 'https://m.media-amazon.com/images/M/MV5BYTRiNDQwYzAtMzVlZS00NTI5LWJjYjUtMzkwNTUzMWMxZTllXkEyXkFqcGdeQXVyNDIzMzcwNjc@._V1_FMjpg_UX1000_.jpg',
          },
          {
            'name':'Me Before You',
            'image': 'https://m.media-amazon.com/images/M/MV5BMTQ2NjE4NDE2NV5BMl5BanBnXkFtZTgwOTcwNDE5NzE@._V1_.jpg',
          },
          {
            'name':'Last Christmas',
            'image': 'https://m.media-amazon.com/images/M/MV5BNTQ4ZmY0NjgtYzVhNy00NzhiLTk3YTYtNzM1MTdjM2VhZDA3XkEyXkFqcGdeQXVyMTkxNjUyNQ@@._V1_.jpg',
          },
        ],
        'detail':'Emilia Isobel Euphemia Rose Clarke is an English actress. She studied at the Drama Centre London, appearing in a number of stage productions. Her television debut was a guest appearance in the BBC One medical soap opera Doctors in 2009.',
      },

      'curr_index': 0,
      
    }

    this.handleClick = this.handleClick.bind(this);
    this.updateInfo = this.updateInfo.bind(this);
    this.transitionImage = this.transitionImage.bind(this);

  }


  handleClick(){
    this.transitionImage();
    this.updateInfo();


  }


  updateInfo(){
    var next_index;
    if(this.state.curr_index == this.state.items.length -1){
      next_index = 0;
    }else{
      next_index = this.state.curr_index + 1;
    }
    const item = this.state.items[next_index];
    this.setState(function(state,props){
      return{
        curr_index: next_index,
        curr_item: item,
      }
    })
    
  }

  transitionImage(){
    $(`.top-image`).fadeOut(600, function(){
        for(let i=1;i<4; i++){
            var z_index = parseInt($(`#d-image-${i}`).css("z-index"));
            if(z_index == 3){
                $(`#d-image-${i}`).css("z-index",`1`);
                $(`#d-image-${i}`).addClass("bottom-image");
                $(`#d-image-${i}`).removeClass("top-image");

            }else{
                var new_z_index = z_index + 1;
                $(`#d-image-${i}`).css("z-index",`${new_z_index}`);
                if(new_z_index == 3){
                    $(`#d-image-${i}`).addClass("top-image");
                }else{
                    $(`#d-image-${i}`).removeClass("bottom-image");
                }
            }
        }
        $(`.bottom-image`).fadeIn(600);

    });
    

}




  render(){
    return(
      <>
        <Col md={7} className="text-center">
          <div className="photo-display px-3  mx-auto">
                <img id="d-image-1" className="d-image top-image  w-75" src="https://www.fashiongonerogue.com/wp-content/uploads/2015/12/Emilia-Clarke-Dior-Magazine-Winter-2015-Cover-Pictures07.jpg"/>
                <img id="d-image-2" className="d-image w-100" src="https://www.hola.com/us/images/0266-117f85863148-55f688c6a17b-1000/horizontal-1200/kim-kardashian-for-skims.jpg"/>
                <img id="d-image-3" className="d-image bottom-image w-100" src="https://assets.vogue.com/photos/598cc3c207a5d91d83ac40d1/4:3/w_2999,h_2249,c_limit/oprah-winfrey-vogue-september-2017.jpg"/>

          </div>

        </Col>
        <Col md={5} className="text-center">
          <div className="px-3  mx-auto">
              <h4 className="fw-lighter display-5">{this.state.curr_item.name}</h4>
              <h3 className="display-6">{this.state.curr_item.occupation}</h3>
              <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="#ffb3de" class="bi bi-x-diamond-fill zoom-in-ani" viewBox="0 0 16 16">
                  <path d="M9.05.435c-.58-.58-1.52-.58-2.1 0L4.047 3.339 8 7.293l3.954-3.954L9.049.435zm3.61 3.611L8.708 8l3.954 3.954 2.904-2.905c.58-.58.58-1.519 0-2.098l-2.904-2.905zm-.706 8.614L8 8.708l-3.954 3.954 2.905 2.904c.58.58 1.519.58 2.098 0l2.905-2.904zm-8.614-.706L7.292 8 3.339 4.046.435 6.951c-.58.58-.58 1.519 0 2.098l2.904 2.905z"/>
              </svg>
              <Row className="my-3">
                  <Col  className="ccard">
                      <img className="cmovie rounded h-100 w-100 " src={this.state.curr_item.resume[0].image}/>
                  </Col>
                  <Col  className="ccard ">
                      <img className="cmovie rounded h-100 w-100 " src={this.state.curr_item.resume[1].image}/>
                  </Col>
                  <Col className="ccard">
                      <img className="cmovie rounded h-100 w-100 " src={this.state.curr_item.resume[2].image}/>

                  </Col>

              </Row>
              <div className="my-5">
                  <p className="lead fs-6">
                  {this.state.curr_item.detail}
                  </p>
                  
              </div>
              <a className="stack-next" onClick={this.handleClick}>
                <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" className="bi bi-arrow-right mb-3" viewBox="0 0 16 16">
                    <path fill-rule="evenodd" d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8z"/>
                </svg>
              </a>

          </div>

        </Col>

      </>
    )
  }
}

ReactDOM.render(
  <StackDisplay/>,
  document.getElementById("stack-display")
);