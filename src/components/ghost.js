import React, { Component } from 'react';

const Ghost = (props) => {
	 
	 let thisClass = "box";
	 
	 if(props.animateFlag){
		 thisClass = thisClass + " animate";
	 }
	
	return(
		<div className={thisClass}>
			<div className="body">
				<div className="eye leftEye"></div>
				<div className="eye rightEye"></div>
				<div className="mouth"></div>
				<div className="hand leftHand"></div>
				<div className="hand rightHand"></div>
			</div>
		</div>
	);
};

export default Ghost;