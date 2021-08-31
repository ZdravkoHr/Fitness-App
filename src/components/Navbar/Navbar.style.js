import styled from 'styled-components';

const NavBarEl = styled.nav`
	& {
		padding: 1rem;
		display: flex;
		justify-content: space-between;
		align-items: center;
		font-family: 'Raleway', sans-serif;
	}

	.menu-items {
		display: flex;
		list-style: none;
	}

	.open-sidebar {
		padding-left: 10px;
		cursor: pointer;
	}

	.open-sidebar > * {
		width: 2rem;
		height: 2rem;
	}

	.menu-items li > * {
		padding: 5px 15px;
		cursor: pointer;
		margin-right: 5px;
		border-radius: 5px;
		font-size: 1rem;

		&.active,
		&:hover {
			background: #fff;
			color: #101032;
		}
	}
`;

export default NavBarEl;
