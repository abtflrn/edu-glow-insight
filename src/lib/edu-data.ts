const EDU_URL = "/data/edu.json";

export interface EduRaw {
  provinces: string[];
  cities: string[];
  districts: string[];
  stages: string[];
  population: Record<string, [number, number]>; // provinceIdx -> [total, eduAge]
  schools: [string, number, number, number, number, number][];
  // [name, stageIdx, status(0=N,1=S), districtIdx, cityIdx, provinceIdx]
}

export interface School {
  name: string;
  stage: string;
  status: "Negeri" | "Swasta";
  district: string;
  city: string;
  province: string;
  cityIdx: number;
  provinceIdx: number;
  stageIdx: number;
}

export interface EduData {
  provinces: string[];
  cities: string[];
  districts: string[];
  stages: string[];
  population: Record<string, [number, number]>;
  schools: School[];
  cityToProvince: Record<number, number>;
}

let cache: Promise<EduData> | null = null;

export function loadEduData(): Promise<EduData> {
  if (cache) return cache;
  cache = fetch(eduAsset.url)
    .then((r) => r.json() as Promise<EduRaw>)
    .then((raw) => {
      const cityToProvince: Record<number, number> = {};
      const schools: School[] = raw.schools.map((s) => {
        cityToProvince[s[4]] = s[5];
        return {
          name: s[0],
          stage: raw.stages[s[1]],
          status: s[2] === 0 ? "Negeri" : "Swasta",
          district: raw.districts[s[3]],
          city: raw.cities[s[4]],
          province: raw.provinces[s[5]],
          cityIdx: s[4],
          provinceIdx: s[5],
          stageIdx: s[1],
        };
      });
      return { ...raw, schools, cityToProvince };
    });
  return cache;
}
