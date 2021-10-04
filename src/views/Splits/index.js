import { history } from 'helpers.js';
import SplitsEl from './Splits.style.js';

const Splits = () => {
	const addHandler = () => {
		history.push('/split/add');
	};

	return (
		<SplitsEl className='container splits'>
			<div className='title'>
				<h1>Your Splits: </h1>
				<button className='btn btn-green btn-rounded' onClick={addHandler}>
					Add Split +
				</button>
			</div>
		</SplitsEl>
	);
};

export default Splits;
