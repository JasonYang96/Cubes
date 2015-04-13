#CS174A Spring 2015 Assignment #1
* * * 
###Required code:
>1. This is the README and I have commented my code.
>2. I implemented a 960x540 canvas with `<canvas id="gl-canvas" width="960" height="540"></canvas>`. I then made the canvas black by calling `gl.clearColor( 0.0, 0.0, 0.0, 1.0 )`. Finally, I enabled z-buffer with `gl.enable(gl.DEPTH_TEST);`
>3. I instanced 8 cubes by creating an array of translation matrices, found at cubes.js:49, that a for loop would go through in the render function, found at cubes.js:249. To draw each cube's outline in white, I had to push the vertices again and instead, draw lines and pass in white to vColor. Finally, I implemented the 'c' key with an event listener that would increment a `ColorIndex` variable used when passing in the color to vColor.
>4. I implemented this portion by using an event listener. I made a `coord` var that holds 3 floats for the x,y,z variables. I would update these variables to take care of the i,j,k,m and right and left arrows. To change the heading, I incorporated a `headingAngle` variable that keeps track of the degree. I would then pass this into the rotate() function to rotate it correctly about the y-axis. I implemented the 'r' key by clearing the coord and headingAngle variables to their inital values.
>5. I used an equation to relate the vertical FOV with the horizontal FOV. Then, by changing the FOV by pressing 'n' and 'w' keys, the `fovx` variable would passed into the perspective() to create a perspective matrix. To create an orthographic projection of a cross hair, I pushed more vertices to points[] then, if my `crosshairON` variable was true, I would send in 0 degrees as theta, as well as only send in a ortho() matrix to the shader.

###Extra Credit:
>1. As I've explained in #3, I instanced the cubes by multiplying a translation matrix to a cube created at the origin. I also implemented using Triangle Strips by only pushing 14 vertices and using those 14 vertices to create a cube.
>2. I rotate the cube by updating theta every time render is called. I then use this theta to form a rotational matrix found in the shader. I also scale the matrix by using the value of sin(theta) as this goes between -1 and 1. I then use this to my advantage to multiply a scaling matrix of `scale(1+.1*sin(theta),1+.1*sin(theta),1+.1*sin(theta)). By multiplying by .1, I will scale between .9 and 1.1. I decided to rotate the cubes around the y-axis. To achieve 60 rpm, I increase theta by 6.0 degrees everytime render is called as the browser tries to refresh at 60 fps.
>3. By using rotate(), I am already using quaternions.
>4. I believe this is also required.
>5. Turning in on Sunday night!