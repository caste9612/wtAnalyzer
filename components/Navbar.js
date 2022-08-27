import { useContext, useEffect, useState } from 'react';
import { CuvetteContext } from '../lib/context';
import styles from "../styles/Navbar.module.css";
import Image from 'next/image';
import Logo from '../public/VisiaLab-Logo-RGB-Icon-HD.png'

export default function Navbar() {

    const { cuvettes, setCuvettes } = useContext(CuvetteContext);

    let tmpCuvettes = [];

    let needleApp = []
    let needleAps = []


    function processDispense(words){
        let numbers = words.split(",");
        let pos2 =  numbers[3];
        let pos1 = Number(numbers[2]);
        let quantity = Number(numbers[4].split(")")[0]); 
        //console.log("ago: " + numbers[0] + " - pos: " + pos1 + "," + pos2 + " - quantity: " + quantity);
        //console.log(words);

        let tempNeedleOperation = {type: "DISP", pos1: pos1, pos2: pos2, quantity: quantity};

        if(numbers[0] === "APS")
            needleAps.push(tempNeedleOperation);
        if(numbers[0] === "APP")
            needleApp.push(tempNeedleOperation);
    }

    function processAspirateTube(words){
        let numbers = words.split(",");
        let pos1 =  numbers[1];
        let pos2 = Number(numbers[2]);
        let quantity = Number(numbers[3].split(")")[0]); 
        //console.log("ago: " + numbers[0] + " - pos: " + pos1 + "," + pos2 + " - quantity: " + quantity);
        //console.log(words);

        let tempNeedleOperation = {type: "ASP_TB", pos1: pos1, pos2: pos2, quantity: quantity};

        if(numbers[0] === "APS")
            needleAps.push(tempNeedleOperation);
        if(numbers[0] === "APP")
            needleApp.push(tempNeedleOperation);
    }

    function processAspirateTank(words){
        let numbers = words.split(",");
        let pos1 = "tank";
        let pos2 = "tank";
        let quantity = Number(numbers[2].split(")")[0]); 
        //console.log("ago: " + numbers[0] + " - pos: " + pos1 + "," + pos2 + " - quantity: " + quantity);
        //console.log(words);

        let tempNeedleOperation = {type: "ASP_TK", pos1: pos1, pos2: pos2, quantity: quantity};

        if(numbers[0] === "APS")
            needleAps.push(tempNeedleOperation);
        if(numbers[0] === "APP")
            needleApp.push(tempNeedleOperation);
    }

    function processAspirateCuvette(words){
        let numbers = words.split(",");
        let pos2 = numbers[3];
        let pos1 = Number(numbers[2]);
        let quantity = Number(numbers[4].split(")")[0]); 
        //console.log("ago: " + numbers[0] + " - pos: " + pos1 + "," + pos2 + " - quantity: " + quantity);
        //console.log(words);

        let tempNeedleOperation = {type: "ASP_CVT", pos1: pos1, pos2: pos2, quantity: quantity};

        if(numbers[0] === "APS")
            needleAps.push(tempNeedleOperation);
        if(numbers[0] === "APP")
            needleApp.push(tempNeedleOperation);
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

    function setSelectedFile(file){
        var reader = new FileReader();
        reader.onload = function(progressEvent){
            var lines = this.result.split('\n');
            for(var line = 0; line < lines.length; line++){
                let words = lines[line].split("(");
                if(words.length > 0){
                    switch(words[0]){
                        case "DISPENSE_CUVETTE":
                            processDispense(words[1]);
                            break;
                        case "ASPIRATE_TUBE":
                            processAspirateTube(words[1]);
                            break;
                        case "ASPIRATE_TANK":
                            processAspirateTank(words[1]);
                            break;
                        case "ASPIRATE_CUVETTE":
                            processAspirateCuvette(words[1]);
                            break;
                        case "DISPENSE_WELL":
                            line = lines.length;
                            break;
                    }
                }
            }
            console.log(needleAps);
            console.log(needleApp);
            computeCuvetteAlloc();
            tmpCuvettes.forEach(el => {
                cuvettes.push(el);
            });
            setCuvettes({cuvettes: cuvettes});
            
            console.log(cuvettes);
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

