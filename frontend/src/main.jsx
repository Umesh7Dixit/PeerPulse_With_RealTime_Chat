import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { ChakraProvider, ColorModeScript,  extendTheme } from '@chakra-ui/react'
import { mode } from '@chakra-ui/theme-tools'
import { BrowserRouter } from 'react-router-dom'
import { RecoilRoot } from 'recoil'
// import { color } from 'framer-motion'

const styles = {   // object that contains styling configurations.
  global : (props)=> ({  // indicating that these styles apply globally across the entire application.
    body: {              // This refers to the <body> element of the HTML document,
      color: mode('gray.800','whiteAlpha.900')(props),   //sets the text color of the body using Chakra UI's mode function. It dynamically selects the color based on the current color mode ('gray.800' for dark mode, 'whiteAlpha.900' for light mode).
      bg:mode('gray.100','#101010')(props),       //sets the background color based on the current color mode ('gray.100' for dark mode, '#101010' for light mode).
    }
  })
};


const colors = {
  gray:{
    light:"#616161",
    dark:"#1e1e1e",
  }
}

const config = {
  initialColorMode: 'dark',
  useSystemColorMode: true,
};


const theme = extendTheme({ config, styles, colors });

// ColorModeScript in color mode in chakraUI

ReactDOM.createRoot(document.getElementById('root')).render(
    // <React.StrictMode> => during development due to this everything on console or token shown twice so to reduce this we comment it out 
  //  <React.StrictMode>  renders every component twice on development on production its gonna be normal
  <React.StrictMode> 
    <RecoilRoot>
    <BrowserRouter>
    <ChakraProvider theme={theme} >
    <ColorModeScript initialColorMode={theme.config.initialColorMode}/>
      <App />
    </ChakraProvider>
    </BrowserRouter>
    </RecoilRoot>
   </React.StrictMode>,
)
