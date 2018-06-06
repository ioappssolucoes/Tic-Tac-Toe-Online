import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';

class Login extends React.Component {
	constructor(props) {
		super(props);
	}
	
	render() {
		
		const nicknameRefHandle = (e) => {
			this.nicknameRef = e;
		};
		
		const loginClickHandle = () => {
			this.props.onClick(this.nicknameRef.value);
		};
		
		return(
			<div className={'row '+this.props.className}>
				<div className={'row'}>
					<input ref={(e) => nicknameRefHandle(e)} type="text" className={''} placeholder={'Nickname'} />
				</div>
				<div className={'row'}>
					<button onClick={() => loginClickHandle()} className={''}>Login</button>
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