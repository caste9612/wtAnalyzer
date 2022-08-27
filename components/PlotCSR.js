import Plot from 'react-plotly.js'
import { useContext, useEffect, useState, useRef } from 'react';
import { CuvetteContext } from '../lib/context';

export default function PlotCSR(){

    const { cuvettes, setCuvettes } = useContext(CuvetteContext);

    let values = [[]];
    let headers = [["<b> cuvetteIndex </b>"], ["<b> liquid1 </b>"], ["<b> quantity1 </b>"], ["<b> liquid2 </b>"], ["<b> quantity2 </b>"], ["<b> quantity </b>"], ["<b> fromCuvette </b>"]];


    let xCuvettesIndexes = [];
    let yFirstLiquid = [];
    let yFirstLiquidColor = [];
    let ySecondLiquid = [];
    let ySecondLiquidColor = [];

    function addSampleColor(liquid2){
        for(let i = 0; i < xCuvettesIndexes.length; i++){
            if(xCuvettesIndexes[i] == liquid2){
                yFirstLiquidColor.push(addAlpha(yFirstLiquidColor[i], 0.5));
                console.log(yFirstLiquidColor[i]);
                break;
            }
        }
    }

    function addAlpha(color, opacity) {
        // coerce values so ti is between 0 and 1.
        var _opacity = Math.round(Math.min(Math.max(opacity || 1, 0), 1) * 255);
        color = color.substring(0, color.length - 2);
        return color + _opacity.toString(16).toUpperCase();
    }

    useEffect(() => {
        //console.log("ciao dal Plot Client Rendered");
        console.log( cuvettes);
        xCuvettesIndexes.length = 0;
        yFirstLiquid.length = 0;
        yFirstLiquidColor.length = 0;
        ySecondLiquid.length = 0;
        ySecondLiquidColor.length = 0;

        if(cuvettes.length != 0){
            var uniqueArray = [];
            for(let i=0; i < cuvettes.cuvettes.length; i++){
                if(uniqueArray.includes(cuvettes.cuvettes[i].liquid2) == false) {
                    uniqueArray.push(cuvettes.cuvettes[i].liquid2);
                }
                console.log(uniqueArray.includes(cuvettes.cuvettes[i].liquid2));
            }
            var clr =[];
            for(var i = 0; i < uniqueArray.length; i++)
            {
                clr.push('#'+Math.floor(Math.random()*16777215).toString(16) + 'FF');
            }
            console.log(clr);
        }

        if(cuvettes.length != 0){
            values.length = 0;

            cuvettes.cuvettes.forEach(cuvette => {
                let remainLiquid = cuvette.quantity;
                xCuvettesIndexes.push(cuvette.cuvetteIndex);
                remainLiquid -= cuvette.quantity2;
                if(remainLiquid >= 0){
                    yFirstLiquid.push(cuvette.quantity2);
                    ySecondLiquid.push(remainLiquid);
                    if(cuvette.fromCuvette == true){
                        addSampleColor(cuvette.liquid2)
                    }
                    else{
                        yFirstLiquidColor.push(clr[uniqueArray.indexOf(cuvette.liquid2)]);
                    }
                }else{
                    yFirstLiquid.push(remainLiquid);
                    ySecondLiquid.push(0);
                    if(cuvette.fromCuvette == true){
                        addSampleColor(cuvette.liquid2)
                    }
                    else{
                        yFirstLiquidColor.push(clr[uniqueArray.indexOf(cuvette.liquid2)]);
                    }
                }
                if(cuvette.liquid1 == "tanktank"){
                    ySecondLiquidColor.push("rgba(0,0,255,0.3)");
                }
                else{
                    ySecondLiquidColor.push("rgba(0,0,0,0.3)");
                }

                Object.keys(cuvette).forEach((value, index) => {
                    if(values.length < 7) values.push([]);
                    console.log(value, index);
                    values[index].push(cuvette[value])
                })
            });

        }

      }, [cuvettes]);


    return(
        <div>
            <Plot
                data={[
                    {
                        x: xCuvettesIndexes,
                        y: yFirstLiquid,
                        marker: {color: yFirstLiquidColor},
                        type: 'bar',
                        name: 'First Liquid Dispensed',
                    },
                    {
                        x: xCuvettesIndexes,
                        y: ySecondLiquid,
                        marker: {color: ySecondLiquidColor},
                        type: 'bar',
                        name: 'Second Liquid Dispensed',
                    },        
                ]}
                layout={ {title: 'Cuvette Alloc', barmode:'stack'} }
                useResizeHandler={true}
                style={{width: "100%", height: "100%"}}
            /> 

            
            <Plot
                data={[
                    {
                    type: "table",
                    header: {
                        values: headers,
                        align: "center",
                        fill: { color: "#2849cc" },
                        font: { color: "white", size: 20 },
                    },
                    cells: {
                        values: values,
                        align: "center",
                        font: { family: "Ubuntu" },
                    },
                    },
                ]}
                layout={ {title: 'Cuvette List'} } 
                useResizeHandler={true}
                style={{width: "100%", height: "100%"}}
            />

        </div>
    );
}

