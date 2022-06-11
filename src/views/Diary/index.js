import { useState } from 'react';
import NotificationBox from 'components/Notifications/NotificationBox';

export default function Diary() {
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

	const transformToWorkouts = text => {
		let workouts = text.split(/-{2,}/g).filter(Boolean);
		workouts = workouts.map(workout => {
			let [data, ...exercises] = workout.split('\r\n').filter(Boolean);
			const parenthesesIndex = data.indexOf('(');
			const name =
				parenthesesIndex > -1
					? data.substring(0, parenthesesIndex).trim()
					: data;
			let dateString =
				parenthesesIndex > -1
					? data.substring(parenthesesIndex + 1, data.length - 1)
					: null;
			dateString = dateString
				? dateString.replace(/\./g, '-').split('-').reverse().join('-')
				: dateString;

			exercises = exercises.map(exercise => {
				const [name, info] = exercise.split(' - ');
				const sets = info?.split(' | ').map(set => {
					console.log('set: ', set);
					const xIndex = set.indexOf('x');
					const reps = xIndex > -1 ? set.substring(0, xIndex) : info;
					const weight = xIndex > -1 ? set.substring(xIndex + 1) : null;

					return {
						reps: parseInt(reps),
						weight,
					};
				});
				return {
					name,
					sets,
				};
			});

			return {
				name,
				date: new Date(dateString),
				exercises,
			};
		});

		console.log(workouts);
	};

	const addHandler = () => {
		try {
			if (!fileContent) throw new Error('Трябва да качите непразен файл');
			transformToWorkouts(fileContent);
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
