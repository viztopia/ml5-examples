// --------------------------------------------------------------------------------------------------------
// Configuration
// --------------------------------------------------------------------------------------------------------

let dcgan;
let canvas = document.getElementById('the_canvas');
let button;

function setup() {
    noLoop();
    noCanvas();

    dcgan = new ml5.DCGAN("face", modelReady);

    //button to generate an image
    button = select('#generate-button');
    button.mousePressed(generate);
}

function generate() {
    // dcgan.generate(canvas, (err, result) =>{
    dcgan.generate((err, result) => {
        // console.log(result);

        let img = document.createElement("IMG");
        img.src = URL.createObjectURL(result.blob);
        img.style = "width:256px; height:256px";
        // console.log(img);
        document.body.appendChild(img);
    });
}

function modelReady() {
    select('#status').html('Model Loaded');
}