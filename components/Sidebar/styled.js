import styled from 'styled-components';
import { Link } from 'react-router-dom';

export const Wrapper = styled.div`
  width: 4.3rem;
  height: 100%;
  background-color: #ffffff;
  box-shadow: 0 3px 3px rgba(0,0,0,0.2);
  border-right: 1px solid #dddddd;
`;

export const Item = styled(Link)`
  height: 2.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
`;
