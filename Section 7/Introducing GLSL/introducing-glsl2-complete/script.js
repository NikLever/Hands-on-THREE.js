const vshader = `
#include <noise>

uniform float uTime;

varying float vNoise;

void main() {	
  // add time to the noise parameters so it's animated
  vNoise = 10.0 *  -.10 * turbulence( .5 * normal + uTime );
  float b = 5.0 * pnoise( 0.05 * position + vec3( 2.0 * uTime ), vec3( 100.0 ) );
  float displacement = - 10. * vNoise + b;

  // move the position along the normal and transform it
  vec3 pos = position + normal * displacement;

  gl_Position = projectionMatrix * modelViewMatrix * vec4( pos, 1.0 );
}
`
const fshader = `
uniform sampler2D uTex;

varying float vNoise;

//https://www.clicktorelease.com/blog/vertex-displacement-noise-3d-webgl-glsl-three-js/

float random( vec3 pt, float seed ){
  vec3 scale = vec3( 12.9898, 78.233, 151.7182 );
  return fract( sin( dot( pt + seed, scale ) ) * 43758.5453 + seed ) ;
}

void main() {

  // get a random offset
  float r = .01 * random( gl_FragCoord.xyz, 0.0 );
  // lookup vertically in the texture, using noise and offset
  // to get the right RGB colour
  vec2 uv = vec2( 0, 1.3 * vNoise + r );
  vec3 color = texture2D( uTex, uv ).rgb;

  gl_FragColor = vec4( color, 1.0 );
}
`






const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    1,
    10000
  );
camera.position.z = 100;

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

const clock = new THREE.Clock();

const geometry = new THREE.IcosahedronGeometry( 20, 4 );
const uniforms = {
  uTime: { value: 0.0 },
  uTex: { value: new THREE.TextureLoader().load("https://s3-us-west-2.amazonaws.com/s.cdpn.io/2666677/explosion.png")}
}

const material = new THREE.ShaderMaterial( {
  uniforms: uniforms,
  vertexShader: vshader,
  fragmentShader: fshader
} );

const ball = new THREE.Mesh( geometry, material );
scene.add( ball );

const controls = new THREE.OrbitControls(camera, renderer.domElement);

onWindowResize();

window.addEventListener( 'resize', onWindowResize, false );

update();

function onWindowResize( event ) {
  camera.aspect = window.innerWidth/window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize( window.innerWidth, window.innerHeight );
}

function update() {
  requestAnimationFrame( update );
  uniforms.uTime.value += clock.getDelta();
  renderer.render( scene, camera );
}