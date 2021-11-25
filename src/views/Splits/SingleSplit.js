import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import uuid from 'react-uuid';
import SingleSplitEl from './SingleSplit.style';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import WorkoutBox from 'components/Splits/WorkoutBox';
import DropArea from './DropArea.js';
import DeleteIcon from '@material-ui/icons/Delete';
import { useSelector } from 'react-redux';
import { workoutsSelector } from 'store';
import { Reorder } from '@material-ui/icons';

const SingleSplit = () => {
	const { action } = useParams();

	const {
		appData: { workouts },
	} = useSelector(workoutsSelector);

	const restObj = {
		name: 'rest',
		isRest: true,
		id: uuid(),
	};

	const [splitWorkouts, setSplitWorkouts] = useState([]);
	const [allWorkouts, setAllWorkouts] = useState([]);
	const [showDeleteArea, setShowDeleteArea] = useState(false);

	const deleteArea = useRef();

	const DeleteArea = () => {
		return (
			<div ref={deleteArea} className='delete-area'>
				<DeleteIcon />
			</div>
		);
	};

	const addSplitWorkout = id => {
		console.log(allWorkouts, id);
		const workout = allWorkouts.find(workout => workout.id === id);
		setSplitWorkouts(workouts => {
			return [...workouts, { ...workout, sampleId: uuid() }];
		});
	};

	const reorder = (setter, oldIndex, newIndex) => {
		if (oldIndex === newIndex) return;

		setter(items => {
			console.log(items);
			const newItems = [...items];
			const [removedItem] = newItems.splice(oldIndex, 1);
			newItems.splice(newIndex, 0, removedItem);

			return newItems;
		});
	};

	const handleDragEnd = info => {
		const oldIndex = info.source.index;
		const newIndex = info.destination.index;
		reorder(setAllWorkouts, oldIndex, newIndex);
	};

	useEffect(() => {
		setAllWorkouts([restObj, ...workouts]);
	}, [workouts]);

	return (
		<SingleSplitEl className='container single-split'>
			<div className='title'>
				<h1>{action === 'add' ? 'Add a new split' : 'Edit your split'}</h1>
			</div>

			<div className='split-info'>
				<div className='workouts-sequence'>
					<DragDropContext onDragEnd={handleDragEnd}>
						<Droppable
							droppableId={'WORKOUT'}
							type='workout'
							direction='horizontal'
						>
							{(provided, snapshot) => {
								return (
									<div
										className='all-workouts-field'
										ref={provided.innerRef}
										{...provided.droppableProps}
									>
										{allWorkouts.map((workout, index) => {
											return (
												<Draggable
													key={workout.id}
													draggableId={workout.id}
													index={index}
												>
													{provided => {
														return (
															<div
																ref={provided.innerRef}
																{...provided.draggableProps}
																{...provided.dragHandleProps}
																type='workout'
																//style={{ marginRight: '10px' }}
															>
																<WorkoutBox workout={workout}></WorkoutBox>
															</div>
														);
													}}
												</Draggable>
											);
										})}
										{provided.placeholder}
									</div>
								);
							}}
						</Droppable>

						{/* <DropArea
							splitWorkouts={splitWorkouts}
							addWorkout={addSplitWorkout}
						></DropArea> */}
					</DragDropContext>
				</div>
			</div>

			{showDeleteArea && DeleteArea()}
		</SingleSplitEl>
	);
};

export default SingleSplit;
