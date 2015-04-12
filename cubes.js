//represent gl object
var gl;

//points holds vertices for triangle strip
//edges holds vertices for edges
var points = [];
var edges  = [];

//theta variable
var thetaLoc;
var theta = [ 0, 0, 0 ];

//vertex color, and color index variables
var vColorLoc;
var colorIndex = 0;

//perspective matrix variables
var pMatrix;
var fovy = 45;
var aspect;
var near = 2;
var far = 200;

//translation matrix, model-view matrix
var tMatrix;
var mvMatrix;
var Matrix;
var MatrixLoc;

//x,y,z coord, and heading variable for camera movement
var coord = [ 0, 0, -50 ];
var headingAngle = 0;

//vertex vectors
var vertices = [
    vec3( -1.0, -1.0,  1.0 ),
    vec3( -1.0,  1.0,  1.0 ),
    vec3(  1.0,  1.0,  1.0 ),
    vec3(  1.0, -1.0,  1.0 ),
    vec3( -1.0, -1.0, -1.0 ),
    vec3( -1.0,  1.0, -1.0 ),
    vec3(  1.0,  1.0, -1.0 ),
    vec3(  1.0, -1.0, -1.0 ),
];

//color vectors
var vertexColors = [
    [ 0.0, 0.0, 0.0, 1.0 ],  // black
    [ 0.0, 0.0, 1.0, 1.0 ],  // blue
    [ 0.0, 1.0, 0.0, 1.0 ],  // green
    [ 0.0, 1.0, 1.0, 1.0 ],   // cyan
    [ 1.0, 0.0, 0.0, 1.0 ],  // red
    [ 1.0, 0.0, 1.0, 1.0 ],  // magenta
    [ 1.0, 1.0, 0.0, 1.0 ],  // yellow
    [ 1.0, 1.0, 1.0, 1.0 ],  // white
];

//array of matrices to create 8 cubes
var cubes = [
    translate( 10,  10,  10),
    translate( 10,  10, -10),
    translate( 10, -10,  10),
    translate( 10, -10, -10),
    translate(-10,  10,  10),
    translate(-10,  10, -10),
    translate(-10, -10,  10),
    translate(-10, -10, -10),
];

window.onload = function init()
{
	//initialize canvas and webGL
    var canvas = document.getElementById( "gl-canvas" );
    aspect = canvas.width/canvas.height;
	    
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebG isn't available" ); }

    //create a cube
    colorCube();

    //configure WebGL
    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 0.0, 0.0, 0.0, 1.0 );
    gl.enable(gl.DEPTH_TEST);

    //  Load shaders and initialize attribute buffers
    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

    // get variables from HTML
    vColorLoc = gl.getUniformLocation( program, "vColor" );
    thetaLoc = gl.getUniformLocation( program, "theta");
    MatrixLoc = gl.getUniformLocation( program, "Matrix");

    //create and bind buffer for vertices
    var vBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW );

    //send the vertex buffer to shader
    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 3, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    //event listener
    window.onkeydown = function(event) {
        var key = event.keyCode > 48 ? String.fromCharCode(event.keyCode) : event.keyCode;
        var radian = radians(headingAngle);
        switch(key) {
            case 'C':
                colorIndex = (colorIndex + 1) % vertexColors.length;
                break;
            case 'I':
                coord[0] -=(.25 * Math.sin(radian));
                coord[2] +=(.25 * Math.cos(radian));
                break;
            case 'J':
                coord[0] +=(.25 * Math.cos(radian));
                coord[2] +=(.25 * Math.sin(radian));
                break;
            case 'K':
                coord[0] -=(.25 * Math.cos(radian));
                coord[2] -=(.25 * Math.sin(radian));
                break;
            case 'M':
                coord[0] +=(.25 * Math.sin(radian));
                coord[2] -=(.25 * Math.cos(radian));
                break;         
            case 'R':
                coord[0] = 0;
                coord[1] = 0;
                coord[2] = -50;
                headingAngle = 0;
                break;   
            case 37: //left arrow
                headingAngle -=1;
                break;
            case 38: //up arrow
                coord[1] -=.25;
                break;
            case 39: //right arrow
                headingAngle +=1;
                break;
            case 40: //down arrow
                coord[1] +=.25;
                break;
        }
    };

    render();
};

function colorCube()
{   
    var indices = [ 0, 4, 7, 6, 3, 2, 1, 6, 5, 4, 1, 0, 3, 7, //vertices for faces 
                    0, 1, 2, 3, 1, 2, 6, 7, 1, 5, 2, 6, 5, 6, 4, 7, 0, 4, 3, 7, 0, 3, 4, 5]; //vertices for edges

    for ( var i = 0; i < indices.length; ++i ) {
        points.push( vertices[indices[i]] );
    }
}

function render() {
    //clear canvas
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT );
    
    //rotate by theta and send to shader
    theta[0] += 6.0;
    gl.uniform3fv(thetaLoc, theta);

    //apply model-view matrix
    pMatrix = perspective(fovy, aspect, near, far);
    tMatrix = mult(rotate(headingAngle, [ 0, 1, 0 ]), translate( coord[0], coord[1], coord[2]));
    mvMatrix = mult(pMatrix, tMatrix);

    for (var i = 0; i < cubes.length; ++i) {
        Matrix = mult(mvMatrix, cubes[i]);
        gl.uniformMatrix4fv(MatrixLoc, false, flatten(Matrix));

        //set up color of triangles then draw
        gl.uniform4fv(vColorLoc, vertexColors[(colorIndex + i) % cubes.length]);
        gl.drawArrays( gl.TRIANGLE_STRIP, 0, 14 );

        //set up color of edges and ccccdraw
        gl.uniform4fv(vColorLoc, [1,1,1,1]);
        gl.drawArrays( gl.LINES, 14, 24);
    }

    //call render on browser refresh
    requestAnimFrame( render );
}
