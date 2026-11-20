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
  <title>Proposta Comercial Enxuta - Salão Essencial</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Playfair+Display:ital,wght@0,600;0,700;1,600&display=swap');

    @page {
      size: A4 portrait;
      margin: 8mm 12mm;
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
      font-size: 9.5pt;
      line-height: 1.35;
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
      padding-bottom: 10px;
      margin-bottom: 12px;
    }

    .logo-container {
      max-width: 180px;
    }

    .logo-img {
      max-height: 44px;
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
      font-size: 7.5pt;
      font-weight: 700;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      padding: 3px 10px;
      border-radius: 20px;
      border: 1px solid rgba(200, 122, 20, 0.25);
      margin-bottom: 3px;
    }

    .meta-text {
      font-size: 8pt;
      color: #736B65;
    }

    .meta-text strong {
      color: #1F1D1B;
    }

    /* Title Block */
    .title-block {
      margin-bottom: 10px;
    }

    h1.doc-title {
      font-family: 'Playfair Display', serif;
      font-size: 17pt;
      color: #1F1D1B;
      font-weight: 700;
      margin-bottom: 2px;
      letter-spacing: -0.02em;
    }

    .subtitle {
      font-size: 9pt;
      color: #736B65;
    }

    /* Compact Client Info Bar */
    .client-bar {
      display: flex;
      background: #FAF8F6;
      border: 1px solid #EAE4DE;
      border-radius: 8px;
      padding: 8px 14px;
      margin-bottom: 12px;
      justify-content: space-between;
    }

    .client-item span.label {
      font-size: 7pt;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: #8C827A;
      font-weight: 600;
      display: block;
    }

    .client-item span.value {
      font-size: 9pt;
      font-weight: 700;
      color: #1F1D1B;
    }

    /* Section Title */
    .section-title {
      font-size: 10.5pt;
      font-weight: 700;
      color: #1F1D1B;
      margin-top: 6px;
      margin-bottom: 8px;
      border-left: 3px solid #C87A14;
      padding-left: 8px;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    /* 4 Essential Deliverables */
    .cards-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 8px;
      margin-bottom: 10px;
    }

    .card {
      background: #FFFFFF;
      border: 1px solid #EAE4DE;
      border-radius: 8px;
      padding: 8px 10px;
    }

    .card-title {
      font-size: 9pt;
      font-weight: 700;
      color: #C87A14;
      margin-bottom: 2px;
    }

    .card-desc {
      font-size: 7.8pt;
      color: #5C554E;
      line-height: 1.35;
    }

    /* Support Pill Banner */
    .support-banner {
      background: #E8F4EE;
      border: 1px solid rgba(46, 125, 91, 0.25);
      border-radius: 8px;
      padding: 7px 12px;
      margin-bottom: 12px;
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .support-badge {
      background: #2E7D5B;
      color: #FFFFFF;
      font-size: 7pt;
      font-weight: 800;
      padding: 3px 8px;
      border-radius: 6px;
      text-transform: uppercase;
      white-space: nowrap;
    }

    .support-text {
      font-size: 8pt;
      color: #1B573E;
      line-height: 1.3;
    }

    /* Table: Demonstração de Valor */
    table.pricing-table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 10px;
      border-radius: 8px;
      overflow: hidden;
      border: 1px solid #EAE4DE;
    }

    table.pricing-table th {
      background-color: #FAF8F6;
      color: #1F1D1B;
      font-weight: 700;
      font-size: 8pt;
      text-transform: uppercase;
      letter-spacing: 0.04em;
      padding: 6px 10px;
      border-bottom: 1px solid #EAE4DE;
      text-align: left;
    }

    table.pricing-table td {
      padding: 6px 10px;
      font-size: 8.5pt;
      border-bottom: 1px solid #EAE4DE;
      color: #4A443F;
    }

    table.pricing-table tr:last-child td {
      border-bottom: none;
    }

    .strike-price {
      text-decoration: line-through;
      color: #9C948D;
      font-size: 8pt;
      margin-right: 6px;
    }

    .tag-included {
      background: #E8F4EE;
      color: #2E7D5B;
      font-weight: 700;
      font-size: 7.5pt;
      padding: 1px 6px;
      border-radius: 10px;
      display: inline-block;
    }

    /* Highlight Offer Box */
    .offer-box {
      background: linear-gradient(135deg, #FAF8F6 0%, #FDF3E7 100%);
      border: 2px solid #C87A14;
      border-radius: 10px;
      padding: 10px 16px;
      margin-bottom: 10px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .offer-details h3 {
      font-size: 11pt;
      font-weight: 800;
      color: #1F1D1B;
      margin-bottom: 2px;
    }

    .offer-details p {
      font-size: 8pt;
      color: #5C554E;
    }

    .offer-price {
      text-align: right;
    }

    .offer-price .val-mercado {
      font-size: 8pt;
      color: #8C827A;
      text-decoration: line-through;
    }

    .offer-price .price-big {
      font-size: 21pt;
      font-weight: 800;
      color: #C87A14;
      line-height: 1;
      margin: 2px 0;
    }

    .offer-price .conditions {
      font-size: 8pt;
      font-weight: 700;
      color: #1F1D1B;
    }

    /* Payment Methods */
    .payment-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 8px;
      margin-bottom: 10px;
    }

    .pay-card {
      border: 1px solid #EAE4DE;
      border-radius: 8px;
      padding: 8px 12px;
      background: #FFFFFF;
    }

    .pay-card h4 {
      font-size: 8.5pt;
      font-weight: 700;
      color: #1F1D1B;
      margin-bottom: 2px;
    }

    .pay-card p {
      font-size: 7.8pt;
      color: #5C554E;
    }

    /* Post-6 Months Transparency */
    .post-support {
      font-size: 7.8pt;
      color: #736B65;
      background: #FAF8F6;
      border: 1px dashed #D6CEC7;
      border-radius: 6px;
      padding: 6px 10px;
      margin-bottom: 12px;
      text-align: center;
    }

    /* Signatures */
    .signatures {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 28px;
      margin-top: 10px;
      padding-top: 6px;
    }

    .sig-block {
      text-align: center;
    }

    .sig-line {
      border-top: 1px solid #1F1D1B;
      margin-bottom: 4px;
      width: 75%;
      margin-left: auto;
      margin-right: auto;
    }

    .sig-name {
      font-size: 8.5pt;
      font-weight: 700;
      color: #1F1D1B;
    }

    .sig-role {
      font-size: 7.5pt;
      color: #736B65;
    }

    .footer {
      margin-top: 8px;
      padding-top: 6px;
      border-top: 1px solid #EAE4DE;
      display: flex;
      justify-content: space-between;
      font-size: 7pt;
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
          <span class="badge-proposal">Orçamento & Resumo Executivo</span>
          <div class="meta-text">Proposta Nº: <strong>#2026-SE01</strong></div>
          <div class="meta-text">Emissão: <strong>19/11/2026</strong> | Validade: <strong>15 dias</strong></div>
        </div>
      </div>

      <!-- Title -->
      <div class="title-block">
        <h1 class="doc-title">Sistema de Gestão & Fichas Técnicas</h1>
        <p class="subtitle">Aplicativo Exclusivo sob Medida para Gestão de Clientes, Fórmulas e Atendimentos</p>
      </div>

      <!-- Client Bar -->
      <div class="client-bar">
        <div class="client-item">
          <span class="label">Cliente</span>
          <span class="value">Salão Essencial (Clarice)</span>
        </div>
        <div class="client-item">
          <span class="label">Plataforma</span>
          <span class="value">App PWA (Celular & PC)</span>
        </div>
        <div class="client-item">
          <span class="label">Armazenamento</span>
          <span class="value">Cloudflare D1 (Nuvem Ativa)</span>
        </div>
        <div class="client-item">
          <span class="label">Status</span>
          <span class="value" style="color: #2E7D5B;">Pronto para Ativação</span>
        </div>
      </div>

      <!-- Entregáveis Essenciais -->
      <div class="section-title">
        <span>1. Entregáveis & Diferenciais de Valor</span>
        <span style="font-size: 7.5pt; font-weight: normal; color: #736B65;">Desenvolvimento 100% sob medida</span>
      </div>

      <div class="cards-grid">
        <div class="card">
          <div class="card-title">📱 App Exclusivo com Marca Própria</div>
          <div class="card-desc">Instala na tela do celular e PC com a logotipo oficial e identidade visual do Salão Essencial. Sem downloads em lojas.</div>
        </div>

        <div class="card">
          <div class="card-title">🎨 Ficha Técnica de Coloração</div>
          <div class="card-desc">Registro exato de nuances, proporções, gramas de tinta, volumagem de OX e tempo de pausa. Histórico em 1 toque.</div>
        </div>

        <div class="card">
          <div class="card-title">☁️ Nuvem Blindada (Cloudflare D1)</div>
          <div class="card-desc">Proteção definitiva: se o celular estragar ou for trocado, nenhum dado de cliente ou fórmula de tintura é perdido.</div>
        </div>

        <div class="card">
          <div class="card-title">⚡ Agilidade no Atendimento</div>
          <div class="card-desc">Disparo rápido no WhatsApp sem salvar número e atalho direto para o perfil do Instagram para fotos de referência.</div>
        </div>
      </div>

      <!-- Suporte 6 Meses -->
      <div class="support-banner">
        <span class="support-badge">6 Meses Inclusos</span>
        <span class="support-text">
          <strong>Pacote Completo de Acompanhamento:</strong> Hospedagem em nuvem garantida, rotina de backups de segurança, canal de suporte prioritário via WhatsApp e treinamento inicial para uso imediato.
        </span>
      </div>

      <!-- Tabela Demonstração de Valor -->
      <div class="section-title">
        <span>2. Demonstração de Valor & Investimento</span>
      </div>

      <table class="pricing-table">
        <thead>
          <tr>
            <th>Módulo / Serviço</th>
            <th>Detalhamento</th>
            <th style="text-align: right;">Valor de Mercado</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>Desenvolvimento do Aplicativo PWA</strong></td>
            <td>Personalização exclusiva, logo oficial, telas responsivas e catálogo</td>
            <td style="text-align: right;"><span class="strike-price">R$ 3.800,00</span> <span class="tag-included">INCLUSO</span></td>
          </tr>
          <tr>
            <td><strong>Arquitetura de Nuvem (Cloudflare D1)</strong></td>
            <td>Banco de dados relacional criptografado com sincronização contínua</td>
            <td style="text-align: right;"><span class="strike-price">R$ 1.200,00</span> <span class="tag-included">INCLUSO</span></td>
          </tr>
          <tr>
            <td><strong>Plano de Nuvem + Suporte (6 Meses)</strong></td>
            <td>Servidores cobertos, backups e suporte direto via WhatsApp (6x R$ 150)</td>
            <td style="text-align: right;"><span class="strike-price">R$ 900,00</span> <span class="tag-included">INCLUSO</span></td>
          </tr>
          <tr style="background-color: #FAF8F6;">
            <td colspan="2"><strong>VALOR TOTAL INTEGRADO DE MERCADO</strong></td>
            <td style="text-align: right; font-weight: 700; color: #736B65;"><span class="strike-price">R$ 5.900,00</span></td>
          </tr>
        </tbody>
      </table>

      <!-- Offer Box -->
      <div class="offer-box">
        <div class="offer-details">
          <h3>Investimento Especial — Parceria Salão Essencial</h3>
          <p>Aplicativo pronto para uso imediato + 6 meses completos de suporte e nuvem</p>
        </div>
        <div class="offer-price">
          <div class="val-mercado">De R$ 5.900,00 por</div>
          <div class="price-big">R$ 1.500,00</div>
          <div class="conditions">À vista no Pix ou 3x de R$ 500,00 sem juros</div>
        </div>
      </div>

      <!-- Formas de Pagamento -->
      <div class="payment-grid">
        <div class="pay-card">
          <h4>Opção 1: À Vista no Pix</h4>
          <p><strong>R$ 1.500,00</strong> na ativação e liberação do acesso principal da profissional.</p>
        </div>
        <div class="pay-card">
          <h4>Opção 2: Parcelamento Facilitado (3x)</h4>
          <p>Entrada de <strong>R$ 500,00</strong> + 2 parcelas mensais de <strong>R$ 500,00</strong> (30 e 60 dias).</p>
        </div>
      </div>

      <!-- Transparência Pós 6 Meses -->
      <div class="post-support">
        💡 <strong>Continuidade após os 6 meses (Opcional):</strong> Apenas <strong>R$ 89,00/mês</strong> para manutenção de servidores em nuvem e suporte contínuo (sem fidelidade ou multa rescisória).
      </div>
    </div>

    <!-- Assinaturas e Rodapé -->
    <div>
      <div class="signatures">
        <div class="sig-block">
          <div class="sig-line"></div>
          <div class="sig-name">Salão Essencial</div>
          <div class="sig-role">Clarice — Aceite da Proposta</div>
        </div>
        <div class="sig-block">
          <div class="sig-line"></div>
          <div class="sig-name">Responsável pelo Projeto</div>
          <div class="sig-role">Desenvolvimento & Suporte Técnico</div>
        </div>
      </div>

      <div class="footer">
        <span>Salão Essencial — Sistema de Gestão Sob Medida</span>
        <span>Documento de Proposta Comercial Resumida — Página 1 de 1</span>
      </div>
    </div>
  </div>

</body>
</html>
`;

const htmlFilePath = path.resolve('proposta_enxuta_salao_essencial.html');
const pdfWorkspacePath = path.resolve('Proposta-Comercial-Resumida-Salao-Essencial.pdf');
const pdfArtifactPath = 'C:\\Users\\kaue-\\.gemini\\antigravity\\brain\\d84df441-184b-4677-b6bd-501921e756c7\\Proposta-Comercial-Resumida-Salao-Essencial.pdf';

fs.writeFileSync(htmlFilePath, htmlContent, 'utf-8');

const args = [
  '--headless',
  '--disable-gpu',
  '--run-all-compositor-stages-before-draw',
  `--print-to-pdf=${pdfWorkspacePath}`,
  '--no-pdf-header-footer',
  htmlFilePath
];

console.log('Gerando PDF Enxuto com Chrome Headless...');
execFile(chromePath, args, (error) => {
  if (error) {
    console.error('Erro ao gerar PDF Enxuto:', error);
    process.exit(1);
  }
  
  if (fs.existsSync(pdfWorkspacePath)) {
    fs.copyFileSync(pdfWorkspacePath, pdfArtifactPath);
    console.log('PDF Enxuto gerado com sucesso!');
    console.log('Tamanho:', fs.statSync(pdfWorkspacePath).size, 'bytes');
  } else {
    console.error('Arquivo PDF Enxuto não foi encontrado após a execução.');
  }
});
