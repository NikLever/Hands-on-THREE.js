var scene, renderer, cameras, helper, frustrumSize;

init();

function init(){
  scene = new THREE.Scene();
  
  const width = window.innerWidth;
  const height = window.innerHeight;
  const aspect = (width / height) * 0.5;
  
  cameras = [];
  
  frustrumSize = 20;
  const orthoCam = new THREE.OrthographicCamera(-frustrumSize * 0.5 * aspect, frustrumSize * 0.5 * aspect, 0.5 * frustrumSize,-frustrumSize * 0.5,3,20);
  orthoCam.position.set(0,0,10);
  helper = new THREE.CameraHelper(orthoCam);
  scene.add(helper);
  cameras.push(orthoCam);
  
  const helperCam = new THREE.PerspectiveCamera(60, aspect, 1, 100);
  helperCam.position.set(65, 5, 5);
  helperCam.lookAt(0,0,0);
  cameras.push(helperCam);
  
  const ambient = new THREE.HemisphereLight(0xffffbb, 0x080820);
  scene.add(ambient);
  
  const light = new THREE.DirectionalLight(0xFFFFFF, 1);
  light.position.set( 1, 10, 6);
  scene.add(light);
  
  renderer = new THREE.WebGLRenderer();
  renderer.setSize( window.innerWidth, window.innerHeight );
  document.body.appendChild( renderer.domElement );
  
  const controls = new THREE.OrbitControls( cameras[1], renderer.domElement );
  controls.target.set(0,0,5);
  controls.update();
  
  const gui = new dat.GUI();
  const params = {
    frustrumSize: 20,
    near: 0.1,
    far: 100
  }
  gui.add(params, 'frustrumSize')
    .min(1)
    .max(40)
    .step(1)
    .onChange( value => { 
      frustrumSize = value;
    
      const width = window.innerWidth;
	    const height = window.innerHeight;
	    const aspect = (width / height) * 0.5;
	    	
      cameras[0].left = -0.5 * frustrumSize * aspect;
	    cameras[0].right = 0.5 * frustrumSize * aspect;
	    cameras[0].top = frustrumSize / 2;
	    cameras[0].bottom = -frustrumSize / 2;
	    cameras[0].updateProjectionMatrix();
      helper.update();
  });
  gui.add(params, 'near')
    .min(0.1)
    .max(20)
    .step(0.1)
    .onChange( value => { 
    cameras[0].near = value;
    cameras[0].updateProjectionMatrix();
    helper.update();
  });
  gui.add(params, 'far')
    .min(5)
    .max(20)
    .step(1)
    .onChange( value => { 
    cameras[0].far = value;
    cameras[0].updateProjectionMatrix();
    helper.update();
  });
  
  //Add meshes here
 const geometry = new THREE.BoxBufferGeometry();
  const material = new THREE.MeshPhongMaterial();
  const block = new THREE.Mesh(geometry, material);
  
  for(let x=-5; x<5; x+=1.5){
    for(let y=-5; y<5; y+=1.5){
      for(let z=-5; z<5; z+=1.5){
        const mesh = block.clone();
        mesh.position.set(x,y,z);
        scene.add(mesh);
      }
    }
  }
  
  window.addEventListener( 'resize', resize, false);
  
  update();
}

function update(){
  requestAnimationFrame( update );
  const width = window.innerWidth;
  const height = window.innerHeight;
  
  helper.visible = false;
  renderer.autoClear = true;
  renderer.setViewport(0, 0, width*0.5, height);
  renderer.render( scene, cameras[0] );
  
  helper.visible = true;
  renderer.autoClear = false;
  renderer.setViewport(width*0.5, 0, width*0.5, height);
  renderer.render( scene, cameras[1] ); 
}

function resize(){
  const width = window.innerWidth;
	const height = window.innerHeight;
	const aspect = (width / height) * 0.5;
	renderer.setSize( width, height );
	
  cameras[1].aspect = aspect;
	cameras[1].updateProjectionMatrix();
				
  cameras[0].left = -0.5 * frustrumSize * aspect;
	cameras[0].right = 0.5 * frustrumSize * aspect;
	cameras[0].top = frustrumSize / 2;
	cameras[0].bottom = -frustrumSize / 2;
	cameras[0].updateProjectionMatrix();
}