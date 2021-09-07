import CircularProgress from '@material-ui/core/CircularProgress';
import { makeStyles } from '@material-ui/core/styles';

const Spinner = () => {
	const useStyles = makeStyles({
		spinner: {
			color: '#fff',
			width: '120px !important',
			height: '120px !important',
		},
	});

	const styles = useStyles();

	return (
		<div className='absolute-center'>
			<CircularProgress className={styles.spinner} />
		</div>
	);
};

export default Spinner;
