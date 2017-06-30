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
  
Performance
* removed unecessary document.queryselector (using global variable items instead).
* document.body.scrollTop only need to be called once, move it outside for loop to improve performance. Also added support for firefox, chrome and ie when selecting scrollTop.
* added update of ticking variable. used for requestAnmimation function (debouncing)

```
// Moves the sliding background pizzas based on scroll position
function updatePositions() {
    ticking = false; //debouncing scroll events, thanks to https://www.html5rocks.com/en/tutorials/speed/animations/
    frame++;
    window.performance.mark("mark_start_frame");
    var top = (document.documentElement && document.documentElement.scrollTop) ||
        document.body.scrollTop; //to support IE and firefox browser.

    //  var items = document.querySelectorAll('.mover'); // do not call selectorall, not needed. Use global variable instead.
    for (var i = 0; i < items.length; i++) {
        //var phase = Math.sin((document.body.scrollTop / 1250) + (i % 5)); not a good practise to loop document.body.scrollTop. Unecessary calls
        var phase = Math.sin((top / 1250) + (i % 5));
        items[i].style.left = items[i].basicLeft + 100 * phase + 'px'; // Keep it. we could use transformX hack. But has not that much of improvements.
    }

    // User Timing API to the rescue again. Seriously, it's worth learning.
    // Super easy to create custom metrics.
    window.performance.mark("mark_end_frame");
    window.performance.measure("measure_frame_duration", "mark_start_frame", "mark_end_frame");
    if (frame % 10 === 0) {
        var timesToUpdatePosition = window.performance.getEntriesByName("measure_frame_duration");
        logAverageFrame(timesToUpdatePosition);
    }
}

var latestKnownScrollY = 0,
    ticking = false;

//debouncing scroll events, thanks to https://www.html5rocks.com/en/tutorials/speed/animations/
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
// runs updatePositions via onscroll function.
window.addEventListener('scroll', onScroll);
```

### document.addEventListener('DOMContentLoaded', function()

Performance
* resized image to fit style.height and style.width and removed style propertys. Also removed width property from CSS .mover class so browser dont have to resize images.
```
.mover {
  position: fixed;
  /*width: 256px;*/
  z-index: -1;
}
```
* no need for 200 sliding pizzas, changed total to 40 (200 is used taking extra time to paint and update).
* document.querySelector("#movingPizzas1") is called in for loop. No need to be called more than once.
* creating variable to hold movingPizzas1 elements and global variable to store mover elements.
```
// Generates the sliding pizzas when the page loads.
document.addEventListener('DOMContentLoaded', function() {
    var cols = 8;
    var s = 256;
    var addpizza = document.getElementById('movingPizzas1'); //moved out from for loop
    // for (var i = 0; i < 200; i++) { we dont need 200 pizzas to fill screen. Lets go with 40.
    for (var i = 0; i < 40; i++) {
        var elem = document.createElement('img');
        elem.className = 'mover';
        // elem.src = "images/pizza.png";
        elem.src = "img/73.333/pizza.png"; // use a compressed and resized image to improve performance.
        //elem.style.height = "100px"; picture is resized to match style property
        //elem.style.width = "73.333px"; picture is resized to match style property
        elem.basicLeft = (i % cols) * s;
        elem.style.top = (Math.floor(i / cols) * s) + 'px';
        // document.querySelector("#movingPizzas1").appendChild(elem); //Bad practise to call querySelector in loop if not necessary.
        addpizza.appendChild(elem);
    }
    items = addpizza.getElementsByClassName('mover'); //save it globally. elementlist are used in updatePosition.
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

Main issues in resizing pizzas where the querySelectorAll calls inside the foreach loop. There where alot of recalulation of the picture and the resizePizzas was scope to affect each element. I got a good performance to just remove all querySelectorAll and resize and compress pizza.png picture. 

```
     for (var i = 0; i < document.querySelectorAll(".randomPizzaContainer").length; i++) {
             var dx = determineDx(document.querySelectorAll(".randomPizzaContainer")[i], size);
             var newwidth = (document.querySelectorAll(".randomPizzaContainer")[i].offsetWidth + dx) + 'px';
             document.querySelectorAll(".randomPizzaContainer")[i].style.width = newwidth;
         }
  ```

However after some consideration i decided to change the whole logic. Why loop each element when we can just update a CSS class with one call? :) 




**1. Compressed and resize Pizza Image.**
```
  // pizzaImage.src = "images/pizza.png";
    pizzaImage.src = "img/205/pizza.png"; //resized and optimized picture
```
**2. Changed so that CSS controlls the height and witdth instead of using style properties.**

```
.randomPizzaContainer {
    /*replacing element.style property from pizzaelementgenerator*/
    width: 389.961px;
    float: left;
    display: flex;
    /*replacing element.style property from pizzaelementgenerator*/
    height: 325px;
}
```
var pizzaElementGenerator = function(i) {
```
    pizzaContainer.classList.add("randomPizzaContainer");
    // pizzaContainer.style.width = "33.33%"; replaced by css
    // pizzaContainer.style.height = "325px";replaced by css
    pizzaContainer.id = "pizza" + i; // gives each pizza element a unique id
    // pizzaImageContainer.style.width="35%"; //replaced by css

```
**3. Added two more CSS classes to control styles for randomPizzaContainer Childs.**
```
.pizzaImgContainer {
    width: 35%;
}


/*use instead of element.styles*/

.pizzaInformation {
    width: 65%
}
```
**4. Added a new function to add CSS rules to CSS stylesheet.**
```
function addStylesheetRules(rules) {
    var styleEl = document.createElement('style'),
        styleSheet;

    // Append style element to head
    document.head.appendChild(styleEl);

    // Grab style sheet
    styleSheet = styleEl.sheet;

    for (var i = 0, rl = rules.length; i < rl; i++) {
        var j = 1,
            rule = rules[i],
            selector = rules[i][0],
            propStr = '';
        // If the second argument of a rule is an array of arrays, correct our variables.
        if (Object.prototype.toString.call(rule[1][0]) === '[object Array]') {
            rule = rule[1];
            j = 0;
        }

        for (var pl = rule.length; j < pl; j++) {
            var prop = rule[j];
            propStr += prop[0] + ':' + prop[1] + (prop[2] ? ' !important' : '') + ';\n';
        }

        // Insert CSS Rule
        styleSheet.insertRule(selector + '{' + propStr + '}', styleSheet.cssRules.length);
    }
}
```
**5. Deleted all uneccessary code that where used to loop each element with faulty document.queryselectors and set style property invidually to just update .randomPizzaContainer with an attribute**

```
// resizePizzas(size) is called when the slider in the "Our Pizzas" section of the website moves.
var resizePizzas = function(size) {
    window.performance.mark("mark_start_resize"); // User Timing API function

    //no need of this function. replacing with CSS property update
    // Changes the value for the size of the pizza above the slider
    // function changeSliderLabel(size) {
    //     switch (size) {
    //         case "1":
    //             document.querySelector("#pizzaSize").innerHTML = "Small";
    //             return;
    //         case "2":
    //             document.querySelector("#pizzaSize").innerHTML = "Medium";
    //             return;
    //         case "3":
    //             document.querySelector("#pizzaSize").innerHTML = "Large";
    //             return;
    //         default:
    //             console.log("bug in changeSliderLabel");
    //     }
    // }

    //changeSliderLabel(size);

    //no need of this function. replacing with CSS property update
    // // Returns the size difference to change a pizza element from one size to another. Called by changePizzaSlices(size).
    // function determineDx(elem, size) {
    //     var oldWidth = elem.offsetWidth;
    //     var windowWidth = document.querySelector("#randomPizzas").offsetWidth;
    //     var oldSize = oldWidth / windowWidth;

    // keep SizeSwitcher, modiefied for better use of new logic.
    function sizeSwitcher(size) {
        switch (size) {
            case "1":
                document.querySelector("#pizzaSize").innerHTML = "Small";
                return "292.5px";
                //return 0.25;
            case "2":
                document.querySelector("#pizzaSize").innerHTML = "medium";
                return "389.961px";
                //return 0.3333;
            case "3":
                document.querySelector("#pizzaSize").innerHTML = "large";
                return "585px";
                //return 0.5;
            default:
                console.log("bug in sizeSwitcher");
        }
    }

    //     var newSize = sizeSwitcher(size);
    //     var dx = (newSize - oldSize) * windowWidth;

    //     return dx;
    // }

    // no need of function, we dont need to go through each element.

    // Iterates through pizza elements on the page and changes their widths
    // function changePizzaSizes(size) {
    //     for (var i = 0; i < document.querySelectorAll(".randomPizzaContainer").length; i++) {
    //         var dx = determineDx(document.querySelectorAll(".randomPizzaContainer")[i], size);
    //         var newwidth = (document.querySelectorAll(".randomPizzaContainer")[i].offsetWidth + dx) + 'px';
    //         document.querySelectorAll(".randomPizzaContainer")[i].style.width = newwidth;
    //     }
    // }

    //get new size width.
    var newSize = sizeSwitcher(size);

    // update css class with new width.
    addStylesheetRules([
        ['.randomPizzaContainer', ['width', newSize]]
    ]);

    var stylesheets = document.styleSheets;
    // disable old stylesheet if user changed size more than once.
    // if not used their will be multiple stylesheet in browser.
    if (stylesheets.length >= 4) {
        stylesheets[stylesheets.length - 2].disabled = true; // disable stylesheet old stylesheet.
    }

    //changePizzaSizes(size);

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

