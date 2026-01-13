export type Plain = 
  | null
  | string
  | number
  | boolean
  | Plain[]
  | {[key: string]: Plain}