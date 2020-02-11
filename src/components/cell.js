import React, { Component } from 'react';
import Ghost from './ghost';

class Cell extends Component {
	constructor(props){
		super(props);
		
	}
	
	getValue(){
		let display = "";
		//let display = this.props.data.value;
		if(this.props.data.value > 0 
			&& this.props.data.value < 9 
			&& this.props.data.opened
			&& !this.props.data.flagged){
				display = this.props.data.value;
		}else if(this.props.data.flagged){
			display = "+"
		}
		
		return display;
		
	}
	
	render(){
		const {value, onClick, cMenu} = this.props;
		let className = "Cell "+this.props.data.className;
		return(
			<div 
				className ={className}
				onClick={onClick}
				onContextMenu={cMenu}
			>
				<Ghost 
					animateFlag = {this.props.data.animateFlag}
				/>
				{this.getValue()}
			</div>
		);
	}
}

export default Cell;
