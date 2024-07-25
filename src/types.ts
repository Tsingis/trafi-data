export type Mapping = {
  [key: string]: string
}
  
export type Count = {
  [key: string]: number
}
  
export type Municipality = {
  code: string
  name: string
  countByDrivingForce: Count
  countByColor: Count
}