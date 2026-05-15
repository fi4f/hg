// hg prototype — single file

type Vec3 = [number, number, number]

type Ray = {
  origin: Vec3
  dir: Vec3
}

type Hit = {
  t: number
  normal: Vec3
  materialId: number
}

type Material = (hit: Hit, ray: Ray) => Vec3

// -------------------------
// Scene (geometry layer)
// -------------------------

type Scene = {
  raycast(ray: Ray): Hit | null
}

// simple sphere-ish fake intersection (for prototype clarity)
function createScene(): Scene {
  return {
    raycast(ray: Ray): Hit | null {
      // fake plane at z = 0
      const t = -ray.origin[2] / ray.dir[2]
      if (t <= 0) return null

      return {
        t,
        normal: [0, 0, 1],
        materialId: 0
      }
    }
  }
}

// -------------------------
// Camera (uv → ray)
// -------------------------

type Camera = {
  sampleRay(uv: [number, number]): Ray
}

function createCamera(): Camera {
  return {
    sampleRay([u, v]) {
      const x = (u - 0.5) * 2
      const y = (v - 0.5) * 2

      return {
        origin: [0, 0, 1],
        dir: [x, y, -1]
      }
    }
  }
}

// -------------------------
// Sampler (ray + scene → color)
// -------------------------

type Sampler = {
  sample(ray: Ray, scene: Scene): Vec3
}

function createSampler(materials: Material[]): Sampler {
  return {
    sample(ray, scene) {
      const hit = scene.raycast(ray)

      if (!hit) return [0, 0, 0]

      const mat = materials[hit.materialId]!
      return mat(hit, ray)
    }
  }
}

// -------------------------
// Materials (your "pseudo-shaders")
// -------------------------

const red: Material = () => [1, 0, 0]

const normalViz: Material = (hit) => {
  return [
    Math.abs(hit.normal[0]),
    Math.abs(hit.normal[1]),
    Math.abs(hit.normal[2])
  ]
}

// -------------------------
// Render loop (immediate mode)
// -------------------------

function render(
  canvas: HTMLCanvasElement,
  camera: Camera,
  scene: Scene,
  sampler: Sampler
) {
  const ctx = canvas.getContext("2d")!
  const img = ctx.createImageData(canvas.width, canvas.height)

  for (let y = 0; y < canvas.height; y++) {
    for (let x = 0; x < canvas.width; x++) {
      const u = x / canvas.width
      const v = y / canvas.height

      const ray = camera.sampleRay([u, v])
      const color = sampler.sample(ray, scene)

      const i = (y * canvas.width + x) * 4

      img.data[i + 0] = color[0] * 255
      img.data[i + 1] = color[1] * 255
      img.data[i + 2] = color[2] * 255
      img.data[i + 3] = 255
    }
  }

  ctx.putImageData(img, 0, 0)
}

// -------------------------
// Boot
// -------------------------

const canvas = document.querySelector("canvas") as HTMLCanvasElement
canvas.width = 512
canvas.height = 512

const scene = createScene()
const camera = createCamera()
const sampler = createSampler([red, normalViz])

function frame() {
  render(canvas, camera, scene, sampler)
  requestAnimationFrame(frame)
}

frame()