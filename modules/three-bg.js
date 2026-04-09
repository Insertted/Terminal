const THREE = window.THREE;
let scene, camera, renderer, mapGroup;

export function initNetmap() {
    const container = document.getElementById('antenna-viewport');
    if (!THREE || !container) return;

    container.innerHTML = '';
    scene = new THREE.Scene();
    
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 15, 35); 
    camera.lookAt(0, 0, 0);

    renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(renderer.domElement);

    mapGroup = new THREE.Group();

    const pointsGeometry = new THREE.BufferGeometry();
    const coords = [];
    const pointsCount = 6000;

    for (let i = 0; i < pointsCount; i++) {
        const x = (Math.random() - 0.5) * 65;
        const y = (Math.random() - 0.5) * 20 + Math.sin(x / 10) * 5; 
        const z = (Math.random() - 0.5) * 8;
        coords.push(x, y, z);
    }
    
    pointsGeometry.setAttribute('position', new THREE.Float32BufferAttribute(coords, 3));
    
    const pointsMaterial = new THREE.PointsMaterial({ 
        color: 0x636363, 
        size: 0.3,
        transparent: true, 
        opacity: 0.8,
        blending: THREE.AdditiveBlending
    });
    
    const cloud = new THREE.Points(pointsGeometry, pointsMaterial);
    mapGroup.add(cloud);

    const locations = [
        { name: "MSK", pos: [-20, 2, 1], color: 0x55ff55 },
        { name: "SPB", pos: [-22, 5, 0], color: 0x55ff55 },
        { name: "NSK", pos: [0, -1, 2], color: 0xff0000 },
        { name: "VVO", pos: [22, -3, 1], color: 0x55ff55 },
        { name: "EKB", pos: [-8, 1, 0], color: 0x55ff55 }
    ];

    const nodeMaterial = new THREE.MeshBasicMaterial({ color: 0x55ff55, wireframe: true });
    const lineMaterial = new THREE.LineBasicMaterial({ 
        color: 0x55ff55, 
        transparent: true, 
        opacity: 0.6,
        linewidth: 2
    });
    
    const nodeObjects = [];

    locations.forEach(loc => {
    const node = new THREE.Mesh(
        new THREE.IcosahedronGeometry(1.2, 1),
        new THREE.MeshBasicMaterial({ 
            color: loc.color,
            wireframe: true 
        })
    );
    node.position.set(loc.pos[0], loc.pos[1], loc.pos[2]);
    mapGroup.add(node);
    nodeObjects.push(node);
    });

    for (let i = 0; i < nodeObjects.length - 1; i++) {
        const geometry = new THREE.BufferGeometry().setFromPoints([
            nodeObjects[i].position,
            nodeObjects[i + 1].position
        ]);
        const line = new THREE.Line(geometry, lineMaterial);
        mapGroup.add(line);
    }

    scene.add(mapGroup);

    function animate() {
        requestAnimationFrame(animate);
        
        const time = Date.now() * 0.001;

        mapGroup.rotation.y = Math.sin(time * 0.3) * 0.1;
        mapGroup.rotation.x = Math.cos(time * 0.2) * 0.05;

        pointsMaterial.opacity = 0.6 + Math.sin(time * 2) * 0.2;

        nodeObjects.forEach((node, i) => {
            const s = 1 + Math.sin(time * 3 + i) * 0.2;
            node.scale.set(s, s, s);
            node.rotation.y += 0.01;
        });

        renderer.render(scene, camera);
    }
    animate();

    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
}

export function glitchNetmap() {
    if (!mapGroup) return;
    mapGroup.traverse(obj => {
        if (obj.material) obj.material.color.setHex(Math.random() > 0.5 ? 0xff0000 : 0x55ff55);
    });
    setTimeout(() => {
        mapGroup.traverse(obj => {
            if (obj.material) obj.material.color.setHex(0x55ff55);
        });
    }, 400);
}

window.initNetmap = initNetmap;