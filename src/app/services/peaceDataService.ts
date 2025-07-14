export type PeaceData = Record<string, number>;

export class PeaceDataService {
  static async fetchPeaceData(): Promise<PeaceData> {
    // Replace with real fetch later
    return {
      USA: 0,
      ISR: 35,
      EGY: 51,
      FRA: 72,
      RUS: 0,
      CHN: 10,
      IRN: 70,
      UKR: 50,
      IND: 71,
      PAK: 20,
      DEU: 5,
      BRA: 66,
      ARG: 75,
      CAN: 90,
    };
  }
}
