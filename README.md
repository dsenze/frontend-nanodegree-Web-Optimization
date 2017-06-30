## Website Performance Optimization portfolio project

Optimize this online portfolio for speed! In particular, optimize the critical rendering path and make this page render as quickly as possible by applying the techniques you've picked up in the [Critical Rendering Path course](https://www.udacity.com/course/ud884).

This repo includes optimized performance of : https://github.com/udacity/frontend-nanodegree-mobile-portfolio

# Installation
**pre requirements:** node.js and grunt. view more at: https://gruntjs.com/getting-started

### 1. download repo to your computer.
### 2. open node.js console and navigate to project root catalog.
### 3. run command : **npm install** (to download and install all req. Grunt Modules). 
### 3. after installation succuss. run command : **grunt**.
grunt will run predefined automation task and verifies JShint runs without errors. If no error occurs. Grunt minimize css and js and removes all comments and saves the production ready code in \dist.
### 5. start application. dist/index.html.

# Solution

### Orginal site hosted here 
http://dsenze-optimization-orginal.azurewebsites.net/
### Tweaked solution hosted here
http://dsenze-optimization-solution.azurewebsites.net/


#### Part 1: Optimize PageSpeed Insights score above 90 for index.html


* Inlined style.css to head (ok if smaller than 14KB)
* added media="print" to print.css to only be used if in print mode.
* Scripts blocking rendering pattern - Moved .js script to end of body and added async to analytics.js. 
* downloaded all external pictures. compresses and resized all of them to get faster download. changed href to local images.
* changed google fonts to run async reference https://www.lockedowndesign.com/load-google-fonts-asynchronously-for-page-speed/
* finally i compressed, minimized all html, js and css files with grunt.

##### Page Insight Result after tweak
###### **93/100** (mobile)
###### **95/100** (desktop)
##


#### Part 2: Optimize Frames per Second in pizza.html


### updatePositions()

Orginal
```
function updatePositions() {
  frame++;
  window.performance.mark("mark_start_frame");

  var items = document.querySelectorAll('.mover');
  for (var i = 0; i < items.length; i++) {
    var phase = Math.sin((document.body.scrollTop / 1250) + (i % 5));
    items[i].style.left = items[i].basicLeft + 100 * phase + 'px';
  }
```
  
Performance
* removed unecessary document.queryselector (using global variable items instead).
* document.body.scrollTop only need to be called once, move it outside for loop to improve performance. Also added support for firefox, chrome and ie when selecting scrollTop.
* added update of ticking variable. used for requestAnmimation function.

*Comment: (Tried to use some hacks ( transform: translateX() ) however was not that big improvement so good is enough. read about this in https://github.com/udacity/fend-office-hours/tree/master/Web%20Optimization/Effective%20Optimizations%20for%2060%20FPS)
```
function updatePositions() {
    ticking = false; 
    frame++;
    window.performance.mark("mark_start_frame");
    var top = (document.documentElement && document.documentElement.scrollTop) || 
        document.body.scrollTop;  //to support IE and firefox browser.
    for (var i = 0; i < items.length; i++) {
        var phase = Math.sin((top / 1250) + (i % 5));
        items[i].style.left = items[i].basicLeft + 100 * phase + 'px';
    }
}
```

### document.addEventListener('DOMContentLoaded', function()

Orginal
```
// Generates the sliding pizzas when the page loads.
document.addEventListener('DOMContentLoaded', function() {
  var cols = 8;
  var s = 256;
  for (var i = 0; i < 200; i++) {
    var elem = document.createElement('img');
    elem.className = 'mover';
    elem.src = "images/pizza.png";
    elem.style.height = "100px";
    elem.style.width = "73.333px";
    elem.basicLeft = (i % cols) * s;
    elem.style.top = (Math.floor(i / cols) * s) + 'px';
    document.querySelector("#movingPizzas1").appendChild(elem);
  }
```

Performance
* resized image to fit style.height and style.width and removed style propertys. Also removed width property from CSS .mover class so browser dont have to resize images.
```
.mover {
  position: fixed;
  /*width: 256px;*/
  z-index: -1;
}
```
* no need for 200 sliding pizzas, added slidingtotal variable and set total to 40.
* creating variable to hold movingPizzas1 elements and global variable to store mover elements.
```
// Generates the sliding pizzas when the page loads.
document.addEventListener('DOMContentLoaded', function() {
    var cols = 8;
    var s = 256;
    var slidingtotal = 40; // no need for 200 pizzas. replacing for (var i = 0; i < 200; i++) {
    var addpizza = document.getElementById('movingPizzas1'); 
    for (var i = 0; i < slidingtotal; i++) {
        var elem = document.createElement('img');
        elem.className = 'mover';
        //elem.src = "images/pizza.png";
        elem.src = "img/73.333/pizza.png"; //replacing with a new picture in right diemensions
        //elem.style.height = "100px";
        //elem.style.width = "73.333px";
        elem.basicLeft = (i % cols) * s;
        elem.style.top = (Math.floor(i / cols) * s) + 'px';
        //document.querySelector("#movingPizzas1").appendChild(elem);
        //Comment: querySelector only need to be call once. adding variable addpizza before for loop instead.
        addpizza.appendChild(elem);
    }
    items = addpizza.getElementsByClassName('mover'); //Update global variable, used in other functions.
    updatePositions();
});
```

### requestAnimationFrames()
Added requestAnimationFrames with debouncing scroll events.
```
//debouncing scroll events, thanks to https://www.html5rocks.com/en/tutorials/speed/animations/
var latestKnownScrollY = 0,
    ticking = false;

function onScroll() {
    latestKnownScrollY = window.scrollY;
    requestTick();
}

function requestTick() {
    if (!ticking) {
        requestAnimationFrame(updatePositions);
    }
    ticking = true;
}
```

#### Part 3: Time to resize pizzas is less than 5 ms using the pizza size slider on the views/pizza.html page. 
*1. Compressed and resize Pizza Image.

### changePizzaSizes()
* changePizzaSizes included alot of unecessary document.queryselector calls.
* moved dx and newwidth outside for loop (does only have to be called once).
```
    // Iterates through pizza elements on the page and changes their widths
    function changePizzaSizes(size) {
        var container = document.querySelectorAll(".randomPizzaContainer");
        var dx = determineDx(container[1], size);
        var newwidth = (container[1].offsetWidth + dx) + 'px';
        for (var i = 0; i < container.length; i++) {
            container[i].style.width = newwidth;
        }
        
        // unecessary document.query in for loop.
        // for (var i = 0; i < document.querySelectorAll(".randomPizzaContainer").length; i++) {
        //     var dx = determineDx(document.querySelectorAll(".randomPizzaContainer")[i], size);
        //     var newwidth = (document.querySelectorAll(".randomPizzaContainer")[i].offsetWidth + dx) + 'px';
        //     document.querySelectorAll(".randomPizzaContainer")[i].style.width = newwidth;
        // }
    }
```

### determineDX() Fixed and then deleted.
* This was called in a loop so document.queryselector was a bottleneck. Changed it to use a globalvariable. However its only called once after changepizzasize fix.
* function ok when not called in for loop.
* After some measuring i decided to delete determineDx. No need when using CSS class approach.

```
function determineDx (elem, size) {
    var oldWidth = elem.offsetWidth;
    var windowWidth = document.querySelector("#randomPizzas").offsetWidth;
    var oldSize = oldWidth / windowWidth;

    // Changes the slider value to a percent width
    function sizeSwitcher (size) {
      switch(size) {
        case "1":
          return 0.25;
        case "2":
          return 0.3333;
        case "3":
          return 0.5;
        default:
          console.log("bug in sizeSwitcher");
      }
    }

    var newSize = sizeSwitcher(size);
    var dx = (newSize - oldSize) * windowWidth;

    return dx;
  }
```

```
function determineDx(elem, size) {
        var oldWidth = elem.offsetWidth;
        var windowWidth = pizzasDiv.offsetWidth;
        var oldSize = oldWidth / windowWidth;

        // Changes the slider value to a percent width
        function sizeSwitcher(size) {
            switch (size) {
                case "1":
                    return 0.25;
                case "2":
                    return 0.3333;
                case "3":
                    return 0.5;
                default:
                    console.log("bug in sizeSwitcher");
            }
        }

        var newSize = sizeSwitcher(size);
        var dx = (newSize - oldSize) * windowWidth;

        return dx;
    }
```

### resizePizzas(size) CSS class Approach (Deleting DeterminDX(), function changeSliderLabel(size), changePizzaSizes(size)).
After some measurement and thinking i decided its unecessary to loop and add style to each element. Lets try to use a class approach with css instead. Then we only need to update css class property instead of each element.

*Original Code.
```
// resizePizzas(size) is called when the slider in the "Our Pizzas" section of the website moves.
var resizePizzas = function(size) {
  window.performance.mark("mark_start_resize");   // User Timing API function

  // Changes the value for the size of the pizza above the slider
  function changeSliderLabel(size) {
    switch(size) {
      case "1":
        document.querySelector("#pizzaSize").innerHTML = "Small";
        return;
      case "2":
        document.querySelector("#pizzaSize").innerHTML = "Medium";
        return;
      case "3":
        document.querySelector("#pizzaSize").innerHTML = "Large";
        return;
      default:
        console.log("bug in changeSliderLabel");
    }
  }

  changeSliderLabel(size);

   // Returns the size difference to change a pizza element from one size to another. Called by changePizzaSlices(size).
  function determineDx (elem, size) {
    var oldWidth = elem.offsetWidth;
    var windowWidth = document.querySelector("#randomPizzas").offsetWidth;
    var oldSize = oldWidth / windowWidth;

    // Changes the slider value to a percent width
    function sizeSwitcher (size) {
      switch(size) {
        case "1":
          return 0.25;
        case "2":
          return 0.3333;
        case "3":
          return 0.5;
        default:
          console.log("bug in sizeSwitcher");
      }
    }

    var newSize = sizeSwitcher(size);
    var dx = (newSize - oldSize) * windowWidth;

    return dx;
  }

  // Iterates through pizza elements on the page and changes their widths
  function changePizzaSizes(size) {
    for (var i = 0; i < document.querySelectorAll(".randomPizzaContainer").length; i++) {
      var dx = determineDx(document.querySelectorAll(".randomPizzaContainer")[i], size);
      var newwidth = (document.querySelectorAll(".randomPizzaContainer")[i].offsetWidth + dx) + 'px';
      document.querySelectorAll(".randomPizzaContainer")[i].style.width = newwidth;
    }
  }

  changePizzaSizes(size);

  // User Timing API is awesome
  window.performance.mark("mark_end_resize");
  window.performance.measure("measure_pizza_resize", "mark_start_resize", "mark_end_resize");
  var timeToResize = window.performance.getEntriesByName("measure_pizza_resize");
  console.log("Time to resize pizzas: " + timeToResize[timeToResize.length-1].duration + "ms");
};
```
### Changes

* Get pizzaSize.InnerHTML and update .randomPizzaContainer css class with new width property. We only make one call here to update css class and does not have to update each element.
* Disable old stylesheet changes if user clicked more than once.

1. First i deleted all element style properties from pizza Generator. and changed width on .randomPizzaContainer in to width: 389.961px;
```
pizzaContainer.classList.add("randomPizzaContainer");
  pizzaContainer.style.width = "33.33%"; //Delete
  pizzaContainer.style.height = "325px"; //Delete
  pizzaContainer.id = "pizza" + i;                // gives each pizza element a unique id
  pizzaImageContainer.style.width="35%";
```


```
// resizePizzas(size) is called when the slider in the "Our Pizzas" section of the website moves.
var resizePizzas = function(size) {
    window.performance.mark("mark_start_resize"); // User Timing API function
    function changePizzaSizes(size) {

        function sizeSwitcher(size) {
            switch (size) {
                case "1":
                    document.querySelector("#pizzaSize").innerHTML = "Small";
                    return "292.5px";
                case "2":
                    document.querySelector("#pizzaSize").innerHTML = "medium";
                    return "389.961px";
                case "3":
                    document.querySelector("#pizzaSize").innerHTML = "large";
                    return "585px";
                default:
                    console.log("bug in sizeSwitcher");
            }
        }

        var newSize = sizeSwitcher(size);

        addStylesheetRules([
            ['.randomPizzaContainer', ['width', newSize]]
        ]);

        var stylesheets = document.styleSheets;
        // disable old stylesheet if user changed size more than once.
        if (stylesheets.length >= 4) {
            stylesheets[stylesheets.length - 2].disabled = true; // disable stylesheet old stylesheet.
        }
    }

    changePizzaSizes(size);

    // User Timing API is awesome
    window.performance.mark("mark_end_resize");
    window.performance.measure("measure_pizza_resize", "mark_start_resize", "mark_end_resize");
    var timeToResize = window.performance.getEntriesByName("measure_pizza_resize");
    console.log("Time to resize pizzas: " + timeToResize[timeToResize.length - 1].duration + "ms");
};
```



### Optimization Tips and Tricks
* [Optimizing Performance](https://developers.google.com/web/fundamentals/performance/ "web performance")
* [Analyzing the Critical Rendering Path](https://developers.google.com/web/fundamentals/performance/critical-rendering-path/analyzing-crp.html "analyzing crp")
* [Optimizing the Critical Rendering Path](https://developers.google.com/web/fundamentals/performance/critical-rendering-path/optimizing-critical-rendering-path.html "optimize the crp!")
* [Avoiding Rendering Blocking CSS](https://developers.google.com/web/fundamentals/performance/critical-rendering-path/render-blocking-css.html "render blocking css")
* [Optimizing JavaScript](https://developers.google.com/web/fundamentals/performance/critical-rendering-path/adding-interactivity-with-javascript.html "javascript")
* [Measuring with Navigation Timing](https://developers.google.com/web/fundamentals/performance/critical-rendering-path/measure-crp.html "nav timing api"). We didn't cover the Navigation Timing API in the first two lessons but it's an incredibly useful tool for automated page profiling. I highly recommend reading.
* <a href="https://developers.google.com/web/fundamentals/performance/optimizing-content-efficiency/eliminate-downloads.html">The fewer the downloads, the better</a>
* <a href="https://developers.google.com/web/fundamentals/performance/optimizing-content-efficiency/optimize-encoding-and-transfer.html">Reduce the size of text</a>
* <a href="https://developers.google.com/web/fundamentals/performance/optimizing-content-efficiency/image-optimization.html">Optimize images</a>
* <a href="https://developers.google.com/web/fundamentals/performance/optimizing-content-efficiency/http-caching.html">HTTP caching</a>

