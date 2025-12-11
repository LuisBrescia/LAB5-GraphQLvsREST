# GraphQL vs REST — Experimento Controlado (Lab05)

Este repositório contém o desenho, a execução e os resultados do experimento para comparar, de forma controlada, APIs implementadas com GraphQL e com REST. Esta entrega corresponde à versão final (Lab05S03) e inclui: desenho experimental, preparação, execução dos trials, análise estatística e dashboard com as visualizações do BI (imagens + descrições textuais).

## Objetivo Geral

Avaliar empiricamente se uma API implementada com GraphQL apresenta diferenças, em relação a uma API REST equivalente, nos seguintes aspectos:

- **RQ1:** Latência das respostas (tempo de resposta)
- **RQ2:** Tamanho das respostas (payload retornado)

## Perguntas de Pesquisa e Hipóteses

- RQ1. Respostas às consultas GraphQL são mais rápidas do que respostas às consultas REST?
  - H0: Não há diferença significativa no tempo de resposta entre REST e GraphQL.
  - H1: Há diferença significativa no tempo de resposta entre REST e GraphQL (REST mais rápido).

- RQ2. Respostas às consultas GraphQL têm tamanho menor do que respostas REST?
  - H0: Não há diferença significativa no tamanho do payload.
  - H1: GraphQL retorna payload menor que REST.

Observação: para comparação controlada, ambas as APIs retornaram os mesmos campos nas medições.

## Desenho do Experimento

- Tipo de experimento: Experimento controlado, comparação direta (REST vs GraphQL).
- Tratamentos:
  - T1: Consulta REST
  - T2: Consulta GraphQL
- Objetos experimentais:
  - Usuários, Produtos, Tarefas (modelos simples utilizados nas queries).
- Variáveis Dependentes:
  - Tempo de resposta (ms)
  - Tamanho do payload (bytes)
- Variáveis Independentes:
  - Tipo de API (REST / GraphQL)
  - Método HTTP / operação (GET, POST, PUT, DELETE)
  - Banco de dados (MariaDB, MongoDB, Redis)
  - Número de items retornados (100, 500, 1000)
- Repetições e amostragem:
  - Para cada combinação (api, banco, método, items) executou-se a mesma requisição **100 vezes** por trial.
  - Foram realizadas **3 trials** quando aplicável, resultando em até **300 amostras** por condição.
  - Os CSVs anexados trazem os resultados consolidados usados nas análises e visualizações.

## Ameaças à Validade

- Validade interna:
  - Variações no servidor/infra, diferenças de otimização entre implementações e ruído de rede podem afetar os tempos.
- Validade externa:
  - Os resultados refletem o ambiente e implementação usados; generalização para outras arquiteturas é limitada.
- Validade de conclusão:
  - Outliers e amostras isoladas podem influenciar conclusões; por isso foram usadas repetições e múltiplos trials.

## Preparação, Execução e Análise — Status das Sprints (FINAL)

- Lab05S01 (concluída — 5 pontos):
  - Desenho do experimento (hipóteses, variáveis, tratamentos, ameaças).
  - Planejamento da preparação (scripts, ferramentas e protocolo de medição).
  - Rascunho das APIs (endpoints REST e resolvers GraphQL equivalentes).
  - Inclusão dos arquivos CSV iniciais.

- Lab05S02 (concluída — 10 pontos):
  - Implementação e execução dos trials conforme o protocolo (100 repetições × 3 trials quando aplicável).
  - Coleta dos dados brutos e consolidação em CSV.
  - Análise dos resultados e produção do relatório final com estatísticas básicas e interpretação.

- Lab05S03 (concluída — 5 pontos):
  - Criação do dashboard de visualização com gráficos que resumem tempo e tamanho por API, método e banco.
  - Exportação das figuras do BI (imagens) e inclusão de descrições textuais das visualizações neste README.

Todas as etapas acima foram concluídas e integradas nesta entrega final.

## Dados coletados (arquivos anexados)

Os dados usados para gerar as análises e o dashboard:

- benchmark_100_items.csv
- benchmark_500_items(1).csv
- benchmark_1000_items.csv

Colunas em cada CSV:
- api — REST ou GraphQL
- banco — MongoDB / MariaDB / Redis
- metodo — GET / POST / PUT / DELETE
- tempo(ms) — tempo médio (ms) por amostra (consolidado a partir das repetições)
- tamanho — tamanho do payload (bytes)
- items — número de items (100, 500, 1000)

Nota: os tempos e tamanhos apresentados nas análises foram calculados a partir desses CSVs consolidados. Os dados brutos por-requisição estão armazenados para análises estatísticas detalhadas.

## Visualizações e figuras do dashboard

As imagens do dashboard (exportadas do BI) foram adicionadas ao repositório e também descritas textualmente abaixo para leitura direta no relatório.

---

## Sprint 3 — Resultados e visualizações (texto dos gráficos do BI)

Abaixo seguem descrições em texto dos principais gráficos do BI (usando os três CSVs). Os valores mostrados são somas ou médias consolidadas extraídas dos CSVs.

Resumo agregado (todos os arquivos combinados)
- Soma total do tamanho (payload) em todos os testes:
  - REST (todos os arquivos): 902.334 bytes
  - GraphQL (todos os arquivos): 822.919 bytes
  - Diferença: REST acumulou ~79.415 bytes a mais no total de payload agregado.
- Soma total de tempo (ms) em todos os testes:
  - REST (todos os arquivos): 725,69 ms
  - GraphQL (todos os arquivos): 908,81 ms
  - Diferença: GraphQL acumulou ~183,12 ms a mais no total (principalmente devido a picos em Redis).

Principais observações por conjunto de items
- Para 100 items:
  - Tamanho total (soma por API): REST = 55.363 B ; GraphQL = 50.392 B.
  - Tempo total (soma por API): REST = 59,90 ms ; GraphQL = 73,64 ms.
- Para 500 items:
  - Tamanho total: REST = 281.549 B ; GraphQL = 255.670 B.
  - Tempo total: REST = 222,50 ms ; GraphQL = 280,29 ms.
- Para 1000 items:
  - Tamanho total: REST = 565.422 B ; GraphQL = 516.857 B.
  - Tempo total: REST = 443,29 ms ; GraphQL = 554,88 ms.

Observações por banco de dados (todos os arquivos agregados)
- MongoDB (soma agregada):
  - Tamanho: REST = 314.902 B ; GraphQL = 352.634 B.
  - Tempo: REST = 68,58 ms ; GraphQL = 83,83 ms.
- MariaDB:
  - Tamanho: REST = 215.329 B ; GraphQL = 234.151 B.
  - Tempo: REST = 46,58 ms ; GraphQL = 56,52 ms.
- Redis:
  - Tamanho: REST = 373.103 B ; GraphQL = 234.134 B.
  - Tempo: REST = 610,53 ms ; GraphQL = 768,46 ms.

Interpretação textual dos gráficos do BI (por grupo)

- "Soma de tamanho por api, método e banco" (multiplots)
  - Exibe barras por método (GET/POST/PUT/DELETE) agrupadas por API e banco.
  - Redis (REST) apresenta tamanhos de payload mais altos em várias operações, impulsionando o total de REST.
  - Para MongoDB e MariaDB, as diferenças de tamanho entre REST e GraphQL são menores.

- "Soma de tempo(ms) por api, método e banco" (multiplots, com eixo log em algumas figuras)
  - MariaDB e MongoDB mostram tempos médios baixos comparados a Redis.
  - Redis apresenta os maiores tempos médios; há picos significativos nos testes GraphQL com Redis (ex.: POST/DELETE).

- "Soma de tamanho e Soma de tempo(ms) por api" (barras empilhadas)
  - Empilha tamanho (segmento principal) e tempo (segmento menor) por API.
  - REST acumula mais tamanho total (~902 KB) enquanto GraphQL acumula mais tempo total (~909 ms).

- Gráficos ordenados por método (barras horizontais por média de tempo)
  - Maiores médias de tempo estão associadas a Redis (REST e GraphQL), com GraphQL apresentando médias maiores em agregados específicos.
  - Métodos PUT/POST em Redis respondem por grande parte da latência.

Conclusão textual (síntese do BI)
- No conjunto de dados fornecido:
  - REST tende a retornar maior soma de payload total (forte contribuição do Redis).
  - GraphQL tende a apresentar maior soma de tempo (latência agregada), com destaque para operações com Redis onde surgem picos importantes.
- Essas conclusões estão refletidas nas figuras do dashboard: barras de tamanho mostram REST maior no total; barras/segmentos de tempo mostram GraphQL com maior consumo agregado de tempo.

---

## Arquivos neste repositório (atuais)

- README.md (este arquivo, versão final)
- benchmark_100_items.csv
- benchmark_500_items(1).csv
- benchmark_1000_items.csv
- pasta: images/ — figuras exportadas do dashboard (BI)
- pasta: analysis/ — notebooks / scripts usados para agregação, cálculo e geração de gráficos
- pasta: scripts/ — scripts de carga / medição (protocolo: 100 repetições × 3 trials)

---
