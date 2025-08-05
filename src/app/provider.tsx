"use client";

import React from 'react'

import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';
import { Toaster } from 'react-hot-toast';

const client = new ApolloClient({
  uri: 'http://localhost:3000/graphql',
  cache: new InMemoryCache()
});


export default function Provider({ children }: { children: React.ReactNode }) {
  return (
    <ApolloProvider
      client={client}>
      {children}
      <Toaster />
    </ApolloProvider>
  )
}
