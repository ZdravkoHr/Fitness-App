import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { userSelector } from 'store';
import { setDiary } from 'store/slices/diary';
import NotificationBox from 'components/Notifications/NotificationBox';
import { db } from '../../firebase';
import { diarySelector } from 'store';
import DiaryEl from './Diary.style';
import uuid from 'react-uuid';

export default function Diary() {
	const dispatch = useDispatch();
	const { user } = useSelector(userSelector);
	const { diary } = useSelector(diarySelector);

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
					id: uuid(),
				};
			});

			return { name, sets, id: uuid() };
		});
	};

	const getWorkouts = workouts => {
		return workouts.map(workout => {
			let [data, ...exercises] = workout.split('\n\n').filter(Boolean);

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
				id: uuid(),
			};
		});
	};

	const transformToWorkouts = text => {
		let workouts = text.split(/-{2,}\n*/g).filter(Boolean);
		console.log(workouts);
		return getWorkouts(workouts);
	};

	const addHandler = () => {
		try {
			if (!fileContent) throw new Error('Трябва да качите непразен файл');
			const workouts = transformToWorkouts(fileContent);
			dispatch(setDiary(workouts));
			db.collection('users')
				.doc(user.uid)
				.set({ diary: workouts }, { merge: true });
		} catch (err) {
			setFail(true);

			setFailMessage(err.message);
			setTimeout(() => {
				setFail(false);
			}, 1500);
		}
	};

	return (
		<DiaryEl className='container'>
			<NotificationBox active={fail} fail={true} text={failMessage} />
			<input type='file' onChange={read} />
			<article className='diary-holder'>
				{diary.map(workout => {
					const maxSetCount = workout.exercises.reduce((a, b) => {
						return Math.max(a, b.sets.length);
					}, 0);
					return (
						<div key={workout.id} className='workout'>
							<div className='workout-name-row'>
								<h3>{workout.name}</h3>
								<h4>{workout.date}</h4>
							</div>
							<table>
								<tr>
									<th className='exercise-name'>Exercise</th>
									{Array.from({ length: maxSetCount }).map((_, index) => {
										return <th key={uuid()}>Set {index + 1}</th>;
									})}
								</tr>
								{workout.exercises.map(exercise => {
									return (
										<tr>
											<td className='exercise-name'>{exercise.name}</td>
											{
												// [...exercise.sets, ...Array(maxSetCount - exercise.sets.length)].map(set => {

												// })

												exercise.sets.map(set => {
													return <td key={set.id}>a1</td>;
												})
											}
										</tr>
									);
								})}
							</table>
						</div>
					);
				})}
			</article>
			<button className='btn btn-green btn-rounded' onClick={addHandler}>
				Add Workouts
			</button>
		</DiaryEl>
	);
}
