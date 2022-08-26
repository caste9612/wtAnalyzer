import Plot from 'react-plotly.js'
import { useContext, useEffect, useState, useRef } from 'react';
import { CuvetteContext } from '../lib/context';

export default function PlotCSR(){

    const { cuvettes, setCuvettes } = useContext(CuvetteContext);    //const cuvettes = [1,2,3]
    let xPlot = [];
    let yPlot = [];
    useEffect(() => {
        console.log("ciao dal Plot Client Rendered");
        console.log( cuvettes);
        if(cuvettes.length != 0){
            cuvettes.cuvettes.forEach(cuvette => {
                xPlot.push(cuvette.cuvetteIndex);
                yPlot.push(cuvette.quantity1);
            });
        }
      }, [cuvettes]);
    return(
        <Plot
        data={[
            {
            x: xPlot,
            y: yPlot,
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

