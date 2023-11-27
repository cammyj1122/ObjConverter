# Object Converter - In Progress

Takes in obj files and converts them into a modified version of the Class format. This is intended to be used with Blender to export models as objects.

## Exporting From Blender

There are a few things to note for the current process when exporting from blender.

- When exporting, use Wavefront (.obj) (legacy)

* For the object exporting options, makes sure the settings are as follows
  - Objects as OBJ Objects
  - Apply Modifiers - True
  - Write Normals - True
  - Include UVs - True
  - Write Materials - True
  - Triangulate Faces - True

## Format

The converter exports objects in an array of objects. Each object has The following properties:
|Property|Description|
|---|---|
|`vertices`| The **vertices** that are used in the current object. Helpful if the triangle verticies are **not** offset. |
|`normal`|The **normals** that are used in the current object. Helpful if the triangle normals are **not** offset. |
|`uvs`|The **texture uvs** that are used in the current object. Helpful if the triangle verticies are **not** offset. |
|`verts`| A running list of **all verticies**. Helpful if the triangle verticies **are** offset. |
|`norms`| A running list of **all normals**. Helpful if the triangle normals **are** offset. |
|`texts`| A running list of **all texture uvs**. Helpful if the triangle uvs **are** offset. |
|`triangles`| An array of arrays. The inner arrays have a length of 3 and define the 3 verticies of the triangle. the outer array describes all of the triangles that make up the object. <br><br> **Note:** The converter currently maintains **offset vertext information**. This aligns with how obj files are formatted. <br>In the following example, you can see how the vertex information does not start with 1. You can also see this in triangleExample.json|
|`materials`| An object that defines different material information for the object. Includes a **name**, the **ambient** color, **diffuse** color, **specular** color, specular exponent (**n**), **alpha**, and the **texture file name**.|

### Important Note

Currently, the converter reads in vertex information **as is**, meaning it follows obj file standards. Since obj files are 1-indexed, you currently **MUST** subtract all vertex information by 1 to access it properly in the array. This pertains to the vertex position, normal, and texture in the `triangles` object.

### Example File

<pre>
{
    "vertices": [
      [0.3, 0.1, 0.65],
      [0.3, 0.4, 0.65],
      [0.6, 0.4, 0.65],
      [0.6, 0.1, 0.65]
    ],
    "normals": [
      [0, 0, -1],
      [0, 0, -1],
      [0, 0, -1],
      [0, 0, -1]
    ],
    "uvs": [
      [0, 0],
      [0, 1],
      [1, 1],
      [1, 0]
    ],
    "verts": [
      [0.1, 0.3, 0.75],
      [0.25, 0.6, 0.75],
      [0.4, 0.3, 0.75],
      [0.3, 0.1, 0.65],
      [0.3, 0.4, 0.65],
      [0.6, 0.4, 0.65],
      [0.6, 0.1, 0.65],
      [0.65, 0.4, 0.45],
      [0.75, 0.6, 0.45],
      [0.85, 0.4, 0.45]
    ],
    "norms": [
      [0, 0, -1],
      [0, 0, -1],
      [0, 0, -1],
      [0, 0, -1],
      [0, 0, -1],
      [0, 0, -1],
      [0, 0, -1],
      [0, 0, -1],
      [0, 0, -1],
      [0, 0, -1]
    ],
    "texts": [
      [0, 0],
      [0.5, 1],
      [1, 0],
      [0, 0],
      [0, 1],
      [1, 1],
      [1, 0],
      [0, 0],
      [0.5, 1],
      [1, 0]
    ],
    "triangles": [
      [
        {
          "v": 4,
          "vt": 4,
          "vn": 4
        },
        {
          "v": 5,
          "vt": 5,
          "vn": 5
        },
        {
          "v": 6,
          "vt": 6,
          "vn": 6
        }
      ],
      [
        {
          "v": 4,
          "vt": 4,
          "vn": 4
        },
        {
          "v": 6,
          "vt": 6,
          "vn": 6
        },
        {
          "v": 7,
          "vt": 7,
          "vn": 7
        }
      ]
    ],
    "material": {
      "name": "tree",
      "ambient": [0.1, 0.1, 0.1],
      "diffuse": [0.6, 0.6, 0.4],
      "specular": [0.3, 0.3, 0.3],
      "n": 17,
      "alpha": 0.3,
      "texture": "tree.png"
    }
}
</pre>

<br>

## ToDo

- Fix texturing from blender - currently breaks some triangles

* Improve blender process
  - Find a way to fix ambient light for blender material

- Create short user guide with fully blender process
