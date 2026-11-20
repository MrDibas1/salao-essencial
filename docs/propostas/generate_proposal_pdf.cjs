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
  <title>Proposta Comercial - Salão Essencial</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Playfair+Display:ital,wght@0,600;0,700;1,600&display=swap');

    @page {
      size: A4;
      margin: 12mm 15mm;
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
      font-size: 11pt;
      line-height: 1.5;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }

    .page {
      padding: 10px 0;
      page-break-after: always;
    }

    .page:last-child {
      page-break-after: avoid;
    }

    /* Header */
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 2px solid #EAE4DE;
      padding-bottom: 18px;
      margin-bottom: 22px;
    }

    .logo-container {
      max-width: 220px;
    }

    .logo-img {
      max-height: 52px;
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
      font-size: 8.5pt;
      font-weight: 700;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      padding: 4px 12px;
      border-radius: 20px;
      border: 1px solid rgba(200, 122, 20, 0.25);
      margin-bottom: 6px;
    }

    .meta-text {
      font-size: 8.5pt;
      color: #736B65;
    }

    .meta-text strong {
      color: #1F1D1B;
    }

    /* Titles */
    h1.doc-title {
      font-family: 'Playfair Display', serif;
      font-size: 21pt;
      color: #1F1D1B;
      font-weight: 700;
      margin-bottom: 6px;
      letter-spacing: -0.02em;
    }

    .subtitle {
      font-size: 11pt;
      color: #736B65;
      margin-bottom: 22px;
    }

    /* Client Bar */
    .client-bar {
      display: flex;
      background: #FAF8F6;
      border: 1px solid #EAE4DE;
      border-radius: 12px;
      padding: 14px 18px;
      margin-bottom: 24px;
      justify-content: space-between;
    }

    .client-item {
      display: flex;
      flex-direction: column;
    }

    .client-item span.label {
      font-size: 8pt;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: #8C827A;
      font-weight: 600;
      margin-bottom: 2px;
    }

    .client-item span.value {
      font-size: 10.5pt;
      font-weight: 700;
      color: #1F1D1B;
    }

    /* Section Styling */
    .section-title {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 12.5pt;
      font-weight: 700;
      color: #1F1D1B;
      margin-top: 18px;
      margin-bottom: 12px;
      border-left: 4px solid #C87A14;
      padding-left: 10px;
    }

    p.paragraph {
      font-size: 10pt;
      color: #4A443F;
      margin-bottom: 12px;
      text-align: justify;
    }

    /* Cards Grid */
    .cards-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
      margin-bottom: 20px;
    }

    .card {
      background: #FFFFFF;
      border: 1px solid #EAE4DE;
      border-radius: 10px;
      padding: 14px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.02);
    }

    .card-title {
      font-size: 10.5pt;
      font-weight: 700;
      color: #C87A14;
      margin-bottom: 4px;
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .card-desc {
      font-size: 9pt;
      color: #5C554E;
      line-height: 1.45;
    }

    /* Value Breakdown Table */
    table.pricing-table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 14px;
      margin-bottom: 20px;
      border-radius: 10px;
      overflow: hidden;
      border: 1px solid #EAE4DE;
    }

    table.pricing-table th {
      background-color: #FAF8F6;
      color: #1F1D1B;
      font-weight: 700;
      font-size: 9pt;
      text-transform: uppercase;
      letter-spacing: 0.04em;
      padding: 10px 14px;
      border-bottom: 2px solid #EAE4DE;
      text-align: left;
    }

    table.pricing-table td {
      padding: 10px 14px;
      font-size: 9.5pt;
      border-bottom: 1px solid #EAE4DE;
      color: #4A443F;
    }

    table.pricing-table tr:last-child td {
      border-bottom: none;
    }

    .strike-price {
      text-decoration: line-through;
      color: #9C948D;
      font-size: 8.5pt;
      margin-right: 6px;
    }

    .tag-included {
      background: #E8F4EE;
      color: #2E7D5B;
      font-weight: 700;
      font-size: 8pt;
      padding: 2px 8px;
      border-radius: 12px;
      display: inline-block;
    }

    /* Highlight Offer Box */
    .offer-box {
      background: linear-gradient(135deg, #FAF8F6 0%, #FDF3E7 100%);
      border: 2px solid #C87A14;
      border-radius: 14px;
      padding: 18px 22px;
      margin: 20px 0;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .offer-details h3 {
      font-size: 13pt;
      font-weight: 800;
      color: #1F1D1B;
      margin-bottom: 4px;
    }

    .offer-details p {
      font-size: 9pt;
      color: #5C554E;
    }

    .offer-price {
      text-align: right;
    }

    .offer-price .val-mercado {
      font-size: 9.5pt;
      color: #8C827A;
      text-decoration: line-through;
    }

    .offer-price .price-big {
      font-size: 24pt;
      font-weight: 800;
      color: #C87A14;
      line-height: 1;
      margin: 4px 0;
    }

    .offer-price .conditions {
      font-size: 8.5pt;
      font-weight: 600;
      color: #1F1D1B;
    }

    /* Payment Pillars */
    .payment-options {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
      margin-bottom: 20px;
    }

    .opt-box {
      border: 1px solid #EAE4DE;
      border-radius: 10px;
      padding: 12px 16px;
      background: #FFFFFF;
    }

    .opt-box h4 {
      font-size: 9.5pt;
      font-weight: 700;
      color: #1F1D1B;
      margin-bottom: 4px;
    }

    .opt-box p {
      font-size: 8.5pt;
      color: #5C554E;
    }

    /* Support Alert Box */
    .support-box {
      background: #FDFBF9;
      border-left: 4px solid #2E7D5B;
      padding: 12px 16px;
      border-radius: 0 8px 8px 0;
      margin-bottom: 22px;
    }

    .support-box h4 {
      font-size: 9.5pt;
      font-weight: 700;
      color: #2E7D5B;
      margin-bottom: 4px;
    }

    .support-box p {
      font-size: 8.5pt;
      color: #4A443F;
      line-height: 1.45;
    }

    /* Signature Section */
    .signatures {
      margin-top: 36px;
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 36px;
      page-break-inside: avoid;
    }

    .sig-block {
      text-align: center;
    }

    .sig-line {
      border-top: 1px solid #1F1D1B;
      margin-bottom: 6px;
      width: 80%;
      margin-left: auto;
      margin-right: auto;
    }

    .sig-name {
      font-size: 10pt;
      font-weight: 700;
      color: #1F1D1B;
    }

    .sig-role {
      font-size: 8pt;
      color: #736B65;
    }

    .footer {
      margin-top: 30px;
      padding-top: 10px;
      border-top: 1px solid #EAE4DE;
      display: flex;
      justify-content: space-between;
      font-size: 7.5pt;
      color: #8C827A;
    }
  </style>
</head>
<body>

  <!-- PÁGINA 1 -->
  <div class="page">
    <div class="header">
      <div class="logo-container">
        <img src="${logoDataUri}" alt="Salão Essencial" class="logo-img" />
      </div>
      <div class="header-info">
        <span class="badge-proposal">Proposta Comercial Exclusiva</span>
        <div class="meta-text">Proposta Nº: <strong>#2026-SE01</strong></div>
        <div class="meta-text">Emissão: <strong>19/11/2026</strong> | Validade: <strong>15 dias</strong></div>
      </div>
    </div>

    <h1 class="doc-title">Sistema de Gestão & Fichas Técnicas</h1>
    <p class="subtitle">Aplicativo Exclusivo sob Medida para Gestão de Clientes, Fórmulas e Atendimentos</p>

    <div class="client-bar">
      <div class="client-item">
        <span class="label">Cliente / Estabelecimento</span>
        <span class="value">Salão Essencial (Clarice)</span>
      </div>
      <div class="client-item">
        <span class="label">Plataforma</span>
        <span class="value">App PWA (Celular & Computador)</span>
      </div>
      <div class="client-item">
        <span class="label">Segurança de Dados</span>
        <span class="value">Cloudflare D1 (Nuvem Ativa)</span>
      </div>
      <div class="client-item">
        <span class="label">Status</span>
        <span class="value" style="color: #2E7D5B;">Desenvolvido & Pronto</span>
      </div>
    </div>

    <div class="section-title">1. Diagnóstico Estratégico</div>
    <p class="paragraph">
      Em um salão de beleza especializado, o maior patrimônio profissional é o <strong>conhecimento detalhado das clientes e o histórico das suas fórmulas de coloração e química</strong>. Fichas de papel ou anotações manuais mancham de tinta, rasgam e trazem o risco irreparável de perder todo o histórico do salão caso o aparelho celular quebre, molhe ou seja trocado.
    </p>
    <p class="paragraph">
      Esta solução foi construída cirurgicamente para a rotina da <strong>Clarice</strong>, garantindo acesso instantâneo às fórmulas na cadeira de atendimento e blindagem definitiva de todos os dados em nuvem.
    </p>

    <div class="section-title">2. A Solução Entregue & Diferenciais de Valor</div>

    <div class="cards-grid">
      <div class="card">
        <div class="card-title">📱 Aplicativo PWA com Marca Própria</div>
        <div class="card-desc">
          Instala direto na tela inicial do celular (iPhone e Android) e no computador com a logotipo oficial do Salão Essencial e paleta de cores sofisticada. Sem downloads burocráticos.
        </div>
      </div>

      <div class="card">
        <div class="card-title">🎨 Ficha Técnica de Coloração</div>
        <div class="card-desc">
          Registro exato de marcas, nuances, volumagem e gramatura do oxidante (OX), proporções, tempo de pausa e fotos. Histórico detalhado resgatável em 1 toque antes de cada atendimento.
        </div>
      </div>

      <div class="card">
        <div class="card-title">☁️ Banco de Dados em Nuvem (Cloudflare D1)</div>
        <div class="card-desc">
          Sincronização em tempo real com servidores globais. Se a profissional trocar de aparelho ou o celular estragar, nenhum cliente ou fórmula é perdido.
        </div>
      </div>

      <div class="card">
        <div class="card-title">⚡ Agilidade no Atendimento</div>
        <div class="card-desc">
          Disparo rápido de mensagens para o WhatsApp da cliente sem salvar na agenda e acesso direto ao perfil do Instagram para visualização imediata de referências.
        </div>
      </div>
    </div>

    <div class="support-box">
      <h4>🔒 Segurança Máxima: Garantia contra Quebra de Aparelho</h4>
      <p>
        Diferente de sistemas que salvam dados apenas na memória local do smartphone, o Salão Essencial conta com infraestrutura de nuvem ativa. Os dados estão seguros e sincronizados continuamente.
      </p>
    </div>

    <div class="footer">
      <span>Salão Essencial — Gestão Sob Medida</span>
      <span>Página 1 de 2</span>
    </div>
  </div>

  <!-- PÁGINA 2 -->
  <div class="page">
    <div class="header">
      <div class="logo-container">
        <img src="${logoDataUri}" alt="Salão Essencial" class="logo-img" />
      </div>
      <div class="header-info">
        <div class="meta-text">Proposta Nº: <strong>#2026-SE01</strong></div>
        <div class="meta-text">Cliente: <strong>Clarice (Salão Essencial)</strong></div>
      </div>
    </div>

    <div class="section-title">3. Pacote Completo de Suporte & Nuvem (6 Meses Inclusos)</div>
    <p class="paragraph">
      Para assegurar total tranquilidade à profissional no dia a dia, a entrega inclui um pacote completo de acompanhamento e suporte durante <strong>6 meses</strong>:
    </p>

    <div class="cards-grid">
      <div class="card">
        <div class="card-title">🌐 Hospedagem em Nuvem Inclusa</div>
        <div class="card-desc">Custos de infraestrutura, servidores e banco de dados Cloudflare D1 100% cobertos durante os 6 meses de contrato.</div>
      </div>
      <div class="card">
        <div class="card-title">💬 Suporte Direto via WhatsApp</div>
        <div class="card-desc">Canal de atendimento prioritário para esclarecimento de dúvidas, pequenos ajustes operacionais e suporte contínuo.</div>
      </div>
      <div class="card">
        <div class="card-title">💾 Rotina de Backups de Segurança</div>
        <div class="card-desc">Preservação contínua de cópias de segurança do cadastro de clientes, fórmulas capilares e catálogo de produtos.</div>
      </div>
      <div class="card">
        <div class="card-title">🎓 Treinamento Operacional Inicial</div>
        <div class="card-desc">Orientação passo a passo do fluxo de atendimento, registro de novas cores e instalação rápida no celular.</div>
      </div>
    </div>

    <div class="section-title">4. Demonstração de Valor & Investimento</div>

    <table class="pricing-table">
      <thead>
        <tr>
          <th>Módulo / Entregável</th>
          <th>Detalhamento</th>
          <th style="text-align: right;">Valor Médio de Mercado</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><strong>Desenvolvimento do Aplicativo PWA</strong></td>
          <td>Interface exclusiva, design responsivo, logo oficial e fichas técnicas</td>
          <td style="text-align: right;"><span class="strike-price">R$ 3.800,00</span> <span class="tag-included">INCLUSO</span></td>
        </tr>
        <tr>
          <td><strong>Arquitetura de Nuvem (Cloudflare D1)</strong></td>
          <td>Banco de dados relacional, criptografia e sincronização contínua</td>
          <td style="text-align: right;"><span class="strike-price">R$ 1.200,00</span> <span class="tag-included">INCLUSO</span></td>
        </tr>
        <tr>
          <td><strong>Plano de Nuvem + Suporte (6 Meses)</strong></td>
          <td>Hospedagem garantida, backups e atendimento WhatsApp (6x R$ 150)</td>
          <td style="text-align: right;"><span class="strike-price">R$ 900,00</span> <span class="tag-included">INCLUSO</span></td>
        </tr>
        <tr style="background-color: #FAF8F6;">
          <td colspan="2"><strong>VALOR TOTAL DO PACOTE INTEGRADO</strong></td>
          <td style="text-align: right; font-weight: 700; color: #736B65;"><span class="strike-price">R$ 5.900,00</span></td>
        </tr>
      </tbody>
    </table>

    <!-- Highlight Offer -->
    <div class="offer-box">
      <div class="offer-details">
        <h3>Investimento Especial — Parceria Salão Essencial</h3>
        <p>Aplicativo pronto para uso imediato + 6 meses de suporte e nuvem</p>
      </div>
      <div class="offer-price">
        <div class="val-mercado">De R$ 5.900,00 por</div>
        <div class="price-big">R$ 1.500,00</div>
        <div class="conditions">À vista no Pix ou Parcelado em 3x de R$ 500,00</div>
      </div>
    </div>

    <div class="payment-options">
      <div class="opt-box">
        <h4>Opção 1: À Vista no Pix</h4>
        <p><strong>R$ 1.500,00</strong> na ativação definitiva da conta e configuração do acesso principal.</p>
      </div>
      <div class="opt-box">
        <h4>Opção 2: Parcelamento Facilitado (3x)</h4>
        <p>Entrada de <strong>R$ 500,00</strong> + 2 parcelas mensais de <strong>R$ 500,00</strong> (30 e 60 dias).</p>
      </div>
    </div>

    <div class="support-box" style="margin-top: 10px; border-left-color: #C87A14; background-color: #FAF8F6;">
      <h4 style="color: #C87A14;">Continuidade após os 6 Meses (Opcional & Transparente)</h4>
      <p>
        Para manter os servidores de nuvem ativos, backups diários e canal de suporte após os 6 meses inclusos, a mensalidade será de apenas <strong>R$ 89,00/mês</strong> (sem fidelidade obrigatória).
      </p>
    </div>

    <!-- Signatures -->
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
      <span>Página 2 de 2</span>
    </div>
  </div>

</body>
</html>
`;

const htmlFilePath = path.resolve('proposta_salao_essencial.html');
const pdfWorkspacePath = path.resolve('Proposta-Comercial-Salao-Essencial.pdf');
const pdfArtifactPath = 'C:\\Users\\kaue-\\.gemini\\antigravity\\brain\\d84df441-184b-4677-b6bd-501921e756c7\\Proposta-Comercial-Salao-Essencial.pdf';

fs.writeFileSync(htmlFilePath, htmlContent, 'utf-8');

const args = [
  '--headless',
  '--disable-gpu',
  '--run-all-compositor-stages-before-draw',
  `--print-to-pdf=${pdfWorkspacePath}`,
  '--no-pdf-header-footer',
  htmlFilePath
];

console.log('Gerando PDF com Chrome Headless...');
execFile(chromePath, args, (error) => {
  if (error) {
    console.error('Erro ao gerar PDF:', error);
    process.exit(1);
  }
  
  if (fs.existsSync(pdfWorkspacePath)) {
    fs.copyFileSync(pdfWorkspacePath, pdfArtifactPath);
    console.log('PDF gerado com sucesso!');
    console.log('Tamanho:', fs.statSync(pdfWorkspacePath).size, 'bytes');
  } else {
    console.error('Arquivo PDF não foi encontrado após a execução.');
  }
});
