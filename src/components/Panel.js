import { useState } from 'react';
import PanelEl from './Panel.style';

const Panel = ({ headerContent, mainContent, opened: isOpened }) => {
	const [opened, setOpened] = useState(isOpened);

	const clickHandler = () => {
		setOpened(!opened);
	};

	const Main = () => {
		return <main className='panel-main'>{mainContent}</main>;
	};

	return (
		<PanelEl className='panel'>
			<header className='panel-header' onClick={clickHandler}>
				{headerContent}
			</header>
			{opened && Main()}
		</PanelEl>
	);
};

export default Panel;
