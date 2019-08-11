var scene, camera, cameras, cameraIndex, renderer, controls, clock, player, mixer, actions, sun;

init();

function subclip( sourceClip, name, startFrame, endFrame, fps ) {
  fps = fps || 30;

	var clip = sourceClip.clone();
	clip.name = name;

	var tracks = [];

	for ( var i = 0; i < clip.tracks.length; ++ i ) {
		var track = clip.tracks[ i ];
		var valueSize = track.getValueSize();

		var times = [];
		var values = [];

		for ( var j = 0; j < track.times.length; ++ j ) {
			var frame = track.times[ j ] * fps;

			if ( frame < startFrame || frame >= endFrame ) continue;

			times.push( track.times[ j ] );

			for ( var k = 0; k < valueSize; ++ k ) {
				values.push( track.values[ j * valueSize + k ] );
				}
			}

			if ( times.length === 0 ) continue;

			track.times = THREE.AnimationUtils.convertArray( times, track.times.constructor );
			track.values = THREE.AnimationUtils.convertArray( values, track.values.constructor );

			tracks.push( track );
		}

		clip.tracks = tracks;

		// find minimum .times value across all tracks in the trimmed clip
		var minStartTime = Infinity;

		for ( var i = 0; i < clip.tracks.length; ++ i ) {
			if ( minStartTime > clip.tracks[ i ].times[ 0 ] ) {
				minStartTime = clip.tracks[ i ].times[ 0 ];
			}
		}

		// shift all tracks such that clip begins at t=0

		for ( var i = 0; i < clip.tracks.length; ++ i ) {
			clip.tracks[ i ].shift( - 1 * minStartTime );
		}

		clip.resetDuration();

		return clip;
	}

function init(){
  const assetPath = 'https://niksfiles.s3.eu-west-2.amazonaws.com/';
  
  clock = new THREE.Clock();
  
  scene = new THREE.Scene();
  let col = 0x605050;
	scene = new THREE.Scene();
	scene.background = new THREE.Color( col );
	scene.fog = new THREE.Fog( col, 10, 100 );
  
  camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 0.1, 1000 );
  camera.position.set(0, 4, 7);
  camera.lookAt(0,1.5,0);
  
  const ambient = new THREE.HemisphereLight(0xffffff, 0xffffff, 1.5);
  scene.add(ambient);
  
  const light = new THREE.DirectionalLight(0xFFFFFF, 1.5);
  light.position.set( 1, 10, 6);
  light.castShadow = true;
  const shadowSize = 5;
	light.shadow.camera.top = shadowSize;
	light.shadow.camera.bottom = -shadowSize;
	light.shadow.camera.left = -shadowSize;
	light.shadow.camera.right = shadowSize;
  scene.add(light);
  sun = light;
  
  renderer = new THREE.WebGLRenderer({antialias: true});
  renderer.shadowMap.enabled = true;
  renderer.setSize( window.innerWidth, window.innerHeight );
  document.body.appendChild( renderer.domElement );
  
  const planeGeometry = new THREE.PlaneBufferGeometry(200, 200);
  const planeMaterial = new THREE.MeshStandardMaterial();
  const plane = new THREE.Mesh(planeGeometry, planeMaterial);
  plane.rotation.x = -Math.PI/2;
  plane.receiveShadow = true;
  scene.add(plane);
  
  const grid = new THREE.GridHelper( 200, 80);
  scene.add( grid );
  
  const anims = [
					{start:30, end:59, name:"backpedal", loop:true},
					{start:489, end:548, name:"idle", loop:true},
					{start:768, end:791, name:"run", loop:true},
					{start:839, end:858, name:"shuffleLeft", loop:true},
					{start:899, end:918, name:"shuffleRight", loop:true},
					{start:1264, end:1293, name:"walk", loop:true}
   ];
  
  //Load meshes here
  const loader = new THREE.GLTFLoader();
  loader.setPath(assetPath);
  
  loader.load('fred.glb', object => {
    mixer = new THREE.AnimationMixer(object.scene);
    mixer.addEventListener( 'finished', e => {
      if (e.action.next != undefined) playAction(e.action.next);
    } );
    object.scene.children[0].rotation.x = 0;
    actions = {};
    
    object.scene.traverse( child => {
      if (child.isMesh){
        child.castShadow = true;
      }
    });
    
    anims.forEach(anim => {
			const clip = subclip(object.animations[0], anim.name, anim.start, anim.end);
      const action = mixer.clipAction(clip);
      if (!anim.loop){
        action.loop = THREE.LoopOnce;
        action.clampWhenFinished = true;
      }
      if (anim.next!=undefined) action.next = anim.next;
      actions[anim.name] = action;
		});
    
    player = new THREE.Object3D();
    sun.target = player;
    object.scene.children[0].scale.set(0.02,0.02,0.02);
    player.add(object.scene.children[0]);
    
    createCameras()
    addKeyboardControl();
    
    playAction('idle');
    
    scene.add(player);
    update();
  });
  
  const btn = document.getElementById('camera-btn');
  btn.addEventListener('click', changeCamera);
  
  window.addEventListener( 'resize', resize, false);
}

function createCameras(){
  cameras = [];
  cameraIndex = 0; 
  
  const followCam = new THREE.Object3D();
  followCam.position.copy(camera.position);
  player.add(followCam);
  cameras.push(followCam);
  
  const frontCam = new THREE.Object3D();
  frontCam.position.set(0, 3, -8);
  player.add(frontCam);
  cameras.push(frontCam);
  
  const overheadCam = new THREE.Object3D();
  overheadCam.position.set(0, 20, 0);
  cameras.push(overheadCam);
}

function changeCamera(){
  cameraIndex++;
  if (cameraIndex>=cameras.length) cameraIndex = 0;
}

function addKeyboardControl(){
    document.addEventListener( 'keydown', keyDown );
    document.addEventListener( 'keyup', keyUp );
}
  
function keyDown(evt){
    let forward = (player.userData.move!==undefined) ? player.userData.move.forward : 0;
    let turn = (player.userData.move!==undefined) ?  player.userData.move.turn : 0;
    
    switch(evt.keyCode){
      case 87://W
        forward = 1;
        break;
      case 83://S
        forward = -1;
        break;
      case 65://A
        turn = 1;
        break;
      case 68://D
        turn = -1;
        break;
    }
    
    playerControl(forward, turn);
}
  
function keyUp(evt){
    let forward = ( player.userData.move!==undefined) ? player.userData.move.forward : 0;
    let turn = (player.userData.move!==undefined) ?  player.userData.move.turn : 0;
    
    switch(evt.keyCode){
      case 87://W
      case 83://S
        forward = 0;
        break;
      case 65://A
      case 68://D
        turn = 0;
        break;
    }
    
    playerControl(forward, turn);
}

function playerControl(forward, turn){
   	if (forward==0 && turn==0){
			delete player.userData.move;
		}else{
      if (player.userData.move){
        player.userData.move.forward = forward;
        player.userData.move.turn = turn;
      }else{
        player.userData.move = { forward, turn, time: clock.getElapsedTime(), speed: 1 }; 
        cameraIndex = 1;
      }
		}
}

function update(){
  requestAnimationFrame( update );
	renderer.render( scene, camera );
  
  const dt = clock.getDelta();
  mixer.update(dt);
  
  if (player.userData.move!==undefined){
    if (player.userData.move.forward>0 && player.userData.move.speed<10) player.userData.move.speed += 0.1;
    player.translateZ(player.userData.move.forward * dt * player.userData.move.speed);
    player.rotateY(player.userData.move.turn * dt);
    
    //Update actions here
    if (player.userData.move.forward<0){
      playAction('backpedal');
    }else if (player.userData.move.forward==0){
      if (player.userData.move.turn<0){
        playAction('shuffleLeft');
      }else{
        playAction('shuffleRight');
      }
    }else if (player.userData.move.speed>5){
      playAction('run');
    }else{
      playAction('walk');
    }
  }else{
    playerAction('idle');
  }
  
  camera.position.lerp(cameras[cameraIndex].getWorldPosition(new THREE.Vector3()), 0.05);
  const pos = player.position.clone();
  pos.y += 3;
  camera.lookAt(pos);
  
  if (sun != undefined){
      sun.position.x = player.position.x;
      sun.position.y = player.position.y + 10;
      sun.position.z = player.position.z - 10;
      sun.target = player;
  }
}

function playAction(name){
  if (player.userData.actionName == name) return;
  const action = actions[name];
  player.userData.actionName = name;
  mixer.stopAllAction();
  action.reset();
  action.fadeIn(0.5);
  action.play();
}

function resize(){
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize( window.innerWidth, window.innerHeight );
}