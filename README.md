# ESSENCIAL — Sistema de Gestão para Salão de Beleza

Sistema web de alta performance desenvolvido exclusivamente para gestão interna e controle técnico de procedimentos em salões de beleza, com ênfase no histórico detalhado de clientes, colorações, fórmulas químicas e insumos.

---

## 1. Visão Geral e Objetivo

O **ESSENCIAL** foi concebido para resolver a principal dor de cabeleireiros e coloristas: a perda de informações sobre as formulações exatas, proporções de oxidantes, tempos de pausa e misturas de tonalidades utilizadas em atendimentos anteriores.

Com uma interface moderna, sofisticada e minimalista, o profissional tem acesso imediato à ficha técnica de qualquer cliente em poucos cliques, garantindo consistência no resultado e fidelização.

---

## 2. Identidade Visual & Design

O design segue uma proposta minimalista e refinada de software comercial premium:

- **Paleta de Cores Monocromática**:
  - Preto Principal: `#111111`
  - Grafite: `#292929`
  - Branco: `#FFFFFF`
  - Cinza Claro: `#F3F3F3`
  - Cinza Bordas: `#E5E5E5`
  - Cinza Textos Secundários: `#777777`
- **Tipografia**: Cinzel / Inter para elegância estética e máxima legibilidade.
- **Logomarca Oficial**: Integrada em SVG e PNG (`public/assets/logo-essencial.svg` e `public/assets/logo-essencial.png`), com suporte a modo tipográfico configurável nas preferências do sistema.

---

## 3. Módulos do Sistema

### A. Dashboard
- **Indicadores Dinâmicos em Tempo Real**:
  - Total de clientes cadastradas
  - Total de atendimentos e procedimentos registrados
  - Atendimentos realizados no mês corrente
  - Fórmulas técnicas detalhadas de coloração salvas
- **Gráfico de Atendimentos**: Distribuição da frequência dos últimos 6 meses.
- **Atalhos Rápidos**: Novo Atendimento, Cadastrar Cliente, Consultar Clientes.
- **Tabela Recente**: Resumo dos últimos atendimentos e fórmulas aplicadas.

### B. Módulo de Clientes
- Cadastro completo: Nome, Telefone, WhatsApp (com opção de mesmo número), E-mail, Data de Nascimento e Observações.
- Busca instantânea por nome ou telefone.
- Filtro por status (Ativas, Arquivadas ou Todas).
- Ações rápidas: Editar, Arquivar/Desarquivar e Excluir com confirmação segura.

### C. Perfil Individual da Cliente
- **Resumo do Relacionamento**: Quantidade de atendimentos, data do primeiro e último procedimento, serviços frequentes.
- **Botão Destacado "NOVO ATENDIMENTO"**: Vincula imediatamente o formulário à cliente selecionada.
- **Linha do Tempo (Timeline) Cronológica**:
  - Histórico completo do mais recente ao mais antigo.
  - Exibição visual das tintas misturadas, oxidantes e tempos de pausa.
  - Acesso à Ficha Técnica Completa com impressão formatada.

### D. Módulo de Atendimentos & Coloração (Principal Diferencial)
- **Seção 1**: Cliente, data, profissional responsável, tipo de procedimento (Coloração, Retoque de raiz, Luzes, Mechas, Descoloração, Tonalização, Hidratação, Reconstrução, Corte, Escova, Progressiva, Outro) e descrição.
- **Seção 2 — Fórmulas de Coloração**:
  - **Suporte a múltiplas tintas em uma única aplicação** via botão **`+ ADICIONAR OUTRA TINTA`**.
  - Registro de marca, linha, numeração do tom (ex: 7.1, 8.0), quantidade, unidade e região de aplicação (Raiz, Comprimento, Pontas, Cabelo completo).
  - Oxidante: volume (ex: 20 vol), proporção (ex: 1:1.5), marca.
  - Tempo de pausa e notas técnicas.
  - Opção para procedimentos sem química (ex: cortes e escovas).
- **Seção 3 — Avaliação Técnica**: Condição inicial do cabelo, resultado final, histórico e recomendações para o próximo retorno.

### E. Histórico Geral de Atendimentos
- Lista completa cronológica de todos os procedimentos realizados no salão.
- Filtros avançados combinados: busca textual, tipo de procedimento, profissional responsável e intervalo de datas.
- Modal de Ficha Técnica com layout para impressão.

### F. Catálogo de Produtos e Insumos
- Cadastro auxiliar de tintas, oxidantes, descolorantes, tonalizantes e tratamentos.
- Agilidade no preenchimento do formulário de atendimento.
- Não restringe o profissional: é possível digitar qualquer produto livremente no atendimento.

### G. Configurações & Base Demonstrativa
- Dados do salão: Nome, Slogan, Telefone, Endereço e Redes Sociais.
- Alternância entre logo gráfica e tipográfica.
- **Gerenciamento de Demonstração**:
  - *Restaurar Dados Demonstrativos*: carrega dados fictícios realistas para apresentação a clientes.
  - *Limpar Registros Fictícios*: remove dados demo mantendo os reais cadastrados pelo usuário.
  - *Backup JSON*: exportação e importação de segurança de toda a base.

---

## 4. Stack Tecnológica

- **React 19**
- **TypeScript**
- **Vite 8**
- **Tailwind CSS v4**
- **Lucide React** (ícones minimalistas consistentes)
- **Arquitetura Desacoplada**: Persistência gerenciada via `StorageService` em LocalStorage com relacionamentos estruturados (`Client` -> `Appointment` -> `ColorFormula` -> `ColorProductItem[]`), pronta para migração transparente para banco de dados relacional (PostgreSQL/Supabase/MySQL).

---

## 5. Como Executar o Projeto Localmente

### Pré-requisitos
- Node.js versão 18 ou superior
- Gerenciador de pacotes `npm` ou `yarn`

### Instalação

```bash
# 1. Clone ou acesse a pasta do projeto
cd "d:/Projetos/Salao Essencial"

# 2. Instale as dependências
npm install

# 3. Inicie o servidor de desenvolvimento
npm run dev
```

A aplicação estará disponível em `http://localhost:5173`.

### Build de Produção

```bash
# Gera o build estático otimizado na pasta dist/
npm run build

# Pré-visualização do build de produção
npm run preview
```

---

## 6. Preparação para Expansão Futura

A arquitetura do código foi projetada modularmente para suportar as seguintes extensões sem retrabalho:
1. Conexão a API REST / GraphQL e Banco de Dados na nuvem.
2. Módulo de agendamento online e calendário de profissionais.
3. Registro fotográfico de evolução capilar (Antes / Depois).
4. Notificações automáticas de retorno via WhatsApp API.
5. Controle de estoque e baixa automática de insumos.
