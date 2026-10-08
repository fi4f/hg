# Mercury

Mercury is a tiny engine for making interactive stuff on the web.

It brings a language, a library, and a runtime into one malleable environment. The goal is to make that environment easy to modify while you work, so the tools you need can become part of the thing you are making.

## Why Mercury?

The enemy of creativity is cognitive friction. Switching between platforms, editors, languages, and workflows takes attention away from the work itself.

Mercury aims to reduce that friction by giving browser code and shader code a shared language and data model. You can describe behavior, work with data, and define fragment shaders in hg-lisp, while using JavaScript and WGSL directly when you need them.

## Language, library, runtime

| Part | Purpose |
| --- | --- |
| **Language** | hg-lisp provides a small set of forms for expressing browser behavior and fragment shaders. It targets JavaScript and WGSL. |
| **Library** | The JavaScript API exposes Mercury's data types and runtime capabilities. It is intended to work both inside and outside hg-lisp. |
| **Runtime** | The runtime connects those values and behaviors to the browser and GPU, including shader handles produced by hg-lisp. |

The JavaScript API separates data from functions: data uses native primitives and plain objects, and operations live in plain objects grouped by domain. Mercury uses explicit function calls and avoids classes and hidden dispatch through getters or setters. Any required accessor exception must document its purpose and behavior. The codebase prefers double-quoted strings, and hg-lisp accepts only double-quoted string literals. See the [API conventions](docs/api.md#api-conventions).

## Working with Mercury

The intended workflow is to define data and behavior in hg-lisp, describe fragment rendering with shader functions, and modify the running experience as you go. Only fragment shaders are user-programmable; the runtime owns the vertex path, and custom vertex and compute shaders are unsupported. Type guards give data an explicit shape wherever JavaScript and WGSL meet.

hg-lisp uses `let` for scoped mutable declarations, `set` for assignment, and `get` for explicit symbol resolution when needed. It has no constant declaration form. Assignment supports dot notation for collection members, including computed dictionary keys.

Evaluation follows JavaScript's lexical scope, captures, and name lookup. Child declarations may shadow parent bindings; conflicting declarations in the same scope and unresolved bindings are errors. Expressions evaluate from left to right and statements from top to bottom. See [evaluation](docs/hg-lisp.md#evaluation).

Functions implicitly return their final statement's value, with `return` available for early exits. Empty functions and functions ending with a non-value statement return `nil`. Braces group statements in a lexical scope, produce no value, and introduce no function or return boundary. They cannot be used in value positions, including collection accessors. See [brace blocks](docs/hg-lisp.md#brace-blocks).

Arithmetic, vector and matrix operations, and vector swizzles work on both the JavaScript and WGSL targets. See [arithmetic and linear algebra](docs/hg-lisp.md#arithmetic-and-linear-algebra) for the shared operation contract.

Unsuffixed numbers are `num`; the suffixes `i`, `u`, and `f` select `i32`, `u32`, and `f32`. All scalar numeric types use ordinary JavaScript numbers on the host side. Primitive constructors convert values, while guards validate them before a function body runs. String literals use JavaScript escapes, and `$"..."` templates evaluate expressions inside braces, with doubled braces producing literal braces. See the [language's value rules](docs/hg-lisp.md#numeric-literals).

Type queries use `<type>?`, such as `(i32? 10)`, and return a boolean. The `bool` type exists in both targets but cannot cross the JavaScript/WGSL data boundary. Guard failures are hard errors, and runtime guards check values at guarded boundaries. A value that later mutates out of shape is checked again only if it encounters another guard. See [type queries](docs/hg-lisp.md#type-queries) and [type guards](docs/hg-lisp.md#type-guards).

Most runtime data types should serialize to and from JSON for web compatibility. JSON numbers, strings, booleans, nulls, and arrays map directly to `num`, `str`, `bool`, `nil`, and `list`. Scalar numbers serialize without retaining their numeric type. Ordinary objects map to `dict`; other serializable object types require a `__type__` discriminator. Application and shader handles are not serializable. See [JSON serialization](docs/hg-lisp.md#json-serialization) for the data boundary and dictionary collision policy.

The proposed [reserved metadata rule](docs/hg-lisp.md#reserved-type-metadata) makes known assignments to `__type__` compiler errors. Computed keys and live edits need equivalent mutation checks when the target is only known at runtime.

hg-lisp also provides forms for embedding raw JavaScript and WGSL. These let you reach the underlying languages without leaving the surrounding Mercury program.

JavaScript-side programs can use [asynchronous forms](docs/hg-lisp.md#asynchronous-forms): `async` wraps functions, `promise` creates promises with chained handlers, and `await` waits for their results. Inside promise bodies and `then` handlers, `return` supplies successful completion and `reject` returns a rejected promise without throwing. These promise operations cannot compile to WGSL.

The compilers expose a public API so the editor and other applications can inspect source tokens for syntax highlighting and request target output. JavaScript and WGSL are the initial design targets; HTML and CSS are possible future targets. See the [compiler API](docs/api.md#compiler-api) for the tooling boundary.

The WGSL compiler lifts shader and helper function definitions into the surrounding module while preserving their source scopes and metadata. See [function hoisting](docs/hg-lisp.md#function-hoisting) for the compiler requirement and remaining capture lowering contracts.

The runtime exposes its API through a single `hg` object. Create an application with `hg.App.new(options)`, then serve a script as its current scene with `hg.App.serve(app, script)`. Scene operations distinguish live updates that preserve memory from serving a scene with fresh memory; their final contracts are still being specified. Each app manages its own execution, memory, canvas, and lifecycle. See the [runtime entry point](docs/api.md#runtime-entry-point) for configuration and defaults.

App options `w` and `h` define the output graphics buffer's actual pixel size. Presentation centers and uniformly scales the graphics on the canvas, preserving their aspect ratio and letterboxing unused space. It uses canvas bitmap pixels for sizing and retains centered clipping when a minimum scale cannot fit. See [frame presentation](docs/api.md#frame-presentation) for the geometry.

## Self-hosted editor

Mercury's ultimate goal is an editor written in hg-lisp, with its own source visible and editable inside the editor. Changing that source should change the running editor in real time. This makes the editor itself part of the environment you can shape as you work. See [self-hosted editing](docs/hg-lisp.md#self-hosted-editing) for the language implications.

The editor manages a separate application instance for the app being developed. The editor and child app are distinct instances, each with one canvas destination. From the editor, you should be able to inspect and edit the child's live memory, update its code, and reset it. External invocation of child functions or API operations still needs a contract. See [reflection and external control](docs/api.md#reflection-and-external-control) for that runtime boundary.

## Design status

These documents describe the intended design of the new Mercury runtime. The language and API are still being specified; examples illustrate the design rather than a released implementation. Installation, the complete API reference, and runnable getting-started instructions will follow once those contracts are defined.

## Documentation

- [hg-lisp](docs/hg-lisp.md): compilation targets, syntax, data types, type guards, mutation, shader functions, and self-hosted editing.
- [JavaScript API](docs/api.md): compiler tooling, applications, scene updates, runtime values, and external control.
