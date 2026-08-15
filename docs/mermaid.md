# Frontend and Backend Clean Reactive Architecture

The frontend uses Clean Reactive Architecture and reaches the backend through
its gateway. The backend follows the conventional Clean Architecture
controller/use-case/presenter arrangement.

![Frontend and Backend Clean Reactive Architecture](ca-fe-reactive-framework-NextJs-FE-BE.svg)

<details>
  <summary>mermaid</summary>

```mermaid
graph TD

subgraph FE["Client (Frontend)"]
  subgraph FB1["Boundary"]
    FUI["User Interface"]
  end

  FPI["Presenter &lt; I &gt;"]
  FCI["Controller &lt; I &gt;"]

  FP["Presenter"]
  FC["Controller"]

  FUC["Use Case Interactor"]

  subgraph FB3["Boundary"]
    FE1["Entities"]
  end

  FGI["Gateway &lt; I &gt;"]
end

subgraph FBI["Client–Server Integration"]
  subgraph FB4["Boundary"]
    BFG["Gateway"]
  end
end

subgraph BE["Server (Backend)"]
  subgraph BB1["Boundary"]
    BC["Controller"]
    BP["Presenter"]
    BVM["View Model &lt; DS &gt;"]
  end

  BID["Input Data &lt; DS &gt;"]
  BIB["Input Boundary &lt; I &gt;"]
  BOD["Output Data &lt; DS &gt;"]
  BOB["Output Boundary &lt; I &gt;"]
  BUC["Use Case Interactor"]

  subgraph BB2["Boundary"]
    BDAI["Data Access Interface &lt; I &gt;"]
    BDA["Data Access"]
    BDB["Database"]
  end

  subgraph BB3["Boundary"]
    BE1["Entities"]
  end
end

%% implementation relations
FP -. implements .-> FPI
FC -. implements .-> FCI
BFG -. implements .-> FGI
BP -. implements .-> BOB
BUC -. implements .-> BIB
BDA -. implements .-> BDAI

%% frontend dependency relations
FUI -- depends --> FPI
FUI -- depends --> FCI
FC -- depends --> FUC
FP -- depends --> FE1
FUC -- depends --> FE1
FUC -- depends --> FGI

%% frontend-to-backend dependency relation
BFG -- depends --> BC
BFG -- depends --> BVM

%% backend dependency relations
BC -- depends --> BIB
BC -- depends --> BID
BP -- depends --> BVM
BP -- depends --> BOD
BUC -- depends --> BID
BUC -- depends --> BOB
BUC -- depends --> BOD
BUC -- depends --> BDAI
BUC -- depends --> BE1
BDAI -- depends --> BE1
BDA -- depends --> BDB

classDef boundary fill:none,stroke:#666,stroke-width:2px,stroke-dasharray: 5 5;
class FB1,FB2,FB3,FB4,BB1,BB2,BB3 boundary;
```

</details>
