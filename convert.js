var objs = null;
let mats = null;
var modelName = "";

// Material Regex
var matNameRegex = /^(newmtl|usemtl) (?<name>.*)/;
var matSpecExRegex = /Ns (?<n>.*)/;
var matAmbiRegex = /Ka(?<r> -?\d+\.\d+)(?<g> -?\d+\.\d+)(?<b> -?\d+\.\d+)/;
var matDiffRegex = /Kd(?<r> -?\d+\.\d+)(?<g> -?\d+\.\d+)(?<b> -?\d+\.\d+)/;
var matSpecRegex = /Ks(?<r> -?\d+\.\d+)(?<g> -?\d+\.\d+)(?<b> -?\d+\.\d+)/;
var matAlphaRegex = /^d(?<alpha> -?\d+\.\d+)/;
var matTextRegex = /map_Kd (?<text>.*)/;

// Object Regex
var vertexRegex = /^v(?<x> -?\d+\.\d+)(?<y> -?\d+\.\d+)(?<z> -?\d+\.\d+)$/;
var normalRegex = /^vn(?<x> -?\d+\.\d+)(?<y> -?\d+\.\d+)(?<z> -?\d+\.\d+)$/;
var textureRegex = /^vt(?<u> -?\d+\.\d+)(?<v> -?\d+\.\d+)$/;
var faceReg = /^f( \d+(\/\d+)(\/\d+)){3}|^f( \d+){3}/g;
var splitReg = /(?<v>\d+)(\/(?<t>\d*)\/(?<n>\d*))?/g;
var objectRegex = /^o (.*)$/;
var useMatRegex = /^(newmtl|usemtl) (?<name>.*)$/;

function toggleHidden() {
  $("#loading ").toggleClass("hidden");
}

function test() {
  var str =
    "f 1/1/1 5/2/1 7/3/1 3/4/1\nf 4/5/2 3/4/2 7/6/2 8/7/2\nf 87//122 98//127 91//126\nf 87//122 92//128 98//127\nf 1 2 3\nf 1 4 2\nf 5 6 7\nf 5 8 6";
  var test2 = "f 1/1/1 5/2/1 7/3/1 3/4/1\nf";

  var test = test2.match(faceReg);

  //for (let res of test) {
  console.log(test);
  var final = test[0].matchAll(splitReg);

  for (let fin of final) {
    console.log(fin.groups);
  }
  //}
}

function readMaterial(file) {
  let CHUNK_SIZE = 10 * 1024;
  let start = 0;
  let end = file.size > CHUNK_SIZE ? CHUNK_SIZE : file.size;
  let mat = null;
  mats = [];

  return new Promise((resolve, reject) => {
    let fr = new FileReader();

    fr.onload = function () {
      let buffer = new Uint8Array(fr.result);
      var lastline = 0;
      for (let i = 0; i < buffer.length; i++) {
        if (buffer[i] === 10) {
          let j;
          for (j = i + 1; j < buffer.length; j++) {
            if (buffer[j] === 10) break;
          }

          let snippet = new TextDecoder("utf-8").decode(buffer.slice(i + 1, j));
          lastline = i;
          var match;

          if ((match = snippet.match(matNameRegex))) {
            if (mat) {
              mats.push(mat);
            }
            initMat();
            mat.name = match.groups.name;
            mat.material.name = match.groups.name;
          } else if ((match = snippet.match(matSpecExRegex))) {
            mat.material.n = parseFloat(match.groups.n);
          } else if ((match = snippet.match(matAmbiRegex))) {
            mat.material.ambient.push(
              parseFloat(match.groups.r),
              parseFloat(match.groups.g),
              parseFloat(match.groups.b)
            );
          } else if ((match = snippet.match(matDiffRegex))) {
            //console.log(match);
            mat.material.diffuse.push(
              parseFloat(match.groups.r),
              parseFloat(match.groups.g),
              parseFloat(match.groups.b)
            );
          } else if ((match = snippet.match(matSpecRegex))) {
            mat.material.specular.push(
              parseFloat(match.groups.r),
              parseFloat(match.groups.g),
              parseFloat(match.groups.b)
            );
          } else if ((match = snippet.match(matAlphaRegex))) {
            mat.material.alpha = parseFloat(match.groups.alpha);
          } else if ((match = snippet.match(matTextRegex))) {
            mat.material.texture = match.groups.text;
          }
        }
      }
      if (end != file.size) {
        start += lastline;
        end = start + CHUNK_SIZE;
        end = file.size > end ? end : file.size;
        //console.log("New Chunk!");
        loadChunk(start, end);
      } else {
        console.log("Read End");
        mats.push(mat);
        console.log(mats);
        resolve();
      }
    };

    fr.onerror = reject;

    function initMat() {
      mat = {
        name: "",
        material: {
          name: "",
          ambient: [],
          diffuse: [],
          specular: [],
          n: 0,
          alpha: 1.0,
          texture: "",
        },
      };
    }
    function loadChunk(start, end) {
      let slice = file.slice(start, end);
      fr.readAsArrayBuffer(slice);
    }

    loadChunk(start, end);
  });
}
convert;
function readFile(file) {
  let fr = new FileReader();
  let CHUNK_SIZE = 10 * 1024;
  let start = 0;
  let end = file.size > CHUNK_SIZE ? CHUNK_SIZE : file.size;
  objs = [];
  var obj = null;

  var vertCount = 0;
  var normCount = 0;
  var textCount = 0;

  var verticies = [];
  var norms = [];
  var texts = [];
  //initObj();

  fr.onload = function () {
    let buffer = new Uint8Array(fr.result);
    var lastline = 0;
    var linecount = 0;
    for (let i = 0; i < buffer.length; i++) {
      if (buffer[i] === 10) {
        let j;
        for (j = i + 1; j < buffer.length; j++) {
          if (buffer[j] === 10) break;
        }
        linecount++;

        let snippet = new TextDecoder("utf-8").decode(buffer.slice(i + 1, j));
        lastline = i;
        //console.log(snippet);
        var match;

        if ((match = snippet.match(objectRegex))) {
          if (obj) {
            //vertCount += obj.vertices.length;
            //normCount += obj.normals.length;
            //textCount += obj.uvs.length;
            objs.push(obj);

            obj.verts = verticies;
            obj.norms = norms;
            obj.texts = texts;
          }
          initObj();
        } else if ((match = snippet.match(useMatRegex))) {
          //console.log(match);
          var found = mats.find(
            (material) => material.name == match.groups.name
          );
          if (found) {
            obj.material = found.material;
          }

          //obj.material.name = match.groups.name;
        } else if ((match = snippet.match(vertexRegex))) {
          //console.log(match);
          obj.vertices.push([
            parseFloat(match.groups.x),
            parseFloat(match.groups.y),
            parseFloat(match.groups.z),
          ]);
          verticies.push([
            parseFloat(match.groups.x),
            parseFloat(match.groups.y),
            parseFloat(match.groups.z),
          ]);
        } else if ((match = snippet.match(normalRegex))) {
          obj.normals.push([
            parseFloat(match.groups.x),
            parseFloat(match.groups.y),
            parseFloat(match.groups.z),
          ]);
          norms.push([
            parseFloat(match.groups.x),
            parseFloat(match.groups.y),
            parseFloat(match.groups.z),
          ]);
        } else if ((match = snippet.match(textureRegex))) {
          obj.uvs.push([
            parseFloat(match.groups.u),
            parseFloat(match.groups.v),
          ]);
          texts.push([parseFloat(match.groups.u), parseFloat(match.groups.v)]);
        } else if ((match = snippet.match(faceReg))) {
          var final = match[0].matchAll(splitReg);
          var verts = [];

          var arr = Array.from(match[0].matchAll(splitReg));

          if (arr.length == 3) {
            for (let fin of final) {
              verts.push({
                v: parseFloat(fin.groups.v) - vertCount,
                vt: parseFloat(fin.groups.t) - textCount,
                vn: parseFloat(fin.groups.n) - normCount,
              });
            }

            obj.triangles.push(verts);
          } else {
            for (let k = 1; k < arr.length - 1; k++) {
              verts = [];
              verts.push({
                v: parseFloat(arr[0][1]) - vertCount,
                vt: parseFloat(arr[0][3]) - textCount,
                vn: parseFloat(arr[0][4]) - normCount,
              });
              verts.push({
                v: parseFloat(arr[k][1]) - vertCount,
                vt: parseFloat(arr[k][3]) - textCount,
                vn: parseFloat(arr[k][4]) - normCount,
              });
              verts.push({
                v: parseFloat(arr[k + 1][1]) - vertCount,
                vt: parseFloat(arr[k + 1][3]) - textCount,
                vn: parseFloat(arr[k + 1][4]) - normCount,
              });

              obj.triangles.push(verts);
            }
          }
        }
      }
    }
    if (end != file.size) {
      start += lastline;
      end = start + CHUNK_SIZE;
      end = file.size > end ? end : file.size;
      loadChunk(start, end);
    } else {
      console.log("Read End");
      obj.verts = verticies;
      obj.norms = norms;
      obj.texts = texts;
      objs.push(obj);
      console.log(objs);

      $("#downloadMsg").text(modelName + " model is ready.");
      document.getElementById("dwnBtn").disabled = false;
      toggleHidden();
    }
  };

  function initObj() {
    obj = {
      vertices: [],
      normals: [],
      uvs: [],
      verts: [],
      norms: [],
      texts: [],
      triangles: [],
      material: {
        name: "",
        ambient: [],
        diffuse: [],
        specular: [],
        n: 0,
        alpha: 1.0,
        texture: "",
      },
    };
  }

  function loadChunk(start, end) {
    let slice = file.slice(start, end);
    fr.readAsArrayBuffer(slice);
  }

  loadChunk(start, end);
}

function convert() {
  toggleHidden();
  let objfile = $("#objpicker")[0].files[0];
  let matfile = $("#matpicker")[0].files[0];

  if (objfile) {
    modelName = objfile.name.split(".")[0];

    if (matfile) {
      readMaterial(matfile).then(() => {
        readFile(objfile);
      });
    } else {
      readFile(objfile);
    }
  } else {
    console.log("No Object File!");
    toggleHidden();
  }
}

async function download() {
  if (modelName != "" && objs != null) {
    var blob = new Blob([JSON.stringify(objs, null, 2)], {
      type: "application/json",
    });

    var url = URL.createObjectURL(blob);

    var pom = document.createElement("a");

    pom.href = url;
    pom.download = modelName + ".json";

    document.body.appendChild(pom);
    pom.dispatchEvent(
      new MouseEvent("click", {
        bubbles: true,
        cancelable: true,
        view: window,
      })
    );

    // Remove link from body
    document.body.removeChild(pom);
  }
}

function clear() {
  objs = null;
  document.getElementById("dwnBtn").disabled = true;
  $("#downloadMsg").text("");
  $("#objpicker")[0].val("");
  $("#matpicker")[0].val("");
}
