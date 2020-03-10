import React from 'react';
import styled from 'styled-components';
import { SnackbarProvider } from 'notistack';
import Sidebar from '../Sidebar';

const Wrapper = styled.div`
  display: flex;
  height: 100vh;
  overflow: auto;
  background-color: #ffffff;
`;

const Body = styled.div`
  padding: 2rem;
  height: 96vh;
  width: 100%;
  overflow: auto;
`;

function Layout({ sidebar, children }) {
  return <SnackbarProvider hideIconVariant={false}>
        <Wrapper>
          <Sidebar items={sidebar}/>
          <Body>
            {children}
          </Body>
        </Wrapper>
      </SnackbarProvider>
}

export default Layout;
