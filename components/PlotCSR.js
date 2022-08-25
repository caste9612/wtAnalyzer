import Plot from 'react-plotly.js'
import { useContext, useEffect, useState, useRef } from 'react';
import { CuvetteContext } from '../lib/context';

export default function PlotCSR(){

    const { cuvettes } = useContext(CuvetteContext);
    //const cuvettes = [1,2,3]
    useEffect(() => {
        console.log("ciao dal Plot Client Rendered");
        //setCuvettesData({ cuvettes: {  } });
      }, [cuvettes]);
    return(
        <Plot
        data={[
            {
            //x: [1,2,3],
            x: cuvettes?.length > 0 ? cuvettes[0].cuvetteIndex : [1,2,3],
            y: [1,2,3],
            //y: cuvettes.length != 0 ? cuvettes[0].quantity : [1,2,3],
            type: 'scatter',
            mode: 'lines+markers',
            marker: {color: 'red'},
            },
            {type: 'bar', x: [1, 2, 3], y: [2, 5, 3]},
        ]}
        layout={ {width: 320, height: 240, title: 'A Fancy Plot'} }
        /> 
        
    );
}

