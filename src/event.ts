import { Id } from "./id.js"
import type { Plain } from "./data/plain.js"

export namespace Event {
  export type Listener<E extends Plain> = {
    (what: E, also: Context<E>): void
  }

  export type Context <E extends Plain> = {
    tree: Tree
    node: Node
    path: string
    when: string
    self: Id<Listener<E>>
  }

  export type Action = 
    | { action: "listen"  , path: string, when: string       , then: Id<Listener<any>>        }
    | { action: "deafen"  , path: string, when: string | null, then: Id<Listener<any>> | null }
    | { action: "dispatch", path: string, when: string, what: Plain }

  export type Tree = {
    root   : Event.Node
    pending: Array<Event.Action>
  }

  export type Node = {
    children : {[id: string]: Node                    }
    listeners: {[id: string]: Array<Id<Listener<any>>>}
  }

  export type Options = {
    path  ?: string
    defer ?: boolean
  }
}

export const Event = {
  Tree: {
    new() {
      return {
        root   : Event.Node.new(),
        pending: [ ]
      } satisfies Event.Tree
    }
  },

  Node: {
    new() {
      return {
        children : { },
        listeners: { }
      } satisfies Event.Node
    }
  },

  once<E extends Plain>(then: Id<Event.Listener<E>> | Event.Listener<E>) {
    return Id.acquire<Event.Listener<E>>((what, also) => {
      if (typeof then === "string")
        then = Id.resolve(then)
      then(what, also)

      Event.deafen(
        also.tree, 
        also.when, 
        also.self,
        { path: also.path, defer: false }
      )
    })
  },

  listen  <E extends Plain>(tree: Event.Tree, when: string       , then: Id<Event.Listener<E>> | Event.Listener<E>       , o ?: Event.Options) {    
    const a = { action: "listen", path: o?.path ?? "", when, then: wrap(then)! } satisfies Event.Action
    if (o?.defer ?? true) queue(tree, a)
    else                  flush(tree, a)
  },

  deafen  <E extends Plain>(tree: Event.Tree, when: string | null, then: Id<Event.Listener<E>> | Event.Listener<E> | null, o ?: Event.Options) {
    const a = { action: "deafen", path: o?.path ?? "", when, then: wrap(then)  } satisfies Event.Action
    if (o?.defer ?? true) queue(tree, a)
    else                  flush(tree, a)
  },

  dispatch<E extends Plain>(tree: Event.Tree, when: string, what: E, o ?: Event.Options) {
    const a = { action: "dispatch", path: o?.path ?? "", when, what } satisfies Event.Action
    if (o?.defer ?? true) queue(tree, a)
    else                  flush(tree, a)
  },

  poll(tree: Event.Tree) {
    tree.pending.splice(0).forEach(
      a => flush(tree, a)
    )
  }
}

function wrap<E extends Plain>(then: Id<Event.Listener<E>> | Event.Listener<E> | null) {
  switch (typeof then) {
    case "function" : return Id.acquire(then)
    case "string"   : return then
    case "object"   : return then
  }
}

function queue(tree: Event.Tree, a: Event.Action) {
  tree.pending.push(a)
}

function flush(tree: Event.Tree, a: Event.Action) {
  switch(a.action) {
    case "listen"  : return onListen  (tree, a)
    case "deafen"  : return onDeafen  (tree, a)
    case "dispatch": return onDispatch(tree, a)
  }
}

function requestListeners(node: Event.Node | undefined, when: string) {
  let list = node?.listeners[when]
  if (!list) return
  return list
}

function requireListeners(node: Event.Node            , when: string) {
  let list = node.listeners[when]
  if (!list) node.listeners[when] = (
    list = [ ]
  )
  return list
}

function requestNode(root: Event.Node | undefined, path: string) {
  for (const id of path.split("/")) {
    let node = root?.children[id]
    if (!node) return
    root = node
  }
  return root
}

function requireNode(root: Event.Node            , path: string) {
  for (const id of path.split("/")) {
    let node = root.children[id]
    if (!node) root.children[id] = (
      node = Event.Node.new()
    )
    root = node
  }
  return root
}

function onListen  (tree: Event.Tree, a: Event.Action & { action: "listen"  }) {
  const node = requireNode(tree.root, a.path)
  const list = requireListeners(node, a.when)
  if (list.includes(a.then))
    throw new Error(`[Event.onListen] Listener with id '${a.then}' already exists.`)
  list.push(a.then)
}

function onDeafen  (tree: Event.Tree, a: Event.Action & { action: "deafen"  }) {
         if (a.when !== null && a.then !== null) {
    const node = requestNode(tree.root, a.path)
    const list = requestListeners(node, a.when)
    if (!list || !list.includes(a.then)) return

    list.splice(list.indexOf(a.then), 1)

  } else if (a.when !== null && a.then === null) {
    const node = requestNode(tree.root, a.path)
    const list = requestListeners(node, a.when)
    if (!list) return

    list.splice(0)

  } else if (a.when === null && a.then !== null) {
    const node = requestNode(tree.root, a.path)
    if (!node) return

    for (const list of Object.values(node.listeners))
      if (list.includes(a.then))
        list.splice(list.indexOf(a.then), 1)

  } else if (a.when === null && a.then === null) {
    const node = requestNode(tree.root, a.path)
    if (!node) return
    node.children  = { }
    node.listeners = { }
  }
}

function onDispatch(tree: Event.Tree, { path, when, what }: Event.Action & { action: "dispatch" }) {
  const node = requestNode(tree.root, path)
  if (!node) return
  reDispatch (tree, node, path, when, what)
}

function reDispatch(tree: Event.Tree, node: Event.Node, path: string, when: string, what: any) {
  requestListeners(node, when)?.forEach(self => {
    Id.resolve(self)(what, { tree, node, path, when, self })
  })

  for (const [name, child] of Object.entries(node.children))
    reDispatch(tree, child, `${path}/${name}`, when, what)
}