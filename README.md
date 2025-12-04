# Lab05S02 — Relatório Sprint 2
GraphQL vs REST — Execução do experimento, análise dos resultados e relatório final (entrega Lab05S02)

Autor: grupo / Victor Reis e Luís Brescia 
Disciplina: Laboratório de Experimentação de Software  
Professor: Danilo 
Data da execução: 2025-12-04

---

Índice
- Introdução
- Objetivo e perguntas de pesquisa
- Ambiente experimental
- Procedimento de execução (como reproduzir)
- Resultados obtidos (CSV)
- Análise dos resultados (normalizada e comparativa)
- Respostas às RQ1 e RQ2 (conclusão preliminar)
- Ameaças à validade e limitações
- Passos recomendados / próximos passos

---

Introdução
----------
Este relatório documenta a Sprint 2 do experimento controlado para comparar APIs GraphQL e REST (mesma aplicação e mesmo banco: MariaDB). Nesta sprint executamos os testes, coletamos os tempos e analisamos os resultados (relatório e recomendações para análises estatísticas e dashboard).

Objetivo e perguntas de pesquisa
--------------------------------
- RQ1: Respostas às consultas GraphQL são mais rápidas do que respostas às consultas REST?
- RQ2: Respostas às consultas GraphQL têm tamanho menor do que respostas às consultas REST?

Ambiente experimental
---------------------
- Servidor de testes: aplicação Node.js que expõe endpoints REST e GraphQL no mesmo processo (arquivo principal: server.js).
- Banco de dados: MariaDB (container Docker definido em docker-compose.yml).
- Cliente de teste: scripts em Node.js local (runTests.js) que executam as operações e medem tempo (performance.now()).
- Dependências: axios (conforme package.json).
- Arquivos relevantes:
  - runTests.js — orquestra os testes e salva CSV (benchmark_maria.csv).
  - scripts/restMariaClient.js — cliente REST (medidas de GET/POST/PUT/DELETE).
  - scripts/gqlMariaClient.js — cliente GraphQL (medidas e funções auxiliares).
  - benchmark_maria.csv — resultados gerados (tempo em ms).
- Recomendação de runtime: Node 18+ (ES modules habilitado no package.json: "type": "module").
- Docker (para MariaDB e MongoDB) recomendado para reproduzir o mesmo estado.

Procedimento de execução (como reproduzir)
------------------------------------------
1. Subir bancos:
   - docker-compose up -d
   - Aguarde MariaDB inicializar (os scripts de seed em ./mariadb são aplicados pelo container).
2. Instalar dependências:
   - npm install
3. Iniciar servidor (se preferir manual):
   - node server.js
   - (o runTests.js já assume que o servidor está ativo em http://localhost:4000)
4. Executar testes:
   - node runTests.js
   - O script registra as medições no arquivo benchmark_maria.csv criado na raiz.
5. Resultado final:
   - benchmark_maria.csv contendo colunas: api,banco,metodo,tempo(ms)

Resultados (CSV gerado)
-----------------------
Conteúdo do arquivo `benchmark_maria.csv` gerado pelo runTests.js:

```csv
api,banco,metodo,tempo(ms)
REST,MariaDB,GET x8520,15.26
REST,MariaDB,POST x1000,12.49
REST,MariaDB,PUT x1000,1.89
REST,MariaDB,DELETE x1000,1.31
GraphQL,MariaDB,GET x9520,35.70
GraphQL,MariaDB,POST x1000,12.95
GraphQL,MariaDB,PUT x1000,12.45
GraphQL,MariaDB,DELETE x1000,5.35
```

Observação: o CSV atual contém apenas tempos (ms). O código cliente calcula tamanhos (size) em memória, porém o runTests.js salva somente tempo no CSV — isto é uma limitação para RQ2 (ver seção Limitações).

Análise dos resultados
----------------------
Observação inicial: os testes atuais correspondem a uma execução (uma medição por tratamento). Para análises estatísticas robustas são necessárias várias repetições (recomenda-se pelo menos 30 repetições por tratamento). Aqui fazemos uma análise descritiva e algumas normalizações por-objeto para facilitar a comparação.

Dados usados (novamente):
- REST GET x8520 → 15.26 ms
- REST POST x1000 → 12.49 ms
- REST PUT x1000 → 1.89 ms
- REST DELETE x1000 → 1.31 ms

- GraphQL GET x9520 → 35.70 ms
- GraphQL POST x1000 → 12.95 ms
- GraphQL PUT x1000 → 12.45 ms
- GraphQL DELETE x1000 → 5.35 ms

Comparação direta (tempo total)
- GET: GraphQL 35.70 ms vs REST 15.26 ms → GraphQL foi 20.44 ms mais lento (≈ +133.9%).
  - Nota: número de registros retornados difere (REST 8.520 vs GraphQL 9.520) → normalizamos abaixo.
- POST x1000: GraphQL 12.95 ms vs REST 12.49 ms → GraphQL +0.46 ms (+3.7%).
- PUT x1000: GraphQL 12.45 ms vs REST 1.89 ms → GraphQL +10.56 ms (+558.7%).
- DELETE x1000: GraphQL 5.35 ms vs REST 1.31 ms → GraphQL +4.04 ms (+308.4%).

Normalização por operação/registro (para comparação justa quando counts diferem)
- GET per record:
  - REST: 15.26 ms / 8520 ≈ 0.00179 ms/registro
  - GraphQL: 35.70 ms / 9520 ≈ 0.00375 ms/registro
  - Razão: GraphQL ≈ 2.09× mais lento por registro no GET (normalizado).
- POST per record (x1000):
  - REST: 12.49 / 1000 = 0.01249 ms/op
  - GraphQL: 12.95 / 1000 = 0.01295 ms/op
  - Razão: GraphQL ≈ 1.04× (≈3.7% mais lento).
- PUT per record (x1000):
  - REST: 1.89 / 1000 = 0.00189 ms/op
  - GraphQL: 12.45 / 1000 = 0.01245 ms/op
  - Razão: GraphQL ≈ 6.59× mais lento.
- DELETE per record (x1000):
  - REST: 1.31 / 1000 = 0.00131 ms/op
  - GraphQL: 5.35 / 1000 = 0.00535 ms/op
  - Razão: GraphQL ≈ 4.08× mais lento.

Interpretação resumida
- Em GET (consulta de leitura em massa) GraphQL apresentou maior latência tanto em total quanto quando normalizado por registro (≈2× mais lento). Parte desta diferença se deve ao overhead de parsing/execução da query GraphQL e à construção dinâmica do resultado.
- Em POST (inserção em lote x1000) os tempos foram muito próximos (diferença pequena — GraphQL ligeiramente mais lento).
- Em operações de atualização e exclusão em lote (PUT e DELETE) GraphQL foi consideravelmente mais lento (fator 4–6×), possivelmente por:
  - overhead do resolver GraphQL em cada item (execução por item) e menos otimizações para lote no resolver atual;
  - implementação do schema/resolvers pode estar fazendo iterações e consultas individuais ao banco por item em vez de um único comando em lote (verificar implementação do mariaResolvers/mariaUpdateMany e mariaDeleteMany).
- Essas diferenças mostram um padrão: GraphQL adiciona overhead de execução por resolver e parsing da query, o que tende a aumentar latências em operações que processam muitos registros individualmente.

Respostas preliminares às RQ
----------------------------
- RQ1 (tempo de resposta): Com os dados atuais e considerando uma execução de teste, REST foi mais rápido que GraphQL para as operações testadas (GET, PUT, DELETE). Em POST a diferença foi pequena. Conclusão: evidência preliminar indica que REST tende a ser mais rápido no cenário testado. Observação: esta conclusão é provisória — precisa de repetições estatísticas e controle estrito de contagens e implementação (veja limitações).
- RQ2 (tamanho do payload): Inconclusivo — o CSV salvo não contém os tamanhos (size) resultantes. Os clientes já calculam size internamente, mas runTests.js não persiste essa métrica no CSV. Precisamos rodar novamente salvando size para comparar volumes de payload (bytes). Portanto, atualmente não é possível responder RQ2 com os artefatos gerados.

Ameaças à validade e limitações
------------------------------
1. Medições únicas: cada tratamento tem apenas uma medição. Não há repetição suficiente para inferência estatística. (Recomendado: ≥ 30 repetições por tratamento.)
2. Contagens diferentes no GET (8520 vs 9520) — confunde comparação direta. Deve-se garantir mesma amostra de retorno para GET em ambos os tratamentos.
3. Implementação dos resolvers GraphQL pode não estar otimizada (por ex., updates/deletes podem estar sendo feitos item a item). Isto afeta generalidade.
4. Ambiente: CPU, rede, disco e estado do banco durante a medição podem introduzir ruído.
5. Falta de métrica de tamanho no CSV (RQ2 não respondida).
6. Ordem de execução: se os testes foram executados em sequência sem limpeza do cache, efeitos de cold/warm cache podem ocorrer.

Recomendações / Próximos passos
-------------------------------
1. Replicar experimentos com N repetições (ex.: 30 ou 50) por tratamento para obter distribuição e permitir testes estatísticos (t-test ou Wilcoxon se não-normal).
2. Garantir igualdade no número de registros retornados nos GET (seed igual / mesmo snapshot).
3. Registrar e salvar também o tamanho do payload (bytes) no CSV. Modificar runTests.js → saveCSV para incluir campos size e, se possível, payload médio por registro.
4. Perfilar resolvers GraphQL:
   - Verificar se mariaUpdateMany/mariaDeleteMany usam operações em lote no DB ou fazem N queries.
   - Se possível, otimizar resolvers para usar chamadas em lote (uma query UPDATE ... WHERE id IN (...)) para reduzir overhead.
5. Para análise estatística: calcular média, mediana, desvio padrão, intervalo de confiança e tamanho de efeito (Cohen's d) por operação.
6. Visualização (Sprint 3): criar dashboard com boxplots, histogramas e gráficos de barras com CI; usar pandas/matplotlib/seaborn ou uma solução web (Plotly).
7. Repetir testes em diferentes cenários (variação de payloads, consultas com seleção de campos menores via GraphQL para testar vantagem teórica de payloads menores).

Exemplos de alterações práticas (código)
- Modificar runTests.js para persistir size (ex.: incluir size retornado pelos clientes e salvar no CSV).
- Incluir loop para N repetições e gerar arquivo CSV com colunas: api,db,metodo,count,trial,time_ms,size_bytes

Plano de análise estatística proposto
-----------------------------------
1. Para cada operação (GET, POST, PUT, DELETE) e por API (REST vs GraphQL) coletar N medições independentes.
2. Testar normalidade (Shapiro-Wilk).
3. Se normal: t-test de duas amostras (independentes) para diferença de médias.
   - Reportar p-value e intervalo de confiança da diferença.
4. Se não-normal: teste não-paramétrico (Mann-Whitney U / Wilcoxon rank-sum).
5. Calcular tamanho do efeito (Cohen's d) e apresentar interpretação.
6. Visualizar com boxplots e violins.

Conclusão (resumo)
------------------
Com a execução atual (uma run) observamos que REST teve desempenho melhor em GET, PUT e DELETE, e desempenho muito próximo no POST em lote. GraphQL demonstrou overhead perceptível principalmente em operações de atualização/exclusão em lote — possivelmente por implementação dos resolvers. Não há dados suficientes para a conclusão estatística formal; além disso, RQ2 ficou sem resposta por falta da métrica de tamanho persistida. Para tornar a conclusão robusta é necessário executar múltiplas repetições, normalizar o número de registros retornados e persistir métricas de tamanho do payload.

Anexos / artefatos
------------------
- benchmark_maria.csv (gerado)
- scripts/source: runTests.js, scripts/restMariaClient.js, scripts/gqlMariaClient.js
- docker-compose.yml (MariaDB + MongoDB para replicação)