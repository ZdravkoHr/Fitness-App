import styled from 'styled-components';
const SidebarEl = styled.aside`
	& {
		position: fixed;
		background: rgba(0, 0, 0, 0.9);
		height: 100%;
		top: 0;
		min-width: 200px;
		transition: 0.2s ease-in;
		z-index: 9999999;
	}

	&.hidden {
		transform: translateX(-100%);
	}

	.close-sidebar {
		display: flex;
		justify-content: flex-end;
		padding: 10px;
	}

	.close-sidebar > * {
		width: 30px;
		height: 30px;
		cursor: pointer;
	}

	.links {
		margin: 20px 0;

		li {
			font-size: 20px;
			letter-spacing: 2px;
			text-transform: uppercase;

			& > * {
				display: block;
				cursor: pointer;
				border-bottom: 1px solid #fff;
				padding: 15px;
				transition: padding 1s;
				&:hover {
					background: var(--primary-color);
					padding-left: 20px;
				}
			}
		}
	}
`;

export default SidebarEl;
