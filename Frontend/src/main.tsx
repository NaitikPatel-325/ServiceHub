import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { ChakraProvider } from '@chakra-ui/react'
import { extendTheme } from "@chakra-ui/react";
import { Provider } from 'react-redux'
import Store from "./store";

const theme = extendTheme({
  styles: {
    global: {
      body: {
        bg: "#131313",
      },
    },
  },
});

createRoot(document.getElementById('root')!).render(
  
  <ChakraProvider theme={theme}>
    <Provider store={Store}>
      <App />
    </Provider>
  </ChakraProvider>
)
