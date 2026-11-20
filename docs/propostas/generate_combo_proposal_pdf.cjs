const { execFile } = require('child_process');
const fs = require('fs');
const path = require('path');

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const logoPath = path.resolve('public/assets/logo-essencial.png');
const logoBase64 = fs.readFileSync(logoPath).toString('base64');
const logoDataUri = `data:image/png;base64,${logoBase64}`;

const htmlContent = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <title>Proposta Comercial Integrada - Salão Essencial & Loja de Roupas</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Playfair+Display:ital,wght@0,600;0,700;1,600&display=swap');

    @page {
      size: A4 portrait;
      margin: 7mm 11mm;
    }

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    body {
      font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      color: #1F1D1B;
      background-color: #FFFFFF;
      font-size: 8.8pt;
      line-height: 1.3;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }

    .container {
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }

    /* Header */
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 2px solid #EAE4DE;
      padding-bottom: 8px;
      margin-bottom: 9px;
    }

    .logo-container {
      max-width: 175px;
    }

    .logo-img {
      max-height: 40px;
      width: auto;
      object-fit: contain;
    }

    .header-info {
      text-align: right;
    }

    .badge-proposal {
      display: inline-block;
      background-color: #FDF3E7;
      color: #C87A14;
      font-size: 7pt;
      font-weight: 700;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      padding: 2.5px 9px;
      border-radius: 20px;
      border: 1px solid rgba(200, 122, 20, 0.25);
      margin-bottom: 2px;
    }

    .meta-text {
      font-size: 7.8pt;
      color: #736B65;
    }

    .meta-text strong {
      color: #1F1D1B;
    }

    /* Title Block */
    .title-block {
      margin-bottom: 8px;
    }

    h1.doc-title {
      font-family: 'Playfair Display', serif;
      font-size: 15.5pt;
      color: #1F1D1B;
      font-weight: 700;
      margin-bottom: 2px;
      letter-spacing: -0.02em;
    }

    .subtitle {
      font-size: 8.4pt;
      color: #736B65;
    }

    /* Compact Client Info Bar */
    .client-bar {
      display: flex;
      background: #FAF8F6;
      border: 1px solid #EAE4DE;
      border-radius: 7px;
      padding: 6px 12px;
      margin-bottom: 9px;
      justify-content: space-between;
    }

    .client-item span.label {
      font-size: 6.8pt;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: #8C827A;
      font-weight: 600;
      display: block;
    }

    .client-item span.value {
      font-size: 8.4pt;
      font-weight: 700;
      color: #1F1D1B;
    }

    /* Section Title */
    .section-title {
      font-size: 9.8pt;
      font-weight: 700;
      color: #1F1D1B;
      margin-top: 5px;
      margin-bottom: 7px;
      border-left: 3px solid #C87A14;
      padding-left: 7px;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    /* 6 Cards Grid (3 columns x 2 rows) */
    .cards-grid {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
      gap: 7px;
      margin-bottom: 8px;
    }

    .card {
      background: #FFFFFF;
      border: 1px solid #EAE4DE;
      border-radius: 7px;
      padding: 6.5px 8.5px;
    }

    .card-tag {
      font-size: 6.5pt;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin-bottom: 2px;
      display: inline-block;
    }

    .tag-salao {
      color: #C87A14;
    }

    .tag-loja {
      color: #2E7D5B;
    }

    .card-title {
      font-size: 8.2pt;
      font-weight: 700;
      color: #1F1D1B;
      margin-bottom: 2px;
      display: flex;
      align-items: center;
      gap: 3px;
    }

    .card-desc {
      font-size: 7.2pt;
      color: #5C554E;
      line-height: 1.28;
    }

    /* Support Pill Banner */
    .support-banner {
      background: #E8F4EE;
      border: 1px solid rgba(46, 125, 91, 0.25);
      border-radius: 7px;
      padding: 5.5px 10px;
      margin-bottom: 9px;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .support-badge {
      background: #2E7D5B;
      color: #FFFFFF;
      font-size: 6.8pt;
      font-weight: 800;
      padding: 2.5px 7px;
      border-radius: 5px;
      text-transform: uppercase;
      white-space: nowrap;
    }

    .support-text {
      font-size: 7.6pt;
      color: #1B573E;
      line-height: 1.25;
    }

    /* Table: Demonstração de Valor */
    table.pricing-table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 8px;
      border-radius: 7px;
      overflow: hidden;
      border: 1px solid #EAE4DE;
    }

    table.pricing-table th {
      background-color: #FAF8F6;
      color: #1F1D1B;
      font-weight: 700;
      font-size: 7.6pt;
      text-transform: uppercase;
      letter-spacing: 0.04em;
      padding: 5px 9px;
      border-bottom: 1px solid #EAE4DE;
      text-align: left;
    }

    table.pricing-table td {
      padding: 4.5px 9px;
      font-size: 7.8pt;
      border-bottom: 1px solid #EAE4DE;
      color: #4A443F;
    }

    table.pricing-table tr:last-child td {
      border-bottom: none;
    }

    .strike-price {
      text-decoration: line-through;
      color: #9C948D;
      font-size: 7.5pt;
      margin-right: 5px;
    }

    .tag-included {
      background: #E8F4EE;
      color: #2E7D5B;
      font-weight: 700;
      font-size: 7pt;
      padding: 1px 5px;
      border-radius: 8px;
      display: inline-block;
    }

    /* Highlight Offer Box */
    .offer-box {
      background: linear-gradient(135deg, #FAF8F6 0%, #FDF3E7 100%);
      border: 2px solid #C87A14;
      border-radius: 9px;
      padding: 8px 14px;
      margin-bottom: 8px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .offer-details h3 {
      font-size: 10.2pt;
      font-weight: 800;
      color: #1F1D1B;
      margin-bottom: 2px;
    }

    .offer-details p {
      font-size: 7.6pt;
      color: #5C554E;
    }

    .offer-details .tag-discount {
      display: inline-block;
      background: #C87A14;
      color: #FFFFFF;
      font-size: 6.8pt;
      font-weight: 800;
      padding: 1.5px 6px;
      border-radius: 4px;
      margin-top: 3px;
    }

    .offer-price {
      text-align: right;
    }

    .offer-price .val-mercado {
      font-size: 7.8pt;
      color: #8C827A;
      text-decoration: line-through;
    }

    .offer-price .price-big {
      font-size: 19pt;
      font-weight: 800;
      color: #C87A14;
      line-height: 1;
      margin: 1px 0;
    }

    .offer-price .conditions {
      font-size: 7.8pt;
      font-weight: 700;
      color: #1F1D1B;
    }

    /* Payment Methods */
    .payment-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 7px;
      margin-bottom: 8px;
    }

    .pay-card {
      border: 1px solid #EAE4DE;
      border-radius: 7px;
      padding: 6.5px 10px;
      background: #FFFFFF;
    }

    .pay-card h4 {
      font-size: 8pt;
      font-weight: 700;
      color: #1F1D1B;
      margin-bottom: 2px;
    }

    .pay-card p {
      font-size: 7.4pt;
      color: #5C554E;
      line-height: 1.25;
    }

    /* Post-Support & Transparency */
    .post-support {
      font-size: 7.4pt;
      color: #736B65;
      background: #FAF8F6;
      border: 1px dashed #D6CEC7;
      border-radius: 6px;
      padding: 5px 9px;
      margin-bottom: 8px;
      text-align: center;
    }

    /* Signatures */
    .signatures {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 24px;
      margin-top: 6px;
      padding-top: 4px;
    }

    .sig-block {
      text-align: center;
    }

    .sig-line {
      border-top: 1px solid #1F1D1B;
      margin-bottom: 3px;
      width: 75%;
      margin-left: auto;
      margin-right: auto;
    }

    .sig-name {
      font-size: 8pt;
      font-weight: 700;
      color: #1F1D1B;
    }

    .sig-role {
      font-size: 7.2pt;
      color: #736B65;
    }

    .footer {
      margin-top: 6px;
      padding-top: 4px;
      border-top: 1px solid #EAE4DE;
      display: flex;
      justify-content: space-between;
      font-size: 6.8pt;
      color: #8C827A;
    }
  </style>
</head>
<body>

  <div class="container">
    <div>
      <!-- Header -->
      <div class="header">
        <div class="logo-container">
          <img src="${logoDataUri}" alt="Salão Essencial" class="logo-img" />
        </div>
        <div class="header-info">
          <span class="badge-proposal">Orçamento & Resumo Executivo Unificado</span>
          <div class="meta-text">Proposta Nº: <strong>#2026-SE02</strong></div>
          <div class="meta-text">Emissão: <strong>19/11/2026</strong> | Validade: <strong>15 dias</strong></div>
        </div>
      </div>

      <!-- Title -->
      <div class="title-block">
        <h1 class="doc-title">Sistema de Gestão & Presença Local no Google</h1>
        <p class="subtitle">Aplicativo Exclusivo sob Medida (Salão Essencial) + Otimização Estratégica do Google Meu Negócio (Loja de Roupas)</p>
      </div>

      <!-- Client Bar -->
      <div class="client-bar">
        <div class="client-item">
          <span class="label">Cliente</span>
          <span class="value">Salão Essencial & Loja de Roupas (Clarice)</span>
        </div>
        <div class="client-item">
          <span class="label">Soluções</span>
          <span class="value">App PWA + Google Meu Negócio</span>
        </div>
        <div class="client-item">
          <span class="label">Infraestrutura</span>
          <span class="value">Cloudflare D1 + Google Business</span>
        </div>
        <div class="client-item">
          <span class="label">Status</span>
          <span class="value" style="color: #2E7D5B;">Pronto para Ativação</span>
        </div>
      </div>

      <!-- Entregáveis Essenciais em Grid 3x2 -->
      <div class="section-title">
        <span>1. Entregáveis & Diferenciais de Valor por Negócio</span>
        <span style="font-size: 7.2pt; font-weight: normal; color: #736B65;">Pacote Combo Integrado de Alto Impacto</span>
      </div>

      <div class="cards-grid">
        <!-- Card 1 (Salão) -->
        <div class="card">
          <span class="card-tag tag-salao">Salão Essencial</span>
          <div class="card-title">📱 App Marca Própria</div>
          <div class="card-desc">Instalação direta no celular/PC com ícone oficial e identidade visual do salão. Acesso instantâneo sem depender de app stores.</div>
        </div>

        <!-- Card 2 (Salão) -->
        <div class="card">
          <span class="card-tag tag-salao">Salão Essencial</span>
          <div class="card-title">🎨 Ficha de Coloração</div>
          <div class="card-desc">Controle milimétrico de nuances, marcas, proporções de tintura, gramas e volumes de OX. Histórico da cliente em 1 clique.</div>
        </div>

        <!-- Card 3 (Salão) -->
        <div class="card">
          <span class="card-tag tag-salao">Salão Essencial</span>
          <div class="card-title">☁️ Nuvem & WhatsApp</div>
          <div class="card-desc">Dados salvos em nuvem blindada (Cloudflare) com disparo ágil para WhatsApp sem precisar salvar o contato da cliente na agenda.</div>
        </div>

        <!-- Card 4 (Loja de Roupas) -->
        <div class="card">
          <span class="card-tag tag-loja">Loja de Roupas</span>
          <div class="card-title">📍 Perfil Oficial Google</div>
          <div class="card-desc">Configuração, verificação e otimização completa da ficha da loja no Google Maps e na Pesquisa Local (Google Meu Negócio).</div>
        </div>

        <!-- Card 5 (Loja de Roupas) -->
        <div class="card">
          <span class="card-tag tag-loja">Loja de Roupas</span>
          <div class="card-title">👗 Vitrine & SEO Local</div>
          <div class="card-desc">Categorização assertiva de moda, SEO para busca "loja de roupas perto de mim", cadastro de coleções, fotos em alta resolução e botões de contato.</div>
        </div>

        <!-- Card 6 (Loja de Roupas) -->
        <div class="card">
          <span class="card-tag tag-loja">Loja de Roupas</span>
          <div class="card-title">⭐ Reputação & Clientes</div>
          <div class="card-desc">Estratégia e link direto para captação de avaliações 5 estrelas, gerando autoridade local e direcionando clientes para a loja física e WhatsApp.</div>
        </div>
      </div>

      <!-- Suporte Integrado Banner -->
      <div class="support-banner">
        <span class="support-badge">6 Meses Inclusos</span>
        <span class="support-text">
          <strong>Acompanhamento Integrado:</strong> Hospedagem em nuvem garantida do App, rotinas automáticas de backup, suporte prioritário via WhatsApp, treinamento da equipe e validação pós-publicação do perfil no Google.
        </span>
      </div>

      <!-- Tabela Demonstração de Valor -->
      <div class="section-title">
        <span>2. Demonstração de Valor & Investimento Integrado</span>
      </div>

      <table class="pricing-table">
        <thead>
          <tr>
            <th>Módulo / Serviço</th>
            <th>Detalhamento do Escopo</th>
            <th style="text-align: right;">Valor de Mercado</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>Desenvolvimento do Aplicativo PWA (Salão)</strong></td>
            <td>Personalização exclusiva, logo oficial, fichas técnicas, catálogo e telas responsivas</td>
            <td style="text-align: right;"><span class="strike-price">R$ 3.800,00</span> <span class="tag-included">INCLUSO</span></td>
          </tr>
          <tr>
            <td><strong>Arquitetura de Nuvem (Cloudflare D1)</strong></td>
            <td>Banco de dados relacional criptografado com sincronização contínua e segura</td>
            <td style="text-align: right;"><span class="strike-price">R$ 1.200,00</span> <span class="tag-included">INCLUSO</span></td>
          </tr>
          <tr>
            <td><strong>Plano de Nuvem + Suporte Técnico (6 Meses)</strong></td>
            <td>Servidores cobertos, backups diários e canal de suporte direto via WhatsApp (6x R$ 150)</td>
            <td style="text-align: right;"><span class="strike-price">R$ 900,00</span> <span class="tag-included">INCLUSO</span></td>
          </tr>
          <tr>
            <td><strong>Otimização Google Meu Negócio (Loja de Roupas)</strong></td>
            <td>Setup completo, SEO local, fotos estratégicas, vitrine de produtos e integração WhatsApp</td>
            <td style="text-align: right;"><span class="strike-price">R$ 1.100,00</span> <span class="tag-included">INCLUSO</span></td>
          </tr>
          <tr style="background-color: #FAF8F6;">
            <td colspan="2"><strong>VALOR TOTAL INTEGRADO DE MERCADO</strong></td>
            <td style="text-align: right; font-weight: 700; color: #736B65;"><span class="strike-price">R$ 7.000,00</span></td>
          </tr>
        </tbody>
      </table>

      <!-- Offer Box Especial Combo -->
      <div class="offer-box">
        <div class="offer-details">
          <h3>Investimento Especial — Combo Salão Essencial + Loja de Roupas</h3>
          <p>Aplicativo PWA completo + 6 meses de nuvem/suporte + Otimização Google Meu Negócio</p>
          <span class="tag-discount">Economia de mais de 72% na contratação integrada</span>
        </div>
        <div class="offer-price">
          <div class="val-mercado">De R$ 7.000,00 por</div>
          <div class="price-big">R$ 1.950,00</div>
          <div class="conditions">À vista no Pix ou 3x de R$ 650,00 sem juros</div>
        </div>
      </div>

      <!-- Formas de Pagamento -->
      <div class="payment-grid">
        <div class="pay-card">
          <h4>Opção 1: À Vista no Pix (Super Desconto)</h4>
          <p><strong>R$ 1.850,00</strong> na ativação (com R$ 100 de desconto pontualidade à vista) ou <strong>R$ 1.950,00</strong> padrão.</p>
        </div>
        <div class="pay-card">
          <h4>Opção 2: Parcelamento Facilitado (3x Sem Juros)</h4>
          <p>Entrada de <strong>R$ 650,00</strong> + 2 parcelas mensais de <strong>R$ 650,00</strong> (30 e 60 dias).</p>
        </div>
      </div>

      <!-- Transparência de Valores Individuais & Pós 6 Meses -->
      <div class="post-support">
        💡 <strong>Flexibilidade & Transparência:</strong> Valores individuais avulsos — Sistema Salão: R$ 1.500,00 | Google Loja de Roupas: R$ 650,00. No combo unificado, o Google sai por <strong>apenas R$ 450,00</strong>. Manutenção opcional pós 6 meses do app: apenas R$ 89,00/mês.
      </div>
    </div>

    <!-- Assinaturas e Rodapé -->
    <div>
      <div class="signatures">
        <div class="sig-block">
          <div class="sig-line"></div>
          <div class="sig-name">Salão Essencial & Loja de Roupas</div>
          <div class="sig-role">Clarice — Aceite da Proposta Integrada</div>
        </div>
        <div class="sig-block">
          <div class="sig-line"></div>
          <div class="sig-name">Responsável pelo Projeto</div>
          <div class="sig-role">Desenvolvimento, Otimização & Suporte</div>
        </div>
      </div>

      <div class="footer">
        <span>Salão Essencial & Loja de Roupas — Soluções Digitais Sob Medida</span>
        <span>Documento de Proposta Comercial Resumida — Página 1 de 1</span>
      </div>
    </div>
  </div>

</body>
</html>
`;

const htmlFilePath = path.resolve('proposta_integrada_salao_e_loja.html');
const pdfWorkspacePath = path.resolve('Proposta-Comercial-Integrada-Salao-e-Loja.pdf');
const appDataDir = 'C:\\Users\\kaue-\\.gemini\\antigravity\\brain\\d68596ff-18ba-4261-87e3-a99e0bb9aed7';
const pdfArtifactPath = path.join(appDataDir, 'Proposta-Comercial-Integrada-Salao-e-Loja.pdf');

fs.writeFileSync(htmlFilePath, htmlContent, 'utf-8');

const args = [
  '--headless',
  '--disable-gpu',
  '--run-all-compositor-stages-before-draw',
  `--print-to-pdf=${pdfWorkspacePath}`,
  '--no-pdf-header-footer',
  htmlFilePath
];

console.log('Gerando PDF Integrado com Chrome Headless...');
execFile(chromePath, args, (error) => {
  if (error) {
    console.error('Erro ao gerar PDF Integrado:', error);
    process.exit(1);
  }
  
  if (fs.existsSync(pdfWorkspacePath)) {
    if (fs.existsSync(appDataDir)) {
      fs.copyFileSync(pdfWorkspacePath, pdfArtifactPath);
    }
    console.log('PDF Integrado gerado com sucesso!');
    console.log('Tamanho:', fs.statSync(pdfWorkspacePath).size, 'bytes');
  } else {
    console.error('Arquivo PDF Integrado não foi encontrado após a execução.');
  }
});
