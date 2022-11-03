import * as THREE from "three";
import { MeshBVH,computeBoundsTree, disposeBoundsTree, acceleratedRaycast, StaticGeometryGenerator  } from 'three-mesh-bvh';


export const MeshIsHidden = async(mesh, traitModel, greed = 20) => {
    THREE.BufferGeometry.prototype.computeBoundsTree = computeBoundsTree;
    THREE.BufferGeometry.prototype.disposeBoundsTree = disposeBoundsTree;
    THREE.Mesh.prototype.raycast = acceleratedRaycast;

    let greedCounter =  0;
    const traitMeshes = [];

    traitModel.traverse((child)=>{
        if (child.isMesh){
            child.geometry.computeBoundsTree();
            traitMeshes.push(child);
        }
    });
    mesh.geometry.computeBoundsTree();

    console.log(mesh)
    
    // const bodyGen = new StaticGeometryGenerator( [ mesh ] );
    // const bodyGeom = bodyGen.generate();
    // bodyGeom.computeBoundsTree();
    // bodyGen.generate( bodyGeom );
    // bodyGeom.boundsTree.refit();

    // const clothGen = new StaticGeometryGenerator( [ ...traitMeshes ] );
    // const clothGeom = clothGen.generate();
    // clothGeom.computeBoundsTree();
    // clothGen.generate( clothGeom );
    // clothGeom.boundsTree.refit();

    // console.log(clothGeom);
    // console.log(bodyGeom)

    const raycaster = new THREE.Raycaster();
    console.log(raycaster)
    //raycaster.firstHitOnly = true;
    

    raycaster.far = 0.1;

    //console.log(raycaster);
    const index = mesh.geometry.index.array;
    // //debug section
    // console.log ("length")
    // console.log (mesh.geometry.index.array.length);

    // console.log ("max vertices")
    // console.log (mesh.geometry.attributes.position.array.length/3);
    
    // 
    // let maxval = 0;
    // for (let i =0; i < index.length;i++){
    //     if (index[i] > maxval)
    //         maxval = index[i];
    // }
    // console.log ("max index")
    // console.log(maxval);
    // console.log("============================")
    // //end debug section

    const vertexData = mesh.geometry.attributes.position.array;
    const normalsData = mesh.geometry.attributes.normal.array;
    //console.log(vertexData)
    //console.log(raycaster);
    let hidden = true;
    let origin = new THREE.Vector3();
    let direction = new THREE.Vector3();
    // setting += 3 to only check 1 vertex of each face
    const intersections = [];
    for (let i =0; i < index.length;i++){
        intersections.length = 0;
        const vi = index[i] * 3;
        origin.set(vertexData[vi],vertexData[vi+1],vertexData[vi+2])
        direction.set(normalsData[vi],normalsData[vi+1],normalsData[vi+2]);
        
        raycaster.set(origin,direction);
        if (raycaster.intersectObjects( traitMeshes ).length === 0){
            greedCounter++;
            if (greedCounter >= greed){
                hidden = false;
                break;
            }
        }
            
    }
    mesh.visible = !hidden;


        




    // for (let i =0; i < vertexData.length;i+=3){
    //     // set the origin
    //     const origin = new THREE.Vector3(vertexData[i],vertexData[i+1],vertexData[i+2])
    //     const direction = new THREE.Vector3(normalsData[i],normalsData[i+2],normalsData[i+2]);
    //     if (i === 0){
    //         //console.log(origin)
    //         //console.log(direction)
    //     }

    //     raycast.set(origin,direction);
    // }
}