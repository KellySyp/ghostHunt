import React, { Component } from 'react';
import Cell from './cell';
import Ghost from './ghost';

class Board extends Component {
	constructor(props){
		super(props);
		
		this.state = {
			message: "HAPPY HALLOWEEN",
			data: this.createBoard(),
			gameState: 0
		};
		
	}
	
	createBoard(){
		let newBoard = [];
		//Create Array
		for(let i = 0; i < this.props.height; i++){
			newBoard.push([]);
			for(let j = 0; j < this.props.width; j++){
				newBoard[i][j] = {
					x: i,
                    y: j,
					value: 0,
					className: 'graveClose',
					flagged: false,
					opened: false,
					animateFlag: false
				}
			}
		}
		//Hide Ghosts
		for(let i=0; i < this.props.ghosts; i++){
			let ghostPlaced = false;
			while(!ghostPlaced){
				var rdmX = this.getRandomNumber(this.props.width);
				var rdmY = this.getRandomNumber(this.props.height);
				
				if(newBoard[rdmX][rdmY].value != 9){
					newBoard[rdmX][rdmY].value = 9;
					ghostPlaced = true;
				}
			}
		}
		
		//Check Neighbors
		for(let i = 0; i < this.props.height; i++){
				for(let j = 0; j < this.props.width; j++){
					if(newBoard[i][j].value < 9){
						let neighborcount = 0;
						let neighbors = this.findNeighbors(newBoard, i, j, 9);
						newBoard[i][j].value = neighbors.length;
					}
				}
			}
		return newBoard;
	}
	
	renderBoard(data){
		//Return Cells
		return data.map((datarow)=>{
			return datarow.map((dataitem)=>{
				if(dataitem.opened){
					dataitem.className = 'graveOpen';
				}
				if(dataitem.opened && dataitem.value == 9){
					dataitem.className = 'ghosted';
				}
				if(!dataitem.opened){
					dataitem.className = 'graveClose';
				}
				if(dataitem.flagged){
					dataitem.className = 'flagged';
				}
				return(
					<Cell 
						key = {dataitem.x +""+ dataitem.y}
						data = {dataitem}
						onClick={() => this._checkClick(dataitem.x, dataitem.y)}
						cMenu={(e) => this._checkFlag(e, dataitem.x, dataitem.y)}
					/>
				);
			});
		});
	}
	
	_checkClick(x, y){
		if(this.state.gameState == 0){
			let updateBoard = this.state.data;
			updateBoard[x][y].opened = true;
			updateBoard[x][y].flagged = false;
			if(updateBoard[x][y].value == 9){
				//reveal all
				updateBoard.forEach((row) => {
					row.forEach((cell) => {
						cell.opened = true;
						//if cell value == 9 && !flagged
						if(cell.value == 9 && !cell.flagged){
							//add animate classname to ghost box
							cell.animateFlag = true;
						}
					})
				});
				//alert("You Lose");
				this.setState({
					message: "YOU LOSE"
				});
				this.setState({
					gameState: 1
				});
				
			}else{
				let win = true;
				updateBoard.forEach((row) => {
					row.forEach((cell) => {
						if(cell.value < 9 && !cell.opened) win = false;
					})
				});
				if(win){
					this.setState({
						message: "YOU WIN"
					});
					//alert("You Win");
					this.setState({
						gameState: 1
					});
				}
			}
			//opens all 0 cells
			if(updateBoard[x][y].value == 0){
				updateBoard = this.findChain(updateBoard,x,y);
			}
			
			//Updates board
			this.setState({
				data: updateBoard
			});
		}
	}
	
	_checkFlag(e, x, y){
		if(this.state.gameState == 0){
			let updateBoard = this.state.data;
			if(!updateBoard[x][y].opened){
				updateBoard[x][y].flagged = !updateBoard[x][y].flagged;
			}
			//Check Win
			let win = true;
			updateBoard.forEach((row) => {
				row.forEach((cell) => {
					if(cell.value == 9 && !cell.flagged) win = false;
				})
			});
			if(win){
				this.setState({
					message: "YOU WIN"
				});
				//reveal all
				updateBoard.forEach((row) => {
					row.forEach((cell) => {
						cell.opened = true;
					})
				});
				//alert("You Win");
				this.setState({
					gameState: 1
				});
			}
			
			this.setState({
				data: updateBoard
			});
		}
	}
	
	findChain(updateBoard, x ,y){
		console.log("find chain");
		let process = [];
		process.push(updateBoard[x][y]);
		
		while (process.length > 0){
			//grab one cell from the process array
			let p = Math.floor(Math.random()*process.length);
			let cluster = [];
			let px = process[p].x;
			let py = process[p].y;
			
			//look at neighbors,if any are 0 add to process and cluster.
			cluster = this.findNeighbors(updateBoard, px, py, 0);
			
			cluster.forEach((cell) => {
				if(!updateBoard[cell.x][cell.y].opened){
					process.push(updateBoard[cell.x][cell.y]);
				}
				updateBoard[cell.x][cell.y].opened = true;
			});
			
			// remove this item from process
			process.splice(p,1);
		}
		return updateBoard;
	}
	
	findNeighbors(data, x, y, val){
		let neighbors = [];
		var check = [
			[x-1, y-1],
			[x-1, y],
			[x-1, y+1],
			[x, y-1],
			[x, y+1],
			[x+1, y-1],
			[x+1, y],
			[x+1, y+1]
		];
		check.forEach((check, i) => {
			if(check[0] > -1 
				&& check[0] < this.props.height
				&& check[1] > -1
				&& check[1] < this.props.width
				&& data[check[0]][check[1]].value == val
				){
					neighbors.push(data[check[0]][check[1]]);
				}
		});
		
		return neighbors;
		
	}
	
	restartGame(){
		this.setState({
			message: "HAPPY HALLOWEEN",
			data: this.createBoard(),
			gameState: 0
		});
	}
	
	// get random number given a dimension
    getRandomNumber(dimension) {
        // return Math.floor(Math.random() * dimension);
        return Math.floor((Math.random() * 1000) + 1) % dimension;
    }
	

	render(){
		return(
			<div className = "Board">
			<div className = "Banner">{this.state.message}</div>
				{
                    this.renderBoard(this.state.data)
                }
				<button type="button" className="button" 
					onClick={()=>this.restartGame()}>
					Restart
				</button>
			</div>
		)
	}
	
}


export default Board;