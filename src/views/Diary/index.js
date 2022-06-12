import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { userSelector } from 'store';
import { setDiary } from 'store/slices/diary';
import NotificationBox from 'components/Notifications/NotificationBox';
import { db } from '../../firebase';

export default function Diary() {
	const dispatch = useDispatch();
	const { user } = useSelector(userSelector);
	const [fileContent, setFileContent] = useState('');
	const [fail, setFail] = useState(false);
	const [failMessage, setFailMessage] = useState('');
	const read = e => {
		e.preventDefault();
		const reader = new FileReader();
		reader.onload = e => {
			setFileContent(e.target.result);
		};
		reader.readAsText(e.target.files[0]);
	};

	const getExercises = exercises => {
		return exercises.map(exercise => {
			const [name, info] = exercise.split(' - ');
			const sets = info?.split(' | ').map(set => {
				const xIndex = set.indexOf('x');
				const reps = xIndex > -1 ? set.substring(0, xIndex) : info;
				const weight = xIndex > -1 ? set.substring(xIndex + 1) : null;

				return {
					reps: parseInt(reps),
					weight,
				};
			});

			return { name, sets };
		});
	};

	const getWorkouts = workouts => {
		return workouts.map(workout => {
			let [data, ...exercises] = workout.split('\r\n').filter(Boolean);
			const parenthesesIndex = data.indexOf('(');
			let name = data;
			let dateString = null;
			if (parenthesesIndex > -1) {
				name = data.substring(0, parenthesesIndex).trim();
				dateString = data.substring(parenthesesIndex + 1, data.length - 1);
			}

			exercises = getExercises(exercises);

			return {
				name,
				date: dateString,
				exercises,
			};
		});
	};

	const transformToWorkouts = text => {
		text = '--\r\n' + text;
		let workouts = text.split(/-{2,}/g).filter(Boolean);
		return getWorkouts(workouts);
	};

	const addHandler = () => {
		try {
			if (!fileContent) throw new Error('Трябва да качите непразен файл');
			const workouts = transformToWorkouts(fileContent);
			dispatch(setDiary(workouts));
			console.log(db.collection('users').doc(user.uid).set);
			console.log(workouts);
			db.collection('users').doc(user.uid).set({ n: workouts });
		} catch (err) {
			setFail(true);

			setFailMessage(err.message);
			setTimeout(() => {
				setFail(false);
			}, 1500);
		}
	};

	return (
		<div className='container'>
			<NotificationBox active={fail} fail={true} text={failMessage} />
			<input type='file' onChange={read} />
			<button className='btn btn-green btn-rounded' onClick={addHandler}>
				Add Workouts
			</button>
		</div>
	);
}
