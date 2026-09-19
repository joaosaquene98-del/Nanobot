const fs = require('fs');

const prefix = '.';
const { handleCommand } = require('./comandos');

// ====== CONFIG ======
const pathNano         = './config/nanoativar.json';
const pathGatilhos     = './config/gatilhos.json';
const pathAntilink     = './config/antilink.json';
const pathAntifoto     = './config/antifoto.json';
const pathDetector     = './config/detector.json';
const pathComprovantes = './config/comprovantes.json';

// ====== DATA ======
const pathContas       = './data/contas.json';
const pathAntivideo    = './data/antivideo.json';
const pathAntiaudio    = './data/antiaudio.json';
const pathAntistatus   = './data/antistatus.json';
const pathDias         = './data/dias.json';

// Garante que as pastas existam
if (!fs.existsSync('./config')) fs.mkdirSync('./config', { recursive: true });
if (!fs.existsSync('./data')) fs.mkdirSync('./data', { recursive: true });


// Função para carregar os dados do participante
function ctx(msg, sender) {
  return msg?.key?.id && msg?.message
    ? {
        stanzaId: msg.key.id,
        participant: sender,
        quotedMessage: msg.message
      }
    : undefined;
}

// Função para carregar horas do bot
function getDataHoraBot() {
  const agora = new Date(
    new Date().toLocaleString("en-US", { timeZone: "Africa/Maputo" })
  );

  return {
    data: agora.toLocaleDateString("pt-PT"),
    hora: agora.toLocaleTimeString("pt-PT", {
      hour: "2-digit",
      minute: "2-digit"
    })
  };
}

//  Função para carregar dias 
function carregarDias() {
  if (!fs.existsSync(pathDias)) {
    fs.writeFileSync(pathDias, JSON.stringify({}, null, 2));
  }
  return JSON.parse(fs.readFileSync(pathDias));
}

function salvarDias(data) {
  fs.writeFileSync(pathDias, JSON.stringify(data, null, 2));
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

// Carregar antivideo 
function carregarAntivideo() {
  if (!fs.existsSync(pathAntivideo)) return {};
  return JSON.parse(fs.readFileSync(pathAntivideo));
}

function salvarAntivideo(dados) {
  fs.writeFileSync(pathAntivideo, JSON.stringify(dados, null, 2));
}

// Carregar contas
function carregarContas() {
  if (!fs.existsSync(pathContas)) {
    fs.writeFileSync(pathContas, JSON.stringify({}, null, 2));
  }
  return JSON.parse(fs.readFileSync(pathContas));
}

// Carrega JSON genérico
function carregarJSON(path) {
  try {
    if (!fs.existsSync(path)) return {};
    return JSON.parse(fs.readFileSync(path, 'utf-8'));
  } catch {
    return {};
  }
}

// Função para salvar comprovantes 
function carregarComprovantes() {
  try {
    if (!fs.existsSync(pathComprovantes)) return {};
    return JSON.parse(fs.readFileSync(pathComprovantes, 'utf-8'));
  } catch {
    return {};
  }
}

function salvarComprovantes(dados) {
  fs.writeFileSync(
    pathComprovantes,
    JSON.stringify(dados, null, 2),
    'utf-8'
  );
}


// Carrega o detector.json
function carregarDetector() {
  try {
    if (!fs.existsSync(pathDetector)) return {};
    return JSON.parse(fs.readFileSync(pathDetector, 'utf-8'));
  } catch {
    return {};
  }
}

/**
 * Detecta links
 */
function contemLink(texto) {
  const regex = /(https?:\/\/|www\.|chat\.whatsapp\.com|wa\.me)/i;
  return regex.test(texto);
}

function getDataHoraBot(msg) {
  let ts;

  if (msg && msg.messageTimestamp) {
    ts = Number(msg.messageTimestamp) * 1000;
  } else {
    ts = Date.now();
  }

  const d = new Date(ts);

  const dia = String(d.getDate()).padStart(2, "0");
  const mes = String(d.getMonth() + 1).padStart(2, "0");
  const ano = d.getFullYear();

  const hora = String(d.getHours()).padStart(2, "0");
  const min = String(d.getMinutes()).padStart(2, "0");

  return {
    data: `${dia}/${mes}/${ano}`,
    hora: `${hora}:${min}`
  };
}

/**
 * Processa mensagens
 */
async function processarMensagem(sock, msg) {
  if (!msg.message || msg.key.fromMe) return;

  const from = msg.key.remoteJid;
  const sender = msg.key.participant || from;
  const isGroup = from.endsWith('@g.us');

// ========= VERIFICAÇÃO DE DIAS ============
if (isGroup) {
  const diasData = carregarDias();
  const grupoAtivo = diasData[from];

  const agora = Date.now();
  const expirado = !grupoAtivo || grupoAtivo.fim < agora;

  if (expirado) {
    await sock.sendMessage(from, {
      text:
`⚠️ *PLANO EXPIRADO!* 🚫
Este grupo não possui dias ativos ou o plano expirou.

📞 contacte o gestor do bot para renovar o plano, obrigado 🔍.`,
      mentions: [sender],
      contextInfo: {
        stanzaId: msg.key?.id,
        participant: sender,
        quotedMessage: msg.message
      }
    });

    return;
  }
}

  // ===== TEXTO =====
  let texto = '';
  if (msg.message.conversation) {
    texto = msg.message.conversation;
  } else if (msg.message.extendedTextMessage?.text) {
    texto = msg.message.extendedTextMessage.text;
  }

// ============== COMPROVATIVOS =================
const detector = carregarDetector();
const filtroAtivo = detector[from] === true;

if (filtroAtivo && texto) {

    const reMpesa =
    /Confirmado\s+([A-Za-z0-9]+).*?Transferiste\s+([\d.,]+)MT.*?para\s+(\d+)\s*-\s*([A-Za-z\s]+).*?aos\s+(\d{1,2}\/\d{1,2}\/\d{2,4})\s*as\s+(\d{1,2}:\d{2}(?::\d{2})?\s*(?:AM|PM|am|pm)?)/i;

  const reEmola =
    /ID da transac(?:a|ã)o\s+([A-Za-z0-9.\-]+).*?Transferiste\s+([\d.,]+)MT.*?conta\s+(\d+),?\s*nome[:\s]*([A-Za-z\s]+).*?as\s+(\d{1,2}:\d{2}(?::\d{2})?)\s*de\s*(\d{1,2}\/\d{1,2}\/\d{2,4})/i;


  let resultado = null;

  let m = texto.match(reMpesa);
  if (m) {
    resultado = {
      codigo: m[1],
      valor: m[2],
      numeroDestinatario: m[3],
      nome: m[4].trim()
    };
  } else {
    m = texto.match(reEmola);
    if (m) {
      resultado = {
        codigo: m[1],
        valor: m[2],
        numeroDestinatario: m[3],
        nome: m[4].trim()
      };
    }
  }

  if (resultado) {

    const contas = carregarContas();

    if (!contas[from] || (
      (!contas[from].mpesa || contas[from].mpesa.length === 0) &&
      (!contas[from].emola || contas[from].emola.length === 0)
    )) {

      const msgSemContas =
`❌ *Comprovativo recusado* 🚫

⚠️ Este grupo ainda não possui contas *M-Pesa* ou *E-Mola* cadastradas,

👑 *administradores do grupo*
➡️ Adicionem primeiro as contas usando:
• \`.addmpesa numero-nome\`
• \`.addmola numero-nome\`

📌 Após adicionar as contas corretas,
envie o comprovativo novamente.`;

      await sock.sendMessage(from, {
        text: msgSemContas,
        mentions: [sender],
        contextInfo: {
          stanzaId: msg.key.id,
          participant: sender,
          quotedMessage: msg.message
        }
      });

      return;
    }

    const contasGrupo = [
      ...(contas[from].mpesa || []),
      ...(contas[from].emola || [])
    ];

    const contaExiste = contasGrupo.find(c =>
      c.numero === resultado.numeroDestinatario &&
      c.nome.toLowerCase() === resultado.nome.toLowerCase()
    );

    if (!contaExiste) {

      const msgContaInvalida =
`❌ *comprovativo recusado* 🚫

📛 *Motivo:* Os dados do pagamento não conferem.
☎️ *Número:* ${resultado.numeroDestinatario}
👤 *Nome:* ${resultado.nome}

⚠️ Este número ou nome **NÃO correspondem**
a nenhuma conta *M-Pesa* ou *E-Mola* cadastrada neste grupo.
 
🔐 Apenas comprovativos pagos para contas
registradas no grupo são aceites.`;

      await sock.sendMessage(from, {
        text: msgContaInvalida,
        mentions: [sender],
        contextInfo: {
          stanzaId: msg.key.id,
          participant: sender,
          quotedMessage: msg.message
        }
      });

      return;
    }

    let numeroReceber = null;
    const linhas = texto.split("\n").map(l => l.trim());

    for (let i = linhas.length - 1; i >= 0; i--) {
      if (/^(84|85)\d{6,7}$/.test(linhas[i])) {
        numeroReceber = linhas[i];
        break;
      }
    }

    const { data, hora } = getDataHoraBot();

    const comprovantes = carregarComprovantes();
    if (!comprovantes[from]) comprovantes[from] = [];

const comprovanteExistente = comprovantes[from].find(
  c => c.codigo === resultado.codigo
);

if (comprovanteExistente) {
  const remetenteOriginal = comprovanteExistente.enviado_por;
const dataOriginal = comprovanteExistente.data_recebido;
const horaOriginal = comprovanteExistente.hora_recebido;

  const mensagemDuplicado =
`❌ *Comprovante já registrado!* 🚫

🔑 *Chave:* \`${resultado.codigo}\`
📅 *Registrado em:* ${dataOriginal} às ${horaOriginal}
👤 *Remetente:* @${remetenteOriginal.split("@")[0]}

⚠️ Este comprovante já foi utilizado e não pode ser processado novamente.`;

  await sock.sendMessage(from, {
    text: mensagemDuplicado,
    mentions: [remetenteOriginal],
    contextInfo: {
      stanzaId: msg.key.id,
      participant: sender,
      quotedMessage: msg.message
    }
  });

  return;
}

    comprovantes[from].push({
      codigo: resultado.codigo,
      valor: resultado.valor,
      nome_destinatario: resultado.nome,
      numero_destinatario: resultado.numeroDestinatario,
      numero_receber: numeroReceber || null,
      enviado_por: sender,
      data_recebido: data,
      hora_recebido: hora,
      timestamp: Date.now()
    });

    salvarComprovantes(comprovantes);

    let mensagem =
`✅ *Comprovante detectado com sucesso* 🇲🇿

🔑 *Chave:* \`${resultado.codigo}\`
🗂️ *Valor:* ${resultado.valor} MT
🔖 *Nome do destinatário:* ${resultado.nome}
☎️ *Destinatário:* ${resultado.numeroDestinatario}
⏰ *Recebido em:* ${data} às ${hora}`;

    if (numeroReceber) {
      mensagem += `\n🧿 *Número a receber:* ${numeroReceber}`;
    }

    mensagem += `

🙏🏽 Obrigado por enviar o comprovative`;

    await sock.sendMessage(from, {
      text: mensagem,
      mentions: [sender],
      contextInfo: {
        stanzaId: msg.key.id,
        participant: sender,
        quotedMessage: msg.message
      }
    });

    return;
  }
}

  console.log(`
📩 Mensagem recebida de: ${from}
🔑 id: ${from}
👤 Remetente: ${sender}
✉️ Conteúdo: ${texto || '[MÍDIA]'}
───────────────────────────────
`);

  const nano = carregarJSON(pathNano);
  const gatilhos = carregarJSON(pathGatilhos);
  const antilink = carregarJSON(pathAntilink);
  const antifoto = carregarJSON(pathAntifoto);

  const nanoStatus = nano[from] === 'on';
  const antilinkStatus = antilink[from] === true;
  const antifotoStatus = antifoto[from] === true;

  // ================= ANTIFOTO =================
  if (isGroup && antifotoStatus && msg.message.imageMessage) {
    console.log(`
🖼️ ANTIFOTO DETECTADO 
📍 Grupo: ${from}
👤 Usuário: ${sender}
───────────────────────────────
`);

    const metadata = await sock.groupMetadata(from);
    const admins = metadata.participants
      .filter(p => p.admin)
      .map(p => p.id);

    if (!admins.includes(sender)) {
      try {
        await sock.sendMessage(from, {
          delete: {
            remoteJid: from,
            fromMe: false,
            id: msg.key.id,
            participant: sender
          }
        });

        await sock.sendMessage(from, {
          text: `📸 @${sender.split("@")[0]} *fotos não são permitidas neste grupo!* 🚫\n\nPor favor, envie apenas *comprovativos em texto* para agilizar o atendimento. 🙏`,
          mentions: [sender]
        });

        return;
      } catch (err) {
        console.error('Erro no antifoto:', err);
      }
    }
  }

// ================= ANTIVIDEO =================
if (isGroup) {
  try {
    const antivideoData = carregarAntivideo();
    const antivideoStatus = antivideoData[from] === true;

    if (
      antivideoStatus &&
      (
        msg.message?.videoMessage ||
        (msg.message?.documentMessage &&
         msg.message.documentMessage.mimetype?.startsWith('video/'))
      )
    ) {

      console.log(`
🎥 ANTIVIDEO DETECTADO
📍 Grupo: ${from}
👤 Usuário: ${sender}
───────────────────────────────
`);

      const metadata = await sock.groupMetadata(from);
      const admins = metadata.participants
        .filter(p => p.admin === 'admin' || p.admin === 'superadmin')
        .map(p => p.id);

      const senderLid = msg.key.participant || msg.key.remoteJid;

      if (admins.includes(senderLid)) return;

      await sock.sendMessage(from, {
        delete: {
          remoteJid: from,
          fromMe: false,
          id: msg.key.id,
          participant: senderLid
        }
      });

      await sock.sendMessage(from, {
        text:
`🚫 *VÍDEO BLOQUEADO* 📵

👤 @${senderLid.split('@')[0]}
❌ O envio de *vídeos* não é permitido neste grupo.

⚠️ Caso precise enviar um vídeo,
entre em contacto com um *administrador*.

🤖 Sistema de segurança ativo.`,
        mentions: [senderLid]
      });

      return;
    }

  } catch (err) {
    console.error('Erro no antivideo:', err);
  }
}

// ================= ANTIAUDIO =================
if (isGroup) {
  try {
    const antiaudioData = carregarAntiaudio();
    const antiaudioStatus = antiaudioData[from] === true;

    if (antiaudioStatus && msg.message?.audioMessage) {

      console.log(`
🔊 ANTIAUDIO DETECTADO
📍 Grupo: ${from}
👤 Usuário: ${sender}
───────────────────────────────
`);

      const metadata = await sock.groupMetadata(from);
      const admins = metadata.participants
        .filter(p => p.admin === 'admin' || p.admin === 'superadmin')
        .map(p => p.id);

      const senderLid = msg.key.participant || msg.key.remoteJid;

       if (admins.includes(senderLid)) return;

      await sock.sendMessage(from, {
        delete: {
          remoteJid: from,
          fromMe: false,
          id: msg.key.id,
          participant: senderLid
        }
      });

      await sock.sendMessage(from, {
        text:
`🔊🚫 *ÁUDIO BLOQUEADO*

👤 @${senderLid.split('@')[0]}
❌ O envio de *áudios* não é permitido neste grupo.

⚠️ Caso precise enviar um áudio,
fale com um *administrador*.

🤖 Sistema de segurança ativo.`,
        mentions: [senderLid]
      });

      return;
    }

  } catch (err) {
    console.error('Erro no antiaudio:', err);
  }
}

// ================= ANTISTATUS =================
if (isGroup) {
  try {
    const antistatusData = carregarAntistatus();
    const antistatusStatus = antistatusData[from] === true;

    if (antistatusStatus) {
      const texto =
        msg.message?.conversation ||
        msg.message?.extendedTextMessage?.text ||
        msg.message?.imageMessage?.caption ||
        msg.message?.videoMessage?.caption ||
        '';

      if (!texto) return;

      const contemGrupo =
        texto.toLowerCase().includes('grupo') ||
        texto.toLowerCase().includes('whatsapp.com/chat') ||
        texto.toLowerCase().includes('wa.me');

      if (!contemGrupo) return;

      const metadata = await sock.groupMetadata(from);
      const admins = metadata.participants
        .filter(p => p.admin === 'admin' || p.admin === 'superadmin')
        .map(p => p.id);

      const senderLid = msg.key.participant || msg.key.remoteJid;
      if (admins.includes(senderLid)) return;

      console.log(`
📵 ANTISTATUS DETECTADO
📍 Grupo: ${from}
👤 Usuário: ${senderLid}
───────────────────────────────
`);

      await sock.sendMessage(from, {
        delete: {
          remoteJid: from,
          fromMe: false,
          id: msg.key.id,
          participant: senderLid
        }
      });

      await sock.sendMessage(from, {
        text:
`🚫📵 *MENÇÃO DE STATUS BLOQUEADA*

👤 @${senderLid.split('@')[0]}
❌ Não é permitido mencionar ou divulgar *status* relacionados a este grupo.

⚠️ Respeite as regras do grupo.
🤖 Sistema de proteção ativo.`,
        mentions: [senderLid]
      });

      return;
    }

  } catch (err) {
    console.error('Erro no antistatus:', err);
  }
}

  // ================= ANTILINK =================
  if (isGroup && antilinkStatus && texto && contemLink(texto)) {
    const metadata = await sock.groupMetadata(from);
    const admins = metadata.participants
      .filter(p => p.admin)
      .map(p => p.id);

    if (!admins.includes(sender)) {
      try {
        await sock.sendMessage(from, {
          delete: {
            remoteJid: from,
            fromMe: false,
            id: msg.key.id,
            participant: sender
          }
        });

        await sock.sendMessage(from, {
          text: `🚫 Membro @${sender.split('@')[0]} removido por enviar link.\n\n💡 *Links não são permitidos neste grupo.*`,
          mentions: [sender]
        });

        await sock.groupParticipantsUpdate(from, [sender], 'remove');
        return;
      } catch (err) {
        console.error('Erro no antilink:', err);
      }
    }
  }

  // ================= COMANDOS =================
  if (texto && texto.startsWith(prefix)) {
    const commandBody = texto.slice(prefix.length).trim();
    await handleCommand(
      sock,
      {
        from,
        sender,
        msg,
        texto,
        mentions: [sender],
        contextInfo: {
          stanzaId: msg.key?.id,
          participant: sender,
          quotedMessage: msg.message
        }
      },
      commandBody
    );
  }

// ================= GATILHOS =================
else if (texto && gatilhos[from]?.[texto.toLowerCase()]) {
  if (nanoStatus) {

    let resposta = gatilhos[from][texto.toLowerCase()];
    let mentions = [];

    if (resposta.includes('@user')) {
      resposta = resposta.replace(/@user/gi, `@${sender.split('@')[0]}`);
      mentions.push(sender);
    }

    await sock.sendMessage(from, {
      text: resposta,
      mentions,
      contextInfo: {
        stanzaId: msg.key.id,
        participant: sender,
        quotedMessage: msg.message
      }
    });
  }
}
}

module.exports = { processarMensagem };