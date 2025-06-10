// 연료 데이터 상수 정의
import {FuelType} from '@/types/scope'

// 연료 타입별 상세 데이터
export const FUEL_DATA: Record<string, FuelType> = {
  // === 고정연소 - 액체연료 (석유계 29개) ===
  CRUDE_OIL: {
    id: 'CRUDE_OIL',
    name: '원유',
    category: 'LIQUID_PETROLEUM',
    unit: 'L',
    emissionActivityType: 'STATIONARY_COMBUSTION',
    subcategoryType: 'LIQUID',
    co2Factor: 2.13,
    ch4Factor: 0.0033,
    n2oFactor: 0.0006
  },
  NAPHTHA: {
    id: 'NAPHTHA',
    name: '나프타',
    category: 'LIQUID_PETROLEUM',
    unit: 'L',
    emissionActivityType: 'STATIONARY_COMBUSTION',
    subcategoryType: 'LIQUID',
    co2Factor: 1.93,
    ch4Factor: 0.0033,
    n2oFactor: 0.0006
  },
  GASOLINE: {
    id: 'GASOLINE',
    name: '휘발유',
    category: 'LIQUID_PETROLEUM',
    unit: 'L',
    emissionActivityType: 'STATIONARY_COMBUSTION',
    subcategoryType: 'LIQUID',
    co2Factor: 2.08,
    ch4Factor: 0.0033,
    n2oFactor: 0.0006
  },
  AVIATION_GASOLINE: {
    id: 'AVIATION_GASOLINE',
    name: '항공휘발유',
    category: 'LIQUID_PETROLEUM',
    unit: 'L',
    emissionActivityType: 'STATIONARY_COMBUSTION',
    subcategoryType: 'LIQUID',
    co2Factor: 2.08,
    ch4Factor: 0.0033,
    n2oFactor: 0.0006
  },
  JET_FUEL_KEROSENE: {
    id: 'JET_FUEL_KEROSENE',
    name: '제트유(등유형)',
    category: 'LIQUID_PETROLEUM',
    unit: 'L',
    emissionActivityType: 'STATIONARY_COMBUSTION',
    subcategoryType: 'LIQUID',
    co2Factor: 2.16,
    ch4Factor: 0.0033,
    n2oFactor: 0.0006
  },
  JET_FUEL_GASOLINE: {
    id: 'JET_FUEL_GASOLINE',
    name: '제트유(휘발유형)',
    category: 'LIQUID_PETROLEUM',
    unit: 'L',
    emissionActivityType: 'STATIONARY_COMBUSTION',
    subcategoryType: 'LIQUID',
    co2Factor: 2.08,
    ch4Factor: 0.0033,
    n2oFactor: 0.0006
  },
  KEROSENE: {
    id: 'KEROSENE',
    name: '등유',
    category: 'LIQUID_PETROLEUM',
    unit: 'L',
    emissionActivityType: 'STATIONARY_COMBUSTION',
    subcategoryType: 'LIQUID',
    co2Factor: 2.16,
    ch4Factor: 0.0033,
    n2oFactor: 0.0006
  },
  DIESEL: {
    id: 'DIESEL',
    name: '경유',
    category: 'LIQUID_PETROLEUM',
    unit: 'L',
    emissionActivityType: 'STATIONARY_COMBUSTION',
    subcategoryType: 'LIQUID',
    co2Factor: 2.58,
    ch4Factor: 0.0033,
    n2oFactor: 0.0006
  },
  HEAVY_OIL_A: {
    id: 'HEAVY_OIL_A',
    name: '중유(A급)',
    category: 'LIQUID_PETROLEUM',
    unit: 'L',
    emissionActivityType: 'STATIONARY_COMBUSTION',
    subcategoryType: 'LIQUID',
    co2Factor: 2.68,
    ch4Factor: 0.0033,
    n2oFactor: 0.0006
  },
  HEAVY_OIL_B: {
    id: 'HEAVY_OIL_B',
    name: '중유(B급)',
    category: 'LIQUID_PETROLEUM',
    unit: 'L',
    emissionActivityType: 'STATIONARY_COMBUSTION',
    subcategoryType: 'LIQUID',
    co2Factor: 2.75,
    ch4Factor: 0.0033,
    n2oFactor: 0.0006
  },
  HEAVY_OIL_C: {
    id: 'HEAVY_OIL_C',
    name: '중유(C급)',
    category: 'LIQUID_PETROLEUM',
    unit: 'L',
    emissionActivityType: 'STATIONARY_COMBUSTION',
    subcategoryType: 'LIQUID',
    co2Factor: 2.86,
    ch4Factor: 0.0033,
    n2oFactor: 0.0006
  },
  BUNKER_A_OIL: {
    id: 'BUNKER_A_OIL',
    name: '벙커A유',
    category: 'LIQUID_PETROLEUM',
    unit: 'L',
    emissionActivityType: 'STATIONARY_COMBUSTION',
    subcategoryType: 'LIQUID',
    co2Factor: 2.68,
    ch4Factor: 0.0033,
    n2oFactor: 0.0006
  },
  BUNKER_B_OIL: {
    id: 'BUNKER_B_OIL',
    name: '벙커B유',
    category: 'LIQUID_PETROLEUM',
    unit: 'L',
    emissionActivityType: 'STATIONARY_COMBUSTION',
    subcategoryType: 'LIQUID',
    co2Factor: 2.75,
    ch4Factor: 0.0033,
    n2oFactor: 0.0006
  },
  BUNKER_C_OIL: {
    id: 'BUNKER_C_OIL',
    name: '벙커C유',
    category: 'LIQUID_PETROLEUM',
    unit: 'L',
    emissionActivityType: 'STATIONARY_COMBUSTION',
    subcategoryType: 'LIQUID',
    co2Factor: 2.86,
    ch4Factor: 0.0033,
    n2oFactor: 0.0006
  },
  LUBRICANTS: {
    id: 'LUBRICANTS',
    name: '윤활유',
    category: 'LIQUID_PETROLEUM',
    unit: 'L',
    emissionActivityType: 'STATIONARY_COMBUSTION',
    subcategoryType: 'LIQUID',
    co2Factor: 2.68,
    ch4Factor: 0.0033,
    n2oFactor: 0.0006
  },
  BITUMEN_ASPHALT: {
    id: 'BITUMEN_ASPHALT',
    name: '역청/아스팔트',
    category: 'LIQUID_PETROLEUM',
    unit: 'kg',
    emissionActivityType: 'STATIONARY_COMBUSTION',
    subcategoryType: 'LIQUID',
    co2Factor: 3.2,
    ch4Factor: 0.0033,
    n2oFactor: 0.0006
  },
  PETROLEUM_COKE: {
    id: 'PETROLEUM_COKE',
    name: '석유코크스',
    category: 'LIQUID_PETROLEUM',
    unit: 'kg',
    emissionActivityType: 'STATIONARY_COMBUSTION',
    subcategoryType: 'LIQUID',
    co2Factor: 3.5,
    ch4Factor: 0.0033,
    n2oFactor: 0.0006
  },

  // === 고정연소 - 고체연료 (석탄계 15개) ===
  ANTHRACITE: {
    id: 'ANTHRACITE',
    name: '무연탄',
    category: 'SOLID_COAL',
    unit: 'kg',
    emissionActivityType: 'STATIONARY_COMBUSTION',
    subcategoryType: 'SOLID',
    co2Factor: 2.36,
    ch4Factor: 0.01,
    n2oFactor: 0.0015
  },
  BITUMINOUS_COAL: {
    id: 'BITUMINOUS_COAL',
    name: '유연탄',
    category: 'SOLID_COAL',
    unit: 'kg',
    emissionActivityType: 'STATIONARY_COMBUSTION',
    subcategoryType: 'SOLID',
    co2Factor: 2.42,
    ch4Factor: 0.01,
    n2oFactor: 0.0015
  },
  SUB_BITUMINOUS_COAL: {
    id: 'SUB_BITUMINOUS_COAL',
    name: '아역청탄',
    category: 'SOLID_COAL',
    unit: 'kg',
    emissionActivityType: 'STATIONARY_COMBUSTION',
    subcategoryType: 'SOLID',
    co2Factor: 1.9,
    ch4Factor: 0.01,
    n2oFactor: 0.0015
  },
  LIGNITE: {
    id: 'LIGNITE',
    name: '갈탄',
    category: 'SOLID_COAL',
    unit: 'kg',
    emissionActivityType: 'STATIONARY_COMBUSTION',
    subcategoryType: 'SOLID',
    co2Factor: 1.17,
    ch4Factor: 0.01,
    n2oFactor: 0.0015
  },
  COKING_COAL: {
    id: 'COKING_COAL',
    name: '코크스용탄',
    category: 'SOLID_COAL',
    unit: 'kg',
    emissionActivityType: 'STATIONARY_COMBUSTION',
    subcategoryType: 'SOLID',
    co2Factor: 2.42,
    ch4Factor: 0.01,
    n2oFactor: 0.0015
  },
  COKE_OVEN_COKE: {
    id: 'COKE_OVEN_COKE',
    name: '코크스오븐코크스',
    category: 'SOLID_COAL',
    unit: 'kg',
    emissionActivityType: 'STATIONARY_COMBUSTION',
    subcategoryType: 'SOLID',
    co2Factor: 3.21,
    ch4Factor: 0.01,
    n2oFactor: 0.0015
  },
  CHARCOAL: {
    id: 'CHARCOAL',
    name: '목탄',
    category: 'SOLID_COAL',
    unit: 'kg',
    emissionActivityType: 'STATIONARY_COMBUSTION',
    subcategoryType: 'SOLID',
    co2Factor: 3.17,
    ch4Factor: 0.01,
    n2oFactor: 0.0015
  },

  // === 고정연소 - 가스연료 (11개) ===
  NATURAL_GAS: {
    id: 'NATURAL_GAS',
    name: '천연가스',
    category: 'GAS_FUEL',
    unit: 'Nm³',
    emissionActivityType: 'STATIONARY_COMBUSTION',
    subcategoryType: 'GAS',
    co2Factor: 2.176,
    ch4Factor: 0.001,
    n2oFactor: 0.0001
  },
  LIQUEFIED_NATURAL_GAS: {
    id: 'LIQUEFIED_NATURAL_GAS',
    name: '액화천연가스(LNG)',
    category: 'GAS_FUEL',
    unit: 'kg',
    emissionActivityType: 'STATIONARY_COMBUSTION',
    subcategoryType: 'GAS',
    co2Factor: 2.75,
    ch4Factor: 0.001,
    n2oFactor: 0.0001
  },
  LIQUEFIED_PETROLEUM_GAS: {
    id: 'LIQUEFIED_PETROLEUM_GAS',
    name: '액화석유가스(LPG)',
    category: 'GAS_FUEL',
    unit: 'kg',
    emissionActivityType: 'STATIONARY_COMBUSTION',
    subcategoryType: 'GAS',
    co2Factor: 3.0,
    ch4Factor: 0.001,
    n2oFactor: 0.0001
  },
  PROPANE: {
    id: 'PROPANE',
    name: '프로판',
    category: 'GAS_FUEL',
    unit: 'kg',
    emissionActivityType: 'STATIONARY_COMBUSTION',
    subcategoryType: 'GAS',
    co2Factor: 2.96,
    ch4Factor: 0.001,
    n2oFactor: 0.0001
  },
  BUTANE: {
    id: 'BUTANE',
    name: '부탄',
    category: 'GAS_FUEL',
    unit: 'kg',
    emissionActivityType: 'STATIONARY_COMBUSTION',
    subcategoryType: 'GAS',
    co2Factor: 3.03,
    ch4Factor: 0.001,
    n2oFactor: 0.0001
  },

  // === 이동연소 - 차량전용연료 (3개) ===
  MOTOR_GASOLINE: {
    id: 'MOTOR_GASOLINE',
    name: '자동차용 휘발유',
    category: 'VEHICLE_FUEL',
    unit: 'L',
    emissionActivityType: 'MOBILE_COMBUSTION',
    subcategoryType: 'ROAD',
    co2Factor: 2.08,
    ch4Factor: 0.0033,
    n2oFactor: 0.0006
  },
  AUTOMOTIVE_DIESEL: {
    id: 'AUTOMOTIVE_DIESEL',
    name: '자동차용 경유',
    category: 'VEHICLE_FUEL',
    unit: 'L',
    emissionActivityType: 'MOBILE_COMBUSTION',
    subcategoryType: 'ROAD',
    co2Factor: 2.58,
    ch4Factor: 0.0033,
    n2oFactor: 0.0006
  },
  LIQUEFIED_PETROLEUM_GAS_VEHICLE: {
    id: 'LIQUEFIED_PETROLEUM_GAS_VEHICLE',
    name: '자동차용 LPG',
    category: 'VEHICLE_FUEL',
    unit: 'L',
    emissionActivityType: 'MOBILE_COMBUSTION',
    subcategoryType: 'ROAD',
    co2Factor: 1.51,
    ch4Factor: 0.001,
    n2oFactor: 0.0001
  },

  // === 이동연소 - 항공용연료 (3개) ===
  AVIATION_GASOLINE_MOBILE: {
    id: 'AVIATION_GASOLINE_MOBILE',
    name: '항공휘발유',
    category: 'AVIATION_FUEL',
    unit: 'L',
    emissionActivityType: 'MOBILE_COMBUSTION',
    subcategoryType: 'AVIATION',
    co2Factor: 2.08,
    ch4Factor: 0.0033,
    n2oFactor: 0.0006
  },
  JET_FUEL_KEROSENE_MOBILE: {
    id: 'JET_FUEL_KEROSENE_MOBILE',
    name: '제트유(등유형)',
    category: 'AVIATION_FUEL',
    unit: 'L',
    emissionActivityType: 'MOBILE_COMBUSTION',
    subcategoryType: 'AVIATION',
    co2Factor: 2.16,
    ch4Factor: 0.0033,
    n2oFactor: 0.0006
  },
  JET_FUEL_GASOLINE_MOBILE: {
    id: 'JET_FUEL_GASOLINE_MOBILE',
    name: '제트유(휘발유형)',
    category: 'AVIATION_FUEL',
    unit: 'L',
    emissionActivityType: 'MOBILE_COMBUSTION',
    subcategoryType: 'AVIATION',
    co2Factor: 2.08,
    ch4Factor: 0.0033,
    n2oFactor: 0.0006
  },

  // === 이동연소 - 바이오연료 (2개) ===
  BIODIESEL: {
    id: 'BIODIESEL',
    name: '바이오디젤',
    category: 'BIO_FUEL',
    unit: 'L',
    emissionActivityType: 'MOBILE_COMBUSTION',
    subcategoryType: 'ROAD',
    co2Factor: 0, // 바이오연료는 CO2 배출계수 0
    ch4Factor: 0.0033,
    n2oFactor: 0.0006
  },
  BIOETHANOL: {
    id: 'BIOETHANOL',
    name: '바이오에탄올',
    category: 'BIO_FUEL',
    unit: 'L',
    emissionActivityType: 'MOBILE_COMBUSTION',
    subcategoryType: 'ROAD',
    co2Factor: 0, // 바이오연료는 CO2 배출계수 0
    ch4Factor: 0.0033,
    n2oFactor: 0.0006
  },

  // === 전력 (1개) ===
  ELECTRICITY_KWH: {
    id: 'ELECTRICITY_KWH',
    name: '전력',
    category: 'ELECTRICITY',
    unit: 'kWh',
    emissionActivityType: 'ELECTRICITY',
    co2Factor: 0.0004653 // 2023년 전력배출계수
  },

  // === 스팀 (3개) ===
  STEAM_TYPE_A: {
    id: 'STEAM_TYPE_A',
    name: '스팀 A타입',
    category: 'STEAM',
    unit: 'GJ',
    emissionActivityType: 'STEAM',
    subcategoryType: 'TYPE_A',
    co2Factor: 56.452
  },
  STEAM_TYPE_B: {
    id: 'STEAM_TYPE_B',
    name: '스팀 B타입',
    category: 'STEAM',
    unit: 'GJ',
    emissionActivityType: 'STEAM',
    subcategoryType: 'TYPE_B',
    co2Factor: 60.974
  },
  STEAM_TYPE_C: {
    id: 'STEAM_TYPE_C',
    name: '스팀 C타입',
    category: 'STEAM',
    unit: 'GJ',
    emissionActivityType: 'STEAM',
    subcategoryType: 'TYPE_C',
    co2Factor: 59.685
  }
}

// 배출활동 타입별 연료 목록
export const FUELS_BY_ACTIVITY_TYPE = {
  STATIONARY_COMBUSTION: {
    LIQUID: Object.values(FUEL_DATA).filter(
      fuel =>
        fuel.emissionActivityType === 'STATIONARY_COMBUSTION' &&
        fuel.subcategoryType === 'LIQUID'
    ),
    SOLID: Object.values(FUEL_DATA).filter(
      fuel =>
        fuel.emissionActivityType === 'STATIONARY_COMBUSTION' &&
        fuel.subcategoryType === 'SOLID'
    ),
    GAS: Object.values(FUEL_DATA).filter(
      fuel =>
        fuel.emissionActivityType === 'STATIONARY_COMBUSTION' &&
        fuel.subcategoryType === 'GAS'
    )
  },
  MOBILE_COMBUSTION: {
    ROAD: Object.values(FUEL_DATA).filter(
      fuel =>
        fuel.emissionActivityType === 'MOBILE_COMBUSTION' &&
        fuel.subcategoryType === 'ROAD'
    ),
    AVIATION: Object.values(FUEL_DATA).filter(
      fuel =>
        fuel.emissionActivityType === 'MOBILE_COMBUSTION' &&
        fuel.subcategoryType === 'AVIATION'
    )
  },
  ELECTRICITY: Object.values(FUEL_DATA).filter(
    fuel => fuel.emissionActivityType === 'ELECTRICITY'
  ),
  STEAM: Object.values(FUEL_DATA).filter(fuel => fuel.emissionActivityType === 'STEAM')
}

// 연료 검색 및 필터링 함수들
export const getFuelsByActivityType = (
  activityType: string,
  subType?: string
): FuelType[] => {
  if (activityType === 'STATIONARY_COMBUSTION' && subType) {
    return (
      FUELS_BY_ACTIVITY_TYPE.STATIONARY_COMBUSTION[
        subType as keyof typeof FUELS_BY_ACTIVITY_TYPE.STATIONARY_COMBUSTION
      ] || []
    )
  }
  if (activityType === 'MOBILE_COMBUSTION' && subType) {
    return (
      FUELS_BY_ACTIVITY_TYPE.MOBILE_COMBUSTION[
        subType as keyof typeof FUELS_BY_ACTIVITY_TYPE.MOBILE_COMBUSTION
      ] || []
    )
  }
  const result =
    FUELS_BY_ACTIVITY_TYPE[activityType as keyof typeof FUELS_BY_ACTIVITY_TYPE]
  return Array.isArray(result) ? result : []
}

export const getFuelById = (fuelId: string): FuelType | undefined => {
  return FUEL_DATA[fuelId]
}

export const getAllFuels = (): FuelType[] => {
  return Object.values(FUEL_DATA)
}
