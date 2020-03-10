import React from 'react';
import { ApolloProvider } from 'react-apollo';
import styled from 'styled-components';
import { ThemeProvider } from '@material-ui/core/styles';
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

function Layout({ sidebar, theme, apolloClient, children }) {
  return <ApolloProvider client={apolloClient}>
    <ThemeProvider theme={theme}>
      <SnackbarProvider hideIconVariant={false}>
        <Wrapper>
          <Sidebar items={sidebar}/>
          <Body>
            {children}
          </Body>
        </Wrapper>
      </SnackbarProvider>
    </ThemeProvider>
  </ApolloProvider>
}

export default Layout;
