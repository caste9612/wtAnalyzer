import NeedleOperationProcessor from "./NeedleOperationProcessor";

class AspirateTubeProcessor extends NeedleOperationProcessor{

    process(words){
        let numbers = words.split(",");
        let pos1 =  numbers[1];
        let pos2 = Number(numbers[2]);
        let quantity = Number(numbers[3].split(")")[0]); 
        //console.log("ago: " + numbers[0] + " - pos: " + pos1 + "," + pos2 + " - quantity: " + quantity);
        //console.log(words);

        let result = {type: "ASP_TB", pos1: pos1, pos2: pos2, quantity: quantity};

        return {
            needle: numbers[0],
            needleOperation: result
        };    
    }

}

export default AspirateTubeProcessor;