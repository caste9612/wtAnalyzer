import Navbar from '../components/Navbar';
import { CuvetteContext, CuvettesProvider } from '../lib/context';
import { createContext, useContext, useState } from 'react'
import '../styles/globals.css'

function MyApp({ Component, pageProps }) {


  const [cuvettes, setCuvettesData] = useState({cuvettes: []});

  return (
    <CuvetteContext.Provider value={{cuvettes, setCuvettesData}}>
      <Navbar />
      <Component {...pageProps} />
    </CuvetteContext.Provider> 
  );
}

export default MyApp
