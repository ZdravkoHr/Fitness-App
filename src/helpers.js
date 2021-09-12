import { createBrowserHistory } from 'history';

export const history = createBrowserHistory();

export const capitalize = str => str[0].toUpperCase() + str.slice(1);

export const areWorkoutsDifferent = (dbData, storeData) => {
	if (dbData.length !== storeData.length) return true;

	for (const i in dbData) {
		if (dbData[i].name !== storeData[i].name) return true;
		if (dbData[i].exercises.length !== storeData[i].exercises.length)
			return true;

		for (const j in dbData[i].exercises) {
			if (dbData[i].exercises[j] !== storeData[i].exercises[j]) return true;
		}
	}

	return false;
};
