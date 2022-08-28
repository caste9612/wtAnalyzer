import NeedleOperationProcessor from "./NeedleOperationProcessor";

class AspirateTankProcessor extends NeedleOperationProcessor{

    process(words){
        let numbers = words.split(",");
        let pos1 = "tank";
        let pos2 = "tank";
        let quantity = Number(numbers[2].split(")")[0]); 
        //console.log("ago: " + numbers[0] + " - pos: " + pos1 + "," + pos2 + " - quantity: " + quantity);
        //console.log(words);

        let result = {type: "ASP_TK", pos1: pos1, pos2: pos2, quantity: quantity};

        return {
            needle: numbers[0],
            needleOperation: result
        };
    }
}

export default AspirateTankProcessor;