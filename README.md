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

- 100 medições por tratamento (REST e GraphQL)

- 3 rodadas (trials) → total 300 medições por API

---

### H. Ameaças à Validade

1.  **Validade Interna**
    - Variações no servidor podem afetar resultados.
    - Nosso código pode não estar otimizado igualmente para ambos os tipos de API.
2.  **Validade Externa**
    - Os resultados podem não generalizar para todas as arquiteturas
      ou modelos de API.
3.  **Validade de Conclusão**
    - Amostras pequenas podem levar a conclusões equivocadas.

## Preparação do Experimento

Após a definição teórica do experimento, iniciou-se o processo de preparação do ambiente necessário para coleta dos dados. Para isso, foi desenvolvido um servidor utilizado como base para os testes, executando simultaneamente uma API REST e uma API GraphQL, garantindo que ambas operassem em condições idênticas para que os resultados obtidos fossem comparáveis.

A aplicação foi estruturada em Node.js e configurada para expor dois pontos de acesso distintos: um endpoint REST tradicional e um endpoint GraphQL, ambos consumindo os mesmos dados e respondendo com o mesmo formato. Foram implementados scripts independentes responsáveis por enviar requisições para cada modelo de API, medir automaticamente o tempo necessário para obtenção da resposta e calcular o tamanho do payload retornado. Esses scripts serão utilizados posteriormente para a execução repetida das requisições e geração das medições experimentais.

Para a persistência e fornecimento dos dados utilizados nas consultas, foi configurado suporte a MariaDB e MongoDB, permitindo flexibilidade no armazenamento e viabilizando futuros tratamentos com variação de fonte de dados. Com o ambiente finalizado — servidor ativo, rotas funcionando, medições automatizadas e bancos disponíveis — o experimento encontra-se pronto para a fase de execução e coleta efetiva dos resultados, que constituirá o próximo passo do estudo.
