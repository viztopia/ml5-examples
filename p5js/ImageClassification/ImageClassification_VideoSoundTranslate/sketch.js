// Copyright (c) 2018 ml5
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

/* ===
ml5 Example
Webcam Image Classification using MobileNet and p5.js
This example uses a callback pattern to create the classifier
=== */

let classifier;
let video;
let langDropdown;
let selectedLang = 'zh-CN';
// Before you run this example, you need to put in your own Google translate API key below</p>
// You will need to register and generate and get Google API key and also enable the Google Translate API in the Google Console.
// Read more here: https://cloud.google.com/translate/docs/quickstart-client-libraries#client-libraries-install-nodejs
const translateAPIKey = 'Xxxxxxxxxxxxxxxxxx_xxxxxxxxxxxxxxxxxxxx';
// Create a new p5.speech object
// You can also control the Language, Rate, Pitch and Volumn of the voice
// Read more at http://ability.nyu.edu/p5.js-speech/
const myVoice = new p5.Speech();

function setup() {
  noCanvas();
  // Create a camera input
  video = createCapture(VIDEO);
  // Initialize the Image Classifier method with MobileNet and the video as the second argument
  classifier = ml5.imageClassifier('MobileNet', video, modelReady);

  // List all the voices from p5.speech.js
  myVoice.listVoices();
  // Select a default voice
  myVoice.setVoice(63);

  langDropdown = select('#lang');
  langDropdown.changed(langChangedEvent);
}

function modelReady() {
  // Change the status of the model once its ready
  select('#status').html('Model Loaded');
  // Call the classifyVideo function to start classifying the video
  classifyVideo();
}

// Get a prediction for the current video frame
function classifyVideo() {
  classifier.predict(gotResult);
}

// When we get a result
function gotResult(err, results) {
  // The results are in an array ordered by probability.
  const resultText = results[0].className;
  select('#result').html(resultText);
  select('#probability').html(nf(results[0].probability, 0, 2));
  // Translate the result to another language using Google translate API
  const url = `https://www.googleapis.com/language/translate/v2/?key=${translateAPIKey}&target=${selectedLang}&source=en&q=${resultText}`;
  loadJSON(url, gotTranslation);
}

function gotTranslation(result) {
  if (result && result.data && result.data.translations) {
    const translatedRes = result.data.translations[0].translatedText;
    // Show the translated result
    select('#translatedResult').html(translatedRes);
    // Speak out the result
    myVoice.speak(translatedRes);
    // Continue to classify the view
    classifyVideo();
  }
}

function langChangedEvent() {
  selectedLang = langDropdown.value();
  switch (selectedLang) {
    case 'zh-CN':
      myVoice.setVoice(63);
      break;
    case 'es':
      myVoice.setVoice(52);
      break;
    case 'fr':
      myVoice.setVoice(54);
      break;
    default:
      myVoice.setVoice(default_voice);
  }
}
