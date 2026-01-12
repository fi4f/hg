export type Plain = Plain.Any

export namespace Plain {
  export type Any =
    | Plain.Null
    | Plain.String
    | Plain.Number
    | Plain.Boolean
    | Plain.Any[]
    | Plain.Object

  export type Null    = null
  export type String  = string
  export type Number  = number
  export type Boolean = boolean
  export type Array   = Plain.Any[]
  export type Object  = {[id: string]: Plain.Any}
}