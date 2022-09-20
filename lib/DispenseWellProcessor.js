import NeedleOperationProcessor from "./NeedleOperationProcessor";

class DispenseWellProcessor extends NeedleOperationProcessor{

    process(words){
        let numbers = words.split(",");
        let rack =  Number(numbers[1]);
        let slide = Number(numbers[2]);
        let zone = numbers[3].split("")[0];
        let well = numbers[3].split("")[1];
        if(numbers[3].split("").length > 2){
            console.log(numbers[3].split(""));
            well = numbers[3].split("")[1] + "" + numbers[3].split("")[2];
        }
        //let quantity = Number(numbers[4].split(")")[0]); 
        //console.log("ago: " + numbers[0] + " - pos: " + pos1 + "," + pos2 + " - quantity: " + quantity);
        //console.log(words);

        let result = {type: "WELL", rack: rack, slide: slide, zone: zone, well: well};

        return [
            {
            needle: numbers[0],
            needleOperation: result
            }
        ];
    }

}

export default DispenseWellProcessor;