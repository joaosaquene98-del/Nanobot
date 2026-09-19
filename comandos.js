const fs = require('fs');
const { downloadMediaMessage } = require('@whiskeysockets/baileys');

// ====== CONFIG ======
const pathNano               = './config/nanoativar.json';
const pathGatilhos           = './config/gatilhos.json';
const pathAnticoncorrencia   = './config/anticoncorrencia.json';
const pathConcorrentes       = './config/concorrentes.json';
const pathBemvindo           = './config/bemvindo.json';
const pathPersonalizar       = './config/personalizar.json';
const pathSistema            = './config/sistema.json';
const pathCompras            = './config/compras.json';
const pathAntilink           = './config/antilink.json';
const pathAntifoto           = './config/antifoto.json';
const pathDetector           = './config/detector.json';

// ====== DATA ======
const pathContas             = './data/contas.json';
const pathAntivideo          = './data/antivideo.json';
const pathAntiaudio          = './data/antiaudio.json';
const pathAntistatus         = './data/antistatus.json';
const pathAutorizacao        = './data/autorizacao.json';
const pathDias               = './data/dias.json';
const pathdadoscompras = './data/dadoscompras.json';
const pathAlarmes = "./data/alarmes.json";

// Garante que as pastas existam
if (!fs.existsSync('./config')) fs.mkdirSync('./config', { recursive: true });
if (!fs.existsSync('./data')) fs.mkdirSync('./data', { recursive: true });

// Função para verificar mudanças de dias 
function verificarMudancaDeDia(compras) {
  const hoje = new Date().toISOString().slice(0, 10);

  if (!compras._dataAtual) {
    compras._dataAtual = hoje;
    return;
  }

  if (compras._dataAtual !== hoje) {
    for (const grupo in compras) {
      if (grupo === '_dataAtual') continue;

      for (const user in compras[grupo]) {
        compras[grupo][user].Megashoje = 0;
        compras[grupo][user].Saldohoje = 0;
      }
    }

    compras._dataAtual = hoje;
  }
}

// Função para carregar  alarmes
function carregarAlarmes() {
  if (!fs.existsSync(pathAlarmes)) {
    fs.writeFileSync(pathAlarmes, JSON.stringify({}, null, 2));
  }
  return JSON.parse(fs.readFileSync(pathAlarmes));
}

function salvarAlarmes(dados) {
  fs.writeFileSync(pathAlarmes, JSON.stringify(dados, null, 2));
}

// Função para carregar dias
function carregarDias() {
  if (!fs.existsSync(pathDias)) {
    fs.writeFileSync(pathDias, JSON.stringify({}, null, 2));
  }
  return JSON.parse(fs.readFileSync(pathDias));
}

function salvarDias(data) {
  fs.writeFileSync(pathDias, JSON.stringify(data, null, 2));
}

// Função para carregar autorizações
function carregarAutorizacoes() {
  if (!fs.existsSync(pathAutorizacao)) {
    fs.writeFileSync(pathAutorizacao, JSON.stringify({}, null, 2));
  }
  return JSON.parse(fs.readFileSync(pathAutorizacao));
}

// Função para salvar autorizações
function salvarAutorizacoes(data) {
  fs.writeFileSync(pathAutorizacao, JSON.stringify(data, null, 2));
}

// Função para carregar antistatus
function carregarAntistatus() {
  if (!fs.existsSync(pathAntistatus)) {
    fs.writeFileSync(pathAntistatus, JSON.stringify({}, null, 2));
  }
  return JSON.parse(fs.readFileSync(pathAntistatus));
}

function salvarAntistatus(data) {
  fs.writeFileSync(pathAntistatus, JSON.stringify(data, null, 2));
}

// Função para carregar antiaudio
function carregarAntiaudio() {
  if (!fs.existsSync(pathAntiaudio)) {
    fs.writeFileSync(pathAntiaudio, JSON.stringify({}, null, 2));
  }
  return JSON.parse(fs.readFileSync(pathAntiaudio));
}

function salvarAntiaudio(data) {
  fs.writeFileSync(pathAntiaudio, JSON.stringify(data, null, 2));
}

// Função para carregar antivideo
function carregarAntivideo() {
  if (!fs.existsSync(pathAntivideo)) {
    if (!fs.existsSync('./data')) {
      fs.mkdirSync('./data', { recursive: true });
    }
    fs.writeFileSync(pathAntivideo, JSON.stringify({}, null, 2));
  }

  return JSON.parse(fs.readFileSync(pathAntivideo, 'utf-8'));
}

// Função para salvar antivideo
function salvarAntivideo(data) {
  if (!fs.existsSync('./data')) {
    fs.mkdirSync('./data', { recursive: true });
  }

  fs.writeFileSync(pathAntivideo, JSON.stringify(data, null, 2));
}

// Função para carregar contas
function carregarContas() {
  try {
    if (!fs.existsSync(pathContas)) return {};
    return JSON.parse(fs.readFileSync(pathContas, 'utf-8'));
  } catch {
    return {};
  }
}

// Função para salvar contas
function salvarContas(dados) {
  if (!fs.existsSync('./data')) {
    fs.mkdirSync('./data', { recursive: true });
  }

  fs.writeFileSync(pathContas, JSON.stringify(dados, null, 2));
}

// Função para carregar sistema antifoto
function carregarAntifoto() {
  try {
    if (!fs.existsSync(pathAntifoto)) return {};
    return JSON.parse(fs.readFileSync(pathAntifoto, 'utf-8'));
  } catch {
    return {};
  }
}

function salvarAntifoto(data) {
  fs.writeFileSync(pathAntifoto, JSON.stringify(data, null, 2));
}
  
// Carrega o estado do nanoativar por grupo
 
function carregarNano() {
  try {
    if (!fs.existsSync(pathNano)) return {};
    return JSON.parse(fs.readFileSync(pathNano, 'utf-8'));
  } catch (err) {
    console.error('Erro ao carregar nanoativar.json:', err);
    return {};
  }
}


// Salva o estado do nanoativar por grupo

function salvarNano(data) {
  try {
    const dir = pathNano.split('/').slice(0, -1).join('/');
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(pathNano, JSON.stringify(data, null, 2));
  } catch (err) {
    console.error('Erro ao salvar nanoativar.json:', err);
  }
}

// Carrega os gatilhos do grupo
 
function carregarGatilhos() {
  try {
    if (!fs.existsSync(pathGatilhos)) return {};
    return JSON.parse(fs.readFileSync(pathGatilhos, 'utf-8'));
  } catch (err) {
    console.error('Erro ao carregar gatilhos.json:', err);
    return {};
  }
}

// Salva os gatilhos do grupo

function salvarGatilhos(data) {
  try {
    const dir = pathGatilhos.split('/').slice(0, -1).join('/');
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(pathGatilhos, JSON.stringify(data, null, 2));
  } catch (err) {
    console.error('Erro ao salvar gatilhos.json:', err);
  }
}


// Carrega o estado do filtro anticoncorrencia por grupo
 
function carregarAnticoncorrencia() {
  try {
    if (!fs.existsSync(pathAnticoncorrencia)) return {};
    return JSON.parse(fs.readFileSync(pathAnticoncorrencia, 'utf-8'));
  } catch (err) {
    console.error('Erro ao carregar anticoncorrencia.json:', err);
    return {};
  }
}


 // Salva o estado do filtro anticoncorrencia por grupo
 
function salvarAnticoncorrencia(data) {
  try {
    const dir = pathAnticoncorrencia.split('/').slice(0, -1).join('/');
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(pathAnticoncorrencia, JSON.stringify(data, null, 2));
  } catch (err) {
    console.error('Erro ao salvar anticoncorrencia.json:', err);
  }
}


// Carrega concorrentes do grupo
 
function carregarConcorrentes() {
  try {
    if (!fs.existsSync(pathConcorrentes)) return {};
    return JSON.parse(fs.readFileSync(pathConcorrentes, 'utf-8'));
  } catch (err) {
    console.error('Erro ao carregar concorrentes.json:', err);
    return {};
  }
}


// Salva concorrentes do grupo
 
function salvarConcorrentes(data) {
  try {
    const dir = pathConcorrentes.split('/').slice(0, -1).join('/');
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(pathConcorrentes, JSON.stringify(data, null, 2));
  } catch (err) {
    console.error('Erro ao salvar concorrentes.json:', err);
  }
}

// Função para carregar sistema de compras 
function carregarSistema() {
  if (!fs.existsSync(pathSistema)) {
    fs.writeFileSync(pathSistema, JSON.stringify({}, null, 2));
  }
  return JSON.parse(fs.readFileSync(pathSistema, "utf-8"));
}

function salvarSistema(data) {
  fs.writeFileSync(pathSistema, JSON.stringify(data, null, 2));
}

function lerStatus(path, groupId) {
  try {
    if (!fs.existsSync(path)) return false;
    const data = JSON.parse(fs.readFileSync(path, 'utf-8'));
    return data[groupId] === true || data[groupId] === 'on';
  } catch {
    return false;
  }
}

// Função que processa comandos do bot

async function handleCommand(sock, data, command) {
  const cmd = command.trim();
  const nano = carregarNano();
  const gatilhos = carregarGatilhos();
  const anticoncorrencia = carregarAnticoncorrencia();
  const concorrentes = carregarConcorrentes();
  const from = data.from;
  const sender = data.sender;
  const msg = data.msg;

  const nanoStatus = nano[from] === 'on';
  const anticoncorrenciaStatus = anticoncorrencia[from] === 'on';


  switch (true) {
// COMANDO: .ping
case cmd.toLowerCase() === 'ping': {
  await sock.sendMessage(from, {
    react: {
      text: '🍆',
      key: msg.key
    }
  });
  break;
}

// COMANDO: .sabes
case cmd.toLowerCase() === 'sabes': {
  try {
    const isGroup = from.endsWith('@g.us');
    if (!isGroup) {
      await sock.sendMessage(from, {
        text: '❌ Este comando funciona apenas em grupos.',
        mentions: [sender],
        contextInfo: { stanzaId: msg.key.id, participant: sender, quotedMessage: msg.message }
      });
      break;
    }

    const metadata = await sock.groupMetadata(from);
    const admins = metadata.participants
      .filter(p => p.admin === "admin" || p.admin === "superadmin")
      .map(p => p.id);

    const senderLid = (msg.key.participant || msg.key.remoteJid);
    if (!admins.includes(senderLid)) {
      await sock.sendMessage(from, {
        text: '❌ Apenas administradores podem usar este comando!',
        mentions: [sender],
        contextInfo: { stanzaId: msg.key.id, participant: sender, quotedMessage: msg.message }
      });
      break;
    }

    const mensagens = [
      '💌 Eu...',
      '❤️ Sei...',
      '😳 Que...',
      '🥰 Tu...',
      '😘 Amas...',
      '🦧 A..',
      '💗 Fátima lucas 💕',
      '💍'
    ];


    let sentMsg = await sock.sendMessage(from, { text: mensagens[0] });

    for (let i = 1; i < mensagens.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 1500));
      await sock.sendMessage(from, { 
        text: mensagens[i], 
        edit: {
          remoteJid: from,
          id: sentMsg.key.id,
          participant: sentMsg.key.participant
        }
      });
    }

} catch (err) {
  console.error('Erro no comando .sabes:', err);
  await sock.sendMessage(from, {
    text: '❌ Ocorreu um erro ao executar o comando. Verifique se o bot é administrador.',
    mentions: [sender],
    contextInfo: { stanzaId: msg.key.id, participant: sender, quotedMessage: msg.message }
  });
}
break;
}

// COMANDO: .menu
case cmd.toLowerCase() === 'menu': {
  const textoMenu = `
╭═══════════════════════╮
│ 🤖 *Blessed • MENU* │
╰═══════════════════════╯

👑 *ADMINISTRAÇÃO DO GRUPO
Blessed 258851907857*
━━━━━━━━━━━━━━━━━━━━━━━
🔹 .ban @usuario / 258XXXXXXXXX
🔹 .grupo a → Abrir grupo
🔹 .grupo f → Fechar grupo
🔹 .limpar → Limpar o chat
🔹 .antilink on/off → Ativa e desativa antilink
🔹 .antifoto on/off → Bloquea envio de fotos
🔹 .antivideo on/off → Bloquea envio de vídeos 
🔹 .antiaudio on/off -> bloquea envio de áudios
🔹 .antistatus on/off -> bloquea menção de status 
🔹 .detector on/off → Ativa e desativa detector de comprovativos 
🔹 .status → Mostra o status dos sistemas do grupo
🔹 .addmpesa -> Adiciona conta do m-pesa
🔹 .addmola -> Adiciona conta E-mola 
🔹 .contas -> para ver contas do grupo
🔹 .delmpesa -> remove contas m-pesa no grupo
🔹 .delmola -> remove contas e-mola no grupo
🔹 .anticoncorrencia on/off → ativa e desativa  o filtro anticoncorrencia 
🔹 .addconcorrente → adicionando concorrentes a base, usando lid 
🔹 .<→ remove concorrentes da base, usando lid
🔹 .certificarconcorencia → verifica se a concorrentes no grupo
🔹 .bot → verifica dias restantes
🔹 .promover → promeve um usuário ao mencionar ele
🔹 .demote → remove usuário do cargo de administrador 
🔹 .pp -> ver a posição do usuário (adm)
🔹 .p -> para membros verem suas posições 
🔹 .alarme -> adiciona alarmes no grupo para abrir e fechar automaticamente 
 
🎉 *BOAS-VINDAS*
━━━━━━━━━━━━━━━━━━━━━━━
🔹 .bsvindo <mensagem> → Definir boas-vindas
🔹 .bemvindo on/off → Ativa e desativa boas-vindas 

🧠 *NANO COMANDOS*
━━━━━━━━━━━━━━━━━━━━━━━
🔹 .nanoativar on/off → Ativa e desativa sistema nano
🔹 .nanoadd gatilho,resposta
🔹 .nanodel gatilho
🔹 .listanano → Listar nanos
🔹 .limparnanos → Apagar nanos do grupo

🛒 *SISTEMA DE COMPRAS*
━━━━━━━━━━━━━━━━━━━━━━━
🔹 .compras on (mb,gb,saldo)
🔹 .clientes → Ver clientes
🔹 .compra 620mb → Registrar compra
🔹 .anular → anula compra (mb,gb,saldo)
🔹 .resetcompras → Apagar compras

👻 *CONTROLE DE MEMBROS*
━━━━━━━━━━━━━━━━━━━━━━━
🔹 .todos → marca todos membros do grupo
🔹 .rentanas → Membros sem compras
🔹 .fantasmas 10 → Remover fantasmas

💡 *EXEMPLOS DE USO*
━━━━━━━━━━━━━━━━━━━━━━━
📌 .compra 620mb *(respondendo o cliente)*
📌 .fantasmas 10
📌 .ban @usuario
📌 .nanoadd oi,Olá 👋
📌 .nanodel oi
📌 .todos tudo bem *(marca todos membros com a mensagem)*
📌 .delmpesa 1 (remove a conta com um número)
📌 .delmola 1 (remove a conta com um número)
📌 .addconcorrente 194558394654885@lid.
📌 .removeconcorrente 194558394654885@lid
dono do BOT 258851907857
━━━━━━━━━━━━━━━━━━━━━━━
⚙️ *NANOBOT ATIVO E OPERACIONAL ♡*
`;

  await sock.sendMessage(from, {
    text: textoMenu,
    mentions: [sender],
    contextInfo: {
      stanzaId: msg.key.id,
      participant: sender,
      quotedMessage: msg.message
    }
  });

  break;
}

// COMANDO: .nanoativar
case cmd.toLowerCase().startsWith('nanoativar'): {
  const isGroup = from.endsWith('@g.us');

  if (!isGroup) {
    await sock.sendMessage(from, {
      text: '❌ Este comando funciona apenas em grupos.',
      mentions: [sender],
      contextInfo: { stanzaId: msg.key.id, participant: sender, quotedMessage: msg.message }
    });
    break;
  }

  const groupMeta = await sock.groupMetadata(from);
  const admins = groupMeta.participants
    .filter(p => p.admin === "admin" || p.admin === "superadmin")
    .map(p => p.id);

  const senderId = msg.key.participant || msg.key.remoteJid;

  if (!admins.includes(senderId)) {
    await sock.sendMessage(from, {
      text: '❌ Apenas administradores podem usar este comando!',
      mentions: [sender],
      contextInfo: { stanzaId: msg.key.id, participant: sender, quotedMessage: msg.message }
    });
    break;
  }

  const arg = cmd.split(' ')[1]?.toLowerCase();
  if (arg === 'on') {
    nano[from] = 'on';
    salvarNano(nano);
    await sock.sendMessage(from, {
      text: '🤖 ✅ Sistema de nanocomandos *ATIVADO* neste grupo!',
      mentions: [sender],
      contextInfo: { stanzaId: msg.key.id, participant: sender, quotedMessage: msg.message }
    });
  } else if (arg === 'off') {
    nano[from] = 'off';
    salvarNano(nano);
    await sock.sendMessage(from, {
      text: '🤖 ❌ Sistema de nanocomandos *DESATIVADO* neste grupo!',
      mentions: [sender],
      contextInfo: { stanzaId: msg.key.id, participant: sender, quotedMessage: msg.message }
    });
  } else {
    await sock.sendMessage(from, {
      text: '❌ Use .nanoativar on ou .nanoativar off',
      mentions: [sender],
      contextInfo: { stanzaId: msg.key.id, participant: sender, quotedMessage: msg.message }
    });
  }

  break;
}

// COMANDO: .nanoadd
case cmd.toLowerCase().startsWith('nanoadd'): {
  const isGroup = from.endsWith('@g.us');

  if (!isGroup) {
    await sock.sendMessage(from, {
      text: '❌ Este comando funciona apenas em grupos.',
      mentions: [sender],
      contextInfo: { stanzaId: msg.key.id, participant: sender, quotedMessage: msg.message }
    });
    break;
  }

  const groupMeta = await sock.groupMetadata(from);
  const admins = groupMeta.participants
    .filter(p => p.admin === "admin" || p.admin === "superadmin")
    .map(p => p.id);

  const senderId = (msg.key.participant || msg.key.remoteJid);

  if (!admins.includes(senderId)) {
    await sock.sendMessage(from, {
      text: '❌ Apenas administradores podem usar este comando!',
      mentions: [sender],
      contextInfo: { stanzaId: msg.key.id, participant: sender, quotedMessage: msg.message }
    });
    break;
  }

  if (!nanoStatus) {
    await sock.sendMessage(from, {
      text: '❌ O filtro de nano comandos não está ativo neste grupo.',
      mentions: [sender],
      contextInfo: { stanzaId: msg.key.id, participant: sender, quotedMessage: msg.message }
    });
    break;
  }

  const addArgs = cmd.slice('nanoadd'.length).trim();
  const splitAdd = addArgs.split(',');
  if (splitAdd.length < 2) {
    await sock.sendMessage(from, {
      text: '❌ Formato incorreto. Use: .nanoadd gatilho,resposta',
      mentions: [sender],
      contextInfo: { stanzaId: msg.key.id, participant: sender, quotedMessage: msg.message }
    });
    break;
  }

  const gatilho = splitAdd[0].trim().toLowerCase();

  const resposta = splitAdd.slice(1).join(',').trim();

  if (!gatilhos[from]) gatilhos[from] = {};
  gatilhos[from][gatilho] = resposta;
  salvarGatilhos(gatilhos);

  await sock.sendMessage(from, {
    text: `🤖 ✅ Nano comando criado/atualizado:\nGatilho: *${gatilho}*\nResposta: *${resposta}*`,
    mentions: [sender],
    contextInfo: { stanzaId: msg.key.id, participant: sender, quotedMessage: msg.message }
  });

  break;
}
// COMANDO: .nanodel
case cmd.toLowerCase().startsWith('nanodel'): {
  const isGroup = from.endsWith('@g.us');

  if (!isGroup) {
    await sock.sendMessage(from, {
      text: '❌ Este comando funciona apenas em grupos.',
      mentions: [sender],
      contextInfo: { stanzaId: msg.key.id, participant: sender, quotedMessage: msg.message }
    });
    break;
  }

  const groupMeta = await sock.groupMetadata(from);
  const admins = groupMeta.participants
    .filter(p => p.admin === "admin" || p.admin === "superadmin")
    .map(p => p.id);

  const senderId = (msg.key.participant || msg.key.remoteJid);

  if (!admins.includes(senderId)) {
    await sock.sendMessage(from, {
      text: '❌ Apenas administradores podem usar este comando!',
      mentions: [sender],
      contextInfo: { stanzaId: msg.key.id, participant: sender, quotedMessage: msg.message }
    });
    break;
  }

  if (!nanoStatus) {
    await sock.sendMessage(from, {
      text: '❌ O filtro de nano comandos não está ativo neste grupo.',
      mentions: [sender],
      contextInfo: { stanzaId: msg.key.id, participant: sender, quotedMessage: msg.message }
    });
    break;
  }

  const delGatilho = cmd.slice('nanodel'.length).trim().toLowerCase();

  if (gatilhos[from]?.[delGatilho]) {
    delete gatilhos[from][delGatilho];
    salvarGatilhos(gatilhos);
    await sock.sendMessage(from, {
      text: `🤖 ✅ Nano comando removido: *${delGatilho}*`,
      mentions: [sender],
      contextInfo: { stanzaId: msg.key.id, participant: sender, quotedMessage: msg.message }
    });
  } else {
    await sock.sendMessage(from, {
      text: `❌ O gatilho *${delGatilho}* não foi encontrado neste grupo.`,
      mentions: [sender],
      contextInfo: { stanzaId: msg.key.id, participant: sender, quotedMessage: msg.message }
    });
  }
  break;
}

// COMANDO: .listanano
case cmd.toLowerCase() === 'listanano': {
  const isGroup = from.endsWith('@g.us');

  if (!isGroup) {
    await sock.sendMessage(from, {
      text: '❌ Este comando funciona apenas em grupos.',
      mentions: [sender],
      contextInfo: { stanzaId: msg.key.id, participant: sender, quotedMessage: msg.message }
    });
    break;
  }

  const groupMeta = await sock.groupMetadata(from);
  const admins = groupMeta.participants
    .filter(p => p.admin === "admin" || p.admin === "superadmin")
    .map(p => p.id);

  const senderId = (msg.key.participant || msg.key.remoteJid);

  if (!admins.includes(senderId)) {
    await sock.sendMessage(from, {
      text: '❌ Apenas administradores podem usar este comando!',
      mentions: [sender],
      contextInfo: { stanzaId: msg.key.id, participant: sender, quotedMessage: msg.message }
    });
    break;
  }

  if (!nanoStatus) {
    await sock.sendMessage(from, {
      text: '❌ O filtro de nano comandos não está ativo neste grupo.',
      mentions: [sender],
      contextInfo: { stanzaId: msg.key.id, participant: sender, quotedMessage: msg.message }
    });
    break;
  }

  const lista = gatilhos[from] ? Object.keys(gatilhos[from]) : [];
  if (lista.length === 0) {
    await sock.sendMessage(from, {
      text: '❌ Nenhum nano comando registrado neste grupo.',
      mentions: [sender],
      contextInfo: { stanzaId: msg.key.id, participant: sender, quotedMessage: msg.message }
    });
  } else {
    await sock.sendMessage(from, {
      text: `🤖 ✅ Lista de nano comandos deste grupo:\n- ${lista.join('\n- ')}`,
      mentions: [sender],
      contextInfo: { stanzaId: msg.key.id, participant: sender, quotedMessage: msg.message }
    });
  }

  break;
}

// COMANDO: .limparnanos
case cmd.toLowerCase() === 'limparnanos': {
  const isGroup = from.endsWith('@g.us');

  if (!isGroup) {
    await sock.sendMessage(from, {
      text: '❌ Este comando funciona apenas em grupos.',
      mentions: [sender],
      contextInfo: { stanzaId: msg.key.id, participant: sender, quotedMessage: msg.message }
    });
    break;
  }

  const groupMeta = await sock.groupMetadata(from);
  const admins = groupMeta.participants
    .filter(p => p.admin === "admin" || p.admin === "superadmin")
    .map(p => p.id);

  const senderId = (msg.key.participant || msg.key.remoteJid);

  if (!admins.includes(senderId)) {
    await sock.sendMessage(from, {
      text: '❌ Apenas administradores podem usar este comando!',
      mentions: [sender],
      contextInfo: { stanzaId: msg.key.id, participant: sender, quotedMessage: msg.message }
    });
    break;
  }

  if (!nanoStatus) {
    await sock.sendMessage(from, {
      text: '❌ O filtro de nano comandos não está ativo neste grupo.',
      mentions: [sender],
      contextInfo: { stanzaId: msg.key.id, participant: sender, quotedMessage: msg.message }
    });
    break;
  }

  if (gatilhos[from]) {
    delete gatilhos[from];
    salvarGatilhos(gatilhos);
    await sock.sendMessage(from, {
      text: '🤖 ✅ Todos os nano comandos deste grupo foram apagados.',
      mentions: [sender],
      contextInfo: { stanzaId: msg.key.id, participant: sender, quotedMessage: msg.message }
    });
  } else {
    await sock.sendMessage(from, {
      text: '❌ Não há nano comandos para apagar neste grupo.',
      mentions: [sender],
      contextInfo: { stanzaId: msg.key.id, participant: sender, quotedMessage: msg.message }
    });
  }

  break;
}
  
// COMANDO: .anticoncorrencia
case cmd.toLowerCase().startsWith('anticoncorrencia'): {
  const isGroup = from.endsWith('@g.us');

  if (!isGroup) {
    await sock.sendMessage(from, {
      text: '❌ Este comando funciona apenas em grupos.',
      mentions: [sender],
      contextInfo: { stanzaId: msg.key.id, participant: sender, quotedMessage: msg.message }
    });
    break;
  }

  const groupMeta = await sock.groupMetadata(from);
  const adminsAC = groupMeta.participants
    .filter(p => p.admin === "admin" || p.admin === "superadmin")
    .map(p => p.id);

  const senderAC = (msg.key.participant || msg.key.remoteJid);

  if (!adminsAC.includes(senderAC)) {
    await sock.sendMessage(from, {
      text: '❌ Apenas administradores podem usar este comando!',
      mentions: [sender],
      contextInfo: { stanzaId: msg.key.id, participant: sender, quotedMessage: msg.message }
    });
    break;
  }

  const argAC = cmd.split(' ')[1]?.toLowerCase();
  if (argAC === 'on') {
    anticoncorrencia[from] = 'on';
    salvarAnticoncorrencia(anticoncorrencia);
    await sock.sendMessage(from, {
      text: '🤖 ✅ anticoncorrencia *ativado* neste grupo!',
      mentions: [sender],
      contextInfo: { stanzaId: msg.key.id, participant: sender, quotedMessage: msg.message }
    });
  } else if (argAC === 'off') {
    anticoncorrencia[from] = 'off';
    salvarAnticoncorrencia(anticoncorrencia);
    await sock.sendMessage(from, {
      text: '🤖 ❌ anticoncorrencia *desativada* neste grupo!',
      mentions: [sender],
      contextInfo: { stanzaId: msg.key.id, participant: sender, quotedMessage: msg.message }
    });
  } else {
    await sock.sendMessage(from, {
      text: '❌ Use .anticoncorrencia on ou .anticoncorrencia off',
      mentions: [sender],
      contextInfo: { stanzaId: msg.key.id, participant: sender, quotedMessage: msg.message }
    });
  }

  break;
}

// COMANDO: .addconcorrente
case cmd.toLowerCase().startsWith('addconcorrente'): {
  const isGroup = from.endsWith('@g.us');

  if (!isGroup) {
    await sock.sendMessage(from, {
      text: '❌ Este comando funciona apenas em grupos.',
      mentions: [sender],
      contextInfo: { stanzaId: msg.key.id, participant: sender, quotedMessage: msg.message }
    });
    break;
  }

  const metadata = await sock.groupMetadata(from).catch(() => null);
  const admins = metadata?.participants
    .filter(p => p.admin !== null)
    .map(p => p.id);

  if (!admins.includes(sender)) {
    await sock.sendMessage(from, {
      text: '❌ Este comando só pode ser usado por administradores.',
      mentions: [sender],
      contextInfo: { stanzaId: msg.key.id, participant: sender, quotedMessage: msg.message }
    });
    break;
  }

  if (!anticoncorrenciaStatus) {
    await sock.sendMessage(from, {
      text: '🤖 ❌ o filtro anticoncorrência não está ativo neste grupo.',
      mentions: [sender],
      contextInfo: { stanzaId: msg.key.id, participant: sender, quotedMessage: msg.message }
    });
    break;
  }

  const listaRaw = cmd.replace('addconcorrente', '').trim();

  if (!listaRaw) {
    await sock.sendMessage(from, {
      text: '🤖 ❌ informe os lids dos concorrentes separados por vírgula.\n\nexemplo:\n.addconcorrente 49362159841324,203744927047837,174126597689350',
      mentions: [sender],
      contextInfo: { stanzaId: msg.key.id, participant: sender, quotedMessage: msg.message }
    });
    break;
  }

  const lista = listaRaw
    .split(',')
    .map((x) => x.replace(/[^0-9]/g, '').trim())
    .filter((x) => x.length > 6);

  if (lista.length === 0) {
    await sock.sendMessage(from, {
      text: '🤖 ❌ nenhum número válido de concorrente foi detectado.',
      mentions: [sender],
      contextInfo: { stanzaId: msg.key.id, participant: sender, quotedMessage: msg.message }
    });
    break;
  }

  if (!concorrentes || typeof concorrentes !== 'object') {
    concorrentes = {};
  }

  let adicionados = 0;
  let repetidos = 0;

  for (const lid of lista) {
    const jidFinal = `${lid}@lid`;

    if (concorrentes[jidFinal]) {
      repetidos++;
    } else {
      concorrentes[jidFinal] = true;
      adicionados++;
    }
  }

  salvarConcorrentes(concorrentes);

  try {
    await sock.sendMessage(from, {
      delete: {
        remoteJid: from,
        id: msg.key.id,
        participant: msg.key.participant
      }
    });
    console.log('🗑 mensagem do usuário apagada (comando addconcorrente).');
  } catch (err) {
    console.log('⚠️ não foi possível apagar a mensagem do usuário:', err?.message || err);
  }

  await sock.sendMessage(from, {
    text:
      `🤖 ✅ processo concluído.\n\n` +
      `📥 total de números enviados:  *${lista.length}*\n` +
      `🟢 concorrentes adicionados: *${adicionados}*\n` +
      `🟡 já estavam na lista: *${repetidos}*\n\n` +
      `✔️ todos os números válidos foram registrados como concorrentes no sistema `,
    mentions: [sender],
    contextInfo: { stanzaId: msg.key.id, participant: sender, quotedMessage: msg.message }
  });

  break;
}


// COMANDO: removeconcorrente
case cmd.toLowerCase().startsWith('removeconcorrente'): {
    const isGroup = from.endsWith('@g.us');

    if (!isGroup) {
        await sock.sendMessage(from, {
            text: '❌ Este comando funciona apenas em grupos.',
            mentions: [sender],
            contextInfo: { stanzaId: msg.key.id, participant: sender, quotedMessage: msg.message }
        });
        break;
    }

    const metadata = await sock.groupMetadata(from).catch(() => null);
    const admins = metadata?.participants
        .filter(p => p.admin !== null)
        .map(p => p.id);

    if (!admins.includes(sender)) {
        await sock.sendMessage(from, {
            text: '❌ Este comando só pode ser usado por administradores.',
            mentions: [sender],
            contextInfo: { stanzaId: msg.key.id, participant: sender, quotedMessage: msg.message }
        });
        break;
    }

    if (!anticoncorrenciaStatus) {
        await sock.sendMessage(from, {
            text: '❌ Filtro anticoncorrencia não está ativo neste grupo.',
            mentions: [sender],
            contextInfo: { stanzaId: msg.key.id, participant: sender, quotedMessage: msg.message }
        });
        break;
    }

    try {
        let concorrentes = {};
        if (fs.existsSync(pathConcorrentes)) {
            concorrentes = JSON.parse(fs.readFileSync(pathConcorrentes, "utf-8"));
        }

        const args = cmd.split(" ")[1];

        // 🔹 SEM ARGUMENTO → REMOVE ADMINS DO GRUPO ATUAL
        if (!args) {
            const adminsGrupo = metadata.participants
                .filter(p => p.admin === "admin" || p.admin === "superadmin")
                .map(p => p.id);

            let removidos = 0;

            for (const admin of adminsGrupo) {
                if (concorrentes[admin]) {
                    delete concorrentes[admin];
                    removidos++;
                }
            }

            salvarConcorrentes(concorrentes);

            await sock.sendMessage(from, {
                text:
                    `🤖 ✅ Remoção concluída!\n\n` +
                    `🧹 Administradores removidos da lista: *${removidos}*`,
                mentions: [sender],
                contextInfo: { stanzaId: msg.key.id, participant: sender, quotedMessage: msg.message }
            });
            break;
        }

        // 🔹 SE FOR ID DE GRUPO
        if (args.endsWith('@g.us')) {
            const grupoId = args.trim();
            const grupoInfo = await sock.groupMetadata(grupoId).catch(() => null);

            if (!grupoInfo) {
                await sock.sendMessage(from, {
                    text: '❌ Grupo não encontrado ou bot não está nele.',
                    mentions: [sender],
                    contextInfo: { stanzaId: msg.key.id, participant: sender, quotedMessage: msg.message }
                });
                break;
            }

            let removidos = 0;

            for (const membro of grupoInfo.participants) {
                const lid = membro.id.endsWith('@lid')
                    ? membro.id
                    : membro.id.replace(/@s\.whatsapp\.net$/, '') + '@lid';

                if (concorrentes[lid]) {
                    delete concorrentes[lid];
                    removidos++;
                }
            }

            salvarConcorrentes(concorrentes);

            await sock.sendMessage(from, {
                text:
                    `🤖 ✅ Remoção por grupo concluída!\n\n` +
                    `🧹 Concorrentes removidos: *${removidos}*`,
                mentions: [sender],
                contextInfo: { stanzaId: msg.key.id, participant: sender, quotedMessage: msg.message }
            });
            break;
        }

        // 🔹 REMOÇÃO INDIVIDUAL (LID)
        const numeroRaw = args.trim();
        const numeroLimpo = numeroRaw.replace(/[^0-9]/g, '');
        const formatoLid = numeroRaw.endsWith("@lid")
            ? numeroRaw
            : `${numeroLimpo}@lid`;

        if (concorrentes[formatoLid]) {
            delete concorrentes[formatoLid];
            salvarConcorrentes(concorrentes);

            await sock.sendMessage(from, {
                text: `🤖 ✅ Concorrente removido da lista de concorrentes.`,
                mentions: [sender],
                contextInfo: { stanzaId: msg.key.id, participant: sender, quotedMessage: msg.message }
            });
        } else {
            await sock.sendMessage(from, {
                text: `❌ O número não está na lista de concorrentes.`,
                mentions: [sender],
                contextInfo: { stanzaId: msg.key.id, participant: sender, quotedMessage: msg.message }
            });
        }

    } catch (err) {
        console.error("❌ Erro ao remover concorrente:", err);
        await sock.sendMessage(from, {
            text: `❌ Erro verifique se o bot é administrador.`,
            mentions: [sender],
            contextInfo: { stanzaId: msg.key.id, participant: sender, quotedMessage: msg.message }
        });
    }

    break;
}
// COMANDO: .certificarconcorencia
case cmd.toLowerCase().startsWith('certificarconcorencia'): {
    console.log("\n------------------ CERTIFICARCONCORRENCIA ------------------");
    console.log("📌 Grupo (from):", from);

    const isGroup = from.endsWith('@g.us');

    if (!isGroup) {
        await sock.sendMessage(from, {
            text: '❌ Este comando funciona apenas em grupos.',
            mentions: [sender],
            contextInfo: { stanzaId: msg.key?.id, participant: sender, quotedMessage: msg.message }
        });
        break;
    }

    const metadata = await sock.groupMetadata(from).catch(() => null);
    const admins = metadata?.participants
        .filter(p => p.admin !== null)
        .map(p => p.id);

    if (!admins.includes(sender)) {
        await sock.sendMessage(from, {
            text: '❌ Este comando só pode ser usado por administradores.',
            mentions: [sender],
            contextInfo: { stanzaId: msg.key?.id, participant: sender, quotedMessage: msg.message }
        });
        break;
    }

    if (!anticoncorrenciaStatus) {
        await sock.sendMessage(from, {
            text: '❌ O filtro anticoncorrência não está ativo neste grupo.',
            mentions: [sender],
            contextInfo: { stanzaId: msg.key?.id, participant: sender, quotedMessage: msg.message }
        });
        break;
    }

    try {
        const lista = concorrentes; 
        console.log("📂 Concorrentes registrados no arquivo:", lista);

        if (Object.keys(lista).length === 0) {
            await sock.sendMessage(from, {
                text: '🤖 ✅ Nenhum número registrado como concorrente no JSON.',
                mentions: [sender],
                contextInfo: { stanzaId: msg.key?.id, participant: sender, quotedMessage: msg.message }
            });
            console.log("⚠️ Nenhum concorrente registrado no JSON.");
            break;
        }

        const participantes = metadata.participants.map(p => p.id);
        console.log("👥 Participantes do grupo:", participantes);

        const encontrados = [];

        for (const membro of participantes) {
            console.log(`\n🔍 Verificando membro: ${membro}`);

            const match = lista[membro] === true;
            console.log("🔎 Achou concorrente?", match);

            if (match) {
                encontrados.push(membro);
            }
        }

        console.log("\n📌 Concorrentes encontrados no grupo:", encontrados);

        if (encontrados.length === 0) {
            await sock.sendMessage(from, {
                text: '🤖 ✅ Não há concorrentes presentes neste grupo no momento.',
                mentions: [sender],
                contextInfo: { stanzaId: msg.key?.id, participant: sender, quotedMessage: msg.message }
            });
            break;
        }

        const texto =
            '⚠️ *Concorrentes detectados neste grupo!* ⚠️\n\n' +
            encontrados.map((id, i) => `🔹 ${i + 1}. @${id.split('@')[0]}`).join('\n') +
            '\n\n🔍 *Ação necessária!*';

        await sock.sendMessage(from, {
            text: texto,
            mentions: encontrados,
            contextInfo: { stanzaId: msg.key?.id, participant: sender, quotedMessage: msg.message }
        });

    } catch (err) {
        console.error("🔥 Erro ao verificar os concorrentes:", err);
        await sock.sendMessage(from, {
            text: `❌ Ocorreu um erro ao verificar concorrentes,  verifique se o bot é administrador: ${err.message}`,
            mentions: [sender],
            contextInfo: { stanzaId: msg.key?.id, participant: sender, quotedMessage: msg.message }
        });
    }

    console.log("------------------ certificarconcorencia concluído ✅️ ------------------\n");
    break;
}

// FUNÇÃO AUXILIAR
function getUserJid(p) {
    if (!p) return null;
    return p.id || p.jid || p.lid || null;
}

// COMANDO: .capturaconcorencia
case cmd.toLowerCase().startsWith("capturaconcorencia"): {
    console.log("\n---------------- CAPTURACONCORRENCIA ----------------");

    const isGroup = from.endsWith('@g.us');

    if (!isGroup) {
        await sock.sendMessage(from, {
            text: '❌ ESTE COMANDO FUNCIONA APENAS EM GRUPOS.',
            mentions: [sender],
            contextInfo: { stanzaId: msg.key.id, participant: sender, quotedMessage: msg.message }
        });
        break;
    }

    const metadata = await sock.groupMetadata(from).catch(() => null);
    const admins = metadata?.participants
        .filter(p => p.admin !== null)
        .map(p => getUserJid(p));

    if (!admins.includes(sender)) {
        await sock.sendMessage(from, {
            text: '❌ ESTE COMANDO SÓ PODE SER USADO POR ADMINISTRADORES.',
            mentions: [sender],
            contextInfo: { stanzaId: msg.key.id, participant: sender, quotedMessage: msg.message }
        });
        break;
    }

    const anticoncorrenciaStatus = JSON.parse(
        fs.existsSync(pathAnticoncorrencia)
            ? fs.readFileSync(pathAnticoncorrencia, "utf-8")
            : "{}"
    )[from] === "on";

    if (!anticoncorrenciaStatus) {
        await sock.sendMessage(from, {
            text: '❌ FILTRO ANTICORRENCIA NÃO ESTÁ ATIVO NESTE GRUPO.',
            mentions: [sender],
            contextInfo: { stanzaId: msg.key.id, participant: sender, quotedMessage: msg.message }
        });
        break;
    }

    const args = cmd.split(" ")[1];
    if (!args) {
        await sock.sendMessage(from, {
            text: '❌ INFORME O ID DO GRUPO E O MODO (GERAL/ADMIN). EXEMPLO:\n.capturaconcorencia 120363421228229250@g.us,admin',
            mentions: [sender],
            contextInfo: { stanzaId: msg.key.id, participant: sender, quotedMessage: msg.message }
        });
        break;
    }

    const [groupId, modo] = args.split(",");
    if (!groupId || !modo || !["geral", "admin"].includes(modo.toLowerCase())) {
        await sock.sendMessage(from, {
            text: '❌ MODO INVÁLIDO. USE "GERAL" OU "ADMIN". EXEMPLO:\n.capturaconcorencia 120363421228229250@g.us,admin',
            mentions: [sender],
            contextInfo: { stanzaId: msg.key.id, participant: sender, quotedMessage: msg.message }
        });
        break;
    }

    console.log(`🔍 Capturando participantes do grupo: ${groupId} no modo: ${modo}`);

    try {
    const groupMeta = await sock.groupMetadata(groupId);
    if (!groupMeta) {
        await sock.sendMessage(from, {
            text: '❌ NÃO FOI POSSÍVEL OBTER INFORMAÇÕES DO GRUPO.',
            mentions: [sender],
            contextInfo: { stanzaId: msg.key.id, participant: sender, quotedMessage: msg.message }
        });
        break;
    }

    const nomeGrupo = groupMeta.subject;
    const totalMembros = groupMeta.participants.length;

    let lids = [];
    if (modo.toLowerCase() === "admin") {
        lids = groupMeta.participants
            .filter(p => p.admin === 'admin' || p.admin === 'superadmin')
            .map(p => getUserJid(p));
    } else {
        lids = groupMeta.participants.map(p => getUserJid(p));
    }

    if (!lids.length) {
        await sock.sendMessage(from, {
            text: '❌ NENHUM PARTICIPANTE ENCONTRADO PARA O MODO SELECIONADO.',
            mentions: [sender],
            contextInfo: { stanzaId: msg.key.id, participant: sender, quotedMessage: msg.message }
        });
        break;
    }

    let concorrentes = {};
    if (fs.existsSync(pathConcorrentes)) {
        concorrentes = JSON.parse(fs.readFileSync(pathConcorrentes, "utf-8"));
    }

    let adicionados = 0;
    let jaExistiam = 0;

    for (const lid of lids) {
        if (!concorrentes[lid]) {
            concorrentes[lid] = true;
            adicionados++;
        } else {
            jaExistiam++;
        }
    }

    fs.writeFileSync(pathConcorrentes, JSON.stringify(concorrentes, null, 2));

    const totalGlobal = Object.keys(concorrentes).length;

    await sock.sendMessage(from, {
        text:
`✅ *CAPTURA CONCLUÍDA*

📌 *Grupo:* ${nomeGrupo}
🆔 *ID:* ${groupId}
👥 *Total de membros:* ${totalMembros}

➕ *Adicionados agora:* ${adicionados}
♻️ *Já existiam:* ${jaExistiam}

🌍 *Base global:* ${totalGlobal} concorrentes`,
        mentions: [sender],
        contextInfo: { stanzaId: msg.key.id, participant: sender, quotedMessage: msg.message }
    });

} catch (err) {
    console.error("❌ Erro ao capturar participantes:", err);
    await sock.sendMessage(from, {
        text: '❌ OCORREU UM ERRO AO CAPTURAR PARTICIPANTES.',
        mentions: [sender],
        contextInfo: { stanzaId: msg.key.id, participant: sender, quotedMessage: msg.message }
    });
}

    break;
}

// COMANDO .BEMVINDO
case cmd.toLowerCase().startsWith('bemvindo'): {
  const isGroup = from.endsWith('@g.us');

  if (!isGroup) {
    await sock.sendMessage(from, {
      text: '❌ Este comando funciona apenas em grupos.',
      mentions: [sender],
      contextInfo: {
        stanzaId: msg.key.id,
        participant: sender,
        quotedMessage: msg.message
      }
    });
    break;
  }

  const metadata = await sock.groupMetadata(from).catch(() => null);
  const admins = metadata?.participants
    .filter(p => p.admin !== null)
    .map(p => p.id);

  if (!admins.includes(sender)) {
    await sock.sendMessage(from, {
      text: '❌ Este comando só pode ser usado por administradores.',
      mentions: [sender],
      contextInfo: {
        stanzaId: msg.key.id,
        participant: sender,
        quotedMessage: msg.message
      }
    });
    break;
  }

  const opcao = cmd.split(' ')[1];

  if (!opcao || !['on', 'off'].includes(opcao.toLowerCase())) {
    await sock.sendMessage(from, {
      text: '❌ Use corretamente:\n\n.bemvindo on\n.bemvindo off',
      mentions: [sender],
      contextInfo: {
        stanzaId: msg.key.id,
        participant: sender,
        quotedMessage: msg.message
      }
    });
    break;
  }

  let bemvindoData = {};
  if (fs.existsSync(pathBemvindo)) {
    bemvindoData = JSON.parse(fs.readFileSync(pathBemvindo, 'utf-8') || '{}');
  }

  bemvindoData[from] = opcao.toLowerCase();

  fs.writeFileSync(pathBemvindo, JSON.stringify(bemvindoData, null, 2));

  await sock.sendMessage(from, {
    text:
      opcao.toLowerCase() === 'on'
        ? '🤖 ✅ Sistema de boas-vindas *Ativado* neste grupo.'
        : '🤖 ❌ Sistema de boas-vindas *Desativado* neste grupo.',
    mentions: [sender],
    contextInfo: {
      stanzaId: msg.key.id,
      participant: sender,
      quotedMessage: msg.message
    }
  });

  break;
}

// comando .bsvindo
case cmd.toLowerCase().startsWith('bsvindo'): {
  const isGroup = from.endsWith('@g.us');

  if (!isGroup) {
    await sock.sendMessage(from, {
      text: '❌ Este comando funciona apenas em grupos.',
      mentions: [sender],
      contextInfo: { stanzaId: msg.key.id, participant: sender, quotedMessage: msg.message }
    });
    break;
  }

  const metadata = await sock.groupMetadata(from).catch(() => null);
  const admins = metadata?.participants
    .filter(p => p.admin !== null)
    .map(p => p.id);

  if (!admins.includes(sender)) {
    await sock.sendMessage(from, {
      text: '❌ Este comando só pode ser usado por administradores.',
      mentions: [sender],
      contextInfo: { stanzaId: msg.key.id, participant: sender, quotedMessage: msg.message }
    });
    break;
  }

  const texto = cmd.replace(/^bsvindo/i, '').trim();

  if (!texto) {
    await sock.sendMessage(from, {
      text: '❌ Informe a mensagem de boas-vindas.\n\nExemplo:\n.bsvindo seja bem-vindo ao grupo @user',
      mentions: [sender],
      contextInfo: { stanzaId: msg.key.id, participant: sender, quotedMessage: msg.message }
    });
    break;
  }

  let data = {};
  if (fs.existsSync(pathPersonalizar)) {
    data = JSON.parse(fs.readFileSync(pathPersonalizar, 'utf-8') || '{}');
  }

  data[from] = texto;

  fs.writeFileSync(pathPersonalizar, JSON.stringify(data, null, 2));

  await sock.sendMessage(from, {
    text: '✅ Mensagem de boas-vindas personalizada com sucesso para este grupo.',
    mentions: [sender],
    contextInfo: { stanzaId: msg.key.id, participant: sender, quotedMessage: msg.message }
  });

  break;
}

// comando .ban
case cmd.toLowerCase().startsWith('ban'): {
  const isGroup = from.endsWith('@g.us');

  if (!isGroup) {
    try {
      await sock.sendMessage(from, {
        text: '❌ este comando funciona apenas em grupos.',
        mentions: [sender],
        contextInfo: {
          stanzaId: msg.key?.id,
          participant: sender,
          quotedMessage: msg.message
        }
      });
    } catch {}
    break;
  }

  const metadata = await sock.groupMetadata(from).catch(() => null);
  if (!metadata) break;

  const admins = metadata.participants
    .filter(p => p.admin !== null)
    .map(p => p.id);

  if (!admins.includes(sender)) {
    try {
      await sock.sendMessage(from, {
        text: '❌ Este comando só pode ser usado por administradores.',
        mentions: [sender],
        contextInfo: {
          stanzaId: msg.key?.id,
          participant: sender,
          quotedMessage: msg.message
        }
      });
    } catch {}
    break;
  }

  let alvo = null;

  const quotedParticipant =
    msg.message?.extendedTextMessage?.contextInfo?.participant;

  if (quotedParticipant) {
    alvo = quotedParticipant;
  } else {
    const mentioned =
      msg.message?.extendedTextMessage?.contextInfo?.mentionedJid;

    if (mentioned?.length) {
      alvo = mentioned[0];
    } else {
      const num = cmd.split(' ')[1];
      if (num) {
        const limpo = num.replace(/\D/g, '');
        if (limpo.length > 5) {
          alvo = `${limpo}@s.whatsapp.net`;
        }
      }
    }
  }

  if (!alvo) {
    try {
      await sock.sendMessage(from, {
        text:
        '❌ Informe o número, mencione o usuário ou responda à mensagem.\n\n' +
        'Exemplos:\n' +
        '.ban @usuario\n' +
        '.ban 258852800194\n' +
        '(ou responda a mensagem)',
        mentions: [sender],
        contextInfo: {
          stanzaId: msg.key?.id,
          participant: sender,
          quotedMessage: msg.message
        }
      });
    } catch {}
    break;
  }

  try {
    await sock.groupParticipantsUpdate(from, [alvo], 'remove');

    try {
      await sock.sendMessage(from, {
        text: '🚫 Usuário removido do grupo.',
        mentions: [alvo],
        contextInfo: {
          stanzaId: msg.key?.id,
          participant: sender,
          quotedMessage: msg.message
        }
      });
    } catch {}

  } catch (err) {
    console.error('Erro no comando ban:', err);

    try {
      await sock.sendMessage(from, {
        text: '❌ Erro ao remover membro. Verifique se o bot é administrador.',
        mentions: [sender],
        contextInfo: {
          stanzaId: msg.key?.id,
          participant: sender,
          quotedMessage: msg.message
        }
      });
    } catch {}
  }

  break;
}

// Comando grupo a/f
case cmd.toLowerCase().startsWith('grupo'): {
  const partes = cmd.split(',');
  const base = partes[0].trim();
  const motivo = partes.slice(1).join(',').trim();

  const arg = base.split(' ')[1]?.toLowerCase();
  if (!arg || !['a', 'f'].includes(arg)) {
    await sock.sendMessage(from, {
      text: '❌ Use corretamente:\n\n.grupo a -> Abre o grupo\n.grupo f -> Fecha o grupo',
      mentions: [sender],
      contextInfo: { stanzaId: msg.key.id, participant: sender, quotedMessage: msg.message }
    });
    break;
  }

  const isGroup = from.endsWith('@g.us');
  if (!isGroup) {
    await sock.sendMessage(from, {
      text: '❌ Este comando funciona apenas em grupos.',
      mentions: [sender],
      contextInfo: { stanzaId: msg.key.id, participant: sender, quotedMessage: msg.message }
    });
    break;
  }

  const metadata = await sock.groupMetadata(from);
  const admins = metadata.participants
    .filter(p => p.admin === 'admin' || p.admin === 'superadmin')
    .map(p => p.id);

  const senderId = (msg.key.participant || msg.key.remoteJid);
  if (!admins.includes(senderId)) {
    await sock.sendMessage(from, {
      text: '❌ Apenas administradores podem usar este comando!',
      mentions: [sender],
      contextInfo: { stanzaId: msg.key.id, participant: sender, quotedMessage: msg.message }
    });
    break;
  }

  try {
    if (arg === 'a') {
      await sock.groupSettingUpdate(from, 'not_announcement');

      await sock.sendMessage(from, {
        text:
          `🤖 🔑 *Grupo aberto!*\n` +
          (motivo ? `📝 Motivo: ${motivo}` : ''),
        mentions: [sender],
        contextInfo: { stanzaId: msg.key.id, participant: sender, quotedMessage: msg.message }
      });

    } else if (arg === 'f') {
      await sock.groupSettingUpdate(from, 'announcement');

      await sock.sendMessage(from, {
        text:
          `🤖 🔐 *Grupo fechado!*\n` +
          (motivo ? `📝 Motivo: ${motivo}` : ''),
        mentions: [sender],
        contextInfo: { stanzaId: msg.key.id, participant: sender, quotedMessage: msg.message }
      });
    }

  } catch (err) {
    console.error('Erro ao atualizar o grupo:', err);
    await sock.sendMessage(from, {
      text: '❌ Não foi possível atualizar as configurações do grupo. Verifique se o bot é admin.',
      mentions: [sender],
      contextInfo: { stanzaId: msg.key.id, participant: sender, quotedMessage: msg.message }
    });
  }

  break;
}

// COMANDO: .compras
case cmd.toLowerCase().startsWith('compras'): {
  try {
    if (!from.endsWith('@g.us')) {
      await sock.sendMessage(from, {
        text: '❌ Este comando só pode ser usado em grupos.',
        mentions: [sender],
        contextInfo: {
          stanzaId: msg.key.id,
          participant: sender,
          quotedMessage: msg.message
        }
      });
      break;
    }

    const metadata = await sock.groupMetadata(from);
    const admins = metadata.participants
      .filter(p => p.admin === 'admin' || p.admin === 'superadmin')
      .map(p => p.id);

    const senderId = msg.key.participant || msg.key.remoteJid;
    if (!admins.includes(senderId)) {
      await sock.sendMessage(from, {
        text: '❌ Apenas administradores podem usar este comando.',
        mentions: [sender],
        contextInfo: {
          stanzaId: msg.key.id,
          participant: sender,
          quotedMessage: msg.message
        }
      });
      break;
    }

    const sistema = carregarSistema();
    const args = cmd.split(' ').slice(1);

    if (!args[0]) {
      await sock.sendMessage(from, {
        text:
          '❌ Use:\n' +
          '.compras on (mb)\n' +
          '.compras on (gb)\n' +
          '.compras on (saldo)\n' +
          '.compras on (mb,gb,saldo)\n' +
          '.compras off',
        mentions: [sender],
        contextInfo: {
          stanzaId: msg.key.id,
          participant: sender,
          quotedMessage: msg.message
        }
      });
      break;
    }

    if (args[0].toLowerCase() === 'off') {
      delete sistema[from];
      salvarSistema(sistema);

      await sock.sendMessage(from, {
        text: '🤖 ❌ Sistema de compras *desativado* neste grupo.',
        mentions: [sender],
        contextInfo: {
          stanzaId: msg.key.id,
          participant: sender,
          quotedMessage: msg.message
        }
      });
      break;
    }

    if (args[0].toLowerCase() === 'on') {
      const tipoRaw = args.slice(1).join(' ').trim();

      if (!tipoRaw.startsWith('(') || !tipoRaw.endsWith(')')) {
        await sock.sendMessage(from, {
          text:
            '❌ Especifique o tipo entre parênteses!\n\n' +
            'Exemplos:\n' +
            '.compras on (mb)\n' +
            '.compras on (gb)\n' +
            '.compras on (saldo)\n' +
            '.compras on (mb,gb,saldo)',
          mentions: [sender],
          contextInfo: {
            stanzaId: msg.key.id,
            participant: sender,
            quotedMessage: msg.message
          }
        });
        break;
      }

      const tipos = tipoRaw
        .replace(/[()]/g, '')
        .toLowerCase()
        .split(',')
        .map(t => t.trim());

      const tiposValidos = ['mb', 'gb', 'saldo'];
      const invalidos = tipos.filter(t => !tiposValidos.includes(t));

      if (invalidos.length > 0) {
        await sock.sendMessage(from, {
          text:
            '❌ Tipo(s) inválido(s): ' + invalidos.join(', ') + '\n\n' +
            'Use apenas:\n' +
            '(mb), (gb), (saldo) ou (mb,gb,saldo)',
          mentions: [sender],
          contextInfo: {
            stanzaId: msg.key.id,
            participant: sender,
            quotedMessage: msg.message
          }
        });
        break;
      }

      if (!sistema[from]) {
        sistema[from] = {
          status: 'on',
          tipos: {}
        };
      }

      sistema[from].status = 'on';

      let ativados = [];

      for (const tipo of tipos) {
        if (!sistema[from].tipos[tipo]) {
          sistema[from].tipos[tipo] = true;
          ativados.push(tipo.toUpperCase());
        }
      }

      salvarSistema(sistema);

      await sock.sendMessage(from, {
        text:
          ativados.length > 0
            ? `✅ Sistema de compras ativado para: *${ativados.join(', ')}*`
            : '⚠️ Todos os tipos informados já estavam ativos neste grupo.',
        mentions: [sender],
        contextInfo: {
          stanzaId: msg.key.id,
          participant: sender,
          quotedMessage: msg.message
        }
      });

      break;
    }

  } catch (err) {
    console.error('❌ Erro no comando compras:', err);
    await sock.sendMessage(from, {
      text: '❌ Erro ao configurar o sistema de compras. Verifique se o bot é administrador.',
      mentions: [sender],
      contextInfo: {
        stanzaId: msg.key.id,
        participant: sender,
        quotedMessage: msg.message
      }
    });
  }

  break;
}


// COMANDO: .compra
case cmd.toLowerCase().startsWith('compra'): {
  try {
    if (!from.endsWith('@g.us')) {
      await sock.sendMessage(from, {
        text: '❌ Este comando só pode ser usado em grupos.',
        mentions: [sender],
        contextInfo: { stanzaId: msg.key.id, participant: sender, quotedMessage: msg.message }
      });
      break;
    }

    const metadata = await sock.groupMetadata(from);
    const admins = metadata.participants
      .filter(p => p.admin === "admin" || p.admin === "superadmin")
      .map(p => p.id);

    const senderId = msg.key.participant || msg.key.remoteJid;
    if (!admins.includes(senderId)) {
      await sock.sendMessage(from, {
        text: '❌ Apenas administradores podem registrar compras.',
        mentions: [sender],
        contextInfo: { stanzaId: msg.key.id, participant: sender, quotedMessage: msg.message }
      });
      break;
    }

    const sistema = carregarSistema();

    if (!sistema[from] || sistema[from].status !== 'on') {
      await sock.sendMessage(from, {
        text:
          '❌ O sistema de compras está desativado neste grupo.\n\n' +
          'Para ativar, envie:\n' +
          '.compras on (mb)\n' +
          '.compras on (gb)\n' +
          '.compras on (saldo)\n\n' +
          '*Apenas administradores podem ativar.*',
        mentions: [sender],
        contextInfo: { stanzaId: msg.key.id, participant: sender, quotedMessage: msg.message }
      });
      break;
    }

    let numeroComprador = null;

    const quoted = msg.message?.extendedTextMessage?.contextInfo?.participant;
    if (quoted) numeroComprador = quoted;

    const argsRaw = cmd.replace(/^compra/i, '').trim();
    let quantidadeStr = null;

    if (argsRaw.includes(',')) {
      const partes = argsRaw.split(',');
      quantidadeStr = partes[0].trim();
      numeroComprador = partes[1].replace(/[^0-9]/g, '') + '@s.whatsapp.net';
    } else {
      quantidadeStr = argsRaw;
    }

    if (!numeroComprador || !quantidadeStr) {
      await sock.sendMessage(from, {
        text:
          '❌ Você precisa responder à mensagem do comprador ou informar o número.\n\n' +
          'Exemplos:\n' +
          '.compra 500MB (respondendo a mensagem)\n' +
          '.compra 620MB,258852800194',
        mentions: [sender],
        contextInfo: { stanzaId: msg.key.id, participant: sender, quotedMessage: msg.message }
      });
      break;
    }

    const numeroLimpo = numeroComprador.split('@')[0];

    const match = quantidadeStr.match(/^([\d.,]+)\s*(mb|gb|saldo)$/i);
    if (!match) {
      await sock.sendMessage(from, {
        text:
          '❌ Formato inválido.\n\n' +
          'Use:\n' +
          '.compra 500MB\n' +
          '.compra 1GB\n' +
          '.compra 50saldo',
        mentions: [sender],
        contextInfo: { stanzaId: msg.key.id, participant: sender, quotedMessage: msg.message }
      });
      break;
    }

    const valor = parseFloat(match[1].replace(',', '.'));
    const unidade = match[2].toLowerCase();

    if (!sistema[from].tipos?.[unidade]) {
      await sock.sendMessage(from, {
        text: `❌ O sistema de compras para (${unidade.toUpperCase()}) não está ativo neste grupo.`,
        mentions: [sender],
        contextInfo: { stanzaId: msg.key.id, participant: sender, quotedMessage: msg.message }
      });
      break;
    }

    let quantidadeMB = 0;
    if (unidade === 'mb') quantidadeMB = Math.round(valor);
    else if (unidade === 'gb') quantidadeMB = Math.round(valor * 1024);
    else if (unidade === 'saldo') quantidadeMB = Math.round(valor);

    let compras = {};
    if (fs.existsSync(pathCompras)) {
      compras = JSON.parse(fs.readFileSync(pathCompras, 'utf-8') || '{}');
    }

    // 🔹 Horário de Moçambique (ISO)
    function getMozTimeISOString() {
      const now = new Date();
      const utc = now.getTime() + now.getTimezoneOffset() * 60000;
      const moz = new Date(utc + 2 * 3600000);
      return moz.toISOString();
    }

    // 🔹 Data de Moçambique (YYYY-MM-DD)
    function getMozDateOnly() {
      const now = new Date();
      const utc = now.getTime() + now.getTimezoneOffset() * 60000;
      const moz = new Date(utc + 2 * 3600000);
      return moz.toISOString().split('T')[0];
    }

    verificarMudancaDeDia(compras);

    const userKey = numeroComprador;

    if (!compras[from]) compras[from] = {};
    if (!compras[from][userKey]) {
      compras[from][userKey] = {
        Megas: 0,
        Megashoje: 0,
        Saldo: 0,
        Saldohoje: 0,
        data: getMozTimeISOString()
      };
    }

    const user = compras[from][userKey];

    const hoje = getMozDateOnly();
    const ultimaData = user.data ? user.data.split('T')[0] : null;
    const novoDia = hoje !== ultimaData;

    if (novoDia) {
      user.Megashoje = 0;
      user.Saldohoje = 0;
    }

    if (unidade === 'mb' || unidade === 'gb') {
      user.Megas += quantidadeMB;
      user.Megashoje = novoDia ? 1 : user.Megashoje + 1;
    }

    if (unidade === 'saldo') {
      user.Saldo += quantidadeMB;
      user.Saldohoje = novoDia ? 1 : user.Saldohoje + 1;
    }

    user.data = getMozTimeISOString();

    fs.writeFileSync(pathCompras, JSON.stringify(compras, null, 2));

    const comprasHoje = unidade === 'saldo' ? user.Saldohoje : user.Megashoje;
    const totalCompradoUser = unidade === 'saldo' ? user.Saldo + 'Saldo' : user.Megas + 'MB';

    const ranking = Object.entries(compras[from])
      .sort((a, b) => {
        const totalA = unidade === 'saldo' ? a[1].Saldo : a[1].Megas;
        const totalB = unidade === 'saldo' ? b[1].Saldo : b[1].Megas;
        return totalB - totalA;
      });

    const posicao = ranking.findIndex(([id]) => id === userKey) + 1;
    const maiorCompradorTotal = ranking[0][1][unidade === 'saldo' ? 'Saldo' : 'Megas'];

    const texto =
`✅ *Concluído Com Sucesso* 🇲🇿
_╔════════════════════╗_
Obrigado @${numeroLimpo} por comprar *${quantidadeStr}${unidade === 'saldo' ? ' Saldo' : ''}*!
Essa é a sua *${comprasHoje}ª compra hoje!*
Você é o comprador nº
→*${posicao}* 
do grupo, com um total acumulado de
→*${totalCompradoUser}*!
O maior comprador do grupo acumulou *${maiorCompradorTotal}${unidade === 'saldo' ? ' Saldo' : 'MB'}*.
*Dr da empresa*: Blessed 258851907857
_╚════════════════════╝_`;

    await sock.sendMessage(from, {
      text: texto,
      mentions: [numeroComprador]
    });

  } catch (err) {
    console.error('❌ Erro no comando compra:', err);
    await sock.sendMessage(from, {
      text: '❌ Erro ao registrar a compra. Verifique se o bot é administrador.',
      mentions: [sender],
      contextInfo: { stanzaId: msg.key.id, participant: sender, quotedMessage: msg.message }
    });
  }
  break;
}

// COMANDO: .anular
case cmd.toLowerCase().startsWith('anular'): {
  try {
    // só em grupos
    if (!from.endsWith('@g.us')) {
      await sock.sendMessage(from, {
        text: '❌ Este comando só pode ser usado em grupos.',
        mentions: [sender],
        contextInfo: { stanzaId: msg.key.id, participant: sender, quotedMessage: msg.message }
      });
      break;
    }

    // verifica admin
    const metadata = await sock.groupMetadata(from);
    const admins = metadata.participants
      .filter(p => p.admin === 'admin' || p.admin === 'superadmin')
      .map(p => p.id);

    const senderId = msg.key.participant || msg.key.remoteJid;
    if (!admins.includes(senderId)) {
      await sock.sendMessage(from, {
        text: '❌ Apenas administradores podem anular compras.',
        mentions: [sender],
        contextInfo: { stanzaId: msg.key.id, participant: sender, quotedMessage: msg.message }
      });
      break;
    }

    // --- identificar comprador ---
    let comprador = null;

    // respondeu mensagem
    const quoted =
      msg.message?.extendedTextMessage?.contextInfo?.participant;
    if (quoted) comprador = quoted;

    // argumentos
    const argsRaw = cmd.replace(/^anular/i, '').trim();
    let quantidadeStr = null;

    if (argsRaw.includes(',')) {
      const partes = argsRaw.split(',');
      quantidadeStr = partes[0].trim();

      const numLimpo = partes[1].replace(/[^0-9]/g, '');
      if (numLimpo) comprador = numLimpo;
    } else {
      quantidadeStr = argsRaw;
    }

    if (!comprador || !quantidadeStr) {
      await sock.sendMessage(from, {
        text:
          '❌ Use:\n' +
          '.anular 500MB (respondendo a mensagem)\n' +
          '.anular 1GB,258852800194\n' +
          '.anular 100saldo',
        mentions: [sender],
        contextInfo: { stanzaId: msg.key.id, participant: sender, quotedMessage: msg.message }
      });
      break;
    }

    // --- parse quantidade ---
    const match = quantidadeStr.match(/^([\d.,]+)\s*(mb|gb|saldo)$/i);
    if (!match) {
      await sock.sendMessage(from, {
        text: '❌ Formato inválido. Ex: .anular 1GB | .anular 100saldo',
        mentions: [sender],
        contextInfo: { stanzaId: msg.key.id, participant: sender, quotedMessage: msg.message }
      });
      break;
    }

    const valor = parseFloat(match[1].replace(',', '.'));
    const unidade = match[2].toLowerCase();

    let quantidadeMB = 0;
    if (unidade === 'mb') quantidadeMB = Math.round(valor);
    if (unidade === 'gb') quantidadeMB = Math.round(valor * 1024);
    if (unidade === 'saldo') quantidadeMB = Math.round(valor);

    // --- ler compras ---
    let compras = {};
    if (fs.existsSync(pathCompras)) {
      compras = JSON.parse(fs.readFileSync(pathCompras, 'utf-8') || '{}');
    }

    if (!compras[from]) {
      await sock.sendMessage(from, {
        text: '❌ Este grupo não possui compras registradas.',
        mentions: [sender],
        contextInfo: { stanzaId: msg.key.id, participant: sender, quotedMessage: msg.message }
      });
      break;
    }

    let compradorId = comprador;

    if (!compradorId.includes('@')) {
      const tentativas = [
        `${compradorId}@s.whatsapp.net`,
        `${compradorId}@lid`
      ];

      compradorId = tentativas.find(id => compras[from][id]);

      if (!compradorId) {
        compradorId = Object.keys(compras[from]).find(id =>
          id.endsWith('@lid') && id.includes(comprador)
        );
      }
    }

    if (!compradorId || !compras[from][compradorId]) {
      await sock.sendMessage(from, {
        text: '❌ Este usuário não possui compras registradas.',
        mentions: [sender],
        contextInfo: { stanzaId: msg.key.id, participant: sender, quotedMessage: msg.message }
      });
      break;
    }

    const user = compras[from][compradorId];

    if (unidade === 'mb' || unidade === 'gb') {
      if (user.Megas < quantidadeMB) {
        await sock.sendMessage(from, {
          text: '❌ O usuário não possui essa quantidade de MB para anular.',
          mentions: [sender],
          contextInfo: { stanzaId: msg.key.id, participant: sender, quotedMessage: msg.message }
        });
        break;
      }
      user.Megas -= quantidadeMB;
    }

    if (unidade === 'saldo') {
      if (user.Saldo < quantidadeMB) {
        await sock.sendMessage(from, {
          text: '❌ O usuário não possui esse saldo para anular.',
          mentions: [sender],
          contextInfo: { stanzaId: msg.key.id, participant: sender, quotedMessage: msg.message }
        });
        break;
      }
      user.Saldo -= quantidadeMB;
    }

    fs.writeFileSync(pathCompras, JSON.stringify(compras, null, 2));

    const numeroLimpo = compradorId.split('@')[0];

    await sock.sendMessage(from, {
      text:
`🤖 ✅ *Compra Anulada com Sucesso*
👤 Cliente: @${numeroLimpo}
➖ Valor removido: *${quantidadeStr.toUpperCase()}*
📊 Saldo atual:
• Megas: *${user.Megas}MB*
• Saldo: *${user.Saldo}*`,
      mentions: [compradorId, sender],
      contextInfo: { stanzaId: msg.key.id, participant: sender, quotedMessage: msg.message }
    });

  } catch (err) {
    console.error('❌ Erro no comando anular:', err);
    try {
      await sock.sendMessage(from, {
        text: '❌ Erro ao anular a compra.',
        mentions: [sender],
        contextInfo: { stanzaId: msg.key.id, participant: sender, quotedMessage: msg.message }
      });
    } catch (_) {}
  }

  break;
}

// COMANDO: .clientes
case cmd.toLowerCase().startsWith('clientes'): {
  try {
    if (!from.endsWith('@g.us')) {
      await sock.sendMessage(from, {
        text: '❌ Este comando só pode ser usado em grupos.',
        mentions: [sender],
        contextInfo: { stanzaId: msg.key.id, participant: sender, quotedMessage: msg.message }
      });
      break;
    }

    const metadata = await sock.groupMetadata(from);
    const admins = metadata.participants
      .filter(p => p.admin === "admin" || p.admin === "superadmin")
      .map(p => p.id);

    const senderId = msg.key.participant || msg.key.remoteJid;
    if (!admins.includes(senderId)) {
      await sock.sendMessage(from, {
        text: '❌ Apenas administradores podem visualizar os clientes.',
        mentions: [sender],
        contextInfo: { stanzaId: msg.key.id, participant: sender, quotedMessage: msg.message }
      });
      break;
    }

    let compras = {};
    if (fs.existsSync(pathCompras)) {
      compras = JSON.parse(fs.readFileSync(pathCompras, 'utf-8') || '{}');
    }

    if (!compras[from]) {
      await sock.sendMessage(from, {
        text: '❌ Não há clientes registrados neste grupo.',
        mentions: [sender],
        contextInfo: { stanzaId: msg.key.id, participant: sender, quotedMessage: msg.message }
      });
      break;
    }

    const converterMB = (mb) => {
      const gb = (mb / 1024).toFixed(2);
      const tb = (mb / 1048576).toFixed(2);
      return `• ${mb}MB\n• Convertido: ${gb}GB, ${tb}TB`;
    };

    const mentionIds = Object.keys(compras[from]);

    const rankingMB = Object.entries(compras[from])
      .filter(([_, data]) => Number(data.Megas) > 0)
      .sort((a, b) => b[1].Megas - a[1].Megas)
      .map(([id, data], index) =>
        `${index + 1}) @${id.split('@')[0]}\n${converterMB(Number(data.Megas))}`
      );

    const rankingSaldo = Object.entries(compras[from])
      .filter(([_, data]) => Number(data.Saldo) > 0)
      .sort((a, b) => b[1].Saldo - a[1].Saldo)
      .map(([id, data], index) =>
        `${index + 1}) @${id.split('@')[0]}\n• ${data.Saldo} Saldo`
      );

    let mensagem = "🛒 *Clientes — Ranking por Produto*\n\n";

    mensagem += "📊 *MB*\n";
    mensagem += rankingMB.length
      ? rankingMB.join('\n\n')
      : "Nenhum cliente comprou MB.";

    mensagem += "\n\n💰 *Saldo*\n";
    mensagem += rankingSaldo.length
      ? rankingSaldo.join('\n\n')
      : "Nenhum cliente comprou Saldo.";

    await sock.sendMessage(from, {
      text: `✅ @${senderId.split('@')[0]} estou enviando a lista de clientes no seu privado...`,
      mentions: [senderId],
      contextInfo: { stanzaId: msg.key.id, participant: sender, quotedMessage: msg.message }
    });

    await sock.sendMessage(senderId, {
      text: mensagem,
      mentions: mentionIds
    });

  } catch (err) {
    console.error('❌ Erro no comando clientes:', err);
    await sock.sendMessage(from, {
      text: '❌ Erro ao gerar lista de clientes.',
      mentions: [sender],
      contextInfo: { stanzaId: msg.key.id, participant: sender, quotedMessage: msg.message }
    });
  }
  break;
}

// COMANDO: .resetcompras
case cmd.toLowerCase() === 'resetcompras': {
  try {
    if (!from.endsWith('@g.us')) {
      await sock.sendMessage(from, {
        text: '❌ Este comando só pode ser usado em grupos.',
        mentions: [sender],
        contextInfo: { stanzaId: msg.key.id, participant: sender, quotedMessage: msg.message }
      });
      break;
    }

    const metadata = await sock.groupMetadata(from);
    const admins = metadata.participants
      .filter(p => p.admin === 'admin' || p.admin === 'superadmin')
      .map(p => p.id);

    const senderId = msg.key.participant || msg.key.remoteJid;
    if (!admins.includes(senderId)) {
      await sock.sendMessage(from, {
        text: '❌ Apenas administradores podem resetar as compras do grupo.',
        mentions: [sender],
        contextInfo: { stanzaId: msg.key.id, participant: sender, quotedMessage: msg.message }
      });
      break;
    }

    let compras = {};
    if (fs.existsSync(pathCompras)) {
      compras = JSON.parse(fs.readFileSync(pathCompras, 'utf-8') || '{}');
    }

    if (!compras[from]) {
      await sock.sendMessage(from, {
        text: '❌ Não há compras registradas neste grupo para apagar.',
        mentions: [sender],
        contextInfo: { stanzaId: msg.key.id, participant: sender, quotedMessage: msg.message }
      });
      break;
    }

    delete compras[from];

    // Salva arquivo
    fs.writeFileSync(pathCompras, JSON.stringify(compras, null, 2));

    await sock.sendMessage(from, {
      text: `✅ @${senderId.split('@')[0]} todas as compras deste grupo foram apagadas com sucesso!`,
      mentions: [senderId],
      contextInfo: { stanzaId: msg.key.id, participant: sender }
    });

  } catch (err) {
    console.error('❌ Erro no comando resetcompras:', err);
    await sock.sendMessage(from, {
      text: '❌ Erro ao resetar as compras do grupo. verifique se o bot é administrador.',
      mentions: [sender],
      contextInfo: { stanzaId: msg.key.id, participant: sender, quotedMessage: msg.message }
    });
  }
  break;
}

// COMANDO: .antilink on/off
case cmd.toLowerCase().startsWith('antilink'): {
  try {
    if (!from.endsWith('@g.us')) {
      await sock.sendMessage(from, {
        text: '❌ Este comando só pode ser usado em grupos.',
        mentions: [sender],
        contextInfo: { stanzaId: msg.key.id, participant: sender, quotedMessage: msg.message }
      });
      break;
    }

    const metadata = await sock.groupMetadata(from);
    const admins = metadata.participants
      .filter(p => p.admin === 'admin' || p.admin === 'superadmin')
      .map(p => p.id);

    const senderId = msg.key.participant || msg.key.remoteJid;
    if (!admins.includes(senderId)) {
      await sock.sendMessage(from, {
        text: '❌ Apenas administradores podem usar o comando antilink.',
        mentions: [sender],
        contextInfo: { stanzaId: msg.key.id, participant: sender, quotedMessage: msg.message }
      });
      break;
    }

    const args = cmd.split(' ');
    if (!args[1] || !['on', 'off'].includes(args[1].toLowerCase())) {
      await sock.sendMessage(from, {
        text: '❌ Uso correto:\n.antilink on\n.antilink off',
        mentions: [sender],
        contextInfo: { stanzaId: msg.key.id, participant: sender, quotedMessage: msg.message }
      });
      break;
    }

if (!fs.existsSync('./config')) {
  fs.mkdirSync('./config', { recursive: true });
}

let antilinkData = {};
if (fs.existsSync(pathAntilink)) {
  antilinkData = JSON.parse(
    fs.readFileSync(pathAntilink, 'utf-8') || '{}'
  );
}

    const status = args[1].toLowerCase() === 'on';
    antilinkData[from] = status;

    fs.writeFileSync(pathAntilink, JSON.stringify(antilinkData, null, 2));

    await sock.sendMessage(from, {
      text: status
        ? '✅ Antilink *ativado* neste grupo.'
        : '❌ Antilink *desativado* neste grupo.',
      mentions: [sender],
      contextInfo: { stanzaId: msg.key.id, participant: sender, quotedMessage: msg.message }
    });

  } catch (err) {
    console.error('❌ Erro no comando antilink:', err);
    await sock.sendMessage(from, {
      text: '❌ Erro ao configurar o antilink. verifique se o bot é administrador.',
      mentions: [sender],
      contextInfo: { stanzaId: msg.key.id, participant: sender, quotedMessage: msg.message }
    });
  }
  break;
}

// COMANDO: .antifoto
case cmd.toLowerCase().startsWith('antifoto'): {
  const isGroup = from.endsWith('@g.us');

  if (!isGroup) {
    await sock.sendMessage(from, {
      text: '❌ Este comando funciona apenas em grupos.',
      mentions: [sender],
      contextInfo: {
        stanzaId: msg.key.id,
        participant: sender,
        quotedMessage: msg.message
      }
    });
    break;
  }

  const groupMeta = await sock.groupMetadata(from);
  const admins = groupMeta.participants
    .filter(p => p.admin === "admin" || p.admin === "superadmin")
    .map(p => p.id);

  const senderId = msg.key.participant || msg.key.remoteJid;

  if (!admins.includes(senderId)) {
    await sock.sendMessage(from, {
      text: '❌ Apenas administradores podem usar este comando!',
      mentions: [sender],
      contextInfo: {
        stanzaId: msg.key.id,
        participant: sender,
        quotedMessage: msg.message
      }
    });
    break;
  }

  const antifoto = carregarAntifoto();
  const arg = cmd.split(' ')[1]?.toLowerCase();

  if (arg === 'on') {
    antifoto[from] = true;
    salvarAntifoto(antifoto);

    await sock.sendMessage(from, {
      text: '🤖 ✅ Sistema antifoto *ativado* neste grupo!',
      mentions: [sender],
      contextInfo: {
        stanzaId: msg.key.id,
        participant: sender,
        quotedMessage: msg.message
      }
    });

  } else if (arg === 'off') {
    antifoto[from] = false;
    salvarAntifoto(antifoto);

    await sock.sendMessage(from, {
      text: '🤖 ✅️ Sistema antifoto *desativado* neste grupo!',
      mentions: [sender],
      contextInfo: {
        stanzaId: msg.key.id,
        participant: sender,
        quotedMessage: msg.message
      }
    });

  } else {
    await sock.sendMessage(from, {
      text: '❌ Use .antifoto on ou .antifoto off',
      mentions: [sender],
      contextInfo: {
        stanzaId: msg.key.id,
        participant: sender,
        quotedMessage: msg.message
      }
    });
  }

  break;
}

// COMANDO: .limpar
case cmd.toLowerCase() === 'limpar': {
  try {
    const isGroup = from.endsWith('@g.us');

    if (!isGroup) {
      await sock.sendMessage(from, {
        text: '❌ Este comando funciona apenas em grupos.',
        mentions: data.mentions,
        contextInfo: data.contextInfo
      });
      break;
    }

    const metadata = await sock.groupMetadata(from);
    const admins = metadata.participants
      .filter(p => p.admin === 'admin' || p.admin === 'superadmin')
      .map(p => p.id);

    if (!admins.includes(sender)) {
      await sock.sendMessage(from, {
        text: '❌ Apenas administradores podem usar este comando.',
        mentions: data.mentions,
        contextInfo: data.contextInfo
      });
      break;
    }

    const linhas = 4000;
    let texto = '🤖\n💨💨\n';

    for (let i = 0; i < linhas; i++) {
      texto += '\n';
    }

    texto += '❲❗❳ Lɪᴍᴘᴇᴢᴀ ᴅᴇ Cʜᴀᴛ Cᴏɴᴄʟᴜɪ́ᴅᴀ ✅';

    await sock.sendMessage(from, {
      text: texto,
      mentions: data.mentions,
      contextInfo: data.contextInfo
    });

  } catch (err) {
    console.error('Erro no comando .limpar:', err);
    await sock.sendMessage(from, {
      text: '❌ Erro ao executar a limpeza verifique se o bot é administrador.',
      mentions: data.mentions,
      contextInfo: data.contextInfo
    });
  }
  break;
}

// COMANDO: .rentanas
case cmd.toLowerCase() === 'rentanas': {
  try {
    const isGroup = from.endsWith('@g.us');

    if (!isGroup) {
      await sock.sendMessage(from, {
        text: '❌ Este comando funciona apenas em grupos.',
        mentions: data.mentions,
        contextInfo: data.contextInfo
      });
      break;
    }

    const metadata = await sock.groupMetadata(from);
    const admins = metadata.participants
      .filter(p => p.admin === 'admin' || p.admin === 'superadmin')
      .map(p => p.id);

    if (!admins.includes(sender)) {
      await sock.sendMessage(from, {
        text: '❌ Apenas administradores podem usar este comando.',
        mentions: data.mentions,
        contextInfo: data.contextInfo
      });
      break;
    }

    let compras = {};
    if (fs.existsSync(pathCompras)) {
      compras = JSON.parse(fs.readFileSync(pathCompras, 'utf-8'));
    }

    const comprasGrupo = compras[from] || {};

    const semCompras = metadata.participants
      .map(p => p.id)
      .filter(id => !comprasGrupo[id]);

    if (semCompras.length === 0) {
      await sock.sendMessage(from, {
        text: '✅ Todos os membros deste grupo já têm compras registradas.',
        mentions: data.mentions,
        contextInfo: data.contextInfo
      });
      break;
    }

    let texto = '🤖 *Membros sem compras*\n\n';

    semCompras.forEach((id, i) => {
      texto += `${i + 1}. @${id.split('@')[0]}\n`;
    });

    texto += `\n📌 Total: *${semCompras.length}* membros`;

    await sock.sendMessage(from, {
      text: texto,
      mentions: semCompras,
      contextInfo: data.contextInfo
    });

  } catch (err) {
    console.error('Erro no comando .rentanas:', err);
    await sock.sendMessage(from, {
      text: '❌ Erro ao verificar membros sem compras. verifique se o bot é administrador.',
      mentions: data.mentions,
      contextInfo: data.contextInfo
    });
  }
  break;
}

// COMANDO: .fantasmas
case cmd.toLowerCase().startsWith('fantasmas'): {
  try {
    const isGroup = from.endsWith('@g.us');

    if (!isGroup) {
      await sock.sendMessage(from, {
        text: '❌ Este comando funciona apenas em grupos.',
        mentions: data.mentions,
        contextInfo: data.contextInfo
      });
      break;
    }

    const metadata = await sock.groupMetadata(from);
    const admins = metadata.participants
      .filter(p => p.admin === 'admin' || p.admin === 'superadmin')
      .map(p => p.id);

    if (!admins.includes(sender)) {
      await sock.sendMessage(from, {
        text: '❌ Apenas administradores podem usar este comando.',
        mentions: data.mentions,
        contextInfo: data.contextInfo
      });
      break;
    }

    const qtd = parseInt(cmd.split(' ')[1]);
    if (!qtd || qtd <= 0) {
      await sock.sendMessage(from, {
        text: '❌ Use: .fantasmas 10',
        mentions: data.mentions,
        contextInfo: data.contextInfo
      });
      break;
    }

    let compras = {};
    if (fs.existsSync(pathCompras)) {
      compras = JSON.parse(fs.readFileSync(pathCompras, 'utf-8'));
    }

    const comprasGrupo = compras[from] || {};

    const fantasmas = metadata.participants
      .map(p => p.id)
      .filter(id => !comprasGrupo[id] && !admins.includes(id));

    if (fantasmas.length === 0) {
      await sock.sendMessage(from, {
        text: '✅ Nenhum membro sem compras encontrado.',
        mentions: data.mentions,
        contextInfo: data.contextInfo
      });
      break;
    }

    const remover = fantasmas
      .filter(id => !admins.includes(id))
      .slice(0, qtd);

    if (remover.length === 0) {
      await sock.sendMessage(from, {
        text: '⚠️ Apenas administradores encontrados. Nenhuma remoção foi feita.',
        mentions: data.mentions,
        contextInfo: data.contextInfo
      });
      break;
    }

    await sock.groupParticipantsUpdate(from, remover, 'remove');

    let texto = '🤖 *Fantasmas removidos*\n\n';

    remover.forEach((id, i) => {
      texto += `${i + 1}. @${id.split('@')[0]}\n`;
    });

    texto += `\n🗑️ Total removido: *${remover.length}*`;

    await sock.sendMessage(from, {
      text: texto,
      mentions: remover,
      contextInfo: data.contextInfo
    });

  } catch (err) {
    console.error('Erro no comando .fantasmas:', err);
    await sock.sendMessage(from, {
      text: '❌ Erro ao remover membros sem compras. verifique se o bot é administrador.',
      mentions: data.mentions,
      contextInfo: data.contextInfo
    });
  }
  break;
}

// COMANDO: .detector
case cmd.toLowerCase().startsWith('detector'): {
  try {
    const isGroup = from.endsWith('@g.us');

    if (!isGroup) {
      await sock.sendMessage(from, {
        text: '❌ Este comando funciona apenas em grupos.',
        mentions: data.mentions,
        contextInfo: data.contextInfo
      });
      break;
    }

    const metadata = await sock.groupMetadata(from);
    const admins = metadata.participants
      .filter(p => p.admin === 'admin' || p.admin === 'superadmin')
      .map(p => p.id);

    if (!admins.includes(sender)) {
      await sock.sendMessage(from, {
        text: '❌ Apenas administradores podem usar este comando.',
        mentions: data.mentions,
        contextInfo: data.contextInfo
      });
      break;
    }

    let detector = {};
    if (fs.existsSync(pathDetector)) {
      detector = JSON.parse(fs.readFileSync(pathDetector, 'utf-8'));
    }

    const arg = cmd.split(' ')[1]?.toLowerCase();
    if (arg === 'on') {
      detector[from] = true;
      fs.writeFileSync(pathDetector, JSON.stringify(detector, null, 2));
      await sock.sendMessage(from, {
        text: '🤖 🔍 Filtro de detector de comprovativos *ativado* neste grupo!',
        mentions: data.mentions,
        contextInfo: data.contextInfo
      });
    } else if (arg === 'off') {
      detector[from] = false;
      fs.writeFileSync(pathDetector, JSON.stringify(detector, null, 2));
      await sock.sendMessage(from, {
        text: '🤖 ✅️ Filtro de detector de comprovativos *desativado* neste grupo!',
        mentions: data.mentions,
        contextInfo: data.contextInfo
      });
    } else {
      await sock.sendMessage(from, {
        text: '❌ Use: .detector on ou .detector off',
        mentions: data.mentions,
        contextInfo: data.contextInfo
      });
    }

  } catch (err) {
    console.error('Erro no comando .detector:', err);
    await sock.sendMessage(from, {
      text: '❌ Erro ao configurar o detector de comprovativos. verifique se o bot é administrador.',
      mentions: data.mentions,
      contextInfo: data.contextInfo
    });
  }
  break;
}

// COMANDO: .status
case cmd.toLowerCase() === 'status': {
  try {
    const isGroup = from.endsWith('@g.us');
    if (!isGroup) {
      await sock.sendMessage(from, {
        text: '❌ este comando só pode ser usado em grupos.',
        mentions: [sender],
        contextInfo: { stanzaId: msg.key.id, participant: sender, quotedMessage: msg.message }
      });
      break;
    }

    const metadata = await sock.groupMetadata(from);

    const admins = metadata.participants
      .filter(p => p.admin === 'admin' || p.admin === 'superadmin')
      .map(p => p.id);

    const senderLid = (msg.key.participant || msg.key.remoteJid);
    const botLid = sock.user.id;

    if (!admins.includes(senderLid)) {
      await sock.sendMessage(from, {
        text: '❌ Apenas administradores podem usar este comando.',
        mentions: [sender],
        contextInfo: { stanzaId: msg.key.id, participant: sender, quotedMessage: msg.message }
      });
      break;
    }
    
    const statusDetector = lerStatus(pathDetector, from) ? '🟢 On' : '🔴 Off';
    const statusAntilink = lerStatus(pathAntilink, from) ? '🟢 On' : '🔴 Off';
    const statusAntifoto = lerStatus(pathAntifoto, from) ? '🟢 On' : '🔴 Off';
    const statusBemvindo = lerStatus(pathBemvindo, from) ? '🟢 On' : '🔴 Off';
    const statusNano = lerStatus(pathNano, from) ? '🟢 On' : '🔴 Off';
    const statusAnticon = lerStatus(pathAnticoncorrencia, from) ? '🟢 On' : '🔴 Off';

    const mensagem =
`🤖 ✅ *Status dos sistemas*

🧾 *Detector de comprovativos:* ${statusDetector}
🔗 *Antilink:* ${statusAntilink}
🖼️ *Antifoto:* ${statusAntifoto}
👋 *Boas-vindas:* ${statusBemvindo}
🧩 *Nano comandos:* ${statusNano}
🚫 *Anticoncorrência:* ${statusAnticon}

👑 *Solicitado por:* @${sender.split('@')[0]}`;

    await sock.sendMessage(from, {
      text: mensagem,
      mentions: [sender],
      contextInfo: {
        stanzaId: msg.key.id,
        participant: sender,
        quotedMessage: msg.message
      }
    });

  } catch (err) {
    console.error('Erro no comando status:', err);

    await sock.sendMessage(from, {
      text: '❌ erro ao Vverificar o status dos sistemas. verifique se o bot e administrador.',
      mentions: [sender],
      contextInfo: { stanzaId: msg.key.id, participant: sender, quotedMessage: msg.message }
    });
  }

  break;
}

// COMANDO: .todos
case cmd.toLowerCase().startsWith('todos'): {
  try {
    const isGroup = from.endsWith('@g.us');
    if (!isGroup) {
      await sock.sendMessage(from, {
        text: '❌ Este comando funciona apenas em grupos.',
        mentions: [sender],
        contextInfo: { stanzaId: msg.key.id, participant: sender, quotedMessage: msg.message }
      });
      break;
    }

    const metadata = await sock.groupMetadata(from);
    const admins = metadata.participants
      .filter(p => p.admin === 'admin' || p.admin === 'superadmin')
      .map(p => p.id);

    const senderLid = msg.key.participant || msg.key.remoteJid;
    if (!admins.includes(senderLid)) {
      await sock.sendMessage(from, {
        text: '❌ Apenas administradores podem usar este comando.',
        mentions: [sender],
        contextInfo: { stanzaId: msg.key.id, participant: sender, quotedMessage: msg.message }
      });
      break;
    }

    const texto = cmd.slice(5).trim();
    if (!texto) {
      await sock.sendMessage(from, {
        text: '❌ Use: .todos sua mensagem',
        mentions: [sender],
        contextInfo: { stanzaId: msg.key.id, participant: sender, quotedMessage: msg.message }
      });
      break;
    }

    const membros = metadata.participants
      .map(p => p.id)
      .filter(id => !admins.includes(id));

    if (membros.length === 0) {
      await sock.sendMessage(from, {
        text: '❌ Não há membros para mencionar.',
        mentions: [sender],
        contextInfo: { stanzaId: msg.key.id, participant: sender, quotedMessage: msg.message }
      });
      break;
    }

    await sock.sendMessage(from, {
      delete: msg.key
    }).catch(() => {});
    
    await sock.sendMessage(from, {
      text: texto,
      mentions: membros
    });

  } catch (err) {
    console.error('Erro no comando .todos:', err);
    await sock.sendMessage(from, {
      text: '❌ Ocorreu um erro ao executar o comando, verifique se o bot é administrador.',
      mentions: [sender],
      contextInfo: { stanzaId: msg.key.id, participant: sender, quotedMessage: msg.message }
    });
  }

  break;
}

// COMANDO: .addmpesa
case cmd.toLowerCase().startsWith('addmpesa'): {
  try {
    const isGroup = from.endsWith('@g.us');
    if (!isGroup) {
      await sock.sendMessage(from, {
        text: '❌ Este comando funciona apenas em grupos.',
        mentions: [sender],
        contextInfo: { stanzaId: msg.key.id, participant: sender, quotedMessage: msg.message }
      });
      break;
    }

    const metadata = await sock.groupMetadata(from);
    const admins = metadata.participants
      .filter(p => p.admin === 'admin' || p.admin === 'superadmin')
      .map(p => p.id);

    const senderLid = msg.key.participant || msg.key.remoteJid;
    if (!admins.includes(senderLid)) {
      await sock.sendMessage(from, {
        text: '❌ Apenas administradores podem usar este comando.',
        mentions: [sender],
        contextInfo: { stanzaId: msg.key.id, participant: sender, quotedMessage: msg.message }
      });
      break;
    }

    const dados = cmd.slice(8).trim();
    if (!dados || !dados.includes('-')) {
      await sock.sendMessage(from, {
        text: '❌ Use: .addmpesa 852800194-Nome Completo',
        mentions: [sender],
        contextInfo: { stanzaId: msg.key.id, participant: sender, quotedMessage: msg.message }
      });
      break;
    }

    const [numero, ...nomeArr] = dados.split('-');
    const nome = nomeArr.join('-').trim();

    const contas = carregarContas();

    if (!contas[from]) {
      contas[from] = { mpesa: [], emola: [] };
    }

    contas[from].mpesa.push({
      numero: numero.trim(),
      nome
    });

    salvarContas(contas);

    await sock.sendMessage(from, {
      text: `🤖 ✅ *Conta M-Pesa adicionada com sucesso!*\n\n📱 Número: *${numero.trim()}*\n👤 Nome: *${nome}*`,
      mentions: [sender],
      contextInfo: { stanzaId: msg.key.id, participant: sender, quotedMessage: msg.message }
    });

  } catch (err) {
    console.error('Erro no comando .addmpesa:', err);
    await sock.sendMessage(from, {
      text: '❌ Erro ao adicionar conta M-Pesa.',
      mentions: [sender],
      contextInfo: { stanzaId: msg.key.id, participant: sender, quotedMessage: msg.message }
    });
  }
  break;
}

// COMANDO: .addmola
case cmd.toLowerCase().startsWith('addmola'): {
  try {
    const isGroup = from.endsWith('@g.us');
    if (!isGroup) {
      await sock.sendMessage(from, {
        text: '❌ Este comando funciona apenas em grupos.',
        mentions: [sender],
        contextInfo: { stanzaId: msg.key.id, participant: sender, quotedMessage: msg.message }
      });
      break;
    }

    const metadata = await sock.groupMetadata(from);
    const admins = metadata.participants
      .filter(p => p.admin === 'admin' || p.admin === 'superadmin')
      .map(p => p.id);

    const senderLid = msg.key.participant || msg.key.remoteJid;
    if (!admins.includes(senderLid)) {
      await sock.sendMessage(from, {
        text: '❌ Apenas administradores podem usar este comando.',
        mentions: [sender],
        contextInfo: { stanzaId: msg.key.id, participant: sender, quotedMessage: msg.message }
      });
      break;
    }

    const dados = cmd.slice(7).trim();
    if (!dados || !dados.includes('-')) {
      await sock.sendMessage(from, {
        text: '❌ Use: .addmola 878339182-Nome Completo',
        mentions: [sender],
        contextInfo: { stanzaId: msg.key.id, participant: sender, quotedMessage: msg.message }
      });
      break;
    }

    const [numero, ...nomeArr] = dados.split('-');
    const nome = nomeArr.join('-').trim();

    const contas = carregarContas();

    if (!contas[from]) {
      contas[from] = { mpesa: [], emola: [] };
    }

    contas[from].emola.push({
      numero: numero.trim(),
      nome
    });

    salvarContas(contas);

    await sock.sendMessage(from, {
      text: `🤖 ✅ *Conta E-Mola adicionada com sucesso!*\n\n📱 Número: *${numero.trim()}*\n👤 Nome: *${nome}*`,
      mentions: [sender],
      contextInfo: { stanzaId: msg.key.id, participant: sender, quotedMessage: msg.message }
    });

  } catch (err) {
    console.error('Erro no comando .addmola:', err);
    await sock.sendMessage(from, {
      text: '❌ Erro ao adicionar conta E-Mola.',
      mentions: [sender],
      contextInfo: { stanzaId: msg.key.id, participant: sender, quotedMessage: msg.message }
    });
  }
  break;
}

// COMANDO: .contas
case cmd.toLowerCase() === 'contas': {
  try {
    const isGroup = from.endsWith('@g.us');
    if (!isGroup) {
      await sock.sendMessage(from, {
        text: '❌ Este comando funciona apenas em grupos.',
        mentions: [sender],
        contextInfo: { stanzaId: msg.key.id, participant: sender, quotedMessage: msg.message }
      });
      break;
    }

    const metadata = await sock.groupMetadata(from);
    const admins = metadata.participants
      .filter(p => p.admin === 'admin' || p.admin === 'superadmin')
      .map(p => p.id);

    const senderLid = msg.key.participant || msg.key.remoteJid;
    if (!admins.includes(senderLid)) {
      await sock.sendMessage(from, {
        text: '❌ Apenas administradores podem usar este comando.',
        mentions: [sender],
        contextInfo: { stanzaId: msg.key.id, participant: sender, quotedMessage: msg.message }
      });
      break;
    }

    const contas = carregarContas();

    if (!contas[from] || 
       ((!contas[from].mpesa || contas[from].mpesa.length === 0) &&
        (!contas[from].emola || contas[from].emola.length === 0))) {

      await sock.sendMessage(from, {
        text: '❌ Nenhuma conta cadastrada neste grupo.',
        mentions: [sender],
        contextInfo: { stanzaId: msg.key.id, participant: sender, quotedMessage: msg.message }
      });
      break;
    }

    let texto = '🤖 ✅ *contas registradas no grupo*\n\n';

    if (contas[from].mpesa && contas[from].mpesa.length > 0) {
      texto += '📲 *M-PESA*\n';
      contas[from].mpesa.forEach((c, i) => {
        texto += `${i + 1}. ${c.numero} - ${c.nome}\n`;
      });
      texto += '\n';
    }

    if (contas[from].emola && contas[from].emola.length > 0) {
      texto += '📲 *E-MOLA*\n';
      contas[from].emola.forEach((c, i) => {
        texto += `${i + 1}. ${c.numero} - ${c.nome}\n`;
      });
      texto += '\n';
    }

    texto += `👑 *Solicitado por:* @${sender.split('@')[0]}`;

    await sock.sendMessage(from, {
      text: texto,
      mentions: [sender],
      contextInfo: {
        stanzaId: msg.key.id,
        participant: sender,
        quotedMessage: msg.message
      }
    });

  } catch (err) {
    console.error('Erro no comando .contas:', err);
    await sock.sendMessage(from, {
      text: '❌ Erro ao listar as contas do grupo.',
      mentions: [sender],
      contextInfo: { stanzaId: msg.key.id, participant: sender, quotedMessage: msg.message }
    });
  }

  break;
}

// COMANDO: .delmpesa
case cmd.toLowerCase().startsWith('delmpesa'): {
  try {
    const isGroup = from.endsWith('@g.us');
    if (!isGroup) {
      await sock.sendMessage(from, {
        text: '❌ Este comando funciona apenas em grupos.',
        mentions: [sender],
        contextInfo: { stanzaId: msg.key.id, participant: sender, quotedMessage: msg.message }
      });
      break;
    }

    const metadata = await sock.groupMetadata(from);
    const admins = metadata.participants
      .filter(p => p.admin === 'admin' || p.admin === 'superadmin')
      .map(p => p.id);

    const senderLid = msg.key.participant || msg.key.remoteJid;
    if (!admins.includes(senderLid)) {
      await sock.sendMessage(from, {
        text: '❌ Apenas administradores podem usar este comando.',
        mentions: [sender],
        contextInfo: { stanzaId: msg.key.id, participant: sender, quotedMessage: msg.message }
      });
      break;
    }

    const indice = parseInt(cmd.split(' ')[1]);
    if (!indice || indice < 1) {
      await sock.sendMessage(from, {
        text: '❌ Use: .delmpesa número',
        mentions: [sender],
        contextInfo: { stanzaId: msg.key.id, participant: sender, quotedMessage: msg.message }
      });
      break;
    }

    const contas = carregarContas();

    if (!contas[from] || !contas[from].mpesa || !contas[from].mpesa[indice - 1]) {
      await sock.sendMessage(from, {
        text: '❌ Conta M-Pesa não encontrada.',
        mentions: [sender],
        contextInfo: { stanzaId: msg.key.id, participant: sender, quotedMessage: msg.message }
      });
      break;
    }

    const removida = contas[from].mpesa.splice(indice - 1, 1)[0];
    salvarContas(contas);

    await sock.sendMessage(from, {
      text: `🤖 ✅ Conta M-Pesa removida:\n📲 ${removida.numero} - ${removida.nome}`,
      mentions: [sender],
      contextInfo: {
        stanzaId: msg.key.id,
        participant: sender,
        quotedMessage: msg.message
      }
    });

  } catch (err) {
    console.error('Erro no comando .delmpesa:', err);
    await sock.sendMessage(from, {
      text: '❌ Erro ao remover a conta M-Pesa.',
      mentions: [sender],
      contextInfo: { stanzaId: msg.key.id, participant: sender, quotedMessage: msg.message }
    });
  }

  break;
}

// COMANDO: .delmola
case cmd.toLowerCase().startsWith('delmola'): {
  try {
    const isGroup = from.endsWith('@g.us');
    if (!isGroup) {
      await sock.sendMessage(from, {
        text: '❌ Este comando funciona apenas em grupos.',
        mentions: [sender],
        contextInfo: { stanzaId: msg.key.id, participant: sender, quotedMessage: msg.message }
      });
      break;
    }

    const metadata = await sock.groupMetadata(from);
    const admins = metadata.participants
      .filter(p => p.admin === 'admin' || p.admin === 'superadmin')
      .map(p => p.id);

    const senderLid = msg.key.participant || msg.key.remoteJid;
    if (!admins.includes(senderLid)) {
      await sock.sendMessage(from, {
        text: '❌ Apenas administradores podem usar este comando.',
        mentions: [sender],
        contextInfo: { stanzaId: msg.key.id, participant: sender, quotedMessage: msg.message }
      });
      break;
    }

    const indice = parseInt(cmd.split(' ')[1]);
    if (!indice || indice < 1) {
      await sock.sendMessage(from, {
        text: '❌ Use: .delmola número',
        mentions: [sender],
        contextInfo: { stanzaId: msg.key.id, participant: sender, quotedMessage: msg.message }
      });
      break;
    }

    const contas = carregarContas();

    if (!contas[from] || !contas[from].emola || !contas[from].emola[indice - 1]) {
      await sock.sendMessage(from, {
        text: '❌ Conta E-Mola não encontrada.',
        mentions: [sender],
        contextInfo: { stanzaId: msg.key.id, participant: sender, quotedMessage: msg.message }
      });
      break;
    }

    const removida = contas[from].emola.splice(indice - 1, 1)[0];
    salvarContas(contas);

    await sock.sendMessage(from, {
      text: `🤖 ✅ Conta E-Mola removida:\n📲 ${removida.numero} - ${removida.nome}`,
      mentions: [sender],
      contextInfo: {
        stanzaId: msg.key.id,
        participant: sender,
        quotedMessage: msg.message
      }
    });

  } catch (err) {
    console.error('Erro no comando .delmola:', err);
    await sock.sendMessage(from, {
      text: '❌ Erro ao remover a conta E-Mola.',
      mentions: [sender],
      contextInfo: { stanzaId: msg.key.id, participant: sender, quotedMessage: msg.message }
    });
  }

  break;
}
// COMANDO: .antivideo
case cmd.toLowerCase().startsWith('antivideo'): {
  try {
    const isGroup = from.endsWith('@g.us');
    if (!isGroup) {
      await sock.sendMessage(from, {
        text: '❌ Este comando funciona apenas em grupos.',
        mentions: [sender],
        contextInfo: {
          stanzaId: msg.key.id,
          participant: sender,
          quotedMessage: msg.message
        }
      });
      break;
    }

    const metadata = await sock.groupMetadata(from);
    const admins = metadata.participants
      .filter(p => p.admin === 'admin' || p.admin === 'superadmin')
      .map(p => p.id);

    const senderLid = msg.key.participant || msg.key.remoteJid;
    if (!admins.includes(senderLid)) {
      await sock.sendMessage(from, {
        text: '❌ Apenas administradores podem usar este comando.',
        mentions: [sender],
        contextInfo: {
          stanzaId: msg.key.id,
          participant: sender,
          quotedMessage: msg.message
        }
      });
      break;
    }

    const estadoArg = cmd.split(' ')[1];
    if (!estadoArg || !['on', 'off'].includes(estadoArg.toLowerCase())) {
      await sock.sendMessage(from, {
        text: '❌ Use:\n\n👉 `.antivideo on`\n👉 `.antivideo off`',
        mentions: [sender],
        contextInfo: {
          stanzaId: msg.key.id,
          participant: sender,
          quotedMessage: msg.message
        }
      });
      break;
    }

    const antivideo = carregarAntivideo();
    const estado = estadoArg.toLowerCase() === 'on';

    antivideo[from] = estado;
    salvarAntivideo(antivideo);

    const resposta = estado
      ? '🤖 ✅ antivideo *ativado*\n\n📵 O envio de *vídeos* está agora bloqueado neste grupo.'
      : '🤖 ❌ antivideo *desativado*\n\n🎥 O envio de *vídeos* foi liberado neste grupo.';

    await sock.sendMessage(from, {
      text: resposta,
      mentions: [sender],
      contextInfo: {
        stanzaId: msg.key.id,
        participant: sender,
        quotedMessage: msg.message
      }
    });

  } catch (err) {
    console.error('Erro no comando .antivideo:', err);
    await sock.sendMessage(from, {
      text: '❌ Erro ao executar o comando antivideo.',
      mentions: [sender],
      contextInfo: {
        stanzaId: msg.key.id,
        participant: sender,
        quotedMessage: msg.message
      }
    });
  }

  break;
}

// COMANDO: .antiaudios
case cmd.toLowerCase().startsWith('antiaudio'): {
  try {
    const isGroup = from.endsWith('@g.us');
    if (!isGroup) {
      await sock.sendMessage(from, {
        text: '❌ Este comando funciona apenas em grupos.',
        mentions: [sender],
        contextInfo: { stanzaId: msg.key.id, participant: sender, quotedMessage: msg.message }
      });
      break;
    }

    const metadata = await sock.groupMetadata(from);
    const admins = metadata.participants
      .filter(p => p.admin === 'admin' || p.admin === 'superadmin')
      .map(p => p.id);

    const senderLid = msg.key.participant || msg.key.remoteJid;
    if (!admins.includes(senderLid)) {
      await sock.sendMessage(from, {
        text: '❌ Apenas administradores podem usar este comando.',
        mentions: [sender],
        contextInfo: { stanzaId: msg.key.id, participant: sender, quotedMessage: msg.message }
      });
      break;
    }

    const arg = cmd.split(' ')[1];
    if (!arg || !['on', 'off'].includes(arg.toLowerCase())) {
      await sock.sendMessage(from, {
        text: '❌ Use:\n\n👉 `.antiaudio on`\n👉 `.antiaudio off`',
        mentions: [sender],
        contextInfo: { stanzaId: msg.key.id, participant: sender, quotedMessage: msg.message }
      });
      break;
    }

    const antiaudio = carregarAntiaudio();
    const estado = arg.toLowerCase() === 'on';

    antiaudio[from] = estado;
    salvarAntiaudio(antiaudio);

    const resposta = estado
      ? '🔊🚫 Antiaudio *ativado*\n\n envio de áudios estão bloqueados neste grupo.'
      : '🔊✅ Antiaudio *desativado*\n\n enviou de áudios estão liberados neste grupo.';

    await sock.sendMessage(from, {
      text: resposta,
      mentions: [sender],
      contextInfo: { stanzaId: msg.key.id, participant: sender, quotedMessage: msg.message }
    });

  } catch (err) {
    console.error('Erro no comando .antiaudios:', err);
    await sock.sendMessage(from, {
      text: '❌ Erro ao configurar o antiaudios.',
      mentions: [sender],
      contextInfo: { stanzaId: msg.key.id, participant: sender, quotedMessage: msg.message }
    });
  }

  break;
}

// COMANDO: .antistatus
case cmd.toLowerCase().startsWith('antttistatus'): {
  try {
    const isGroup = from.endsWith('@g.us');
    if (!isGroup) {
      await sock.sendMessage(from, {
        text: '❌ Este comando funciona apenas em grupos.',
        mentions: [sender],
        contextInfo: { stanzaId: msg.key.id, participant: sender, quotedMessage: msg.message }
      });
      break;
    }

    const metadata = await sock.groupMetadata(from);
    const admins = metadata.participants
      .filter(p => p.admin === 'admin' || p.admin === 'superadmin')
      .map(p => p.id);

    const senderLid = msg.key.participant || msg.key.remoteJid;
    if (!admins.includes(senderLid)) {
      await sock.sendMessage(from, {
        text: '❌ Apenas administradores podem usar este comando.',
        mentions: [sender],
        contextInfo: { stanzaId: msg.key.id, participant: sender, quotedMessage: msg.message }
      });
      break;
    }

    const arg = cmd.split(' ')[1];
    if (!arg || !['on', 'off'].includes(arg.toLowerCase())) {
      await sock.sendMessage(from, {
        text: '❌ Use:\n\n👉 `.antistatus on`\n👉 `.antistatus off`',
        mentions: [sender],
        contextInfo: { stanzaId: msg.key.id, participant: sender, quotedMessage: msg.message }
      });
      break;
    }

    const antistatus = carregarAntistatus();
    const estado = arg.toLowerCase() === 'on';

    antistatus[from] = estado;
    salvarAntistatus(antistatus);

    const resposta = estado
      ? '🟢🚫 antistatus *ativado*\n\nMenções do grupo em status serão bloqueadas.'
      : '🔴✅ antistatus *desativado*\n\nMenções em status estão permitidas.';

    await sock.sendMessage(from, {
      text: resposta,
      mentions: [sender],
      contextInfo: { stanzaId: msg.key.id, participant: sender, quotedMessage: msg.message }
    });

  } catch (err) {
    console.error('Erro no comando antistatus:', err);
  }

  break;
}

// COMANDO: .sair
case cmd.toLowerCase().startsWith('sair'): {
  try {
    // usa o commandBody igual no seu .sabes
    const args = cmd.split(' ').slice(1); 
    const targetGroup = args[0];

    if (!targetGroup || !targetGroup.endsWith('@g.us')) {
      await sock.sendMessage(from, {
        text: '❌ ID do grupo inválido. Use: .sair <id_do_grupo>',
        mentions: [sender],
        contextInfo: { stanzaId: msg.key.id, participant: sender, quotedMessage: msg.message }
      });
      break;
    }

    const mensagens = [
      '🤖 ✅ O bot vai sair do grupo agora!',
      '👋 Até mais!',
      '👨‍💻⚙️'
    ];

    // Obtem todos participantes para mencionar
    let mentions = [];
    try {
      const meta = await sock.groupMetadata(targetGroup);
      mentions = meta.participants.map(p => p.id);
    } catch {}

    function gerarMensagemFixa(texto, mentions, remoteJid) {
      return {
        requestPaymentMessage: {
          currencyCodeIso4217: "MZN",
          amount1000: 0,
          requestFrom: remoteJid,
          noteMessage: {
            extendedTextMessage: {
              text: texto,
              contextInfo: { mentionedJid: mentions }
            }
          }
        }
      };
    }

    let sentMsg = await sock.relayMessage(targetGroup, gerarMensagemFixa(mensagens[0], mentions, targetGroup), { messageId: Date.now().toString() });

    for (let i = 1; i < mensagens.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      await sock.relayMessage(targetGroup, gerarMensagemFixa(mensagens[i], mentions, targetGroup), { messageId: sentMsg.key.id });
    }

    await sock.groupLeave(targetGroup);

  } catch (err) {
    console.error('Erro no comando .sair:', err);
    await sock.sendMessage(from, {
      text: '❌ Ocorreu um erro ao executar o comando. Verifique se o bot está nesse grupo.',
      mentions: [sender],
      contextInfo: { stanzaId: msg.key.id, participant: sender, quotedMessage: msg.message }
    });
  }
  break;
}

// COMANDO: .ivannet
case cmd.toLowerCase() === 'ivannet': {
  try {
    // verifica se é grupo
    if (!from.endsWith('@g.us')) {
      await sock.sendMessage(from, {
        text: '🤖 ❌ ESTE COMANDO FUNCIONA APENAS EM GRUPOS.',
        mentions: [sender],
        contextInfo: {
          stanzaId: msg.key?.id,
          participant: sender,
          quotedMessage: msg.message
        }
      });
      break;
    }

    // verifica se é admin
    const groupMetadata = await sock.groupMetadata(from);
    const admins = groupMetadata.participants
      .filter(p => p.admin)
      .map(p => p.id);

    if (!admins.includes(sender)) {
      await sock.sendMessage(from, {
        text: '🤖 ❌ APENAS ADMINISTRADORES PODEM USAR ESTE COMANDO.',
        mentions: [sender],
        contextInfo: {
          stanzaId: msg.key?.id,
          participant: sender,
          quotedMessage: msg.message
        }
      });
      break;
    }

    // carrega arquivo dias.json
    const fs = await import('fs');
    let diasData = {};

    if (fs.existsSync(pathDias)) {
      diasData = JSON.parse(fs.readFileSync(pathDias, 'utf-8'));
    }

    // busca todos os grupos do bot
    const chats = await sock.groupFetchAllParticipating();
    const grupos = Object.values(chats);

    if (!grupos.length) {
      await sock.sendMessage(from, {
        text: '🤖 ❌ O BOT NÃO ESTÁ EM NENHUM GRUPO.',
        mentions: [sender],
        contextInfo: {
          stanzaId: msg.key?.id,
          participant: sender,
          quotedMessage: msg.message
        }
      });
      break;
    }

    let texto = `🤖 ✅ GRUPOS DO BOT (${grupos.length})\n\n`;
    const agora = Date.now();

    grupos.forEach((g, i) => {
      texto += `${i + 1}️⃣ GRUPO: ${g.subject}\n`;
      texto += `🆔 ID: ${g.id}\n`;

      const infoDias = diasData[g.id];

      if (infoDias) {
        const diasTotais = infoDias.dias ?? 0;
        const fim = infoDias.fim ?? 0;

        let diasRestantes = Math.ceil((fim - agora) / (1000 * 60 * 60 * 24));
        if (diasRestantes < 0) diasRestantes = 0;

        texto += `📆 DIAS TOTAIS: ${diasTotais}\n`;
        texto += `⏳ DIAS RESTANTES: ${diasRestantes}\n`;
      } else {
        texto += `📆 DIAS: SEM REGISTRO\n`;
      }

      texto += `\n`;
    });

    await sock.sendMessage(from, {
      text: texto,
      mentions: [sender],
      contextInfo: {
        stanzaId: msg.key?.id,
        participant: sender,
        quotedMessage: msg.message
      }
    });

  } catch (err) {
    console.error('Erro no comando .ivannet:', err);
    await sock.sendMessage(from, {
      text: '🤖 ❌ ERRO AO LISTAR OS GRUPOS.',
      mentions: [sender],
      contextInfo: {
        stanzaId: msg.key?.id,
        participant: sender,
        quotedMessage: msg.message
      }
    });
  }
  break;
}

// COMANDO: .gpcomandos
case cmd.toLowerCase() === 'gpcomandos': {
  const isGroup = from.endsWith('@g.us');

  if (!isGroup) {
    await sock.sendMessage(from, {
      text: '❌ Este comando funciona apenas em grupos.',
      mentions: [sender],
      contextInfo: {
        stanzaId: msg.key.id,
        participant: sender,
        quotedMessage: msg.message
      }
    });
    break;
  }

  const groupMeta = await sock.groupMetadata(from);
  const admins = groupMeta.participants
    .filter(p => p.admin === 'admin' || p.admin === 'superadmin')
    .map(p => p.id);

  const senderId = msg.key.participant || msg.key.remoteJid;

  if (!admins.includes(senderId)) {
    await sock.sendMessage(from, {
      text: '❌ Apenas administradores podem usar este comando!',
      mentions: [sender],
      contextInfo: {
        stanzaId: msg.key.id,
        participant: sender,
        quotedMessage: msg.message
      }
    });
    break;
  }

  function getDataHora() {
    const now = new Date();
    const pad = (n) => n.toString().padStart(2, '0');
    const data = `${pad(now.getDate())}/${pad(now.getMonth() + 1)}/${now.getFullYear()}`;
    const hora = `${pad(now.getHours())}:${pad(now.getMinutes())}`;
    return { data, hora };
  }

  const { data, hora } = getDataHora();

  const autorizacoes = carregarAutorizacoes();

  if (autorizacoes[from]) {
    await sock.sendMessage(from, {
      text:
`⚠️ Este grupo JÁ é um *Grupo de comandos*

👤 Ativado por: @${autorizacoes[from].ativado_por.split('@')[0]}
📅 Data: ${autorizacoes[from].data}
⏰ Hora: ${autorizacoes[from].hora}`,
      mentions: [autorizacoes[from].ativado_por],
      contextInfo: {
        stanzaId: msg.key.id,
        participant: sender,
        quotedMessage: msg.message
      }
    });
    break;
  }

  autorizacoes[from] = {
    ativado_por: sender,
    data,
    hora,
    timestamp: Date.now()
  };

  salvarAutorizacoes(autorizacoes);

  await sock.sendMessage(from, {
    text:
`🤖 ✅ *Grupo de comandos!*

🔐 Este grupo agora pode:
• Autorizar outros grupos
• Gerenciar aluguer do bot
• reduzir dias e muito mas

👤 Ativado por: @${sender.split('@')[0]}
📅 Em: ${data} às ${hora}`,
    mentions: [sender],
    contextInfo: {
      stanzaId: msg.key.id,
      participant: sender,
      quotedMessage: msg.message
    }
  });

  break;
}

// COMANDO: .on
case cmd.toLowerCase().startsWith('on'): {
  const isGroup = from.endsWith('@g.us');

  if (!isGroup) {
    await sock.sendMessage(from, {
      text: '❌ Este comando funciona apenas em grupos.',
      mentions: [sender],
      contextInfo: { stanzaId: msg.key.id, participant: sender, quotedMessage: msg.message }
    });
    break;
  }

  const groupMeta = await sock.groupMetadata(from);
  const admins = groupMeta.participants
    .filter(p => p.admin === 'admin' || p.admin === 'superadmin')
    .map(p => p.id);

  const senderId = msg.key.participant || msg.key.remoteJid;

  if (!admins.includes(senderId)) {
    await sock.sendMessage(from, {
      text: '❌ Apenas administradores podem usar este comando!',
      mentions: [sender],
      contextInfo: { stanzaId: msg.key.id, participant: sender, quotedMessage: msg.message }
    });
    break;
  }

  const autorizacoes = carregarAutorizacoes();
  if (!autorizacoes[from]) {
    await sock.sendMessage(from, {
      text: '⚠️ Este grupo não é autorizado para usar comandos de dias!',
      mentions: [sender],
      contextInfo: { stanzaId: msg.key.id, participant: sender, quotedMessage: msg.message }
    });
    break;
  }

  const args = cmd.split(' ').slice(1).join(''); // remove ".on "
  const partes = args.split(',');
  const diasAdicionar = parseInt(partes[0]);
  const grupoAlvo = partes[1]?.trim() || from; 

  if (!diasAdicionar || diasAdicionar <= 0) {
    await sock.sendMessage(from, {
      text: '❌ Use: .on <dias> [,idDoGrupo]',
      mentions: [sender],
      contextInfo: { stanzaId: msg.key.id, participant: sender, quotedMessage: msg.message }
    });
    break;
  }

  const diasData = carregarDias();

  const agora = Date.now();
  let diasExistentes = diasData[grupoAlvo] || { dias: 0, fim: agora };

  if (diasExistentes.fim < agora) {
    diasExistentes.dias = 0;
    diasExistentes.fim = agora;
  }

  diasExistentes.dias += diasAdicionar;
  diasExistentes.fim = agora + diasExistentes.dias * 24 * 60 * 60 * 1000;

  diasData[grupoAlvo] = diasExistentes;
  salvarDias(diasData);

  const diasRestantes = Math.ceil((diasExistentes.fim - agora) / (1000 * 60 * 60 * 24));

  await sock.sendMessage(from, {
    text:
`✅ *Dias atualizados com sucesso* 🌟

📌 Grupo: ${grupoAlvo}
⏳ Dias adicionados: ${diasAdicionar}
🗓️ Total de dias restantes: ${diasRestantes} dia(s)
📅 Expira em: ${new Date(diasExistentes.fim).toLocaleString()}

👤 Comando executado por: @${sender.split('@')[0]}`,
    mentions: [sender],
    contextInfo: { stanzaId: msg.key.id, participant: sender, quotedMessage: msg.message }
  });

  break;
}

// COMANDO: .bot
case cmd.toLowerCase() === 'bot': {
  const isGroup = from.endsWith('@g.us');

  if (!isGroup) {
    await sock.sendMessage(from, {
      text: '❌ Este comando funciona apenas em grupos.',
      mentions: [sender],
      contextInfo: { stanzaId: msg.key.id, participant: sender, quotedMessage: msg.message }
    });
    break;
  }

  const groupMeta = await sock.groupMetadata(from);
  const admins = groupMeta.participants
    .filter(p => p.admin === 'admin' || p.admin === 'superadmin')
    .map(p => p.id);

  const senderId = msg.key.participant || msg.key.remoteJid;

  if (!admins.includes(senderId)) {
    await sock.sendMessage(from, {
      text: '❌ Apenas administradores podem usar este comando!',
      mentions: [sender],
      contextInfo: { stanzaId: msg.key.id, participant: sender, quotedMessage: msg.message }
    });
    break;
  }

  const diasData = carregarDias();

  if (!diasData[from] || diasData[from].dias <= 0 || diasData[from].fim < Date.now()) {
    await sock.sendMessage(from, {
      text: '⚠️ Este grupo não tem dias ativos ou já expiraram!',
      mentions: [sender],
      contextInfo: { stanzaId: msg.key.id, participant: sender, quotedMessage: msg.message }
    });
    break;
  }

  const agora = Date.now();
  const fim = diasData[from].fim;

  let diff = fim - agora;

  if (diff < 0) diff = 0;

  const dias = Math.floor(diff / (1000 * 60 * 60 * 24));
  const horas = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutos = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const segundos = Math.floor((diff % (1000 * 60)) / 1000);

  await sock.sendMessage(from, {
    text:
`🤖 *Informações do bot* 🌟

📌 Grupo: ${from}
⏳ Tempo restante: ${dias} dias, ${horas} horas, ${minutos} minutos e ${segundos} segundos
📅 Expira em: ${new Date(fim).toLocaleString()}

👤 Comando usado por: @${sender.split('@')[0]}`,
    mentions: [sender],
    contextInfo: { stanzaId: msg.key.id, participant: sender, quotedMessage: msg.message }
  });

  break;
}

// COMANDO: .off
case cmd.toLowerCase().startsWith('off'): {
  const isGroup = from.endsWith('@g.us');

  if (!isGroup) {
    await sock.sendMessage(from, {
      text: '❌ Este comando funciona apenas em grupos!',
      mentions: [sender],
      contextInfo: { stanzaId: msg.key.id, participant: sender, quotedMessage: msg.message }
    });
    break;
  }

  const metadata = await sock.groupMetadata(from);
  const admins = metadata.participants
    .filter(p => p.admin === 'admin' || p.admin === 'superadmin')
    .map(p => p.id);

  const senderId = msg.key.participant || msg.key.remoteJid;
  if (!admins.includes(senderId)) {
    await sock.sendMessage(from, {
      text: '❌ Apenas administradores podem usar este comando!',
      mentions: [sender],
      contextInfo: { stanzaId: msg.key.id, participant: sender, quotedMessage: msg.message }
    });
    break;
  }

  const autorizacoes = carregarAutorizacoes();
  if (!autorizacoes[from]) {
    await sock.sendMessage(from, {
      text: '⚠️ Este grupo não é autorizado para usar comandos de dias!',
      mentions: [sender],
      contextInfo: { stanzaId: msg.key.id, participant: sender, quotedMessage: msg.message }
    });
    break;
  }

  // 🔹 OBRIGATÓRIO: dias,grupoId
  const argsRaw = cmd.split(' ')[1];
  if (!argsRaw || !argsRaw.includes(',')) {
    await sock.sendMessage(from, {
      text:
        '❌ Uso incorreto!\n\n' +
        'Use exatamente assim:\n' +
        '.off 3,120363419232463692@g.us',
      mentions: [sender],
      contextInfo: { stanzaId: msg.key.id, participant: sender, quotedMessage: msg.message }
    });
    break;
  }

  const [diasStr, grupoId] = argsRaw.split(',');
  const diasRemover = parseInt(diasStr);

  if (!diasRemover || diasRemover <= 0 || !grupoId.endsWith('@g.us')) {
    await sock.sendMessage(from, {
      text: '❌ Dias ou ID do grupo inválidos!',
      mentions: [sender],
      contextInfo: { stanzaId: msg.key.id, participant: sender, quotedMessage: msg.message }
    });
    break;
  }

  const diasData = carregarDias();

  if (!diasData[grupoId]) {
    await sock.sendMessage(from, {
      text: '⚠️ O grupo informado não possui dias ativos!',
      mentions: [sender],
      contextInfo: { stanzaId: msg.key.id, participant: sender, quotedMessage: msg.message }
    });
    break;
  }

  diasData[grupoId].diasRestantes = Math.max(
    0,
    (diasData[grupoId].diasRestantes || 0) - diasRemover
  );

  const agora = Date.now();
  const msPorDia = 24 * 60 * 60 * 1000;
  diasData[grupoId].fim = agora + (diasData[grupoId].diasRestantes * msPorDia);

  salvarDias(diasData);

  await sock.sendMessage(from, {
    text:
`✅ *Dias removidos com sucesso!*

📍 Grupo alvo: ${grupoId}
➖ Dias removidos: ${diasRemover}
🗓️ Dias restantes: ${diasData[grupoId].diasRestantes}
📅 Expira em: ${new Date(diasData[grupoId].fim).toLocaleString()}`,
    mentions: [sender],
    contextInfo: { stanzaId: msg.key.id, participant: sender, quotedMessage: msg.message }
  });

  break;
}
// COMANDO: .entrar
case cmd.toLowerCase().startsWith('entrar'): {
  try {
    const args = cmd.split(' ').slice(1);
    const link = args[0];

    if (!link || !link.includes('chat.whatsapp.com/')) {
      await sock.sendMessage(from, {
        text: '❌ Envie o link do grupo.\n\nExemplo:\n.entrar https://chat.whatsapp.com/XXXXXXXXXXX',
        mentions: [sender],
        contextInfo: { stanzaId: msg.key.id, participant: sender, quotedMessage: msg.message }
      });
      break;
    }

    const codigo = link.split('chat.whatsapp.com/')[1]?.trim();
    if (!codigo) {
      await sock.sendMessage(from, {
        text: '❌ Link inválido.',
        mentions: [sender],
        contextInfo: { stanzaId: msg.key.id, participant: sender, quotedMessage: msg.message }
      });
      break;
    }

    await sock.groupAcceptInvite(codigo);

    await sock.sendMessage(from, {
      text: '✅ Entrei no grupo com sucesso!',
      mentions: [sender],
      contextInfo: { stanzaId: msg.key.id, participant: sender, quotedMessage: msg.message }
    });

  } catch (err) {
    console.error('Erro no comando entrar:', err);

    await sock.sendMessage(from, {
      text: '❌ Não foi possível entrar no grupo. O link pode estar inválido ou expirado.',
      mentions: [sender],
      contextInfo: { stanzaId: msg.key.id, participant: sender, quotedMessage: msg.message }
    });
  }

  break;
}

// COMANDO: .promover
case cmd.toLowerCase().startsWith('promover'): {
  const isGroup = from.endsWith('@g.us');

  if (!isGroup) {
    await sock.sendMessage(from, {
      text: '❌ Este comando funciona apenas em grupos.',
      mentions: [sender],
      contextInfo: { stanzaId: msg.key.id, participant: sender, quotedMessage: msg.message }
    });
    break;
  }

  const metadata = await sock.groupMetadata(from).catch(() => null);
  const admins = metadata?.participants
    .filter(p => p.admin === 'admin' || p.admin === 'superadmin')
    .map(p => p.id);

  const senderId = msg.key.participant || msg.key.remoteJid;
  if (!admins?.includes(senderId)) {
    await sock.sendMessage(from, {
      text: '❌ Apenas administradores podem promover membros.',
      mentions: [sender],
      contextInfo: { stanzaId: msg.key.id, participant: sender, quotedMessage: msg.message }
    });
    break;
  }

  const mentioned = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid;

  if (!mentioned || mentioned.length === 0) {
    await sock.sendMessage(from, {
      text: '❌ Mencione o membro que deseja promover.\n\nExemplo:\n.promover @usuario',
      mentions: [sender],
      contextInfo: { stanzaId: msg.key.id, participant: sender, quotedMessage: msg.message }
    });
    break;
  }

  const alvo = mentioned[0];
  const alvoData = metadata.participants.find(p => p.id === alvo);

  if (!alvoData) {
    await sock.sendMessage(from, {
      text: '❌ Usuário não encontrado neste grupo.',
      mentions: [sender],
      contextInfo: { stanzaId: msg.key.id, participant: sender, quotedMessage: msg.message }
    });
    break;
  }

  if (alvoData.admin === 'admin' || alvoData.admin === 'superadmin') {
    await sock.sendMessage(from, {
      text: '⚠️ Este membro já é administrador.',
      mentions: [alvo],
      contextInfo: { stanzaId: msg.key.id, participant: sender, quotedMessage: msg.message }
    });
    break;
  }

  try {
    await sock.groupParticipantsUpdate(from, [alvo], 'promote');

    await sock.sendMessage(from, {
      text: '✅ Membro promovido a administrador.',
      mentions: [alvo],
      contextInfo: { stanzaId: msg.key.id, participant: sender, quotedMessage: msg.message }
    });

  } catch (err) {
    console.error('Erro no comando promover:', err);

    await sock.sendMessage(from, {
      text: '❌ Erro ao promover membro. Verifique se o bot é administrador.',
      mentions: [sender],
      contextInfo: { stanzaId: msg.key.id, participant: sender, quotedMessage: msg.message }
    });
  }

  break;
}

// COMANDO: .demote
case cmd.toLowerCase().startsWith('demote'): {
  const isGroup = from.endsWith('@g.us');

  if (!isGroup) {
    await sock.sendMessage(from, {
      text: '❌ Este comando funciona apenas em grupos.',
      mentions: [sender],
      contextInfo: { stanzaId: msg.key.id, participant: sender, quotedMessage: msg.message }
    });
    break;
  }

  const metadata = await sock.groupMetadata(from).catch(() => null);
  const admins = metadata?.participants
    .filter(p => p.admin === 'admin' || p.admin === 'superadmin')
    .map(p => p.id);

  const senderId = msg.key.participant || msg.key.remoteJid;
  if (!admins?.includes(senderId)) {
    await sock.sendMessage(from, {
      text: '❌ Apenas administradores podem rebaixar membros.',
      mentions: [sender],
      contextInfo: { stanzaId: msg.key.id, participant: sender, quotedMessage: msg.message }
    });
    break;
  }

  const mentioned = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid;

  if (!mentioned || mentioned.length === 0) {
    await sock.sendMessage(from, {
      text: '❌ Mencione o administrador que deseja rebaixar.\n\nExemplo:\n.demote @admin',
      mentions: [sender],
      contextInfo: { stanzaId: msg.key.id, participant: sender, quotedMessage: msg.message }
    });
    break;
  }

  const alvo = mentioned[0];
  const alvoData = metadata.participants.find(p => p.id === alvo);

  if (!alvoData) {
    await sock.sendMessage(from, {
      text: '❌ Usuário não encontrado neste grupo.',
      mentions: [sender],
      contextInfo: { stanzaId: msg.key.id, participant: sender, quotedMessage: msg.message }
    });
    break;
  }

  if (!alvoData.admin) {
    await sock.sendMessage(from, {
      text: '⚠️ Este membro não é administrador.',
      mentions: [alvo],
      contextInfo: { stanzaId: msg.key.id, participant: sender, quotedMessage: msg.message }
    });
    break;
  }

  try {
    await sock.groupParticipantsUpdate(from, [alvo], 'demote');

    await sock.sendMessage(from, {
      text: '🔻 Administrador rebaixado com sucesso.',
      mentions: [alvo],
      contextInfo: { stanzaId: msg.key.id, participant: sender, quotedMessage: msg.message }
    });

  } catch (err) {
    console.error('Erro no comando demote:', err);

    await sock.sendMessage(from, {
      text: '❌ Erro ao rebaixar administrador. Verifique se o bot é administrador.',
      mentions: [sender],
      contextInfo: { stanzaId: msg.key.id, participant: sender, quotedMessage: msg.message }
    });
  }

  break;
}

// COMANDO: .pp
case cmd.toLowerCase() === 'pp': {
  try {
    if (!from.endsWith('@g.us')) {
      await sock.sendMessage(from, { text: '❌ Este comando funciona apenas em grupos.' });
      break;
    }

    const metadata = await sock.groupMetadata(from);
    const admins = metadata.participants
      .filter(p => p.admin === 'admin' || p.admin === 'superadmin')
      .map(p => p.id);

    const senderId = msg.key.participant || msg.key.remoteJid;
    if (!admins.includes(senderId)) {
      await sock.sendMessage(from, {
        text: '❌ Apenas administradores podem usar este comando.',
        mentions: [sender],
        contextInfo: { stanzaId: msg.key.id, participant: sender, quotedMessage: msg.message }
      });
      break;
    }

    const alvo =
      msg.message?.extendedTextMessage?.contextInfo?.participant;

    if (!alvo) {
      await sock.sendMessage(from, {
        text: '❌ Use este comando respondendo à mensagem do usuário.',
        mentions: [sender],
        contextInfo: { stanzaId: msg.key.id, participant: sender, quotedMessage: msg.message }
      });
      break;
    }

    let compras = {};
    if (fs.existsSync(pathCompras)) {
      compras = JSON.parse(fs.readFileSync(pathCompras, 'utf-8') || '{}');
    }

    if (!compras[from] || !compras[from][alvo]) {
      await sock.sendMessage(from, {
        text: '❌ Este usuário não possui compras registradas.',
        mentions: [alvo],
        contextInfo: { stanzaId: msg.key.id, participant: sender, quotedMessage: msg.message }
      });
      break;
    }

    const user = compras[from][alvo];

    const rankingMegas = Object.entries(compras[from])
      .filter(([, d]) => (d.Megas || 0) > 0)
      .sort((a, b) => (b[1].Megas || 0) - (a[1].Megas || 0));

    const rankingSaldo = Object.entries(compras[from])
      .filter(([, d]) => (d.Saldo || 0) > 0)
      .sort((a, b) => (b[1].Saldo || 0) - (a[1].Saldo || 0));

    const posMegas = rankingMegas.findIndex(([id]) => id === alvo) + 1;
    const posSaldo = rankingSaldo.findIndex(([id]) => id === alvo) + 1;

    const numero = alvo.split('@')[0];

    let texto = `✅ *Concluído Ranking Membro* 🇲🇿\n_╔════════════════════╗_\n`;

    if (user.Megas > 0) {
      texto += `📶 *Megas:* *${user.Megas}MB*\n🏆 *Posição em Megas:* *${posMegas}º lugar*\n`;
    }

    if (user.Saldo > 0) {
      texto += `💰 *Saldo:* *${user.Saldo}*\n🏆 *Posição em Saldo:* *${posSaldo}º lugar*\n`;
    }
      *Dr da empresa* 851907857
    texto += `_╚════════════════════╝_`;

    await sock.sendMessage(from, {
      text: texto,
      mentions: [alvo],
      contextInfo: { stanzaId: msg.key.id, participant: sender, quotedMessage: msg.message }
    });

  } catch (err) {
    console.error('❌ Erro no comando .pp:', err);
    await sock.sendMessage(from, { text: '❌ Erro ao consultar posição.' });
  }

  break;
}

// COMANDO: .p
case cmd.toLowerCase() === 'p': {
  try {
    if (!from.endsWith('@g.us')) {
      await sock.sendMessage(from, { 
        text: '❌ Este comando funciona apenas em grupos.' 
      });
      break;
    }

    let compras = {};
    if (fs.existsSync(pathCompras)) {
      compras = JSON.parse(fs.readFileSync(pathCompras, 'utf-8') || '{}');
    }

    if (!compras[from] || !compras[from][sender]) {
      await sock.sendMessage(from, {
        text: '❌ Você ainda não possui compras registradas.',
        mentions: [sender],
        contextInfo: { stanzaId: msg.key.id, participant: sender, quotedMessage: msg.message }
      });
      break;
    }

    const user = compras[from][sender];

    // ranking megas
    const rankingMegas = Object.entries(compras[from])
      .filter(([, d]) => (d.Megas || 0) > 0)
      .sort((a, b) => (b[1].Megas || 0) - (a[1].Megas || 0));

    // ranking saldo
    const rankingSaldo = Object.entries(compras[from])
      .filter(([, d]) => (d.Saldo || 0) > 0)
      .sort((a, b) => (b[1].Saldo || 0) - (a[1].Saldo || 0));

    const posMegas = user.Megas ? rankingMegas.findIndex(([id]) => id === sender) + 1 : null;
    const posSaldo = user.Saldo ? rankingSaldo.findIndex(([id]) => id === sender) + 1 : null;

    // --- montar mensagem estilizada ---
    let texto = '✅ *Concluído Ranking sua posição🇲🇿*\n_╔════════════════════════╗_\n';

    if (user.Megas) {
      texto += `📶 *Megabytes Comprados:* ${user.Megas}MB\n`;
      texto += `🏆 *Posição em Megas:* ${posMegas}º lugar\n`;
    }

    if (user.Saldo) {
      texto += `💰 *Saldo:* ${user.Saldo} MT\n`;
      texto += `🏆 *Posição em saldo:* ${posSaldo}º lugar\n`;
    }

    texto += '📊 *Status:* Ativo ✅\n';
    texto += '🥇 *Ranking entre membros*\n_╚════════════════════════╝_';

    await sock.sendMessage(from, {
      text: texto.trim(),
      mentions: [sender],
      contextInfo: { stanzaId: msg.key.id, participant: sender, quotedMessage: msg.message }
    });

  } catch (err) {
    console.error('❌ Erro no comando .p:', err);
    await sock.sendMessage(from, { 
      text: '❌ Erro ao consultar sua posição.',
      mentions: [sender],
      contextInfo: { stanzaId: msg.key.id, participant: sender, quotedMessage: msg.message }
    });
  }

  break;
}

// COMANDO: .x
case cmd.toLowerCase() === 'x': {
  try {
    const context = msg.message?.extendedTextMessage?.contextInfo;

    if (!context || !context.quotedMessage) {
      await sock.sendMessage(from, {
        text: '❌ Use o comando respondendo a uma foto, vídeo ou áudio em visualização única.',
        mentions: [sender]
      });
      break;
    }

const groupMeta = await sock.groupMetadata(from);
  const admins = groupMeta.participants
    .filter(p => p.admin === "admin" || p.admin === "superadmin")
    .map(p => p.id);

  const senderId = msg.key.participant || msg.key.remoteJid;

  if (!admins.includes(senderId)) {
    await sock.sendMessage(from, {
      text: '❌ Apenas administradores podem usar este comando!',
      mentions: [sender],
      contextInfo: { stanzaId: msg.key.id, participant: sender, quotedMessage: msg.message }
    });
    break;
  }

    const quoted = context.quotedMessage;

    const media =
      quoted.imageMessage ||
      quoted.videoMessage ||
      quoted.audioMessage;

    if (!media) {
      await sock.sendMessage(from, {
        text: '❌ A mensagem respondida não contém mídia.',
        mentions: [sender]
      });
      break;
    }

    if (media.viewOnce !== true) {
      await sock.sendMessage(from, {
        text: '❌ Essa mídia não está em visualização única.',
        mentions: [sender]
      });
      break;
    }

    const buffer = await downloadMediaMessage(
      {
        key: {
          remoteJid: from,
          id: context.stanzaId,
          participant: context.participant
        },
        message: quoted
      },
      'buffer',
      {},
      { logger: console }
    );

    let envio = {};

    if (quoted.imageMessage) {
      envio = {
        image: buffer,
        caption: '📸 Visualização única removida'
      };
    } else if (quoted.videoMessage) {
      envio = {
        video: buffer,
        caption: '🎥 Visualização única removida'
      };
    } else if (quoted.audioMessage) {
      envio = {
        audio: buffer,
        mimetype: quoted.audioMessage.mimetype,
        ptt: false
      };
    }

    await sock.sendMessage(from, envio);

  } catch (err) {
    console.error('❌ Erro no comando .x:', err);
    await sock.sendMessage(from, {
      text: '❌ Erro ao remover visualização única. verifique se o bot é administrador.',
      mentions: [sender]
    });
  }
  break;
}

// COMANDO: .carregar
case cmd.toLowerCase() === 'carregar': {
  try {
    if (!from.endsWith('@g.us')) {
      await sock.sendMessage(from, { text: '❌ este comando só pode ser usado em grupos.' });
      break;
    }

    const metadata = await sock.groupMetadata(from);
    const admins = metadata.participants
      .filter(p => p.admin === 'admin' || p.admin === 'superadmin')
      .map(p => p.id);

    const senderId = msg.key.participant || msg.key.remoteJid;
    if (!admins.includes(senderId)) {
      await sock.sendMessage(from, { text: '❌ apenas administradores podem usar este comando.' });
      break;
    }

    if (!fs.existsSync(pathCompras)) {
      await sock.sendMessage(from, { text: '❌ Não encontrei o arquivo de compras, contacte o suporte.' });
      break;
    }

    const compras = JSON.parse(fs.readFileSync(pathCompras, 'utf-8') || '{}');

    let backup = {};
    if (fs.existsSync(pathdadoscompras)) {
      backup = JSON.parse(fs.readFileSync(pathdadoscompras, 'utf-8') || '{}');
    }

    // 🔹 CARREGA TODOS OS GRUPOS
    for (const [groupId, usuarios] of Object.entries(compras)) {
      backup[groupId] = {};

      for (const [userId, dados] of Object.entries(usuarios)) {
        backup[groupId][userId] = {
          Megas: dados.Megas || 0,
          Megashoje: dados.Megashoje || 0,
          Saldo: dados.Saldo || 0,
          Saldohoje: dados.Saldohoje || 0,
          data: dados.data || new Date().toISOString()
        };
      }
    }

    fs.writeFileSync(pathdadoscompras, JSON.stringify(backup, null, 2));

    await sock.sendMessage(from, {
      text: '🤖 ✅ todas as compras de todos os grupos foram carregadas!\n📦 backup completo salvo.'
    });

  } catch (err) {
    console.error('Erro no .carregar:', err);
    await sock.sendMessage(from, { text: '❌ erro ao fazer backup.' });
  }
  break;
}

// COMANDO: .restaurar
case cmd.toLowerCase() === 'restaurar': {
  try {
    if (!from.endsWith('@g.us')) {
      await sock.sendMessage(from, { text: '❌ este comando só pode ser usado em grupos.' });
      break;
    }

    const metadata = await sock.groupMetadata(from);
    const admins = metadata.participants
      .filter(p => p.admin === 'admin' || p.admin === 'superadmin')
      .map(p => p.id);

    const senderId = msg.key.participant || msg.key.remoteJid;
    if (!admins.includes(senderId)) {
      await sock.sendMessage(from, { text: '❌ apenas administradores podem usar este comando.' });
      break;
    }

    if (!fs.existsSync(pathdadoscompras)) {
      await sock.sendMessage(from, { text: '❌ nenhum backup encontrado.' });
      break;
    }

    const backup = JSON.parse(fs.readFileSync(pathdadoscompras, 'utf-8') || '{}');

    let compras = {};

    // 🔹 RESTAURA TODOS OS GRUPOS
    for (const [groupId, usuarios] of Object.entries(backup)) {
      compras[groupId] = {};

      for (const [userId, dados] of Object.entries(usuarios)) {
        compras[groupId][userId] = {
          Megas: dados.Megas || 0,
          Megashoje: dados.Megashoje || 0,
          Saldo: dados.Saldo || 0,
          Saldohoje: dados.Saldohoje || 0,
          data: dados.data || new Date().toISOString()
        };
      }
    }

    fs.writeFileSync(pathCompras, JSON.stringify(compras, null, 2));

    await sock.sendMessage(from, {
      text: '🤖 ✅ compras de todos os grupos restauradas!\n♻️ dados totalmente recuperados.'
    });

  } catch (err) {
    console.error('Erro no .restaurar:', err);
    await sock.sendMessage(from, { text: '❌ erro ao restaurar compras.' });
  }
  break;
}

// COMANDO: .resetglobal
case cmd.toLowerCase() === 'resetglobal': {
  try {
    if (!from.endsWith('@g.us')) {
      await sock.sendMessage(from, {
        text: '❌ Este comando só pode ser usado em grupos.',
        mentions: [sender],
        contextInfo: { stanzaId: msg.key.id, participant: sender, quotedMessage: msg.message }
      });
      break;
    }

    const metadata = await sock.groupMetadata(from);
    const admins = metadata.participants
      .filter(p => p.admin === 'admin' || p.admin === 'superadmin')
      .map(p => p.id);

    const senderId = msg.key.participant || msg.key.remoteJid;
    if (!admins.includes(senderId)) {
      await sock.sendMessage(from, {
        text: '❌ Apenas administradores podem resetar todas as compras.',
        mentions: [sender],
        contextInfo: { stanzaId: msg.key.id, participant: sender, quotedMessage: msg.message }
      });
      break;
    }

    fs.writeFileSync(pathCompras, JSON.stringify({}, null, 2));

    await sock.sendMessage(from, {
      text: `🤖 ✅ @${senderId.split('@')[0]} todas as compras foram apagadas com sucesso!\n🧹 arquivo limpo.`,
      mentions: [senderId],
      contextInfo: { stanzaId: msg.key.id, participant: sender }
    });

  } catch (err) {
    console.error('❌ Erro no comando resetglobal:', err);
    await sock.sendMessage(from, {
      text: '❌ Erro ao resetar todas as compras. Verifique permissões do bot.',
      mentions: [sender],
      contextInfo: { stanzaId: msg.key.id, participant: sender, quotedMessage: msg.message }
    });
  }
  break;
}

// COMANDO: .alarme
case cmd.toLowerCase().startsWith('alarme'): {
  const isGroup = from.endsWith('@g.us');

  if (!isGroup) {
    await sock.sendMessage(from, {
      text: '❌ Este comando funciona apenas em grupos.',
      mentions: [sender],
      contextInfo: { stanzaId: msg.key.id, participant: sender, quotedMessage: msg.message }
    });
    break;
  }

  const groupMeta = await sock.groupMetadata(from);
  const admins = groupMeta.participants
    .filter(p => p.admin === "admin" || p.admin === "superadmin")
    .map(p => p.id);

  const senderId = msg.key.participant || msg.key.remoteJid;

  if (!admins.includes(senderId)) {
    await sock.sendMessage(from, {
      text: '❌ Apenas administradores podem usar este comando!',
      mentions: [sender],
      contextInfo: { stanzaId: msg.key.id, participant: sender, quotedMessage: msg.message }
    });
    break;
  }

  const arg = cmd.split(' ')[1];

  if (arg && arg.toLowerCase() === 'off') {
    const alarmes = carregarAlarmes();

    if (!alarmes[from]) {
      await sock.sendMessage(from, {
        text: '⚠️ Não existe nenhum alarme ativo neste grupo.',
        mentions: [sender],
      contextInfo: { stanzaId: msg.key.id, participant: sender, quotedMessage: msg.message }
    });
      break;
    }

    delete alarmes[from];
    salvarAlarmes(alarmes);

    await sock.sendMessage(from, {
      text:
        '⏹️ *Alarme desativado com sucesso!*\n\n' +
        '🔕 Abertura e fechamento automático foram removidos.\n' +
        '📍 Horário: Moçambique 🇲🇿',
      mentions: [sender],
      contextInfo: { stanzaId: msg.key.id, participant: sender, quotedMessage: msg.message }
    });
    break;
  }

  if (!arg || !arg.includes(',')) {
    await sock.sendMessage(from, {
      text:
        '❌ Uso incorreto.\n\n' +
        '📌 Exemplo correto:\n' +
        '.alarme 11:30,12:30\n\n' +
        '⏹️ Para desligar:\n' +
        '.alarme off',
      mentions: [sender],
      contextInfo: { stanzaId: msg.key.id, participant: sender, quotedMessage: msg.message }
    });
    break;
  }

  const [horaAbrir, horaFechar] = arg.split(',');

  const regexHora = /^([01]\d|2[0-3]):[0-5]\d$/;

  if (!regexHora.test(horaAbrir) || !regexHora.test(horaFechar)) {
    await sock.sendMessage(from, {
      text:
        '❌ Horário inválido.\n\n' +
        '⏰ Formato correto: HH:MM\n' +
        '📌 Exemplo: 11:30,12:30',
      mentions: [sender],
      contextInfo: { stanzaId: msg.key.id, participant: sender, quotedMessage: msg.message }
    });
    break;
  }

  const alarmes = carregarAlarmes();

  alarmes[from] = {
    abrir: horaAbrir,
    fechar: horaFechar,
    ativo: true
  };

  salvarAlarmes(alarmes);

  await sock.sendMessage(from, {
    text:
      '⏰ *Alarme configurado com sucesso!*\n\n' +
      `🔓 Abrir grupo: ${horaAbrir}\n` +
      `🔒 Fechar grupo: ${horaFechar}\n\n` +
      '📍 Horário: Moçambique 🇲🇿',
    mentions: [sender],
      contextInfo: { stanzaId: msg.key.id, participant: sender, quotedMessage: msg.message }
    });
  break;
}

  }
}

module.exports = { handleCommand };