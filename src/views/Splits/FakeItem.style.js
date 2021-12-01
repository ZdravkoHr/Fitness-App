import styled from 'styled-components';

const Item = styled.div`
	& {
		position: absolute;
		top: 0;
		left: 0;
		z-index: 10;

		&.dragging {
			opacity: 0.9;
		}
	}
`;

export default Item;
