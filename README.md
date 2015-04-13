#CS174A Spring 2015 Assignment #1
* * * 
###Required code:
>1. This is the README and I have commented my code.
>2. I implemented a 960x540 canvas with `<canvas id="gl-canvas" width="960" height="540"></canvas>`. I then made the canvas black by calling `gl.clearColor( 0.0, 0.0, 0.0, 1.0 )`. Finally, I enabled z-buffer with `gl.enable(gl.DEPTH_TEST);`
>3. I instaned 8 cubes by creating an array of translation matrices, found at cubes.js:49, that a for loop would go through in the render function, found at cubes.js:249. To draw each cube's outline in white, I had to push the vertices again and instead, draw lines and pass in white to vColor. Finally, I implemented the 'c' key with an event listener that would increment a `ColorIndex` variable used when passing in the color to vColor.
>4. I implemented this portion by using an event listener.
>5. 
