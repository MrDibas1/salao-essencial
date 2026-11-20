# PROPOSTA COMERCIAL & BRIEFING TÉCNICO
## Sistema Web Especializado de Gestão para Salão de Beleza

---

**Documento:** Proposta Comercial, Orçamento de Projeto e Levantamento de Briefing  
**Produto:** Web Aplicativo de Gestão Interna & Fichas Técnicas (PWA)  
**Infraestrutura:** Nuvem Cloudflare (Edge Network + D1 Database) + Domínio Próprio  
**Responsável Técnico/Comercial:** [Seu Nome / Nome da sua Agência]  
**Contato:** [Seu Telefone / WhatsApp] | [Seu E-mail]  
**Cliente:** [Nome do Salão de Beleza / Responsável]  
**Data de Emissão:** [Data Atual]  
**Validade da Proposta:** 15 dias  

---

## 1. Resumo Executivo & Diagnóstico

Salões de beleza de alto padrão lidam diariamente com um desafio crítico: **a gestão do histórico técnico de suas clientes**, especialmente em procedimentos químicos e colorações (mechas, luzes, retoques de raiz, tonalizações e descolorações).

### O Cenário Atual (Dores do Salão)
- **Fórmulas perdidas ou esquecidas:** Anotações em cadernos de papel ou blocos de notas do celular que se perdem ou ficam inacessíveis.
- **Insegurança no retorno da cliente:** Dificuldade em replicar exatamente a mistura de tintas (marcas, numerações, proporções e volumes de oxidante) usada há 2 ou 3 meses.
- **Dependência excessiva de memória:** Se o cabeleireiro muda ou se ausenta, a nova profissional não tem acesso ao histórico químico do cabelo da cliente.
- **Dificuldade de comunicação:** Falta de integração ágil com o WhatsApp para confirmação e acompanhamento de procedimentos.
- **Sistemas de mercado genéricos e caros:** Softwares complexos, cheios de menus inúteis, lentos no celular e com mensalidades abusivas por profissional cadastrado.

### A Solução Apresentada
O **Web Aplicativo de Gestão do Salão** é uma plataforma sob medida, com foco cirúrgico no que realmente gera valor e produtividade no dia a dia:
1. **Ficha Técnica de Coloração e Procedimentos** completa e instantânea na palma da mão.
2. **Cadastro e Histórico 360° da Cliente** com acesso direto ao WhatsApp em 1 clique.
3. **Tecnologia PWA (Progressive Web App):** Funciona no celular (iPhone e Android), tablet e computador, podendo ser instalado diretamente na tela inicial sem precisar passar pela App Store ou Google Play.
4. **Infraestrutura Cloudflare com Domínio Próprio:** Carregamento em milissegundos, máxima segurança contra quedas e custo de servidor extremamente reduzido.

---

## 2. Escopo Detalhado do Sistema (O que está incluído)

O sistema é entregue completo, moderno, com design editorial sofisticado e testado para operação rápida com uma mão só no celular.

### Módulo 1: Fichas Técnicas & Procedimentos Químicos (Grande Diferencial)
- Registro detalhado de atendimentos: data, profissional responsável, procedimento principal e descrição.
- **Suporte a múltiplas tintas por procedimento:** adição dinâmica de tintas (marca, linha, tom/numeração ex: 7.1 + 8.0, quantidade em gramas e área de aplicação: raiz, comprimento ou pontas).
- **Especificação de Oxidante (OX):** volume (10v, 20v, 30v, 40v), proporção de mistura (ex: 1:1, 1:1.5, 1:2) e marca.
- **Tempo de pausa controlado:** registro em minutos do tempo de ação.
- **Condição e Avaliação Técnica:** estado inicial do fio, resultado obtido e observações para a próxima visita.
- Suporte a procedimentos não químicos (cortes, escovas, hidratações).

### Módulo 2: Gestão de Clientes (CRM Ágil)
- Cadastro simplificado: Nome, Telefone celular, WhatsApp (com botão de conversa direta em 1 toque), E-mail, Data de Nascimento e Instagram.
- Busca instantânea inteligente por nome ou número de telefone.
- Histórico visual em formato de **linha do tempo cronológica** de todos os atendimentos já realizados.
- Indicador visual rápido do último tom ou procedimento realizado logo no card da cliente.
- Controle de status (clientes ativas ou arquivadas).

### Módulo 3: Histórico Geral & Impressão de Ficha Técnica
- Painel com todos os atendimentos do salão organizados do mais recente para o mais antigo.
- Filtros rápidos por tipo de serviço, profissional e período.
- **Ficha Técnica Imprimível:** visualização formatada para conferência ou impressão rápida de prontuário capilar.

### Módulo 4: Catálogo de Produtos e Insumos
- Cadastro de produtos utilizados no salão (tintas, tonalizantes, pós descolorantes, oxidantes, tratamentos).
- Agiliza o preenchimento automático das fórmulas durante os atendimentos.
- Flexibilidade total: permite selecionar insumos pré-cadastrados ou digitar produtos avulsos na hora.

### Módulo 5: Dashboard e Indicadores em Tempo Real
- Total de clientes cadastradas.
- Atendimentos realizados no mês corrente e total histórico.
- Fórmulas químicas ativas salvas no banco de dados.
- Atalhos rápidos para operações frequentes (Novo Atendimento, Cadastrar Cliente).

### Módulo 6: Identidade Visual e Experiência do Usuário (PWA)
- Aplicação das cores, logotipo e identidade do salão de beleza.
- Ícone personalizado na tela inicial do celular da equipe.
- Layout responsivo *mobile-first* (ótima visualização tanto em celulares quanto em telas grandes de recepção).
- Modo de segurança e backup dos dados com restauração facilitada.

---

## 3. Infraestrutura, Hospedagem e Domínio

Para garantir que o salão tenha uma solução estável, rápida e sem surpresas na fatura mensal, o projeto utiliza a infraestrutura de borda da **Cloudflare**, uma das maiores e mais confiáveis redes de servidores do mundo.

| Recurso | Detalhe Técnico | Benefício Direto para o Salão |
| :--- | :--- | :--- |
| **Domínio Próprio** | `app.nomedosalao.com.br` ou `gestao.nomedosalao.com.br` | Fortalece a marca do salão, passando autoridade e profissionalismo. |
| **Cloudflare Edge** | Execução na borda (Edge Workers) distribuída no Brasil (São Paulo, RJ, Curitiba, etc.) | Carregamento praticamente instantâneo, sem telas travando ou demorando para abrir. |
| **Banco de Dados D1** | Banco relacional SQL em nuvem com replicação e alta consistência | Seus dados de clientes e fórmulas salvos com integridade e segurança. |
| **Certificado SSL (HTTPS)** | Criptografia ativa de ponta a ponta | O cadeado de segurança verde no navegador, protegendo os dados de contato das clientes. |
| **Economia Operacional** | Arquitetura Serverless | **Zero custo de servidor dedicado.** A cota gratuita da Cloudflare atende com folga as operações de um salão de beleza. |

---

## 4. Proposta de Investimento

Apresentamos abaixo **3 formatos de contratação** para que o salão escolha a modalidade que melhor se adapta ao seu fluxo de caixa e planejamento financeiro:

### Opção 1: Implantação + Mensalidade de Suporte *(Recomendada pelo Mercado)*
Ideal para o salão que deseja custo inicial equilibrado com acompanhamento técnico contínuo e suporte humanizado via WhatsApp.

- **Taxa de Implantação e Customização:** **R$ 1.600,00**
  - *Condição:* 50% de entrada (R$ 800,00) no início + 50% na entrega e treinamento (R$ 800,00), ou em até 3x no cartão de crédito.
- **Mensalidade de Suporte & Nuvem:** **R$ 120,00 / mês**
  - *Inclui:* Manutenção preventiva da infraestrutura Cloudflare, rotinas de backup, suporte prioritário para dúvidas via WhatsApp e ajustes operacionais.

---

### Opção 2: Modelo de Assinatura Direta (SaaS Exclusivo)
Ideal para o salão que deseja menor desembolso de entrada, transformando o investimento em custo operacional recorrente.

- **Taxa de Setup Inicial:** **R$ 600,00** (configuração do domínio, identidade visual e carga inicial de insumos).
- **Assinatura Mensal:** **R$ 190,00 / mês** (plano com fidelidade mínima de 12 meses).
  - *Inclui:* Uso da plataforma, hospedagem na nuvem, atualizações corretivas e suporte técnico contínuo.

---

### Opção 3: Projeto Fechado (Licença Definitiva)
Ideal para o salão que prefere pagar uma única vez e ser o proprietário independente de sua infraestrutura.

- **Valor Único do Projeto:** **R$ 3.400,00**
  - *Condição:* Entrada de 40% + 2 parcelas de 30% (ou até 6x no cartão de crédito).
- **Sem mensalidade obrigatória:** A plataforma fica rodando no domínio e infraestrutura Cloudflare configurada. Suportes e novas funcionalidades futuras são cobrados apenas sob demanda.

---

### Custos Diretos de Terceiros (Transparência Total)
- **Registro do Domínio (.com.br):** **R$ 40,00 ao ano** (pago diretamente ao Registro.br).
- **Hospedagem Cloudflare:** **R$ 0,00 / mês** (atendido pelo plano gratuito oficial da Cloudflare para o volume de requisições do salão).

---

## 5. Cronograma e Fases de Implantação

O prazo total estimado para entrega, configuração completa e início de uso é de **10 a 14 dias úteis**, divididos nas seguintes etapas:

```
[Dias 1 - 3]  Levantamento de Briefing, Logo e Coleta de Insumos/Marcas
     ↓
[Dias 4 - 6]  Registro/Apontamento do Domínio e Configuração da Cloudflare
     ↓
[Dias 7 - 10] Personalização Visual, Carga Inicial de Dados e Testes Finais
     ↓
[Dias 11 - 12] Treinamento Prático da Equipe (Presencial ou Vídeo-Chamada)
     ↓
[Dias 13 - 14] Entrada Oficial em Operação (Go-Live) e Acompanhamento
```

---

## 6. Garantia, Suporte e Treinamento

1. **Garantia Técnica:** 30 dias de garantia incondicional após a entrega para correção de qualquer eventual instabilidade sem nenhum custo adicional.
2. **Treinamento da Equipe:** Sessão prática de capacitação (com duração de até 1h30) ensinando a cadastrar clientes, salvar fórmulas no celular e consultar históricos em segundos.
3. **Manual Rápido em Vídeo/PDF:** Guia passo a passo ilustrado para consulta de novos profissionais da equipe.
4. **Exportação dos Dados:** Os dados pertencem 100% ao salão. A qualquer momento a base de clientes e fichas pode ser exportada em arquivo de segurança (JSON/Planilha).

---

## 7. Roteiro de Briefing (Questionário para o Cliente)

Para que possamos iniciar a personalização e configuração do sistema imediatamente após o aceite desta proposta, solicitamos o preenchimento das seguintes informações:

### A. Dados do Salão de Beleza
- **Nome Fantasia Oficial:** _____________________________________________
- **Slogan ou Frase de Destaque (opcional):** _____________________________
- **Telefone / WhatsApp Comercial:** _____________________________________
- **Endereço Completo:** _________________________________________________
- **Instagram Oficial (@):** _____________________________________________

### B. Domínio na Internet
- Já possui domínio próprio registrado? ( ) Sim  ( ) Não
- Caso já possua, qual é o endereço? `www.`_______________________________
- Caso não possua, qual sugestão de endereço prefere? (ex: `gestaoessencial.com.br`): _______________________________________________________

### C. Identidade Visual
- Envio do arquivo da logomarca (preferencialmente em PNG com fundo transparente ou vetor/PDF).
- Cores de preferência do salão (ex: Preto e Dourado, Rosé e Branco, Nude e Grafite, etc.): _____________________________________________

### D. Equipe e Profissionais
- Quantos cabeleireiros / coloristas utilizarão o sistema para registrar fórmulas?
- Nomes dos profissionais para pré-cadastro:
  1. ____________________________________________________________________
  2. ____________________________________________________________________
  3. ____________________________________________________________________
  4. ____________________________________________________________________

### E. Principais Marcas de Produtos Utilizadas no Salão
- Marcas de tintas/colorações mais comuns (ex: Wella Professionals, L'Oréal Professionnel, Truss, Schwarzkopf, Keune):  
  _______________________________________________________________________
- Volumes de OX habituais (ex: 10v, 20v, 30v, 40v): ____________________
- Principais tratamentos oferecidos (ex: Cronograma Capilar, Botox, Progressiva, Luzes):  
  _______________________________________________________________________

---

## 8. Aceite e Próximos Passos

Para confirmar a contratação desta proposta e darmos início à implantação do sistema:

1. Escolha a opção de investimento desejada:  
   ( ) **Opção 1:** Implantação (R$ 1.600) + Suporte Mensal (R$ 120/mês)  
   ( ) **Opção 2:** Setup Reduzido (R$ 600) + Assinatura (R$ 190/mês)  
   ( ) **Opção 3:** Projeto Fechado / Licença Única (R$ 3.400)  

2. Preencha os dados do Briefing da Seção 7.
3. Assine digitalmente ou confirme pelo WhatsApp:

**De acordo pelo Cliente:**  
Nome: ________________________________________________  
Data: _____ / _____ / 2026  
Assinatura: ___________________________________________  

**Responsável Técnico / Contratado:**  
[Seu Nome / Sua Agência]  
Assinatura: ___________________________________________  
