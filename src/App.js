import React from 'react';
import { ThemeProvider, createTheme, CssBaseline, Container } from '@mui/material';
import AssessmentForm from './assement';
// Create a custom MUI theme (optional)
const theme = createTheme({
  palette: {
    mode: 'light', // or 'dark'
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#9c27b0',
    },
  },
  typography: {
    fontFamily: 'Roboto, sans-serif',
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="md" sx={{ py: 4 }}>
        <div>
        <AssessmentForm></AssessmentForm>
        </div>
      </Container>
    </ThemeProvider>

  );
}

export default App;
