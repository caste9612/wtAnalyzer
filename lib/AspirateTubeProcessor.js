import NeedleOperationProcessor from "./NeedleOperationProcessor";

class AspirateTubeProcessor extends NeedleOperationProcessor{

    process(words){
        let numbers = words.split(",");
        if(numbers[0] === "APP-APS"){
            let pos1 =  numbers[1];
            let pos2 = Number(numbers[2]);
            let quantity = Number(numbers[3].split(")")[0]); 
    
            let result = {type: "ASP_TB", pos1: pos1, pos2: pos2, quantity: quantity};

            let pos12 = numbers[1];
            let pos22 = Number(numbers[4]);
            let quantity2 = Number(numbers[5].split(")")[0]); 

            let result2 = {type: "ASP_TB", pos1: pos12, pos2: pos22, quantity: quantity2};

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
            let pos1 =  numbers[1];
            let pos2 = Number(numbers[2]);
            let quantity = Number(numbers[3].split(")")[0]); 
    
            let result = {type: "ASP_TB", pos1: pos1, pos2: pos2, quantity: quantity};
    
            return [
                {
                needle: numbers[0],
                needleOperation: result
                }
            ];
        }
    }

}

export default AspirateTubeProcessor;