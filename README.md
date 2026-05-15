# Mercury

> A tiny engine for making interactive stuff on the web

---

### What is Mercury?

Mercury is a tiny engine for making interactive stuff on the web. 

Mercury is *not*
- an editor
- a framework
- a AAA game engine

---

### Why is Mercury?

The enemy of creativity is cognitive friction.

Many tools, engines, and frameworks come with an overwhelming amount of cognitive and philosophical baggage. I have experienced firsthand the pain of trying to master a new workflow, while each frustration gradually chips away at your creative motivation.

Context-switching is mentally taxing, and many modern tools incorporate many different abstractions that make it an unavoidable part of the user experience. Navigating between lists, inspectors, hierarchies, node editors, and script editors is exhausting.

Mercury is *code-first*. Just you, your text editor, and a few lines of code.

Mercury is *data-first*. All engine primitives are plain objects that can be easily serialized.

Mercury is *unopinionated*. No ideological buy-in required. Mercury exposes a handful of thin wrappers around browser APIs as well as a few plain primitives, but no module is *strictly* required. Mix and match and monkey-patch as you please.

---

### How do Mercury?

Install via npm -

```bash
npm i @fi4f/hg
```

Import the bits you need and start making things -










### Web GPU and Graphics

Drawing via a standard 2d render context is often quite limiting both from a performance perspective AND from a creative perspective. A standard 2d context struggles to handle very dynamic content and is often slow for a large number of draw calls.

I have always liked the simplicity of immediate-mode graphics apis, but I am often disappointed by their limitations. Every time I have tried to approach WebGL or WebGPU to *do* graphics, I find myself working with boilerplate and primitives I find really heavy-handed. Surely there must be a way to handle GPU-accelerated rendering without having to give up the immediate-mode convenience of a 2d context?

Shaders are the language of the GPU. So, my first instinct is to eliminate the need to author shaders in a different language altogether. Instead, I propose to author shaders using a declarative DSL in JavaScript that emits a JSON IR which can be transpiled into a shader string.

This obviously produces a lot of indirection, but hopefully addresses the cognitive pain of switching between languages within a project.

My second intuition is to simplify the graphics pipeline by eliminating everything but compute and fragment shaders. If the engine displays a quad to the screen, then the fragment shader can be used to not only render the frame, but also give the programmer per-pixel control over it.

This change introduces a new way of thinking about how a scene should be rendered. While powerful, this approach is suddenly missing a lot of the convenience of a traditional immediate-mode API. Instead of thinking in Meshes, Materials, Textures, and Shaders per-pixel rendering requires thinking from a more granular perspective.

This is where I propose a new set of primitives that can be used as a drop-in replacement for many of the types associated with a traditional immediate-mode API, without losing the benefits of per-pixel control.

Introducing the Sampler pipeline! In this pipeline, a Sampler is a function that accepts a UV coordinate and returns some information about *what* is visible at that point. The *what* in this case is then resolved to a single color value which of course is used in the fragment shader to render the frame. A variety of samplers are possible, including samplers for various 2d and 3d perspectives.

The sampler pipeline it turns out is very similar to ray tracing, but with some additional flexibility. The primary difference is that in a standard ray traced approach *all* operations are performed from the perspective of a ray. In contract, the Sampler pipeline operates from the perspective of a point on the screen, which can sometimes be a ray or sometimes not. Most 2d games for example don't require a screen-space ray to quickly determine overlap and ordering.