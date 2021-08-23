import { useState } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import './App.css';
import Navbar from 'components/Navbar';
import Sidebar from 'components/Sidebar';
import Home from 'views/Home';
import Signup from 'views/Signup';

function App() {
	const [isSidebarOpened, setIsSidebarOpened] = useState(false);

	return (
		<div className='App'>
			<Router>
				<Navbar openSidebar={() => setIsSidebarOpened(true)} />
				<Sidebar
					opened={isSidebarOpened}
					closeSidebar={() => setIsSidebarOpened(false)}
				/>
				<Switch>
					<Route path='/' exact>
						<Home />
					</Route>
					<Route path='/signup'>
						<Signup />
					</Route>
				</Switch>
			</Router>
		</div>
	);
}

export default App;
