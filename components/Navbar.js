import { useContext, useEffect, useState } from 'react';
import { CuvetteContext } from '../lib/context';
import styles from "../styles/Navbar.module.css";
import Image from 'next/image';
import Logo from '../public/VisiaLab-Logo-RGB-Icon-HD.png';
import AspirateCuvetteProcessor from '../lib/AspirateCuvetteProcessor';
import AspirateTankProcessor from '../lib/AspirateTankProcessor';
import AspirateTubeProcessor from '../lib/AspirateTubeProcessor';
import DispenseProcessor from '../lib/DispenseProcessor';
import NotYetImplementedProcessor from '../lib/NotYetImplementedProcessor';

export default function Navbar() {

    function createNeedleOperationProcessor(type) {
        switch(type){
            case "DISPENSE_CUVETTE": return new DispenseProcessor();
            case "ASPIRATE_TUBE": return new AspirateTubeProcessor();
            case "ASPIRATE_TANK": return new AspirateTankProcessor();
            case "ASPIRATE_CUVETTE": return new AspirateCuvetteProcessor();
            case "DISPENSE_WELL": return null;
            default: return new NotYetImplementedProcessor();
        }
    }

    function computeCuvetteAlloc(){
        for(let i = 0; i < needleAps.length-1; i+=3){
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

            if(needleApp.length >= i + 2){
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

    const { cuvettes, setCuvettes } = useContext(CuvetteContext);

    let tmpCuvettes = [];
    let needleApp = [];
    let needleAps = [];

    function setSelectedFile(file){
        var reader = new FileReader();
        reader.onload = function(progressEvent){
            var lines = this.result.split('\n');
            for(var line = 0; line < lines.length; line++){
                let words = lines[line].split("(");
                if(words.length > 1){

                    let commandProcessor = createNeedleOperationProcessor(words[0]);

                    if(commandProcessor == null){
                        line = lines.length;
                    }else{
                        let processResult = commandProcessor.process(words[1]);

                        if(processResult.needle === "APS")
                            needleAps.push(processResult.needleOperation);
                        if(processResult.needle === "APP")
                            needleApp.push(processResult.needleOperation);
                    }
            
                }
            }
            console.log("APSops: ",  needleAps);
            console.log("APPops: ", needleApp);

            computeCuvetteAlloc();
            setCuvettes({cuvettes: tmpCuvettes});
            }
          
          reader.readAsText(file);
    }

    const selectedFile = '';
    
    return(
        <nav className="navbar">
            <ul>

                <li>
                    <img src= {Logo.src} height={50} width={50}  />
                </li>

                <li>
                    <label className={styles.customfileupload}>
                        Upload WT File
                        <input id="file-upload" type="file" value={selectedFile} onChange={(e) => setSelectedFile(e.target.files[0])}/>
                    </label>
                </li>

            </ul>
        </nav>
    );
}

