## 📘 Scope 1 & 2 배출량 계산 정리 (Markdown)

### 🔥 1. 고정연소 (Stationary Combustion) - Scope 1

**📌 계산식 (수식):**

```
Ei,j = Qi × ECi × EFi,j × fi × Feq,j × 10^-6
```

**📌 파라미터 설명:**

| 항목    | 설명                                         |
| ------- | -------------------------------------------- |
| `Ei,j`  | 연료(i)와 온실가스(j)에 따른 배출량 (tCO2eq) |
| `Qi`    | 연료 사용량 (톤)                             |
| `ECi`   | 열량계수 (MJ/kg)                             |
| `EFi,j` | 배출계수 (kg-GHG/TJ)                         |
| `fi`    | 산화계수                                     |
| `Feq,j` | CO2 환산계수 (CO2=1, CH4=21, N2O=310)        |

**📌 Java 코드 예시:**

```java
double emission = quantity * calorificValue * emissionFactor * oxidationFactor * co2eqFactor * 1e-6;
```

---

### 🚚 2. 이동연소 (Mobile Combustion) - Scope 1

**📌 계산식 (수식):**

```
Ei,j = ∑ (Qi × ECi × EFi,j × Feq,j × 10^-9)
```

**📌 파라미터 설명:**

| 항목    | 설명                                         |
| ------- | -------------------------------------------- |
| `Ei,j`  | 연료(i)와 온실가스(j)에 따른 배출량 (tCO2eq) |
| `Qi`    | 연료 사용량 (ℓ)                              |
| `ECi`   | 열량계수 (MJ/ℓ)                              |
| `EFi,j` | 배출계수 (kg-GHG/TJ)                         |
| `Feq,j` | CO2 환산계수                                 |

**📌 Java 코드 예시:**

```java
double emission = 0.0;
for (Fuel fuel : fuels) {
    double partial = fuel.getQuantity() * fuel.getCalorificValue() * fuel.getEmissionFactor() * fuel.getCo2eqFactor() * 1e-9;
    emission += partial;
}
```

---

### ⚡ 3. 전기 사용 (Electricity) - Scope 2

**📌 계산식 (수식):**

```
CO2eq Emissions = ∑ (Q × EFj × Feq,j)
```

**📌 파라미터 설명:**

| 항목    | 설명                           |
| ------- | ------------------------------ |
| `Q`     | 전력 사용량 (MWh)              |
| `EFj`   | 전력 배출계수 (tGHG/MWh)       |
| `Feq,j` | CO2 환산계수 (CH4=21, N2O=310) |

**📌 Java 코드 예시:**

```java
double emission = 0.0;
for (EmissionFactor factor : emissionFactors) {
    double partial = electricityUsage * factor.getEf() * factor.getCo2eq();
    emission += partial;
}
```

---

### 💨 4. 스팀 사용 (Steam) - Scope 2

**📌 계산식 (수식):**

```
CO2eq Emissions = ∑ (Q × EFj × Feq,j)
```

**📌 파라미터 설명:**

| 항목    | 설명                     |
| ------- | ------------------------ |
| `Q`     | 스팀 사용량 (TJ)         |
| `EFj`   | 스팀 배출계수 (kgGHG/TJ) |
| `Feq,j` | CO2 환산계수             |

**📌 Java 코드 예시:**

```java
double emission = 0.0;
for (EmissionFactor factor : emissionFactors) {
    double partial = steamUsage * factor.getEf() * factor.getCo2eq();
    emission += partial;
}
```

---
