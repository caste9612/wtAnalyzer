import NeedleOperationProcessor from "./NeedleOperationProcessor";

class AspirateTankProcessor extends NeedleOperationProcessor{

    process(words){
        let numbers = words.split(",");

        if(numbers[0] === "APP-APS"){
            let pos1 = "tank";
            let pos2 = "tank";
            let quantity = Number(numbers[2].split(")")[0]); 

            let result = {type: "ASP_TK", pos1: pos1, pos2: pos2, quantity: quantity};

            let pos12 = "tank";
            let pos22 = "tank";
            let quantity2 = Number(numbers[3].split(")")[0]); 

            let result2 = {type: "ASP_TK", pos1: pos12, pos2: pos22, quantity: quantity2};

            return [
                {
                    needle: "APP",
                    needleOperation: result
                },
                {
                    needle: "APS",
                    needleOperation: result2
                }
            ];
        }else{
            let pos1 = "tank";
            let pos2 = "tank";
            let quantity = Number(numbers[2].split(")")[0]); 
    
            let result = {type: "ASP_TK", pos1: pos1, pos2: pos2, quantity: quantity};
    
            return [
                {
                needle: numbers[0],
                needleOperation: result
                }
            ];
        }
    }
}

export default AspirateTankProcessor;