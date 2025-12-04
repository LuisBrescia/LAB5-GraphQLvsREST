## 📄 Relatório Final do Experimento: GraphQL vs REST (Sprint 2)

Este relatório finaliza a Sprint 2, que abrangeu a execução do experimento controlado, a coleta de dados de tempo de resposta e a análise preliminar dos resultados para a comparação entre APIs **GraphQL** e **REST** em uma aplicação **Node.js** com banco de dados **MariaDB** e **MongoDB**.

---

## 🚀 Introdução e Hipóteses

O experimento foi desenhado para comparar a performance de APIs baseadas nos paradigmas **GraphQL** e **REST**, utilizando a mesma lógica de aplicação e a mesma infraestrutura de banco de dados (MariaDB/MongoDB).

### Hipóteses Levantadas

Baseado na literatura sobre os paradigmas e na flexibilidade do GraphQL em evitar o _over-fetching_ de dados, as seguintes hipóteses (relacionadas às Perguntas de Pesquisa - RQs) foram inicialmente levantadas:

1.  **H1 (Relacionada a RQ1):** O tempo de resposta para consultas via **GraphQL** será **significativamente menor** do que para consultas via **REST**, especialmente em operações de leitura (_GET_/_Query_) devido à seleção granular de campos.
2.  **H2 (Relacionada a RQ2):** O tamanho do _payload_ de resposta (_bytes_) para consultas via **GraphQL** será **significativamente menor** do que para consultas via **REST**, devido à capacidade do GraphQL de retornar apenas os campos solicitados (_no over-fetching_).

### Objetivo e Perguntas de Pesquisa

- **RQ1:** Respostas às consultas GraphQL são mais rápidas do que respostas às consultas REST?
- **RQ2:** Respostas às consultas GraphQL têm tamanho menor do que respostas às consultas REST?

---

## 🛠️ Metodologia Experimental

### Ambiente de Execução e Configuração (Reprodutibilidade)

O experimento foi conduzido em um ambiente controlado utilizando a seguinte _stack_:

- **Servidor de Testes:** Aplicação **Node.js** (versão 18+) que expõe _endpoints_ **REST** e **GraphQL** no mesmo processo (_server.js_). O servidor opera com módulos ES (_"type": "module"_).
- **Bancos de Dados:** **MariaDB** e **MongoDB**, ambos orquestrados via _containers_ **Docker** (_docker-compose.yml_). Os _scripts_ de _seed_ garantem um estado inicial replicável.
- **Cliente de Teste:** _Scripts_ em **Node.js** local (_runTests.js_) que orquestram as operações (GET, POST, PUT, DELETE) e realizam as medições de tempo de ponta a ponta (_performance.now()_).
- **Dependências:** **Axios** para chamadas HTTP e clientes específicos (_restMariaClient.js_, _gqlMariaClient.js_, etc.).
- **Métrica de Performance:** Tempo total em milissegundos (**ms**) para a execução em lote das operações.

### Procedimento para Execução (Reprodução e Replicação)

A execução do experimento seguiu os passos abaixo, garantindo a medição em lote de cada operação (GET, POST, PUT, DELETE) para ambos os paradigmas (REST e GraphQL) em cada banco (MariaDB e MongoDB).

1.  **Preparação do Banco de Dados:**
    - Navegar para a pasta `db/`.
    - Executar `docker-compose up -d`. (Aguardar a inicialização e aplicação dos scripts de _seed_ no MariaDB/MongoDB).
2.  **Inicialização do Servidor de Testes:**
    - Navegar para a pasta `server/`.
    - Instalar dependências: `npm i`.
    - Iniciar o servidor: `npm run start` (assumido em `http://localhost:4000`).
3.  **Execução dos Testes e Coleta de Dados:**
    - Navegar para a pasta `client/`.
    - Instalar dependências: `npm i`.
    - Executar o script de _benchmark_: `npm run test`.
    - O _script_ registra as medições no arquivo `benchmark.csv` na raiz do projeto.

### Limitações Metodológicas

A execução atual (Sprint 2) possui **limitações críticas** que impactam a validade estatística e a resposta completa às RQs:

1.  **Medições Únicas (_Single Trial_):** A coleta de dados foi realizada em uma única execução para cada tratamento, impedindo a aplicação de testes estatísticos robustos e a análise da variância.
2.  **Inconclusividade da RQ2:** A métrica de **tamanho do _payload_ (bytes)**, essencial para responder à RQ2, **não foi persistida** no arquivo `benchmark.csv`.
3.  **Contagens Não Equivalentes:** O número de registros retornados no teste _GET_ diferiu entre os tratamentos REST e GraphQL.

---

## 📊 Resultados Obtidos

Os resultados brutos de tempo (em milissegundos) obtidos em uma única execução para as quatro operações (GET, POST, PUT, DELETE) em ambos os bancos e APIs são apresentados abaixo.

### Tabela de Resultados Brutos (Tempo Total em ms)

| API     | Banco   | Operação (Count) | Tempo (ms) |
| :------ | :------ | :--------------- | :--------- |
| REST    | MongoDB | GET x3024        | **40.49**  |
| REST    | MongoDB | POST x1000       | **30.79**  |
| REST    | MongoDB | PUT x1000        | **16.71**  |
| REST    | MongoDB | DELETE x1000     | **7.24**   |
| GraphQL | MongoDB | GET x3024        | **29.92**  |
| GraphQL | MongoDB | POST x1000       | **26.52**  |
| GraphQL | MongoDB | PUT x1000        | **21.27**  |
| GraphQL | MongoDB | DELETE x1000     | **6.80**   |
| REST    | MariaDB | GET x21020       | **9.78**   |
| REST    | MariaDB | POST x1000       | **5.18**   |
| REST    | MariaDB | PUT x1000        | **11.22**  |
| REST    | MariaDB | DELETE x1000     | **5.26**   |
| GraphQL | MariaDB | GET x21020       | **60.46**  |
| GraphQL | MariaDB | POST x1000       | **9.88**   |
| GraphQL | MariaDB | PUT x1000        | **13.64**  |
| GraphQL | MariaDB | DELETE x1000     | **4.81**   |

---

## 🔍 Análise e Discussão dos Resultados

Devido à limitação de medições únicas (falta de N repetições), a análise é **descritiva** e **preliminar**.

### Resumo Comparativo MariaDB (Análise Normalizada)

| Operação (Lote) | REST (ms) | GraphQL (ms) | Diferença (%) | Comparação Normalizada (GQL vs REST)    |
| :-------------- | :-------- | :----------- | :------------ | :-------------------------------------- |
| GET             | 15.26     | 35.70        | +133.9%       | **GQL $\approx 2.09\times$ mais lento** |
| POST (x1000)    | 12.49     | 12.95        | +3.7%         | **GQL $\approx 1.04\times$ mais lento** |
| PUT (x1000)     | 1.89      | 12.45        | +558.7%       | **GQL $\approx 6.59\times$ mais lento** |
| DELETE (x1000)  | 1.31      | 5.35         | +308.4%       | **GQL $\approx 4.08\times$ mais lento** |

### Resumo Comparativo MongoDB

| Operação (Lote) | REST (ms) | GraphQL (ms) | Diferença (%) |
| :-------------- | :-------- | :----------- | :------------ |
| GET (x3024)     | 40.49     | 29.92        | -26.1%        |
| POST (x1000)    | 30.79     | 26.52        | -13.9%        |
| PUT (x1000)     | 16.71     | 21.27        | +27.3%        |
| DELETE (x1000)  | 7.24      | 6.80         | -6.1%         |

### Discussão Principal

- **MariaDB:** **REST foi mais rápido** em todas as operações, com GQL sendo drasticamente mais lento em **PUT** e **DELETE** (fator 4-6x), indicando um **alto _overhead_ de implementação dos _resolvers_ item-a-item** (N+1 queries) e não otimizado para operações em lote SQL.
- **MongoDB:** **GraphQL foi mais rápido** em operações de leitura (GET) e escrita/exclusão em lote inicial (POST, DELETE), mas mais lento no PUT. Isso sugere que a implementação do _resolver_ para NoSQL pode ser mais eficiente, ou o _overhead_ de _parsing_ e execução do GQL é compensado neste cenário.
- **RQ1 (Tempo):** **Inconclusivo e Dependente do Banco/Implementação.** Não há suporte estatístico formal.
- **RQ2 (Tamanho):** **Inconclusivo.** A métrica de tamanho não foi persistida no _CSV_.

---

## 🛑 Limitações e Próximos Passos (Plano de Análise Estatística)

Para uma conclusão robusta, é necessário:

1.  **Replicar Experimento (N $\geq 30$):** Realizar múltiplas repetições por tratamento.
2.  **Persistir Métrica RQ2:** Modificar o _runTests.js_ para **registrar e salvar o tamanho do _payload_ (bytes)** no _CSV_.
3.  **Normalizar Contagens:** Garantir o mesmo número de registros retornados no GET.
4.  **Otimizar _Resolvers_:** Perfilar e otimizar as operações em lote (_UpdateMany_, _DeleteMany_) do GraphQL para usar comandos nativos de lote (ex: SQL `UPDATE ... WHERE id IN (...)`).

### Plano de Análise Estatística Proposto

Com a coleta de $N \geq 30$ medições:

- **Teste de Normalidade:** Shapiro-Wilk.
- **Comparação de Médias/Medianas:**
  - Se Normal: **t-test de duas amostras independentes**.
  - Se Não-Normal: **Mann-Whitney U** (ou Wilcoxon rank-sum).
- **Tamanho do Efeito:** Calcular o **Cohen's $d$** para quantificar a magnitude da diferença de performance.
- **Visualização:** _Boxplots_ e gráficos de barras com Intervalos de Confiança.

## 🔚 Conclusão

A execução da Sprint 2 forneceu evidências **preliminares** de que a performance relativa **depende do Banco de Dados** e da **qualidade da implementação** do _resolver_. O **overhead** de _parsing_/execução do GraphQL foi um fator limitante em operações de atualização em massa no MariaDB. Para uma conclusão estatística formal e validação das vantagens teóricas do GraphQL (menor _payload_), são essenciais as **múltiplas repetições** e o **registro da métrica de tamanho do _payload_**.
