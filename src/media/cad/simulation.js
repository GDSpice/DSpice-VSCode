var libarayPath='';
 
 function opAnalysis(){

   codeSpice= getSourceSpiceForOp();

   drawing.execOp(codeSpice.code).then(result => {
    console.log('Exit code:', result.exitCode);
    console.log('Results:', result.results.results);
    console.log('Raw:', result.rawOutput);

     for(var i=0; i<codeSpice.outputs.length; i++){
        var elem = codeSpice.outputs[i].elem;
        var str = elem.textContent.split('=')[0];
        elem.childNodes[2].textContent=str+'='+result.results.results[i].formatted+codeSpice.outputs[i].unit;
        structProbe(elem);
      }

      var list=codeSpice.list;
        for(var i=0; i<list.length; i++){
        var elem = list[i].elem;
        if(!list[i].used){
        var str = elem.textContent.split('=')[0];
        elem.childNodes[2].textContent=str+'=0.0 V';
        structProbe(elem)
        }
      }
    
    drawing.saveData('Op analysis');
}).catch(err => {
    console.error('Simulation failed:', err);
});

 }



 // In your analysis code
async function runSimulation() {
    const spiceNetlist = generateSpiceNetlist(); // Your netlist generation
    
    try {
        const results = await drawing.runAnalysis(spiceNetlist.code);
        console.log('Simulation results:', results);
        
        // Process results...
        if (results.success) {
            // Show plots, etc.
        }
    } catch (err) {
        console.error('Simulation failed:', err);
    }
}

