import { useContext, useEffect, useState } from 'react';
import { CuvetteContext } from '../lib/context';
import styles from "../styles/Navbar.module.css";

export default function Navbar() {

    const { cuvettes, setCuvettes } = useContext(CuvetteContext);

    let tmpCuvettes = [];

    let needleApp = []
    let needleAps = []


    function processDispense(words){
        let numbers = words.split(",");
        let pos2 = numbers[3].toLowerCase().charCodeAt(0) - 97 + 1;
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
        let pos1 = numbers[1].toLowerCase().charCodeAt(0) - 97 + 1;
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
        let pos1 = 99;
        let pos2 = 99
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
        let pos2 = numbers[3].toLowerCase().charCodeAt(0) - 97 + 1;
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
        for(let i = 0; i < needleApp.length-1; i+=3){
            let tmpCuvette = {liquid1: needleApp[i].pos1 + needleApp[i].pos2, 
                quantity1: needleApp[i].quantity,
                liquid2: needleApp[i + 1].pos1 + needleApp[i + 1].pos2,
                quantity2: needleApp[i + 1].quantity,
                cuvetteIndex: needleApp[i + 3].pos1 + (needleApp[i + 3].pos2 - 1) * 8,
                quantity: needleApp[i + 3].quantity}
            tmpCuvettes.push(tmpCuvette);
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
            <label className={styles.customfileupload}>
            Custom Upload
            <input id="file-upload" type="file" value={selectedFile} onChange={(e) => setSelectedFile(e.target.files[0])}/>
            </label>
        </nav>
    );
}

