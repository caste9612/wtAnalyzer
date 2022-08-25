import Navbar from '../components/Navbar';
import { CuvetteContext, CuvettesProvider } from '../lib/context';
import { createContext, useContext, useEffect, useState } from 'react'
import '../styles/globals.css'

function MyApp({ Component, pageProps }) {

  const[cuvettes, setCuvettes] = useState([]);

  useEffect(() => {
    console.log("ciao dalla App page");
    //setCuvettesData({ cuvettes: {  } });
  }, [JSON.stringify(cuvettes)]);

  return (
    <CuvetteContext.Provider value={{cuvettes, setCuvettes}}>
      <Navbar />
      <Component {...pageProps} />
    </CuvetteContext.Provider> 
  );
}

export default MyApp
