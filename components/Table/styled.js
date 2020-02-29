import styled from 'styled-components';

export const StyledTable = styled.table`
  width: 100%;
  border-radius: 0.3rem;
  border-collapse: collapse;
  overflow: hidden;
  table-layout: fixed;
  box-shadow: 0 1px 4px 0 rgba(0, 0, 0, 0.14);
  background: repeating-linear-gradient(
      transparent,
      transparent 20px,
      #037B86 22px
    ),
    repeating-linear-gradient(
      90deg,
      transparent,
      transparent 20px,
      #037B86 22px
    );
  tr {
    height: 3.75rem;
    font-size: 0.8rem;
    cursor: grab;
    display: table-row;
    user-select: none;
    background-color: #ffffff;

    &:not(:last-child) {
      border-bottom: 0.6px solid rgba(#8a97a6, 0.3);
    }
  }

  thead {
    tr {
      color: ${props => props.theme.colors.base};
      background-color: #037B86;
    }
  }

  td,
  th {
    padding: 0.6rem 0;
    vertical-align: middle;
    text-align: center;
    display: table-cell;
  }

  img {
    width: 4.3rem;
  }
`;
