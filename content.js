console.log('Plugin Jira loaded');

function calculateForClass(className) {

  var totalTime = 0;
  var timeestimate = document.getElementsByClassName(className);

  if (timeestimate.length === 0) {
    return false;
  }

  for (var i = 0; i < timeestimate.length; i++) {
    var estimate = timeestimate[i].innerText;
    // console.log("Estimate of line " + i + " : " + processTime(estimate));
    totalTime += processTime(estimate);
  }

  var timeStats = document.querySelector('#timeStats');
  timeStats.innerHTML = 'Temps total estimé pour ' + timeestimate.length + ' tâches : ' + totalTime;

  return true;
}

function processTime(stringTime) {
  stringTime = stringTime.replace(',', '.');
  floatTime = parseFloat(stringTime);

  if (isNaN(floatTime)) {
    return 0;
  }

  return floatTime;
}

function calculateEstimateTime() {
  if (calculateForClass("timeestimate") === false) {
    calculateForClass("aggregatetimeestimate");
  }
}

function initNewContentBlock() {
  var timeStats = document.createElement('div');
  timeStats.setAttribute("id", "timeStats");
  timeStats.style.width = '100%';
  timeStats.style.padding = '10px 0px';

  var container = document.querySelector('.navigator-group');
  container.prepend(timeStats);
}

initNewContentBlock();
calculateEstimateTime();


// Set observer
function callbackJiraDOMUpdated(mutations) {
  console.log('DOM Updated by Jira');
  // Check for when class "pending" is removed, ajax call will be finished
  var intervalWaitForPendingFinish = setInterval(function() { 
    let parent = document.querySelector('.list-view').parentNode;
    if (!parent.className) {
      // Wait a little, and recalculate everything
      setTimeout(() => {  
        calculateEstimateTime(); 
        console.log('Recalculate estimated time');
      }, 
      500);  
      window.clearInterval(intervalWaitForPendingFinish); 
    }
  }, 1000);

}

let observer = new MutationObserver(callbackJiraDOMUpdated);
let observerOptions = {
  childList: true,
  attributes: true,
  characterData: true,
  subtree: true,
};
var targetNode = document.querySelector('.navigator-content');
observer.observe(targetNode, observerOptions);