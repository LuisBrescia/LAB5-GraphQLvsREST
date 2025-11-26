## GraphQL vs REST --- Desenho e Preparação do Experimento

_Lab05S01: Desenho do experimento, (Passo 1) e preparação (Passo 2)_

Este projeto tem como objetivo realizar um **experimento controlado**
para comparar, de forma quantitativa, o comportamento de **APIs
GraphQL** e **APIs REST**, conforme proposto no laboratório da
disciplina.

O foco desta primeira entrega é documentar o **desenho experimental**
(RQ1 e RQ2) e a **preparação inicial** para condução do experimento.

## Objetivo Geral

Avaliar de maneira empírica se uma API implementada com GraphQL
apresenta diferenças significativas, em relação a uma API REST
equivalente, nos seguintes aspectos:

- **RQ1:** Latência das respostas (tempo de resposta)
- **RQ2:** Tamanho das respostas (payload retornado)

## Perguntas de Pesquisa

### RQ1. Respostas às consultas GraphQL são mais rápidas do que respostas às consultas REST?

Nossa hipótese inicial é que **GraphQL será mais lento que REST**, pois:

- REST utiliza endpoints pré-definidos, com menor processamento
  interno.
- GraphQL exige análise dinâmica da query, validação e montagem da
  resposta com base no schema.

Acreditamos que esse overhead adicional tende a aumentar o tempo de resposta.

---

### RQ2. Respostas às consultas GraphQL têm tamanho menor do que respostas REST?

Nossa hipótese inicial é que **GraphQL terá respostas menores**, pois:

- No REST normalmente retornamos objetos completos.
- Em muitos casos, não é viável criar um endpoint específico só para
  retornar um subconjunto de campos.
- GraphQL permite solicitar **exatamente** os campos desejados →
  reduzindo o payload.

No nosso experimento, porém, **ambas as APIs retornarão exatamente os
mesmos dados**, para garantir uma comparação mais justa e controlada.

## Desenho do Experimento

### A. Hipóteses H0 e H1

#### Para RQ1 (tempo de resposta):

- **H0 (Hipótese Nula):** Não há diferença significativa no tempo de
  resposta entre REST e GraphQL.
- **H1 (Hipótese Alternativa):** Há diferença significativa no tempo
  de resposta entre REST e GraphQL (REST mais rápido).

#### Para RQ2 (tamanho da resposta):

- **H0:** Não há diferença significativa no tamanho do payload.
- **H1:** GraphQL retorna payload menor que REST.

---

### B. Variáveis Dependentes

São as métricas que queremos medir:

- **Tempo de resposta (ms)**
- **Tamanho do payload (bytes ou kB)**

---

### C. Variáveis Independentes

São os fatores que vamos controlar e variar:

- Tipo da API:
  - **REST**
  - **GraphQL**
- Tipo de consulta / complexidade
- Quantidade de requisições repetidas (iterações)

---

### D. Tratamentos

Cada tratamento é uma condição experimental:

1.  **T1 -> Consulta REST**
2.  **T2 -> Consulta GraphQL**

Para garantir justiça: - ambas retornam **os mesmos campos** - ambas
usam a **mesma base de dados** - ambas estão no **mesmo servidor**

---

### E. Objetos Experimentais

Os objetos consultados são modelos simples da API, sendo eles:

- Usuários
- Produtos
- Tarefas

---

### F. Tipo de Projeto Experimental

- **Experimento Controlado**
- **Comparação direta (REST vs GraphQL)**
- **Repetições múltiplas para reduzir ruído estatístico**

---

### G. Quantidade de Medições

Ainda será ajustado, mas inicialmente:

- 100 requisições simultâneas para cada tipo de API

---

### H. Ameaças à Validade

1.  **Validade Interna**
    - Variações no servidor podem afetar resultados.
2.  **Validade Externa**
    - Os resultados podem não generalizar para todas as arquiteturas
      ou modelos de API.
3.  **Validade de Conclusão**
    - Amostras pequenas podem levar a conclusões equivocadas.

## Preparação do Experimento

Nesta sprint, preparamos o ambiente e estruturamos o plano para execução
do experimento.

### **O que será desenvolvido para a Sprint 2**

- Uma API contendo:
  - **/rest/...** (endpoints REST tradicionais)
  - **/graphql** (resolver GraphQL equivalente)
- Ambas acessando **exatamente a mesma fonte de dados**
- Scripts para:
  - disparar múltiplas requisições
  - registrar **tempo de resposta**
  - registrar **tamanho do payload**
- Ferramentas que podem ser utilizadas:
  - Node.js + Express ou NestJS
  - Apollo Server
  - Axios, autocannon, k6, ou scripts próprios para gerar carga
  - Python + Pandas para análise dos dados

## Entregáveis da Sprint 1

- Definição do desenho completo do experimento\
- Hipóteses e variáveis\
- Planejamento dos tratamentos\
- Descrição de como o ambiente experimental será montado\
- Rascunho da API (REST e GraphQL)

## Próximos Passos --- Sprint 2

- Implementar a API REST\
- Implementar a API GraphQL\
- Criar scripts de medição\
- Rodar os primeiros testes\
- Exportar dados para arquivo CSV
