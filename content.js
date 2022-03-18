console.log('Plugin Jira loaded');

let Helper = class {
  static processTime(stringTime) {
    stringTime = stringTime.replace(',', '.');
    let floatTime = parseFloat(stringTime);

    if (isNaN(floatTime)) {
      return 0;
    }

    return floatTime;
  }
}

let FilterView = class {
  constructor() {
    this.initNewContentBlock();
    FilterView.calculateEstimateTime();
    this.initObserver();
  }

  static calculateForClass(className) {
    var totalTime = 0;
    var timeestimate = document.getElementsByClassName(className);

    if (timeestimate.length === 0) {
      return false;
    }

    for (var i = 0; i < timeestimate.length; i++) {
      var estimate = timeestimate[i].innerText;
      totalTime += Helper.processTime(estimate);
    }

    var timeStats = document.querySelector('#timeStats');
    timeStats.innerHTML = 'Temps total estimé pour ' + timeestimate.length + ' tâches : ' + totalTime;

    return true;
  }

  static calculateEstimateTime() {
    if (FilterView.calculateForClass("timeestimate") === false) {
      FilterView.calculateForClass("aggregatetimeestimate");
    }
  }

  initNewContentBlock() {
    var timeStats = document.createElement('div');
    timeStats.setAttribute("id", "timeStats");
    timeStats.style.width = '100%';
    timeStats.style.padding = '10px 0px';

    var container = document.querySelector('.navigator-group');
    container.prepend(timeStats);
  }

  // Set observer
  callbackJiraDOMUpdated(mutations) {
    // Check for when class "pending" is removed, ajax call will be finished
    var intervalWaitForPendingFinish = setInterval(function() { 
      let parent = document.querySelector('.list-view').parentNode;
      if (!parent.className) {
        // Wait a little, and recalculate everything
        setTimeout(() => {  
          FilterView.calculateEstimateTime(); 
        }, 
        500);  
        window.clearInterval(intervalWaitForPendingFinish); 
      }
    }, 1000);

  }

  initObserver() {
    let observer = new MutationObserver(this.callbackJiraDOMUpdated);
    let observerOptions = {
      childList: true,
      attributes: true,
      characterData: true,
      subtree: true,
    };
    var targetNode = document.querySelector('.navigator-content');
    observer.observe(targetNode, observerOptions);
  }
}

let DashboardView = class {
  constructor() {
    this.initNewContentBlock();
    DashboardView.calculateEstimateTime();
    //this.initObserver();
  }
  initNewContentBlock() {
    var timeStats = document.createElement('div');
    timeStats.setAttribute("id", "timeStats");
    timeStats.style.width = '100%';
    timeStats.style.padding = '0px 0px';
    timeStats.style.fontSize = '14px';
    timeStats.style.marginTop = '-20px';
    timeStats.style.textAlign = 'right';

    var container = document.querySelector('.dashboard div[role="presentation"] h3');
    container.parentElement.append(timeStats);
  }
  static calculateForClass(className) {
    var totalTime = 0;
    var timeestimate = document.getElementsByClassName(className);

    if (timeestimate.length === 0) {
      return false;
    }

    for (var i = 0; i < timeestimate.length; i++) {
      var estimate = timeestimate[i].innerText;
      totalTime += Helper.processTime(estimate);
    }

    var timeStats = document.querySelector('#timeStats');
    timeStats.innerHTML = 'Total : ' + totalTime + 'h';

    return true;
  }
  static calculateEstimateTime() {
    if (DashboardView.calculateForClass("timeestimate") === false) {
      DashboardView.calculateForClass("aggregatetimeestimate");
    }
  }
  // Set observer
  // callbackJiraDOMUpdated(mutations) {
  //   setTimeout(() => {  
  //       DashboardView.calculateEstimateTime();
  //     }, 
  //     5000);
  // }
  // initObserver() {
  //   let observer = new MutationObserver(this.callbackJiraDOMUpdated);
  //   let observerOptions = {
  //     childList: true,
  //     attributes: true,
  //     characterData: true,
  //     subtree: true,
  //   };
  //   var targetNode = document.querySelector('.dashboard');
  //   observer.observe(targetNode, observerOptions);
  // }
}

let currentUrl = window.location.href;

if (currentUrl.startsWith('https://libeocom.atlassian.net/issues/')) {
  new FilterView();
} else if(currentUrl.startsWith('https://libeocom.atlassian.net/jira/dashboards/')) {
  new DashboardView();
}
