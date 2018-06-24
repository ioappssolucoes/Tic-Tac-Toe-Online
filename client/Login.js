import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';

function inputHandleChange(e) {
	this.nickname = e.target.value;
}

function inputHandleKeyPress(e) {	
	if(e.key === 'Enter')
		this.buttonHandleClick();
}

function buttonHandleClick() {
	this.props.onClick(this.nickname);
}

class Login extends React.Component {
	constructor(props) {
		super(props);
		
		// Binds
		this.inputHandleChange = inputHandleChange.bind(this);
		this.inputHandleKeyPress = inputHandleKeyPress.bind(this);
		this.buttonHandleClick = buttonHandleClick.bind(this);
	}
	
	render() {						
		return(
			<div className={'row '+this.props.className}>
				<div className={'row'}>
					<input 
						onChange={(e) => this.inputHandleChange(e)} 
						onKeyPress={(e) => this.inputHandleKeyPress(e)}
						type="text"
						className={''}
						placeholder={'Nickname'} />
				</div>
				<div className={'row'}>
					<button onClick={() => this.buttonHandleClick()} className={''}>Login</button>
				</div>
			</div>
		);
	}
}

Login.propTypes = {
	className: PropTypes.string,
	onClick: PropTypes.func
};

Login.defaultProps = {
	className: 'login-component',
	onClick: (v) => {}
};

export default Login;