# Scope 1/2 배출량 관리 시스템 - 백엔드 개발 가이드

## 📋 개요

ESG 프로젝트의 Scope 1(직접 배출량)과 Scope 2(간접 배출량) 관리 시스템의 프론트엔드 구조와 백엔드에서 필요한 API 요구사항을 설명합니다.

## 🏗️ 전체 시스템 구조

### 1. 화면 구성
- **Scope 1 폼**: `src/app/(dashboard)/(scope)/scope1/scope1Form.tsx` - 고정연소/이동연소 관리
- **Scope 2 폼**: `src/app/(dashboard)/(scope)/scope2/scope2Form.tsx` - 전력/스팀 사용량 관리
- **데이터 입력 모달**: `src/components/scope/ScopeModal.tsx` - 통합 데이터 입력
- **협력사 선택기**: `src/components/scope/PartnerSelector.tsx` - 협력사 선택

### 2. 핵심 서비스 파일
- **API 서비스**: `src/services/scope.ts` - 모든 Scope 관련 API 호출
- **연료 데이터**: `src/constants/fuel-data.ts` - 연료별 배출계수 상수
- **타입 정의**: `src/types/scope.ts` - TypeScript 타입 정의

## 🔄 데이터 플로우

### 1. 기본 사용 시나리오
```
1. 사용자가 협력사 선택
2. 보고연도/월 선택
3. 해당 협력사의 배출량 데이터 조회
4. 새 데이터 추가/편집/삭제 가능
```

### 2. 데이터 입력 프로세스
```
ScopeModal 열기 → 배출활동 유형 선택 → 상세 정보 입력 → 배출량 계산 → 저장
```

## 🔢 배출량 계산 로직

현재 프론트엔드에서 처리하는 계산 공식:

### Scope 1 (연료 연소)
```typescript
// 총 CO2 등가량 = CO2 + (CH4 × 25) + (N2O × 298)
const co2Emission = usage * fuel.co2Factor
const ch4Emission = usage * fuel.ch4Factor  
const n2oEmission = usage * fuel.n2oFactor
const totalCo2Equivalent = co2Emission + (ch4Emission * 25) + (n2oEmission * 298)
```

### Scope 2 
```typescript
// 전력: CO2 = 전력사용량(kWh) × 0.0004653
const co2Emission = usage * 0.0004653

// 스팀: CO2 = 스팀사용량(GJ) × 배출계수(56.452~59.685)
const co2Emission = usage * steamFactor
```

**참고**: 현재 계산 로직은 `src/services/scope.ts`의 `calculateEmissions` 함수에 구현되어 있습니다.

## 🎯 백엔드에서 구현해야 할 핵심 API

### 1. 협력사별 데이터 조회 API (가장 중요 🔥)

```http
GET /api/v1/scope/stationary-combustion/partner/{partnerId}/year/{year}
GET /api/v1/scope/mobile-combustion/partner/{partnerId}/year/{year}
GET /api/v1/scope/electricity-usage/partner/{partnerId}/year/{year}
GET /api/v1/scope/steam-usage/partner/{partnerId}/year/{year}
```

**프론트엔드 사용처:**
- `scope1Form.tsx` - `loadData()` 함수 (라인 118)
- `scope2Form.tsx` - `loadData()` 함수 (라인 140)

**현재 호출 코드:**
```typescript
// scope1Form.tsx
const [stationaryResponse, mobileResponse] = await Promise.all([
  fetchStationaryCombustionByPartnerAndYear(selectedPartnerId, selectedYear),
  fetchMobileCombustionByPartnerAndYear(selectedPartnerId, selectedYear)
])

// scope2Form.tsx  
const [electricity, steam] = await Promise.all([
  fetchElectricityUsageByPartnerAndYear(selectedPartnerId, selectedYear),
  fetchSteamUsageByPartnerAndYear(selectedPartnerId, selectedYear)
])
```

### 2. 데이터 생성 API

```http
POST /api/v1/scope/stationary-combustion
POST /api/v1/scope/mobile-combustion  
POST /api/v1/scope/electricity-usage
POST /api/v1/scope/steam-usage
```

**프론트엔드 사용처:**
- `ScopeModal.tsx` - `handleSubmit()` 함수 (라인 311)
- `scope.ts` - `submitScopeData()` 함수 (라인 751)

**현재 호출 코드:**
```typescript
// scope.ts - submitScopeData 함수
switch (emissionActivityType) {
  case 'STATIONARY_COMBUSTION':
    return createStationaryCombustion(formData.stationaryCombustion)
  case 'MOBILE_COMBUSTION':
    return createMobileCombustion(formData.mobileCombustion)
  case 'ELECTRICITY':
    return createElectricityUsage(formData.electricity)
  case 'STEAM':
    return createSteamUsage(formData.steam)
}
```

### 3. 데이터 삭제 API

```http
DELETE /api/v1/scope/stationary-combustion/{id}
DELETE /api/v1/scope/mobile-combustion/{id}
DELETE /api/v1/scope/electricity-usage/{id}  
DELETE /api/v1/scope/steam-usage/{id}
```

**프론트엔드 사용처:**
- `scope1Form.tsx` - `handleDeleteStationary()`, `handleDeleteMobile()` 함수 (라인 142, 156)
- `scope2Form.tsx` - `handleDeleteElectricity()`, `handleDeleteSteam()` 함수

## 📊 데이터 모델 구조

### 고정연소 (Stationary Combustion)
```typescript
interface StationaryCombustionForm {
  partnerCompanyId: string        // UUID 형태
  reportingYear: number          // 보고연도
  reportingMonth: number         // 보고월
  facilityName: string           // 시설명
  facilityLocation?: string      // 시설 위치
  combustionType: 'LIQUID'|'SOLID'|'GAS'  // 연소 타입
  fuelId: string                 // 연료 ID
  fuelUsage: string              // 연료 사용량
  unit: string                   // 단위
  createdBy: string              // 작성자
}
```

### 이동연소 (Mobile Combustion)
```typescript
interface MobileCombustionForm {
  partnerCompanyId: string       // UUID 형태
  reportingYear: number
  reportingMonth: number
  vehicleType: string            // 차량/장비명
  transportType: 'ROAD'|'AVIATION'  // 교통수단 유형
  fuelId: string
  fuelUsage: string
  unit: string
  distance?: string              // 이동거리
  createdBy: string
}
```

### 전력 사용량 (Electricity Usage)
```typescript
interface ElectricityUsageForm {
  partnerCompanyId: string
  reportingYear: number
  reportingMonth: number
  facilityName: string
  facilityLocation?: string
  electricityUsage: string       // 전력 사용량
  unit: string                   // 'kWh'
  isRenewable: boolean          // 재생에너지 여부
  renewableType?: string        // 재생에너지 타입
  createdBy: string
}
```

### 스팀 사용량 (Steam Usage)
```typescript
interface SteamUsageForm {
  partnerCompanyId: string
  reportingYear: number
  reportingMonth: number
  facilityName: string
  facilityLocation?: string
  steamType: 'TYPE_A'|'TYPE_B'|'TYPE_C'  // 스팀 타입
  steamUsage: string             // 스팀 사용량
  unit: string                   // 'GJ'
  createdBy: string
}
```

## 🔍 연료 데이터 관리

### 연료 상수 데이터
프론트엔드에서 `src/constants/fuel-data.ts`에 정의된 연료 정보:

#### Scope 1 연료 타입
```typescript
// 고정연소 - 액체연료 (석유계 29개)
CRUDE_OIL, NAPHTHA, GASOLINE, DIESEL, HEAVY_OIL_A/B/C, BUNKER_A/B/C_OIL 등

// 고정연소 - 고체연료 (석탄계 15개)  
ANTHRACITE, BITUMINOUS_COAL, SUB_BITUMINOUS_COAL, LIGNITE, COKE_OVEN_COKE 등

// 고정연소 - 가스연료 (11개)
NATURAL_GAS, LIQUEFIED_NATURAL_GAS, LPG, PROPANE, BUTANE 등

// 이동연소 - 차량전용연료 (3개)
MOTOR_GASOLINE, AUTOMOTIVE_DIESEL, LPG_VEHICLE

// 이동연소 - 항공용연료 (3개)
AVIATION_GASOLINE, JET_FUEL_KEROSENE, JET_FUEL_GASOLINE

// 이동연소 - 바이오연료 (2개)
BIODIESEL, BIOETHANOL
```

#### Scope 2 연료 타입
```typescript
// 전력 (1개)
ELECTRICITY_KWH: { co2Factor: 0.0004653 }  // 2023년 전력배출계수

// 스팀 (3개)  
STEAM_TYPE_A: { co2Factor: 56.452 }
STEAM_TYPE_B: { co2Factor: 60.974 }
STEAM_TYPE_C: { co2Factor: 59.685 }
```

### 연료 데이터 구조
```typescript
interface FuelType {
  id: string
  name: string
  category: string
  unit: string
  emissionActivityType: 'STATIONARY_COMBUSTION' | 'MOBILE_COMBUSTION' | 'ELECTRICITY' | 'STEAM'
  subcategoryType?: string
  co2Factor: number    // CO2 배출계수
  ch4Factor?: number   // CH4 배출계수 (연료연소만)
  n2oFactor?: number   // N2O 배출계수 (연료연소만)
}
```

**백엔드 고려사항:** 이 연료 데이터를 DB에 저장할지, 프론트엔드와 동일하게 상수로 관리할지 결정 필요

## 🛠️ 백엔드 구현 우선순위

### 1단계 (필수 - 핵심 기능)
1. **협력사별 데이터 조회 API** - 화면 로딩의 핵심
2. **데이터 생성 API** - 새 데이터 입력의 핵심
3. **데이터 삭제 API** - 데이터 관리의 핵심

### 2단계 (향후 확장)
1. **데이터 수정 API** - 현재 프론트에서 미사용이지만 구조는 준비됨
2. **통계/요약 API** - 대시보드 확장 시 필요
3. **배출량 계산 API** - 현재는 프론트에서 처리하지만 백엔드 이관 고려

### 3단계 (선택사항)
1. **연료 타입 관리 API** - 현재는 상수로 관리
2. **배출활동 타입별 연료 필터링 API**
3. **월별 통계 집계 API**

## 📝 API 응답 형식

### 조회 API 응답
```json
{
  "data": [
    {
      "id": 1,
      "partnerCompanyId": "550e8400-e29b-41d4-a716-446655440000",
      "reportingYear": 2024,
      "reportingMonth": 3,
      "facilityName": "보일러 #1",
      "facilityLocation": "공장 1동",
      "combustionType": "LIQUID",
      "fuelId": "DIESEL",
      "fuelUsage": 100.5,
      "unit": "L",
      "totalCo2Equivalent": 258.29,
      "co2Emission": 258.29,
      "ch4Emission": 0.332,
      "n2oEmission": 0.060,
      "createdAt": "2024-03-15T10:30:00Z",
      "updatedAt": "2024-03-15T10:30:00Z",
      "createdBy": "user@example.com"
    }
  ],
  "success": true,
  "message": "데이터 조회 성공"
}
```

### 생성/수정 API 응답
```json
{
  "data": {
    "id": 1,
    "partnerCompanyId": "550e8400-e29b-41d4-a716-446655440000",
    "reportingYear": 2024,
    "reportingMonth": 3,
    // ... 생성된 데이터
    "createdAt": "2024-03-15T10:30:00Z",
    "updatedAt": "2024-03-15T10:30:00Z"
  },
  "success": true,
  "message": "데이터가 성공적으로 저장되었습니다."
}
```

### 삭제 API 응답
```json
{
  "success": true,
  "message": "데이터가 성공적으로 삭제되었습니다."
}
```

### 에러 응답
```json
{
  "success": false,
  "message": "요청 처리 중 오류가 발생했습니다.",
  "errors": [
    "partnerCompanyId는 필수입니다.",
    "reportingYear는 1900년 이상이어야 합니다."
  ]
}
```

## 🚨 중요한 백엔드 고려사항

### 1. 협력사 ID 관리
- 프론트엔드에서 `UUID` 형태로 관리
- `PartnerSelector.tsx`에서 협력사 선택
- 협력사 API: `fetchPartnerCompaniesForScope()` 함수 사용

### 2. 배출량 계산
- **현재**: 프론트엔드에서 계산 (`src/services/scope.ts` - `calculateEmissions` 함수)
- **향후**: 백엔드로 이관 가능 (정확성/일관성 확보)
- **계산 공식**: 위의 "배출량 계산 로직" 섹션 참조

### 3. 데이터 유효성 검사
- **프론트엔드**: `src/services/scope.ts` - `validateScopeFormData()` 함수
- **백엔드**: 동일한 검증 로직 구현 필요

```typescript
// 현재 프론트엔드 검증 로직
export const validateScopeFormData = (formData: ScopeFormData): string[] => {
  const errors: string[] = []
  
  if (!formData.partnerCompanyId?.trim()) {
    errors.push('협력사를 선택해주세요.')
  }
  if (!formData.reportingYear) {
    errors.push('보고연도를 입력해주세요.')
  }
  if (!formData.reportingMonth) {
    errors.push('보고월을 선택해주세요.')
  }
  if (!formData.emissionActivityType) {
    errors.push('배출활동 타입을 선택해주세요.')
  }
  
  return errors
}
```

### 4. 토스트 알림 처리
프론트엔드에서 성공/실패 토스트를 표시하므로, API 응답의 `message` 필드가 중요합니다.

```typescript
// 현재 토스트 사용 예시
showLoading('데이터를 저장하는 중...')
dismissLoading(loadingId, '데이터가 성공적으로 저장되었습니다.', 'success')
```

### 5. 필터링 및 정렬
- **월별 필터링**: 프론트엔드에서 처리 중
- **검색 기능**: 프론트엔드에서 시설명/차량명으로 필터링
- **정렬**: 현재 별도 정렬 없음 (createdAt 역순 권장)

## 📈 성능 최적화 고려사항

### 1. 페이징
현재는 연도별 전체 데이터를 가져오지만, 데이터가 많아지면 페이징 고려 필요

### 2. 캐싱
- 연료 데이터는 자주 변경되지 않으므로 캐싱 적용 가능
- 협력사별 월간 통계는 캐싱으로 성능 향상 가능

### 3. 배치 계산
- 배출량 계산이 복잡해지면 비동기 배치 처리 고려

## 🔧 개발 환경 설정

### 백엔드 서비스 위치
현재 워크스페이스에서 Scope 관련 백엔드 서비스:
```
/Users/donghwan/Documents/code/ESGProject_2/backend/scope-service/
```

### 프론트엔드 테스트 방법
1. 프론트엔드 실행: `cd frontend-p3 && npm run dev`
2. 브라우저에서 `/scope1` 또는 `/scope2` 접속
3. 협력사 선택 후 데이터 조회/입력 테스트

## 🚀 다음 단계

1. **백엔드 API 구현 순서**:
   - 협력사별 조회 API (GET)
   - 데이터 생성 API (POST)  
   - 데이터 삭제 API (DELETE)

2. **테스트 데이터 준비**:
   - 샘플 협력사 데이터
   - 다양한 연료 타입별 배출량 데이터

3. **API 문서화**:
   - Swagger/OpenAPI 문서 작성
   - 프론트엔드 개발자와 API 스펙 검토

---

**문서 작성일**: 2025년 6월 11일  
**작성자**: ESG 프로젝트 팀  
**문서 버전**: 1.0  

이 문서는 Scope 1/2 배출량 관리 시스템의 백엔드 개발을 위한 가이드입니다. 
프론트엔드 코드와 함께 검토하여 정확한 API를 구현해 주세요.
