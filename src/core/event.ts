import type { Plain } from "../hg.js"
import { Id, un } from "./id.js"

export type Event = Plain<any>

export namespace Event {

  export type Handler<E extends Event> = {
    (e: E, c: Context<E>): void
  }

  export type Context<E extends Event> = {
    tree: Tree
    node: Node
    kind: string
    path: string
    self: Id<Handler<E>>
  }

  export type Action = Plain<
    | { action: "listen"  , path: string, kind: string       , handler: Id<Handler<any>>        }
    | { action: "deafen"  , path: string, kind: string | null, handler: Id<Handler<any>> | null }
    | { action: "dispatch", path: string, kind: string       , event: Event }
  >

  export type Listen   = Extract<Action, { action: "listen"  }>
  export type Deafen   = Extract<Action, { action: "deafen"  }>
  export type Dispatch = Extract<Action, { action: "dispatch"}>

  export type Tree = Plain<{
    root   : Node
    pending: Array<Action>
  }>

  export type Node = Plain<{
    children: Id<Map<string, Node>>
    handlers: Id<Map<string, Id<Set<Id<Handler<any>>>>>>
  }>

  export type Options = {
    path  ?: string
    defer ?: boolean
  }
}

const Node = {
  new() {
    return {
      children: Id.acquire(new Map()),
      handlers: Id.acquire(new Map()),
    } satisfies Event.Node
  }
}

const Tree = {
  new() {
    return {
      root   : Node.new(),
      pending: [ ]
    } satisfies Event.Tree
  },
}

export const Event = {
  Tree, 
  Node,

  once<E extends Event>(listener: Event.Handler<E>) {
    return ((e: E, c: Event.Context<E>) => {
      listener(e, c)
      Event.deafen<E>(
        c.tree, 
        c.kind, 
        c.self, 
        { path: c.path, defer: false }
      )
    }) satisfies Event.Handler<E>
  },

  listen<E extends Event>  (tree: Event.Tree, kind: string       , handler:    Event.Handler<E>        , o ?: Event.Options) {
    const a: Event.Listen = { action: "listen"  , path: o?.path ?? "", kind, handler: Id.acquire(handler) }
    if (o?.defer ?? true) queue(tree, a)
    else                  flush(tree, a)
  },

  deafen<E extends Event>  (tree: Event.Tree, kind: string | null, handler: Id<Event.Handler<E>> | null, o ?: Event.Options) {
    const a: Event.Deafen = { action: "deafen"  , path: o?.path ?? "", kind, handler }
    if (o?.defer ?? true) queue(tree, a)
    else                  flush(tree, a)
  },

  dispatch<E extends Event>(tree: Event.Tree, kind: string, event: E, o ?: Event.Options) {
    const a: Event.Dispatch = { action: "dispatch", path: "", kind: "", event }
    if (o?.defer ?? true) queue(tree, a)
    else                  flush(tree, a)
  },

  poll(tree: Event.Tree) {
    tree.pending.splice(0).forEach(
      a => flush(tree, a)
    )
  }
}

function queue(tree: Event.Tree, a: Event.Action) {
  tree.pending.push(a)
}

function flush(tree: Event.Tree, a: Event.Action) {
  switch (a.action) {
    case "listen"  : onListen  (tree, a); break
    case "deafen"  : onDeafen  (tree, a); break
    case "dispatch": onDispatch(tree, a); break
  }
}

function requestListeners(node: Event.Node | undefined, kind: string) {
  let list = node?.handlers[kind]
  if (!list) return
  return list
}

function requireListeners(node: Event.Node            , kind: string) {
  let list = node.handlers[kind]
  if (!list) node.handlers[kind] = (
    list = [ ]
  )
  return list
}

function requestNode(root: Event.Node | undefined, path: string) {
  for (const part of path.split("/")) {
    let node = root?.children[part]
    if (!node) return
    root = node
  }

  return root
}

function requireNode(root: Event.Node            , path: string) {
  for (const part of path.split("/")) {
    let node = root.children[part]
    if (!node) root.children[part] = (
      node = Node.new()
    )
    root = node
  }
  return root
}

function releaseListener (listener :       Id<Event.Handler<any>> ) {
  Id.release(listener)
}

function releaseListeners(listeners: Array<Id<Event.Handler<any>>>) {
  listeners.forEach(releaseListener)
}

function releaseNode(node: Event.Node) {
  Object.values(node.handlers).forEach(releaseListeners)
  Object.values(node.children ).forEach(releaseNode     )
}

function onListen(tree: Event.Tree, a: Event.Listen) {
  const node = requireNode(tree.root, a.path)
  const list = requireListeners(node, a.kind)
  // only add if unique
  if (!list.includes(a.handler))
    list.push(a.handler)
}

function onDeafen(tree: Event.Tree, a: Event.Deafen) {
  if (a.kind !== null && a.handler !== null) {
    const node = requestNode(tree.root, a.path)
    const list = requestListeners(node, a.kind)
    if (list && list.includes(a.handler)) {
      const where = list.indexOf(a.handler)
      const what  = list.splice(where, 1)[0]
      releaseListener(what!)
    }
    
  } else if (a.kind !== null && a.handler === null) {
    const node = requestNode(tree.root, a.path)
    const list = requestListeners(node, a.kind)
    if (list)  releaseListeners(list.splice(0))

  } else if (a.kind === null && a.handler !== null) {
    const node = requestNode(tree.root, a.path)
    if (node) Object.values(node.handlers).forEach(list => {
      if (list.includes(a.handler!)) {
        const where = list.indexOf(a.handler!)
        const what  = list.splice (where, 1)[0]
        releaseListener(what!)
      }
    })
  } else if (a.kind === null && a.handler === null) {
    const node = requestNode(tree.root, a.path)
    if (node) {
      releaseNode(node)
      node.children  = { }
      node.handlers = { }
    }
  }
}

function onDispatch(tree: Event.Tree, a: Event.Dispatch) {
}