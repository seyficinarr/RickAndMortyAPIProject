import React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';  // Import QueryClient and QueryClientProvider from react-query
import HomePage from './pages/HomePage';  // Import HomePage component

// Create a new instance of QueryClient
const queryClient = new QueryClient();

const App = () => {
  return (
    // Wrap the application with QueryClientProvider to provide react-query context
    <QueryClientProvider client={queryClient}>
      {/* Render the HomePage component */}
      <HomePage />
    </QueryClientProvider>
  );
};

export default App;
