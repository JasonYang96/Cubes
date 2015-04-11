var gl;

var NumVertices = 38;

var points = [];
var colors = [];
var edges  = [];

var xAxis = 0;
var yAxis = 1;
var zAxis = 2;

var axis = 0;
var theta = [ 0, 0, 0 ];

var thetaLoc, vColorLoc;
var vColor = 0;

var vertices = [
    vec3( -0.5, -0.5,  0.5 ),
    vec3( -0.5,  0.5,  0.5 ),
    vec3(  0.5,  0.5,  0.5 ),
    vec3(  0.5, -0.5,  0.5 ),
    vec3( -0.5, -0.5, -0.5 ),
    vec3( -0.5,  0.5, -0.5 ),
    vec3(  0.5,  0.5, -0.5 ),
    vec3(  0.5, -0.5, -0.5 )
];

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

window.onload = function init()
{
	//initialize canvas and webGL
    var canvas = document.getElementById( "gl-canvas" );
	    
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebG isn't available" ); }

    colorCube();

    //configure WebGL
    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 0.0, 0.0, 0.0, 1.0 );
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);

    //  Load shaders and initialize attribute buffers
    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

    vColorLoc = gl.getUniformLocation( program, "vColor" );

    var vBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW );

    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 3, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    thetaLoc = gl.getUniformLocation(program, "theta");

    window.onkeypress = function(event) {
        var key = String.fromCharCode(event.keyCode);
        switch(key) {
          case 'c':
            vColor = (vColor + 1) % vertexColors.length;
            break;
        }
    };

    render();
};

function colorCube()
{   
    var indices = [ 3, 2, 1, 6, 5, 4, 1, 0, 3, 7, 0, 4, 7, 6, //vertices for faces 
                    0, 1, 2, 3, 1, 2, 6, 7, 1, 5, 2, 6, 5, 6, 4, 7, 0, 4, 3, 7, 0, 3, 4, 5]; //vertices for edges

    for ( var i = 0; i < indices.length; ++i ) {
        points.push( vertices[indices[i]] );
        if (i <= 14)
            colors.push( vertexColors[1]);
        else
            colors.push( vertexColors[6] );
    }
}

function render() {
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT );
    theta[axis] += 2.0;
    gl.uniform3fv(thetaLoc, theta);

    //set up color of triangles then draw
    gl.uniform4fv(vColorLoc, vertexColors[vColor]);
    gl.drawArrays( gl.TRIANGLE_STRIP, 0, 14 );

    //set up color of edges and draw
    gl.uniform4fv(vColorLoc, [1,1,1,1]);
    gl.drawArrays( gl.LINES, 14, NumVertices-14);

    //call render on browser refresh
    requestAnimFrame( render );
}
