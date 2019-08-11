var scene, camera, renderer, clock, mixer, actions;

init();

//Function courtesy of Don McCurdy
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
  scene.background = new THREE.Color(0x00aaff);
  
  camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 0.1, 1000 );
  camera.position.set(0, 0, 2);
  
  const ambient = new THREE.HemisphereLight(0xffffbb, 0x080820, 3);
  scene.add(ambient);
  
  const light = new THREE.DirectionalLight(0xFFFFFF, 1.5);
  light.position.set( 0, 1, 10);
  scene.add(light);
  
  renderer = new THREE.WebGLRenderer();
  renderer.setSize( window.innerWidth, window.innerHeight );
  document.body.appendChild( renderer.domElement );
  
  const controls = new THREE.OrbitControls( camera, renderer.domElement );
  controls.target.set(0,0.7,0);
  controls.update();
  
  //Add button actions here
  let index = 0;
  const btns = document.getElementById("btns");
  btns.childNodes.forEach( btn => {
    if (btn.innerHTML !== undefined){
      btn.addEventListener('click', 
        playAction.bind(this, index)
      );
      index++;
    }
  });
  
  const anims = [	
					{start:489, end:548, name:"idle", loop:true},
          {start:300, end:344, name:"hit", loop:false, next:0},
					{start:610, end:659, name:"jump", loop:false, next:0},
          {start:225, end:251, name:"die", loop:false},
				];
  
  //Load meshes here
  const loader = new THREE.GLTFLoader();
  loader.setPath(assetPath);
  
  loader.load('fred.glb', object => {
    //Little fix because the character is rotated in the export
    object.scene.children[0].rotation.x = 0;
    
    //Add a mixer here
    
    
    //Split the clips here
    
    scene.add(object.scene);
    update();
  });
  
  window.addEventListener( 'resize', resize, false);
  
}

function playAction(index){
  const action = actions[index];
  mixer.stopAllAction();
  action.reset();
  action.fadeIn(0.5);
  action.play();
}

function update(){
  requestAnimationFrame( update );
	renderer.render( scene, camera );
  const dt = clock.getDelta();
  mixer.update(dt);
}

function resize(){
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize( window.innerWidth, window.innerHeight );
}