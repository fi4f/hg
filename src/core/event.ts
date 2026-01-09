import type { Maybe } from "../util/types.js"

export namespace Event {
  export type Listener<T> = (event: T, context: Event.Context<T>) => void

  export type Listen   = { action: "listen"  , path: string, type  : string            , listener  : Listener<any>             }
  export type Deafen   = { action: "deafen"  , path: string, type ?: string | undefined, listener ?: Listener<any> | undefined }
  export type Dispatch = { action: "dispatch", path: string, type: string, event: any }

  export type Action = Listen | Deafen | Dispatch

  export type Tree = {
    root   :       Event.Node   
    pending: Array<Event.Action>
  }

  export type Node = {
    children : Map<string,     Event.Node          >
    listeners: Map<string, Set<Event.Listener<any>>>
  }

  export type Context<T> = {
    tree: Event.Tree
    node: Event.Node
    path: string
    type: string
    self: Event.Listener<T>
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
        children : new Map(),
        listeners: new Map()
      } satisfies Event.Node
    }
  },

  once<T>(listener: Event.Listener<T>) {
    return ((event: T, context: Event.Context<T>) => {
      listener(event, context)
      const { tree, path, type, self } = context
      Event.deafen(tree, type, self, { path, defer: false })
    }) satisfies Event.Listener<T>
  },

  listen<T>(tree: Event.Tree, type  : string, listener  : Event.Listener<T>, o ?: { path ?: string, defer ?: boolean }) {
    const a: Event.Listen = { action: "listen", path: o?.path ?? "", type, listener }
    if (o?.defer ?? true) queue(tree, a)
    else                  flush(tree, a)
  },

  deafen<T>(tree: Event.Tree, type ?: string, listener ?: Event.Listener<T>, o ?: { path ?: string, defer ?: boolean }) {
    const a: Event.Deafen = { action: "deafen", path: o?.path ?? "", type, listener }
    if (o?.defer ?? true) queue(tree, a)
    else                  flush(tree, a)
  },

  dispatch(tree: Event.Tree, type: string, event: any, o ?: { path ?: string, defer ?: boolean }) {
    const a: Event.Dispatch = { action: "dispatch", path: o?.path ?? "", type, event }
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
  switch(a.action) {
    case "listen"  : return onListen  (tree, a)
    case "deafen"  : return onDeafen  (tree, a)
    case "dispatch": return onDispatch(tree, a)
  }
}

function requestListeners(node: Maybe<Event.Node>, type: string) {
  let list = node?.listeners.get(type)
  // if (!list) node.listeners.set(
  //   type, list = new Set()
  // )
  return list
}

function requireListeners(node:       Event.Node , type: string) {
  let list = node.listeners.get(type)
  if (!list) node.listeners.set(
    type, list = new Set()
  )
  return list
}

function requestNode(root: Maybe<Event.Node>, path: string) {
  for (const part of path.split("/")) {
    let node = root?.children.get(part)
    if (!node) return
    root = node
  }

  return root
}

function requireNode(root:       Event.Node , path: string) {
  for (const part of path.split("/")) {
    let node = root.children.get(part)
    if (!node) root.children.set(
      part, node = Event.Node.new()
    )
    root = node
  }

  return root
}

function onListen  (tree: Event.Tree, a: Event.Listen  ) {
  const node = requireNode(tree.root, a.path)
  const list = requireListeners(node, a.type)
  list.add(a.listener)
}

function onDeafen  (tree: Event.Tree, a: Event.Deafen  ) {
         if (a.type !== undefined && a.listener !== undefined) {
    const node = requestNode(tree.root, a.path)
    const list = requestListeners(node, a.type)
    list?.delete(a.listener)
  } else if (a.type !== undefined && a.listener === undefined) {
    const node = requestNode(tree.root, a.path)
    const list = requestListeners(node, a.type)
    list?.clear()
  } else if (a.type === undefined && a.listener !== undefined) {
    const node = requestNode(tree.root, a.path)
    node?.listeners.forEach((list) => {
      list.delete(a.listener!)
    })
  } else if (a.type === undefined && a.listener === undefined) {
    const node = requestNode(tree.root, a.path)
    node?.children .clear()
    node?.listeners.clear()
  }
}

function onDispatch(tree: Event.Tree, { path, type, event }: Event.Dispatch) {
  const node = requestNode(tree.root, path)
  if (!node) return
  reDispatch(tree, node, path, type, event)
}

function reDispatch(tree: Event.Tree, node: Event.Node, path: string, type: string, event: any) {
  requestListeners(node, type)?.forEach(self => {
    self(event, { tree, node, path, type, self })
  })

  node.children.forEach((child, name) => {
    reDispatch(tree, child, `${path}/${name}`, type, event)
  })
}