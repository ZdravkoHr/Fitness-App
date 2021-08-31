import firebase from 'firebase';
const firebaseConfig = {
	apiKey: 'AIzaSyDwtnNqdlTR30QDHVzZAtHUhAGCuGkIp1Y',
	authDomain: 'fitnessapp-25d3f.firebaseapp.com',
	projectId: 'fitnessapp-25d3f',
	storageBucket: 'fitnessapp-25d3f.appspot.com',
	messagingSenderId: '589313911732',
	appId: '1:589313911732:web:1dc8b17c32f2bac7afe0e1',
	measurementId: 'G-9T0PVF697Q',
};

// Initialize Firebase

firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();

export { firebase, auth };
