import Plot from 'react-plotly.js'
import { useContext, useEffect, useState, useRef } from 'react';
import { CuvetteContext } from '../lib/context';
import Graph from 'graphology';
import { MultiGraph } from 'graphology';
import { SigmaContainer, useLoadGraph, ControlsContainer, ZoomControl, FullScreenControl, LayoutForceAtlas2Control, SearchControl } from "@react-sigma/core";
import "@react-sigma/core/lib/react-sigma.min.css";
import { isUndefined, sample } from 'lodash';
import drawLabel from 'sigma/rendering/canvas/label';
import drawEdgeLabel from 'sigma/rendering/canvas/edge-label';

export default function PlotCSR(){

    const { cuvettes, setCuvettes } = useContext(CuvetteContext);

    const graph = new MultiGraph();

    //Cuvette Table List
    let values = [[]];
    let tablesColor = [[]];
    let headers = [["<b> CuvetteIndex </b>"], ["<b> Diluent </b>"], ["<b> Quantity1 </b>"], ["<b> Liquid </b>"], ["<b> Quantity2 </b>"], ["<b> Quantity </b>"], ["<b> FromCuvette </b>"]];

    //Cuvette Volumes
    const [testVolume, setTestVolume] = useState(30);

    let deadVolumes = [];
    let feasibleTest = [];
    let usableLiquid = [];
    let usedLiquids = [];
    let usedLiquidsText = [];

    //SlideTreeMap
    let slides = [];
    let cuvetteInSlides = [];
    let slidesParents = [];
    let zones = [];

    //Liquids Usage
    let diluentsUsage = [];
    let diluentsNames = [];
    let diluentsColor = [];

    let samplesUsage = [];
    let samplesNames = [];
    let samplesColor = [];

    //Cuvette Alloc
    let xCuvettesIndexes = [];
    let yFirstLiquid = [];
    let yFirstLiquidColor = [];
    let ySecondLiquid = [];
    let ySecondLiquidColor = [];

    let clr =[];
    var uniqueArray = [];

    function addSampleColor(liquid2){
        for(let i = 0; i < xCuvettesIndexes.length; i++){
            if(xCuvettesIndexes[i] == liquid2){
                yFirstLiquidColor.push(addAlpha(yFirstLiquidColor[i], 0.5));
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

    function testVolumeChange(newValue){
        //setTestVolume(newValue);
        //populateAll();
    }

    function resetArrays(){
        xCuvettesIndexes.length = 0;
        yFirstLiquid.length = 0;
        yFirstLiquidColor.length = 0;
        ySecondLiquid.length = 0;
        ySecondLiquidColor.length = 0;
        values.length = 0;
        diluentsNames.length = 0;
        diluentsUsage.length = 0;
        diluentsColor.length = 0;
        samplesUsage.length = 0;
        samplesNames.length = 0;
        samplesColor.length = 0; 
        clr.length = 0;
        uniqueArray.length = 0;
        deadVolumes.length = 0;
        feasibleTest.length = 0;
        usedLiquids.length = 0;
        usableLiquid.length = 0;
        usedLiquidsText.length = 0;
        cuvetteInSlides.length = 0;
        slidesParents.length = 0;
        graph.clear();
    }

    function computeLiquidsColors(){
        for(let i=0; i < cuvettes.cuvettes.length; i++){
            if(uniqueArray.includes(cuvettes.cuvettes[i].liquid2) == false) {
                uniqueArray.push(cuvettes.cuvettes[i].liquid2);
            }
        }
        for(var i = 0; i < uniqueArray.length; i++)
        {
            clr.push('#'+Math.floor(Math.random()*16777215).toString(16) + 'FF');
        }
    }

    function computeCuvetteAlloc(){
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

                let skip = index >= 7 ? true : false;

                if(skip === false){
                    if(values.length < 7) values.push([]);
                    values[index].push(cuvette[value]);
    
                    if(tablesColor.length < 7) tablesColor.push([]);
                    if(cuvette.fromCuvette == false)
                        tablesColor[index].push(clr[uniqueArray.indexOf(cuvette.liquid2)]);
    
                    if(cuvette.fromCuvette == true){
                        for(let k = 0; k < xCuvettesIndexes.length; k++){
                            if(xCuvettesIndexes[k] == cuvette.liquid2){
                                tablesColor[index].push(addAlpha(yFirstLiquidColor[k], 0.5));
                                break;
                            }
                        }
                    }
                }

            })
        });
    }

    function computeLiquidsStatistics(){
        cuvettes.cuvettes.forEach(cuvette => {

            if(diluentsNames.includes(cuvette.liquid1) === false){
                diluentsNames.push(cuvette.liquid1);
                diluentsUsage.push(cuvette.quantity1);
                if(cuvette.liquid1 == "tanktank"){
                    diluentsColor.push("rgba(0,0,255,0.3)");
                }else{
                    diluentsColor.push("rgba(0,0,0,0.3)");
                }
            }else{
                for(let i = 0; i < diluentsUsage.length; i++){
                    if(diluentsNames[i] === cuvette.liquid1){
                        diluentsUsage[i] += cuvette.quantity1;
                    }
                }
            }

            if(samplesNames.includes(cuvette.liquid2) === false && cuvette.fromCuvette === false){
                samplesNames.push(cuvette.liquid2);
                samplesUsage.push(0);
                samplesColor.push(clr[uniqueArray.indexOf(cuvette.liquid2)]);
            }
            if(samplesNames.includes(cuvette.liquid2) === true){
                for(let i = 0; i < samplesUsage.length; i++){
                    if(samplesNames[i] === cuvette.liquid2){
                        samplesUsage[i] += cuvette.quantity2;
                    }
                }
            }

        });
    }

    function checkCuvettesVolumes(cuvettesTMP){

        cuvettesTMP.forEach(cuvette => {
            cuvette.clientsCuvette = [];
            cuvette.remainLiqud = cuvette.quantity - 190;
            cuvette.aspiratedLiquid = 0;
            cuvette.usedLiquidText = "";
        });

        cuvettesTMP.forEach(cuvette => {
            if(cuvette.fromCuvette){
                cuvettesTMP.forEach(cuvetteInner => {
                    if(cuvetteInner.cuvetteIndex === cuvette.liquid2 && cuvette.cuvetteIndex != undefined){
                        cuvetteInner.clientsCuvette.push(cuvette.cuvetteIndex);                        
                        cuvetteInner.usedLiquidText += (" " + cuvette.cuvetteIndex);
                        cuvetteInner.remainLiqud -= cuvette.quantity2;
                        cuvetteInner.aspiratedLiquid += cuvette.quantity2;
                    }
                });
            }
        });

        cuvettesTMP.forEach(cuvette => {
            cuvette.feasibleTest = cuvette.remainLiqud > 0 ? Math.floor(cuvette.remainLiqud/testVolume) : 0;
            deadVolumes.push(190);
            feasibleTest.push(cuvette.feasibleTest);
            usableLiquid.push(cuvette.remainLiqud);
            usedLiquids.push(cuvette.aspiratedLiquid)
            usedLiquidsText.push(cuvette.usedLiquidText);
        });
        console.log("CuvettesTMP: ", cuvettesTMP);
    }

    function graphCreation(cuvettesForGrap){

        cuvettesForGrap.sort((a, b) => a.cuvetteIndex - b.cuvetteIndex);

        let xCuvetteGraph = 0;
        let yCuvetteGraph = 0;

        cuvettesForGrap.forEach(cuvette => {
            if(!cuvette.fromCuvette){
                cuvette.sample = cuvette.liquid2;
                let sampleCuvette = {
                    clientsCuvette: [cuvette.cuvetteIndex],
                    cuvetteIndex: cuvette.liquid2,
                    sample: cuvette.liquid2,
                    fromCuvette: false,
                }
                let xxx = structuredClone(sampleCuvette);

                let include = false;
                cuvettesForGrap.forEach(element => {
                    if(element.cuvetteIndex === xxx.cuvetteIndex){
                        include = true;
                        if(!element.clientsCuvette.includes(cuvette.cuvetteIndex))
                            element.clientsCuvette.push(cuvette.cuvetteIndex);
                    }
                });
                if(!include)
                    cuvettesForGrap.unshift(xxx);
            }
            if(cuvette.clientsCuvette != undefined){
                cuvette.clientsCuvette.forEach(client => {
                    cuvettesForGrap.forEach(test => {
                        if(test.cuvetteIndex === client){
                            test.sample = cuvette.sample;
                        }
                    });
                });
            }
        });

        console.log(cuvettesForGrap);

        cuvettesForGrap.forEach(cuvette => {
            if(!graph.hasNode(cuvette.cuvetteIndex)){
                populateGraph(cuvette, xCuvetteGraph, yCuvetteGraph, cuvettesForGrap);
                xCuvetteGraph += 100;
            }
        });

    }

    let subtrees = 0;
    //RECURSIVE
    function populateGraph(currentCuvette, x, y, cuvettesTMP){

        let tmpXdelta = -0;
        
        if(currentCuvette.cuvetteIndex != undefined){
            if(!graph.hasNode(currentCuvette.cuvetteIndex)){
                graph.addNode(currentCuvette.cuvetteIndex, { x: x + 15, y: y, size: 15, label: currentCuvette.cuvetteIndex + " [1:" + currentCuvette.quantity/currentCuvette.quantity2 + "]", color: clr[uniqueArray.indexOf(currentCuvette.sample)] });
                
                if(typeof currentCuvette.dispWell === "undefined"){
                }else{
                    if(graph.hasNode(currentCuvette.dispWell.wellDisp.rack.toString() + currentCuvette.dispWell.wellDisp.slide.toString() + currentCuvette.dispWell.wellDisp.zone + currentCuvette.dispWell.wellDisp.well) == false){
                        graph.addNode(currentCuvette.dispWell.wellDisp.rack.toString() + currentCuvette.dispWell.wellDisp.slide.toString() + currentCuvette.dispWell.wellDisp.zone + currentCuvette.dispWell.wellDisp.well, {x: x + 19, y: y - 4, size: 15, label: currentCuvette.dispWell.wellDisp.rack.toString() + "-" + currentCuvette.dispWell.wellDisp.slide.toString() + " " + currentCuvette.dispWell.wellDisp.zone + ":" + currentCuvette.dispWell.wellDisp.well, color: "grey" });
                        graph.addEdge(currentCuvette.cuvetteIndex, currentCuvette.dispWell.wellDisp.rack.toString() + currentCuvette.dispWell.wellDisp.slide.toString() + currentCuvette.dispWell.wellDisp.zone + currentCuvette.dispWell.wellDisp.well);
                    }else{
                        //console.log(currentCuvette.cuvetteIndex, currentCuvette.dispWell.wellDisp.rack.toString() + "-" + currentCuvette.dispWell.wellDisp.slide.toString() + " " + currentCuvette.dispWell.wellDisp.zone + ":" + currentCuvette.dispWell.wellDisp.well);
                    }
                }
            }

            if(currentCuvette.clientsCuvette != undefined){
                currentCuvette.clientsCuvette.forEach( clientCuvette => {
                    //console.log("Cerco figli di ", currentCuvette.cuvetteIndex);

                    if(cuvettesTMP != undefined){
                        cuvettesTMP.forEach(test => {
                            if(test.cuvetteIndex === clientCuvette){
                                subtrees += 1;
                                populateGraph(test, x + tmpXdelta , y + 15, cuvettesTMP);
                                //console.log("chiudo ricorsione");
                                subtrees -= 1;
                                //console.log(subtrees);
                                tmpXdelta += 15;
                            }
                        });
                    }

                    //console.log("arco ", currentCuvette.cuvetteIndex, "    ", clientCuvette);
                    if(graph.hasEdge(currentCuvette.cuvetteIndex, clientCuvette)){
                        //console.log("Troppi edge");
                    }else{
                        graph.addUndirectedEdge(currentCuvette.cuvetteIndex, clientCuvette, { type: "line", label: "Ciao" , color : "black", size: 3});
                    }
                    tmpXdelta += ( 10 * subtrees);
                });
            }
        }
    } 

    function mapCreation(cuvetteTMP){
        cuvetteTMP.forEach(cuvette => {
            if(cuvette.dispWell != undefined){

                if(cuvetteInSlides.includes("Rack " + cuvette.dispWell.wellDisp.rack.toString()) == false){
                    cuvetteInSlides.push("Rack " + cuvette.dispWell.wellDisp.rack.toString())
                    slidesParents.push("");
                }     

                if(cuvetteInSlides.includes("Slide " + cuvette.dispWell.wellDisp.slide.toString()) == false){
                    cuvetteInSlides.push("Slide " + cuvette.dispWell.wellDisp.slide.toString())
                    slidesParents.push("Rack " + cuvette.dispWell.wellDisp.rack.toString());
                }

                cuvetteInSlides.push(cuvette.cuvetteIndex);
                slidesParents.push("Slide " + cuvette.dispWell.wellDisp.slide.toString());
            }
        });
    }

    function populateAll(){
        resetArrays();

        if(cuvettes.length != 0){

            //Colors computation
            computeLiquidsColors();

            //Cuvette graphics and table creation
            computeCuvetteAlloc();

            //Cuvette usage
            let cuvettesTMP = structuredClone(cuvettes.cuvettes);
            checkCuvettesVolumes(cuvettesTMP);

            //Dilution Graph
            let cuvettesG = structuredClone(cuvettesTMP);
            graphCreation(cuvettesG);

            //Slide Map
            let cuvettesM = structuredClone(cuvettesTMP);
            mapCreation(cuvettesM);

            //Liquids usage statistics
            computeLiquidsStatistics();

        }
    }

    function LoadGraph () {
        const loadGraph = useLoadGraph();
      
        useEffect(() => {
          loadGraph(graph);
        }, [loadGraph]);
      
        return null;
      };  

    useEffect(() => {

        console.log( cuvettes);
        populateAll();
        
      }, [cuvettes]);




    return(
        
        <div className='containerColumn'>

            {/* CUVETTE ALLOC */}
            <div className='cardFull'>
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
                    style={{width: "100%", height: "50vh"}}
                /> 
            </div>

            {/* CUVETTE USAGE */}
            <div className='cardFull'>
                <Plot
                    data={[
                        {
                            x: xCuvettesIndexes,
                            y: deadVolumes,
                            marker: {color: "black"},
                            type: 'bar',
                            name: 'Dead Volume',
                        },
                        {
                            x: xCuvettesIndexes,
                            y: usedLiquids,
                            text: usedLiquidsText,
                            marker: {color: "orange"},
                            type: 'bar',
                            name: 'Used Liquid',
                        }, 
                        {
                            x: xCuvettesIndexes,
                            y: usableLiquid,
                            marker: {color: "green"},
                            type: 'bar',
                            name: 'Usable Liquid',
                        },    
                    ]}
                    layout={ {
                        title: 'Cuvette Utilization', 
                        barmode:'stack',
                        yaxis: {title: 'micro l'},
                    }}
                    useResizeHandler={true}
                    style={{width: "100%", height: "50vh"}}
                /> 
            </div>

            {/* CUVETTE GRAPH */}
            <div className='cardFull'>
                <SigmaContainer style={{ height: "900px", width: "100%"}}>
                    <ControlsContainer position={"bottom-right"}>
                        <ZoomControl />
                    </ControlsContainer>
                    { <LoadGraph /> }
                </SigmaContainer>     
            </div>

            {/* CUVETTE MAPTREE */}
            <div className='cardFull'>
                <Plot data = {[{
                    type: "treemap",
                    labels: cuvetteInSlides,
                    parents: slidesParents
                }]}
                layout={ {
                    title: 'Slide Allocation', 
                }}
                useResizeHandler={true}
                style={{width: "100%", height: "50vh"}}
                />
            </div>

            {/* CUVETTE TESTS */}
            <div className='container'>
                <div className='card'>
                    <div className='container'>
                        <label>Test Volume:</label>
                        <input
                            type="text"
                            id="roll"
                            name="roll"
                            value={testVolume}
                            required
                            minLength="1"
                            maxLength="3"
                            onChange={(e) => testVolumeChange(e.target.value)}
                        />
                    </div>
                </div>
                <div className='plotSolidContainer'>
                        <Plot
                            data={[
                                {
                                    x: xCuvettesIndexes,
                                    y: feasibleTest,
                                    marker: {
                                        color: "blue",
                                        line: {
                                            color: 'rgb(8,48,107)',
                                            width: 1.5
                                        }
                                    },
                                    text:feasibleTest,
                                    textposition: 'auto',
                                    type: 'bar',
                                },      
                            ]}
                            layout={ {title: 'Feasible tests', barmode:'stack'} }
                            useResizeHandler={true}
                            style={{width: "100%", height: "90%"}}
                        /> 
                </div>
            </div>
            
            {/* LIQUIDS USAGE */}
            <div className='container'>
                <div className='plotSolidContainer'>
                        <Plot
                            data={[
                                {
                                    x: diluentsNames,
                                    y: diluentsUsage,
                                    marker: {
                                        color: diluentsColor,
                                        line: {
                                            color: 'rgb(8,48,107)',
                                            width: 1.5
                                        }
                                    },
                                    text: diluentsUsage,
                                    textposition: 'auto',
                                    type: 'bar',
                                },      
                            ]}
                            layout={ {title: 'Diluents Usage', barmode:'stack'} }
                            useResizeHandler={true}
                            style={{width: "100%", height: "90%"}}
                        /> 
                </div>
                
                <div className='plotSolidContainer'>
                    <Plot
                        data={[
                            {
                                x: samplesNames,
                                y: samplesUsage,
                                marker: {
                                    color: samplesColor,
                                    line: {
                                        color: 'rgb(8,48,107)',
                                        width: 1.5
                                    }
                                },
                                text: samplesUsage,
                                textposition: 'auto',
                                type: 'bar',
                            },      
                        ]}
                        layout={ {title: 'Samples Usage', barmode:'stack'} }
                        useResizeHandler={true}
                        style={{width: "100%", height: "90%"}}
                    /> 
                </div>
                
            </div>

            {/* CUVETTE TABLE */}
            <div className='cardFull'>
                <Plot className='cuvetteTable' 
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
                            height: 30,
                            font: { family: "Ubuntu" , size: 16},
                            fill: {color: tablesColor},
                        },
                        },
                    ]}
                    layout={ {title: 'Cuvette List', autosize: true, responsive: true}} 
                    useResizeHandler={true}
                />
            </div>

        </div>
    );
}

