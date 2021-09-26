import { createBrowserHistory } from 'history';

export const history = createBrowserHistory();

export const capitalize = str => str[0].toUpperCase() + str.slice(1);

export const areWorkoutsDifferent = (workout1, workout2) => {
	const compare = (workout1, workout2) => {
		if (workout1.name !== workout2.name) return true;
		if (workout1.exercises.length !== workout2.exercises.length) return true;

		for (const j in workout1.exercises) {
			if (workout1.exercises[j].name !== workout2.exercises[j].name)
				return true;
		}

		return false;
	};

	if (isObject(workout1)) {
		return compare(workout1, workout2);
	}

	if (workout1.length !== workout2.length) return true;

	for (const i in workout1) {
		const areDifferent = compare(workout1[i], workout2[i]);
		if (areDifferent) return true;
	}

	return false;
};

const isObject = entity => {
	try {
		Object.getPrototypeOf(entity);
		return true;
	} catch (e) {
		return false;
	}
};
