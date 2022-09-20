import { useContext, useEffect, useState } from 'react';
import Router from 'next/router';
import { CuvetteContext } from '../lib/context';
import styles from "../styles/Navbar.module.css";
import Image from 'next/image';
import Logo from '../public/VisiaLab-Logo-RGB-Icon-HD.png';
import AspirateCuvetteProcessor from '../lib/AspirateCuvetteProcessor';
import AspirateTankProcessor from '../lib/AspirateTankProcessor';
import AspirateTubeProcessor from '../lib/AspirateTubeProcessor';
import DispenseProcessor from '../lib/DispenseProcessor';
import DispenseWellProcessor from '../lib/DispenseWellProcessor';
import NotYetImplementedProcessor from '../lib/NotYetImplementedProcessor';
import { GrRefresh } from 'react-icons/gr';

export default function Navbar() {

    function resetPage(){
        Router.reload();
    }

    function createNeedleOperationProcessor(type) {
        switch(type){
            case "DISPENSE_CUVETTE": return new DispenseProcessor();
            case "ASPIRATE_TUBE": return new AspirateTubeProcessor();
            case "ASPIRATE_TANK": return new AspirateTankProcessor();
            case "ASPIRATE_CUVETTE": return new AspirateCuvetteProcessor();
            case "SAMPLE_DISPENSATION\r": return "End of dilution phase";
            case "DISPENSE_WELL": return new DispenseWellProcessor();
            case "SAMPLE_WASHING\r": return null;
            default: return new NotYetImplementedProcessor();
        }
    }

    function computeCuvetteAlloc(){
        for(let i = 0; i < needleAps.length - 2; i+=3){
            let tmpCuvette = {
                    cuvetteIndex: needleAps[i + 2].pos1 + needleAps[i + 2].pos2,
                    liquid1: String(needleAps[i].pos1) + String(needleAps[i].pos2), 
                    quantity1: needleAps[i].quantity,
                    liquid2: needleAps[i + 1].pos1 + needleAps[i + 1].pos2,
                    quantity2: needleAps[i + 1].quantity,
                    //cuvetteIndex: ((needleAps[i + 2].pos1 -1 ) * 8) + needleAps[i + 2].pos2,
                    quantity: needleAps[i + 2].quantity,
                    fromCuvette: !isNaN(parseFloat(needleAps[i + 1].pos1)) && !isNaN(needleAps[i + 1].pos1 - 0)
                }
            tmpCuvettes.push(tmpCuvette);

            if(needleApp.length >= i + 3){
                tmpCuvette = {
                    cuvetteIndex: needleApp[i + 2].pos1 + needleApp[i + 2].pos2,
                    liquid1: String(needleApp[i].pos1) + String(needleApp[i].pos2), 
                    quantity1: needleApp[i].quantity,
                    liquid2: needleApp[i + 1].pos1 + needleApp[i + 1].pos2,
                    quantity2: needleApp[i + 1].quantity,
                    //cuvetteIndex: ((needleApp[i + 2].pos1 -1) * 8) + needleApp[i + 2].pos2,
                    quantity: needleApp[i + 2].quantity,
                    fromCuvette: !isNaN(parseFloat(needleApp[i + 1].pos1)) && !isNaN(needleApp[i + 1].pos1 - 0)
                }
                tmpCuvettes.push(tmpCuvette);
            }
        } 
    }

    function computeWellDispensation(){
        let dispOP = [];

        for(let i = 0; i < wellDispAps.length; i++){
            let disp = {
                cuvette: cuvetteWellDispAps[i],
                wellDisp: wellDispAps[i]
            }
            dispOP.push(disp);
        }
        for(let i = 0; i < wellDispApp.length; i++){
            let disp = {
                cuvette: cuvetteWellDispApp[i],
                wellDisp: wellDispApp[i]
            }
            dispOP.push(disp);
        }

        dispOP.forEach(dispensation => {
            let cuvetteID = dispensation.cuvette.pos1 + dispensation.cuvette.pos2;

            tmpCuvettes.forEach(cuvette => {
                if(cuvetteID === cuvette.cuvetteIndex){
                    cuvette.dispWell = dispensation;
                }
            });
        });
    }

    const { cuvettes, setCuvettes } = useContext(CuvetteContext);

    let tmpCuvettes = [];
    let needleApp = [];
    let needleAps = [];

    let cuvetteWellDispApp = [];
    let cuvetteWellDispAps = [];

    let wellDispApp = [];    
    let wellDispAps = [];

    function setSelectedFile(file){

        var sampleDispensation = false;

        var reader = new FileReader();
        reader.onload = function(progressEvent){
            var lines = this.result.split('\n');
            for(var line = 0; line < lines.length; line++){
                let words = lines[line].split("(");
                if(words.length > 0){

                    let commandProcessor = createNeedleOperationProcessor(words[0]);

                    //Seond phase set
                    if(commandProcessor === "End of dilution phase"){
                        console.log("End of dilution phase processing...");
                        sampleDispensation = true;
                        continue;
                    }

                    //STOP
                    if(commandProcessor == null){
                        console.log("STOP WT READ");
                        line = lines.length;
                    }else{

                        if(sampleDispensation === false){
                            let processResults = commandProcessor.process(words[1]);

                            processResults.forEach( pr => {
                                if(pr.needle === "APS")
                                    needleAps.push(pr.needleOperation);
                                if(pr.needle === "APP")
                                    needleApp.push(pr.needleOperation);
                            })
                        }else{
                            let processResults = commandProcessor.process(words[1]);

                            processResults.forEach( pr => {
                                if(pr.needle != 'SKIP'){
                                    if(pr.needleOperation.type === "ASP_CVT"){
                                        if(pr.needle === "APS")
                                            cuvetteWellDispAps.push(pr.needleOperation);
                                        if(pr.needle === "APP")
                                            cuvetteWellDispApp.push(pr.needleOperation);
                                    }
                                    if(pr.needleOperation.type === "WELL"){
                                        if(pr.needle === "APS")
                                            wellDispAps.push(pr.needleOperation);
                                        if(pr.needle === "APP")
                                            wellDispApp.push(pr.needleOperation);
                                    }
                                }
                            })                        
                        }
                    }
                }
            }
            console.log("APSops: ",  needleAps);
            console.log("APPops: ", needleApp);
            //console.log("APSdispAsp: ",  cuvetteWellDispAps);
            //console.log("APPdispAsp: ", cuvetteWellDispApp);
            //console.log("APSdisp: ",  wellDispAps);
            //console.log("APPdisp: ", wellDispApp);

            computeCuvetteAlloc();

            computeWellDispensation();

            setCuvettes({cuvettes: tmpCuvettes});
            }
          
          reader.readAsText(file);
    }

    const selectedFile = '';
    
    return(
        <nav className="navbar">
            <ul>

                <li>
                    <button className='btn-logo'>
                        <img src= {Logo.src}/>
                    </button>
                </li>

                <li>
                    <label className={styles.customfileupload}>
                        Upload WT File
                        <input id="file-upload" type="file" value={selectedFile} onChange={(e) => setSelectedFile(e.target.files[0])}/>
                    </label>
                </li>

                <li>
                    <button className='btn-red' onClick={resetPage}>
                        <GrRefresh />
                    </button>
                </li>

            </ul>
        </nav>
    );
}

