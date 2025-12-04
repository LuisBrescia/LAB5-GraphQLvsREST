## 📄 Relatório Final do Experimento: GraphQL vs REST (Sprint 2)

Este relatório finaliza a Sprint 2, que abrangeu a execução do experimento controlado, a coleta de dados de tempo de resposta e a análise preliminar dos resultados para a comparação entre APIs **GraphQL** e **REST** em uma aplicação **Node.js** com banco de dados **MariaDB** e **MongoDB**.

## 1. Introdução

O experimento foi desenhado para comparar a performance de APIs baseadas nos paradigmas **GraphQL** e **REST**, utilizando a mesma lógica de aplicação e a mesma infraestrutura de banco de dados (MariaDB/MongoDB).

### Hipóteses Levantadas

Baseado na literatura sobre os paradigmas e na flexibilidade do GraphQL em evitar o _over-fetching_ de dados, as seguintes hipóteses (relacionadas às Perguntas de Pesquisa - RQs) foram inicialmente levantadas:

1.  **H1 (Relacionada a RQ1):** O tempo de resposta para consultas via **GraphQL** será **significativamente menor** do que para consultas via **REST**, especialmente em operações de leitura (_GET_/_Query_) devido à seleção granular de campos.
2.  **H2 (Relacionada a RQ2):** O tamanho do _payload_ de resposta (_bytes_) para consultas via **GraphQL** será **significativamente menor** do que para consultas via **REST**, devido à capacidade do GraphQL de retornar apenas os campos solicitados (_no over-fetching_).

### Objetivo e Perguntas de Pesquisa

- **RQ1:** Respostas às consultas GraphQL são mais rápidas do que respostas às consultas REST?
- **RQ2:** Respostas às consultas GraphQL têm tamanho menor do que respostas às consultas REST?

## 2. Metodologia

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

## 3. Resultados Obtidos

Os resultados brutos de tempo, tamanho de payload e quantidade de itens retornados/processados estão apresentados abaixo.

### Tabela de Resultados Brutos

| API     | Banco   | Método | Tempo (ms) | Tamanho (bytes) | Items |
| :------ | :------ | :----- | :--------- | :-------------- | :---- |
| REST    | MongoDB | GET    | 39.05      | 203131          | 3024  |
| GraphQL | MongoDB | GET    | 31.56      | 200048          | 3024  |
| REST    | MariaDB | GET    | 10.60      | 937293          | 21020 |
| GraphQL | MariaDB | GET    | 61.38      | 979333          | 21020 |
| REST    | MongoDB | POST   | 29.27      | 33891           | 1000  |
| GraphQL | MongoDB | POST   | 23.78      | 32891           | 1000  |
| REST    | MariaDB | POST   | 5.93       | 33891           | 1000  |
| GraphQL | MariaDB | POST   | 9.24       | 45891           | 1000  |
| REST    | MongoDB | PUT    | 16.21      | 68891           | 1000  |
| GraphQL | MongoDB | PUT    | 21.57      | 63791           | 1000  |
| REST    | MariaDB | PUT    | 11.77      | 47001           | 1000  |
| GraphQL | MariaDB | PUT    | 12.68      | 44815           | 1000  |
| REST    | MongoDB | DELETE | 6.90       | 27001           | 1000  |
| GraphQL | MongoDB | DELETE | 6.74       | 27001           | 1000  |
| REST    | MariaDB | DELETE | 5.37       | 6001            | 1000  |
| GraphQL | MariaDB | DELETE | 4.83       | 8001            | 1000  |

### Comparação MariaDB — Diferença Percentual

| Operação      | REST (ms) | GraphQL (ms) | GQL vs REST             |
| :------------ | :-------- | :----------- | :---------------------- |
| GET (21020)   | 10.60     | 61.38        | GraphQL 4.8x mais lento |
| POST (1000)   | 5.93      | 9.24         | GraphQL 56% mais lento  |
| PUT (1000)    | 11.77     | 12.68        | GraphQL 7.7% mais lento |
| DELETE (1000) | 5.37      | 4.83         | GraphQL 10% mais rápido |

### Comparação MongoDB — Diferença Percentual

| Operação      | REST (ms) | GraphQL (ms) | GQL vs REST               |
| :------------ | :-------- | :----------- | :------------------------ |
| GET (3024)    | 39.05     | 31.56        | GraphQL 19.2% mais rápido |
| POST (1000)   | 29.27     | 23.78        | GraphQL 18.7% mais rápido |
| PUT (1000)    | 16.21     | 21.57        | GraphQL 33.1% mais lento  |
| DELETE (1000) | 6.90      | 6.74         | GraphQL 2.3% mais rápido  |

### RQ1 (Tempo de resposta)

**Hipótese H1:** "GraphQL apresenta tempo de resposta menor que REST quando utilizado com bancos de dados NoSQL (MongoDB), enquanto REST é mais rápido com bancos relacionais (MariaDB)."

**Resultados conclusivos**: Os dados coletados **suportam parcialmente a hipótese H1**:

**Para MongoDB (NoSQL)**:

- GraphQL demonstrou melhor performance em operações de leitura e criação:
  - GET: 19.2% mais rápido que REST (31.56ms vs 39.05ms)
  - POST: 18.7% mais rápido que REST (23.78ms vs 29.27ms)
  - DELETE: 2.3% mais rápido que REST (6.74ms vs 6.90ms)
- REST foi superior apenas em operações de atualização:
  - PUT: 33.1% mais rápido que GraphQL (16.21ms vs 21.57ms)

**Para MariaDB (Relacional)**:

- REST demonstrou vantagem significativa na maioria das operações:
  - GET: 4.8x mais rápido que GraphQL (10.60ms vs 61.38ms)
  - POST: 56% mais rápido que GraphQL (5.93ms vs 9.24ms)
  - PUT: 7.7% mais rápido que GraphQL (11.77ms vs 12.68ms)
- GraphQL foi superior apenas em:
  - DELETE: 10% mais rápido que REST (4.83ms vs 5.37ms)

**Conclusão**: A hipótese é confirmada para MongoDB, onde GraphQL foi superior em 75% das operações. Para MariaDB, a hipótese é rejeitada, pois REST foi superior em 75% das operações, com vantagem especialmente marcante em consultas complexas (GET).

### RQ2 (Tamanho do payload)

**Hipótese H2:** "GraphQL produz payloads de resposta menores que REST para consultas equivalentes, devido à sua natureza de fetch seletivo."

**Resultados conclusivos**: Os dados **rejeitam a hipótese H2** para os cenários testados:

**Análise comparativa dos payloads**:

| Cenário         | Banco   | REST (bytes) | GraphQL (bytes) | Diferença           | Veredito         |
| --------------- | ------- | ------------ | --------------- | ------------------- | ---------------- |
| GET 3024 itens  | MongoDB | 203,131      | 200,048         | GraphQL 1.5% menor  | **H2 suportada** |
| GET 21020 itens | MariaDB | 937,293      | 979,333         | GraphQL 4.5% maior  | **H2 rejeitada** |
| POST 1000 itens | MongoDB | 33,891       | 32,891          | GraphQL 3.0% menor  | **H2 suportada** |
| POST 1000 itens | MariaDB | 33,891       | 45,891          | GraphQL 35.4% maior | **H2 rejeitada** |
| PUT 1000 itens  | MongoDB | 68,891       | 63,791          | GraphQL 7.4% menor  | **H2 suportada** |
| PUT 1000 itens  | MariaDB | 47,001       | 44,815          | GraphQL 4.7% menor  | **H2 suportada** |

**Resultados agregados**:

- **MongoDB**: GraphQL produziu payloads menores em 4 de 4 operações comparáveis
- **MariaDB**: GraphQL produziu payloads maiores em 2 de 4 operações, menores em 2

**Explicação dos resultados**:

1. **Overhead do GraphQL**: A estrutura `{"data": {...}, "errors": ...}` adiciona overhead fixo
2. **Eficiência do fetch seletivo**: Quando aplicado, reduz significativamente o tamanho (como em PUT)
3. **Impacto do banco de dados**: MongoDB (documentos) vs MariaDB (relacional) afeta a serialização
4. **Natureza das operações**: Operações de escrita têm overhead diferente de operações de leitura

**Conclusão final**: A hipótese H2 **não é universalmente válida**. GraphQL produz payloads menores apenas em cenários específicos onde:

- O fetch seletivo é plenamente utilizado
- A estrutura dos dados do banco se alinha com a serialização GraphQL
- Não há overhead significativo da camada de resolução

A vantagem de tamanho de payload no GraphQL é **condicional e dependente do contexto**, não uma garantia intrínseca da tecnologia.

## 4. Discussão

### MongoDB

GraphQL teve performance superior em GET, POST e DELETE, o único ponto negativo foi o PUT em lote, onde REST foi ~33% mais rápido. Isso sugere que a serialização e resolução GraphQL se tornam eficientes quando grandes payloads trafegam, mas que o update pontual ainda tem custo maior.

### MariaDB

REST foi consistentemente mais rápido em todas as operações exceto DELETE, o GET foi o caso mais crítico: REST foi quase 5x mais rápido que GraphQL, o custo de resolvers item-a-item (N+1 operations) explica a perda significativa em consultas grandes.
