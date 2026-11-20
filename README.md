# Salão Essencial — Sistema de Gestão Capilar & Coloração

[![Version](https://img.shields.io/badge/versão-1.0.0-C87A14.svg)](package.json)
[![React](https://img.shields.io/badge/React-19.3-61DAFB.svg)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6.svg)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-8.x-646CFF.svg)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-v4-38B2AC.svg)](https://tailwindcss.com/)
[![Cloudflare](https://img.shields.io/badge/Cloudflare_D1-Serverless_SQLite-F38020.svg)](https://developers.cloudflare.com/d1/)
[![PWA](https://img.shields.io/badge/PWA-Instalável-2E7D5B.svg)](https://web.dev/progressive-web-apps/)

Sistema web progressivo (**PWA**) de alta performance desenvolvido sob medida para gestão interna e controle técnico de procedimentos em salões de beleza, com ênfase no histórico minucioso de clientes, fichas de coloração, fórmulas químicas e mural de transformações (**Antes e Depois**).

🌐 **Produção:** [https://salao-essencial.kauemoreiraalternativo.workers.dev](https://salao-essencial.kauemoreiraalternativo.workers.dev)

---

## 🌟 Principais Funcionalidades

### 1. Ficha Técnica de Coloração & Cabelos
* **Registro de Fórmulas:** Suporte a misturas de múltiplas nuances, gramaturas exatas, proporções de oxidante (10, 20, 30, 40 vol), tempo de pausa e observações de aplicação.
* **Histórico Completo por Cliente:** Consulta instantânea do histórico anterior antes de iniciar qualquer serviço químico.
* **Segurança da Cliente:** Campo exclusivo para registro de alergias, sensibilidade de couro cabeludo e preferências pessoais.

### 2. Galeria de Transformações (Antes e Depois)
* **Portfólio Visual Integrado:** Exibição lado a lado de fotos do estado inicial (*Antes*) e do resultado final (*Depois*).
* **Compressão Automática em Canvas (`imageOptimizer.ts`):** Fotos de câmeras de alta resolução (5 MB a 10 MB) são comprimidas no navegador para ~70 KB a 100 KB, garantindo carregamento rápido e economia de tráfego.
* **Modo Lightbox:** Visualizador comparativo em tela cheia com zoom em alta resolução.
* **Filtros e Busca:** Filtragem por tipo de procedimento (*Coloração, Mechas, Corte, etc.*) e busca em tempo real por cliente ou fórmula.

### 3. Banco de Dados em Nuvem & Sincronização (Cloudflare D1)
* **Prevenção Total de Perda de Dados:** Sincronização automática com banco de dados serverless relacional (Cloudflare D1). Caso o celular quebre ou seja trocado, todos os dados são preservados.
* **Offline-First:** O aplicativo continua funcionando normalmente mesmo sem internet via cache local e sincroniza assim que a conexão é restabelecida.

### 4. PWA (Progressive Web App)
* **Instalável:** Pode ser adicionado à tela inicial de iPhones (iOS), dispositivos Android e computadores desktop com ícone e tela cheia.
* **Design Responsivo & Mobile-First:** Navegação pensada para o uso com o polegar no celular e layout expandido para desktops.

### 5. Comunicação & Agilidade no Balcão
* **Atalho Direto para WhatsApp:** Disparo de mensagens com 1 toque sem necessidade de salvar o número na agenda.
* **Integração com Instagram:** Acesso rápido ao perfil da cliente para visualização de referências estéticas.

---

## 🛠️ Tecnologias Utilizadas

* **Frontend:**
  * [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
  * [Vite](https://vitejs.dev/) (Bundler ultrarrápido)
  * [Tailwind CSS v4](https://tailwindcss.com/)
  * [Lucide Icons](https://lucide.dev/) (Ícones modernos)
* **Backend & Infraestrutura Serverless:**
  * [Cloudflare Workers](https://workers.cloudflare.com/)
  * [Cloudflare D1](https://developers.cloudflare.com/d1/) (SQLite distribuído globalmente)
* **Otimização de Imagens:**
  * HTML5 Canvas API (Redimensionamento proporcional e compressão JPEG client-side)

---

## 🚀 Como Executar o Projeto Localmente

### Pré-requisitos
* [Node.js](https://nodejs.org/) versão 18 ou superior
* Gerenciador de pacotes `npm`

### 1. Clonar o repositório
```bash
git clone https://github.com/SEU-USUARIO/salao-essencial.git
cd salao-essencial
```

### 2. Instalar as dependências
```bash
npm install
```

### 3. Iniciar o servidor de desenvolvimento
```bash
npm run dev
```
Acesse a aplicação no seu navegador em `http://localhost:5173`.

### 4. Compilar para produção
```bash
npm run build
```

---

## ☁️ Deploy no Cloudflare Workers & D1

O projeto já conta com o arquivo de configuração `wrangler.jsonc` pronto para deploy na infraestrutura da Cloudflare.

```bash
# Login na Cloudflare (caso ainda não esteja autenticado)
npx wrangler login

# Publicar aplicação e rotas de API
npx wrangler deploy
```

---

## 📄 Estrutura de Pastas

```
├── public/                 # Favicon, assets estáticos e logotipo oficial
│   └── assets/logo-essencial.png
├── src/
│   ├── components/
│   │   ├── common/         # Header, Sidebar, BottomNav, ClientAvatar, etc.
│   │   ├── modules/        # Telas: Dashboard, Clients, Gallery, Appointment, etc.
│   │   └── ui/             # Modais, Toasts, Diálogos de Confirmação
│   ├── services/           # StorageService (local + nuvem) e Dados Demonstrativos
│   ├── types/              # Tipagens TypeScript (Client, Appointment, etc.)
│   ├── utils/              # imageOptimizer.ts e utilitários auxiliares
│   ├── App.tsx             # Componente raiz e roteamento de abas
│   └── main.tsx            # Ponto de entrada React
├── worker/
│   └── index.ts            # API Serverless no Cloudflare Workers + D1
├── schema.sql              # Estrutura das tabelas SQL no Cloudflare D1
├── package.json            # Dependências e scripts
└── wrangler.jsonc          # Configuração do Cloudflare Workers
```

---

## 📝 Licença
Desenvolvido sob medida para **Salão Essencial**. Todos os direitos reservados.
