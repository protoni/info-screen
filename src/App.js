import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Slider from 'react-slick'
import NewWindow from 'react-new-window'
import Popup from "reactjs-popup";
import { Button, ButtonToolbar, ProgressBar, FormControl, Label , ControlLabel} from 'react-bootstrap'
import './bootstrap/css/bootstrap.css';
import { runInThisContext } from 'vm';
import { isNumber } from 'util';

class App extends Component {
	constructor(props) {
		super(props);
		// this.buttonPressed = false;
		this.state = {
			image:[],
			news:[],
			buttonPressed:false,
			isLoading: false,
			changingSlide:false
		}
		
		this.configBtnPressed = this.configBtnPressed.bind(this);
		this.configBtn1Pressed = this.configBtn1Pressed.bind(this);
		this.configSlideIntervalChanged = this.configSlideIntervalChanged.bind(this);
		this.slideCount = 0;
		this.currentSlide = 0;

		/* Prevents the slide for changing immediately without fadeout effect when
		data arrays change */
		this.softUpdate = true;

		this.autoUpdateInterval = 3000; // This should be greater than (this.sliderUpdateInterval)
		this.sliderUpdateInterval = 1000;
	}
	
	componentDidMount() {
		this.updateData()
		
		
		document.addEventListener("keydown", this.escPressed.bind(this), false);
		// document.addEventListener("keyup", this.releaseButtons, false);
		this.interval = setInterval(() => this.updateData(), this.autoUpdateInterval);
	}

	componentWillUpdate() {
		console.log("state changed!")
	}
	

	escPressed(event){
		const {buttonPressed} = this.state
    if(event.keyCode === 27) {
			if(buttonPressed) {
				this.setState({
					buttonPressed:false
				})
			}
			else {
				this.setState({
					buttonPressed:true
				})
			}
			
			console.log("ESC down")
		}
	}

	releaseButtons(event){
    this.buttonPressed = false;
		console.log("Buttons released")
	}

	updateData() {
		
		let loadData = {
			method:"GET",
			mode:"cors",
			headers:{"Content-Type":"application/json"}
		}
		
		fetch("/all", loadData).then((response) => {
			if(response.ok) {
        
				response.json().then((data) => {
					
					
					let tempArr = [];
					
					for(let i = 0; i < data.images.length; i += 1) {
						tempArr.push(data.images[i])
					}
					this.slideCount = tempArr.length;
					
					
					if(this.softUpdate) {
					if(!this.state.changingSlide){
						if(tempArr.length != this.state.image.length) {
							this.slider.slickGoTo(0)
						}
						this.setState({
						image:tempArr
					})
					} else {
						console.log("changing slide")
					}
				} else {
					this.setState({
						image:tempArr
					})
				} 

				}).catch(error => {
					console.log(error);
				})
			
			}
		}).catch(error => {
			console.log(error);
		})

		fetch("/news", loadData).then((response) => {
			if(response.ok) {
        
				response.json().then((data) => {
					
					
					let tempArr = [];
				
					for(let i = 0; i < data.news.length; i += 1) {
						tempArr.push(data.news[i])
					}
					this.slideCount += tempArr.length;
					
					
					if(this.softUpdate) {
						if(!this.state.changingSlide){
							if(tempArr.length != this.state.news.length) {
								this.slider.slickGoTo(0)
						}
						this.setState({
							news:tempArr
						})
						}else {
							console.log("changing slide")
						}
					}
					else {
						this.setState({
							news:tempArr
						})
					}
					
					
				}).catch(error => {
					console.log(error);
				})
			
			}
		}).catch(error => {
			console.log(error);
		})
	}

	getRandomIndex(list) {

    return Math.floor(Math.random()*list.length); 
}

getProgress() {
	let progress = (this.state.currentSlide / this.slideCount) * 100;
	
	if(!progress) progress = 0;
	const rounded = Math.round(progress, 1);

	return rounded;
}

	configBtnPressed() {
		this.setState({ isLoading: true });

    // console.log(this.getProgress())
      // Completed of async action, set loading state back
      this.setState({ isLoading: false });
    
	}

	configBtn1Pressed() {
		this.setState({ isLoading: true });

	console.log("test")
	this.slider.slickGoTo(0)
      // Completed of async action, set loading state back
      this.setState({ isLoading: false });
    
	}

	configSlideIntervalChanged(event) {
		this.setState({ isLoading: true });
		
    	if (event.key === 'Enter') {
			const inputText = event.target.value;
			
			console.log(inputText)
				if(inputText >= 500) {
					this.sliderUpdateInterval = inputText;
					console.log("changed interval to: " + inputText)
				}
			
		  }
      // Completed of async action, set loading state back
      this.setState({ isLoading: false });
	}

  render() {
		
    var settings = {
		dots: true,
    	infinite: true,
    	slidesToShow: 1,
      	slidesToScroll: 1,
      	autoplay: true,
      	speed: 2000,
	  	autoplaySpeed: this.sliderUpdateInterval,
		pauseOnHover:false,
		beforeChange: current => {this.setState({
			changingSlide:true,
			
		})},
		afterChange: current => {this.setState({
			currentSlide:current,
			changingSlide:false
		})},
      	fade:true
    };
	
		const images = this.state.image.map((data) =>
			<img src={data}/>
			
		);
		
		const news = this.state.news.map((data) =>
			<p>{data}</p>
			
		);
		const { isLoading } = this.state;
		let window;
		const {buttonPressed} = this.state
		let now = this.getProgress()
		if(buttonPressed) {
			window = (
				<Popup trigger={
					<ButtonToolbar>
					{/* Standard button */}
					<Button bsStyle="primary" onClick={!isLoading ? this.configBtn1Pressed : null}>Goto 0</Button>
				
					{/* Provides extra visual weight and identifies the primary action in a set of buttons */}
					<Button bsStyle="primary" onClick={!isLoading ? this.configBtnPressed : null}>Primary</Button>
				
					<div id="progress">
						<ProgressBar bsStyle="info" now={now} label={`${now}%`}/>
						<ControlLabel>
							Slider update interval: 
						</ControlLabel>
						<div id="textInput">
							<input type="number" onKeyPress={!isLoading ? this.configSlideIntervalChanged : null}>
								
							</input>
						</div>
					</div>
					
						
					
						
				</ButtonToolbar>
				} position="right center">
    <div>Popup content here !!</div>
  </Popup>
			);
		} else window = null;
		
    return (
			<div>
				{window}
			
			<Slider ref={slider => (this.slider = slider)} {...settings}>

			{images}
			{news}
			
			
			
			{/*}
			<div>
				<img src={this.state.image} alt="" />
			</div>
			<div>
				<img src={this.state.image} alt="" />
			</div>
			<div>
				<img src={this.state.image} alt="" />
			</div>

		*/}
		</Slider>
		</div>
    );
  }
}

export default App;
