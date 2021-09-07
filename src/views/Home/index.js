import { useSelector } from 'react-redux';
import { userSelector } from 'store';
const Home = () => {
	const { user } = useSelector(userSelector);

	return (
		<main className='container home'>
			<section className='welcome'>
				<article>
					<h1>Welcome to the fitness app{user && ', ' + user.displayName}!</h1>
					<p>
						Create your personal diary with your own workouts and track your
						progress.
					</p>
				</article>
			</section>
		</main>
	);
};

export default Home;
