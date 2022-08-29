import NeedleOperationProcessor from "./NeedleOperationProcessor";

class NotYetImplementedProcessor extends NeedleOperationProcessor{

    process(words){
   
        return [
            {
            needle: "SKIP",
            needleOperation: null
            }
        ];
    }

}

export default NotYetImplementedProcessor;