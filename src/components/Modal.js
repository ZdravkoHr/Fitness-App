import CancelIcon from '@material-ui/icons/Cancel';

const Modal = ({ heading, children }) => {
	console.log(children);
	return (
		<div className='modal-wrapper'>
			<div className='modal-body'>
				<div className='modal-top'>
					<h3>{heading}</h3>
					<span className='close-icon'>
						<CancelIcon />
					</span>
				</div>
				<div className='modal-center'>{children}</div>
			</div>
		</div>
	);
};

export default Modal;
