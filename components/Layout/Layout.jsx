import React from 'react';
import { Switch, BrowserRouter } from 'react-router-dom';
import { ApolloProvider } from 'react-apollo';
import styled from 'styled-components';
import { ThemeProvider } from '@material-ui/core/styles';
import { SnackbarProvider } from 'notistack';
import { Sidebar } from '../Sidebar';

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

const Layout = ({ sidebar, theme, apolloClient, children }) => (
    <ApolloProvider client={apolloClient}>
        <BrowserRouter>
            <ThemeProvider theme={theme}>
                <SnackbarProvider hideIconVariant={false}>
                    <Wrapper>
                        <Sidebar items={sidebar} />
                        <Body>
                            <Switch>
                                {children}
                            </Switch>
                        </Body>
                    </Wrapper>
                </SnackbarProvider>
            </ThemeProvider>
        </BrowserRouter>
    </ApolloProvider>
);

export default Layout;
