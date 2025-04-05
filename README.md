<h1 align="center" style="font-size: 40px">DotWave.js</h1>


  <p align="center">
    <img src="https://raw.githubusercontent.com/jsem-nerad/DotWave.js/refs/heads/main/images/preview.png" style="width: 30%; height: auto;" alt="Preview screenshot">
    <br />
    A lightweight JavaScript library that creates interactive dot backgrounds
    <br />
    <br />
    <a href="https://github.com/jsem-nerad/DotWave.js/issues/new?labels=bug&template=bug-report---.md">Report a Bug</a>
    ·
    <a href="https://github.com/jsem-nerad/DotWave.js/issues/new?labels=enhancement&template=feature-request---.md">Request a Feature</a>
  </p>
</div>



<!-- TABLE OF CONTENTS 
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li><a href="#about">About</a></li>
    <li>
      <a href="#"></a>
    </li>
    <li>
      <a href="#"></a>
    </li>
    <li><a href="#"></a></li>
    <li><a href="#usage">Usage</a></li>
    <li><a href="#to-do">To-Do</a></li>
    <li><a href="#license">License</a></li>
  </ol>
</details> -->

### Try now on [dotwave.vojtikdortik.eu](https://dotwave.vojtikdortik.eu/)



## Features

- Dots react smoothly to cursor movements
- Depth perception with parallax effect
- Fully customizable (colors, sizes, behavior)
- Responsive design
- No dependencies
- Lightweight 

## Installation

### Direct Download
Download the library from the `src` folder and include it in your HTML:
```xml
<script src="dotwave.js"></script>
```

## Basic Usage
```xml
<!DOCTYPE html> 
<html lang="en"> 
<head> 
    <meta charset="UTF-8"> 
    <title>DotWave Basic Example</title> 
    <style> 
        body { 
            margin: 0; 
            padding: 0; 
            height: 100vh; 
            font-family: Arial, sans-serif; 
            color: white; }

        .content {
            position: relative;
            z-index: 2;
            text-align: center;
            padding-top: 20vh;
        }
    </style>
</head> 
<body> 
    <div class="content"> 
        <h1>DotWave.js Demo</h1> 
        <p>Move your cursor to interact with the dots.</p> 
    </div>
    <script src="dotwave.js"></script>
    <script>
        // Initialize with default options
        const dotwave = new DotWave();
    </script>
</body> 
</html> 
```

### Configuration Options


```JavaScript
const dotwave = new DotWave({
    container: 'body',           // Container selector or DOM element
    numDots: 200,                // Number of dots
    dotColor: 'white',           // Dot color (CSS color)
    backgroundColor: 'black',    // Background color
    dotMinSize: 0.5,             // Minimum dot size
    dotMaxSize: 2.5,             // Maximum dot size
    dotMinOpacity: 0.5,          // Minimum dot opacity
    dotMaxOpacity: 1,            // Maximum dot opacity
    influenceRadius: 150,        // Mouse influence radius
    influenceStrength: 0.08,     // Mouse influence strength
    randomFactor: 0.03,          // Random movement factor
    friction: 0.97,              // Movement friction
    maxSpeed: 3,                 // Maximum dot speed
    responsive: true,            // Automatically resize with container
    zIndex: -1                   // Canvas z-index
});
```

### Methods
```JavaScript
// Initialize
const dotwave = new DotWave(options);

// Pause animation
dotwave.pause();

// Resume animation
dotwave.resume();

// Update options
dotwave.updateOptions({
    dotColor: 'blue',
    numDots: 300
});

// Clean up when done
dotwave.destroy();
```



## Contributing
Contributions are welcome! Please feel free to submit a Pull Request.
