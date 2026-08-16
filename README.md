# Frontend and Backend Clean Reactive Architecture

The frontend uses Clean Reactive Architecture and reaches the backend through
its gateway. The backend follows the conventional Clean Architecture
controller/use-case/presenter arrangement.

![Client and Server Clean Reactive Architecture](docs/ca-client-server-nextjs.svg)

<details>
  <summary>mermaid</summary>

```mermaid
graph TD

subgraph C["Client"]
  subgraph FB1["Boundary"]
    CUI["User Interface"]
  end

  CPI["Presenter &lt; I &gt;"]
  CCI["Controller &lt; I &gt;"]

  CP["Presenter"]
  CC["Controller"]

  CUC["Use Case Interactor"]

  subgraph FB3["Boundary"]
    CE["Entities"]
  end

  CGI["Gateway &lt; I &gt;"]
end

subgraph CSI["Client–Server Integration"]
  subgraph FB4["Boundary"]
    CSGD["Gateway/Driver"]
  end
end

subgraph S["Server"]
  subgraph BB1["Boundary"]
    SC["Controller"]
    SP["Presenter"]
    SVM["View Model &lt; DS &gt;"]
  end

  SID["Input Data &lt; DS &gt;"]
  SIB["Input Boundary &lt; I &gt;"]
  SOD["Output Data &lt; DS &gt;"]
  SOB["Output Boundary &lt; I &gt;"]
  SUC["Use Case Interactor"]

  subgraph BB2["Boundary"]
    SDAI["Data Access Interface &lt; I &gt;"]
    SDA["Data Access"]
    SDB["Database"]
  end

  subgraph BB3["Boundary"]
    SE["Entities"]
  end
end

%% implementation relations
CP -. implements .-> CPI
CC -. implements .-> CCI
CSGD -. implements .-> CGI
SP -. implements .-> SOB
SUC -. implements .-> SIB
SDA -. implements .-> SDAI

%% frontend dependency relations
CUI -- depends --> CPI
CUI -- depends --> CCI
CC -- depends --> CUC
CP -- depends --> CE
CUC -- depends --> CE
CUC -- depends --> CGI

%% frontend-to-backend dependency relation
CSGD -- depends --> SC
CSGD -- depends --> SVM

%% backend dependency relations
SC -- depends --> SIB
SC -- depends --> SID
SP -- depends --> SVM
SP -- depends --> SOD
SUC -- depends --> SID
SUC -- depends --> SOB
SUC -- depends --> SOD
SUC -- depends --> SDAI
SUC -- depends --> SE
SDAI -- depends --> SE
SDA -- depends --> SDB

classDef boundary fill:none,stroke:#666,stroke-width:2px,stroke-dasharray: 5 5;
class FB1,FB2,FB3,FB4,BB1,BB2,BB3 boundary;
```

</details>
