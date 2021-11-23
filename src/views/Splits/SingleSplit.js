import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import uuid from 'react-uuid';
import SingleSplitEl from './SingleSplit.style';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import WorkoutBox from 'components/Splits/WorkoutBox';
import DropArea from './DropArea.js';
import DeleteIcon from '@material-ui/icons/Delete';
import { Clone } from 'components/Splits/WorkoutBox.style';
import { useSelector } from 'react-redux';
import { workoutsSelector } from 'store';

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

	const [test, setTest] = useState(0);
	const [splitWorkouts, setSplitWorkouts] = useState([]);
	const [allWorkouts, setAllWorkouts] = useState([]);
	const [showDeleteArea, setShowDeleteArea] = useState(false);

	const workoutsField = useRef();

	const deleteArea = useRef();
	const rightShifts = useRef(0);

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

	const getClone = workout => (provided, snapshot, rubric) => {
		return <WorkoutBox workout={workout}></WorkoutBox>;
	};

	const handleDragEnd = () => {};

	useEffect(() => {
		setAllWorkouts([restObj, ...workouts]);
	}, [workouts]);

	return (
		<SingleSplitEl className='container single-split'>
			<div className='title'>
				<h1>{action === 'add' ? 'Add a new split' : 'Edit your split'}</h1>
				{test}
			</div>

			<div className='split-info'>
				<div className='workouts-sequence'>
					<DragDropContext onDragEnd={handleDragEnd}>
						<Droppable
							droppableId={uuid()}
							type='workout'
							isDropDisabled={true}
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
													{(provided, snapshot) => {
														return (
															<>
																<div
																	ref={provided.innerRef}
																	{...provided.draggableProps}
																	{...provided.dragHandleProps}
																>
																	<WorkoutBox workout={workout}></WorkoutBox>
																</div>

																{snapshot.isDragging ? (
																	// <Clone>{workout.name}</Clone>
																	<Clone className='workout'>
																		<p>{workout.name}</p>
																	</Clone>
																) : (
																	// <WorkoutBox workout={workout}></WorkoutBox>
																	''
																)}
															</>
														);
													}}
												</Draggable>
											);
										})}
										{snapshot.isDragging && <p>test</p>}
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
			<p onClick={() => setTest(test + 1)}>Increase</p>
			{showDeleteArea && DeleteArea()}
		</SingleSplitEl>
	);
};

export default SingleSplit;
