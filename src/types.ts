export type Mapping = Record<string, string>
  
export type Count = Record<string, number | undefined>
  
export type Municipality = {
  code: string
  name: string
  countByDrivingForce: Count
  countByColor: Count
  countByRegistrationYear: Count
  countByMaker: Count
}