import NeedleOperationProcessor from "./NeedleOperationProcessor";

class AspirateCuvetteProcessor extends NeedleOperationProcessor{
    
    process(words){
        let numbers = words.split(",");
        let pos2 = numbers[3];
        let pos1 = Number(numbers[2]);
        let quantity = Number(numbers[4].split(")")[0]); 
        //console.log("ago: " + numbers[0] + " - pos: " + pos1 + "," + pos2 + " - quantity: " + quantity);
        //console.log(words);

        let result = {type: "ASP_CVT", pos1: pos1, pos2: pos2, quantity: quantity};

        return {
            needle: numbers[0],
            needleOperation: result
        };
    }

}

export default AspirateCuvetteProcessor;