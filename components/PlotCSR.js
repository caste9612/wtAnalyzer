import Plot from 'react-plotly.js'
import { useContext, useEffect, useState, useRef } from 'react';
import { CuvetteContext } from '../lib/context';

export default function PlotCSR(){

    const { cuvettes, setCuvettes } = useContext(CuvetteContext);

    let xCuvettesIndexes = [];
    let yFirstLiquid = [];
    let ySecondLiquid = [];

    useEffect(() => {
        //console.log("ciao dal Plot Client Rendered");
        console.log( cuvettes);
        if(cuvettes.length != 0){
            cuvettes.cuvettes.forEach(cuvette => {
                let remainLiquid = cuvette.quantity;
                xCuvettesIndexes.push(cuvette.cuvetteIndex);
                remainLiquid -= cuvette.quantity2;
                if(remainLiquid >= 0){
                    yFirstLiquid.push(cuvette.quantity2);
                    ySecondLiquid.push(remainLiquid);
                }else{
                    yFirstLiquid.push(remainLiquid);
                    ySecondLiquid.push(0);
                }
            });
        }
      }, [cuvettes]);



    return(
        <Plot
            data={[
                {
                    x: xCuvettesIndexes,
                    y: yFirstLiquid,
                    marker: {color: 'red'},
                    type: 'bar',
                    name: 'First Liquid Dispensed',
                },
                {
                    x: xCuvettesIndexes,
                    y: ySecondLiquid,
                    marker: {color: 'orange'},
                    type: 'bar',
                    name: 'Second Liquid Dispensed',
                },        
            ]}
        layout={ {title: 'Cuvette Alloc', barmode:'stack'} }
        useResizeHandler={true}
        style={{width: "100%", height: "100%"}}
        /> 
    );
}

