// src/connect.js
const {
  default: makeWASocket,
  useMultiFileAuthState,
  DisconnectReason,
  makeCacheableSignalKeyStore,
  fetchLatestBaileysVersion,
} = require('@whiskeysockets/baileys');
const P = require('pino');
const fs = require('fs');
const readline = require('readline');

const SESSIONS_DIR = './sessions';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});
const question = (q) => new Promise(res => rl.question(q, res));

function mostrarMarca() {
  console.log('\n=============================================');
  console.log('      👨‍💻⚙️  BY: nano bot 🥺');
  console.log('=============================================\n');
}

function garantirPastaSessions() {
  if (!fs.existsSync(SESSIONS_DIR)) {
    fs.mkdirSync(SESSIONS_DIR, { recursive: true });
  }
}

function getNextSessionName() {
  garantirPastaSessions();
  const dirs = fs.readdirSync(SESSIONS_DIR).filter(d => d.startsWith('session-'));
  return `session-${dirs.length + 1}`;
}

async function connect(sessionPath, numero = null, onReady = null) {
  garantirPastaSessions();

  if (!fs.existsSync(sessionPath)) {
    fs.mkdirSync(sessionPath, { recursive: true });
  }

  const { state, saveCreds } = await useMultiFileAuthState(sessionPath);
  const { version } = await fetchLatestBaileysVersion();

  const sock = makeWASocket({
    version,
    auth: state,
    logger: P({ level: 'silent' }),
    browser: ['Ubuntu', 'Chrome', '120.0.6099.71'],
    printQRInTerminal: false,
    keepAliveIntervalMs: 30_000,
    connectTimeoutMs: 60_000,
  });

  sock.ev.on('creds.update', saveCreds);

  // ✅ CORREÇÃO PRINCIPAL: pedir código APENAS quando o QR chega
  // (isso prova que o WebSocket já está ativo e pronto)
  let codigoJaPedido = false;

  sock.ev.on('connection.update', async (update) => {
    const { connection, lastDisconnect, qr } = update;

    // 🔑 Quando o QR aparecer E ainda não registado → pede pairing code em vez do QR
    if (qr && numero && !state.creds.registered && !codigoJaPedido) {
      codigoJaPedido = true;
      const numeroLimpo = numero.replace(/[^0-9]/g, '');
      try {
        const code = await sock.requestPairingCode(numeroLimpo);
        const formatado = code.match(/.{1,4}/g).join('-');
        console.log(`\n╔══════════════════════════════════╗`);
        console.log(`║  🔑 CÓDIGO: ${formatado.padEnd(19)}║`);
        console.log(`╚══════════════════════════════════╝`);
        console.log(`📱 WhatsApp > Dispositivos > Vincular com número\n`);
      } catch (e) {
        console.log('⚠️  Erro ao pedir código:', e.message);
      }
    }

    if (connection === 'open') {
      console.log(`✅ CONECTADO: ${sessionPath}`);
      if (onReady) onReady(sock);
    }

    if (connection === 'close') {
      const statusCode = lastDisconnect?.error?.output?.statusCode;
      if (statusCode === DisconnectReason.loggedOut) {
        console.log(`❌ SESSÃO DESLOGADA — Apaga ${sessionPath} e reinicia!`);
      } else {
        console.log(`🔁 RECONECTANDO (${sessionPath}) em 5s...`);
        const temCreds = fs.existsSync(`${sessionPath}/creds.json`);
        setTimeout(() => connect(sessionPath, temCreds ? null : numero, onReady), 5000);
      }
    }
  });

  return sock;
}

async function iniciar(onReady = null) {
  garantirPastaSessions();

  const sessoesExistentes = fs.readdirSync(SESSIONS_DIR)
    .filter(d => d.startsWith('session-'));

  let socks = [];

  if (sessoesExistentes.length === 0) {
    const numero = await question('📞 Digite seu número (ex: 258851234567): ');
    rl.close();
    const nome = getNextSessionName();
    const caminho = `${SESSIONS_DIR}/${nome}`;

    await new Promise((resolve) => {
      connect(caminho, numero, (sockPronto) => {
        if (onReady) onReady(sockPronto);
        socks.push(sockPronto);
        resolve();
      });
    });

    return socks;
  }

  mostrarMarca();
  console.log('1️⃣  Nova sessão (pareamento por código)');
  console.log('2️⃣  Rodar bot (todas as sessões)\n');

  const op = await question('Escolha uma opção: ');

  if (op === '1') {
    const numero = await question('📞 Digite seu número (ex: 258851234567): ');
    rl.close();
    const nome = getNextSessionName();
    const caminho = `${SESSIONS_DIR}/${nome}`;

    await new Promise((resolve) => {
      connect(caminho, numero, (sockPronto) => {
        if (onReady) onReady(sockPronto);
        socks.push(sockPronto);
        resolve();
      });
    });
  }

  if (op === '2') {
    rl.close();
    for (const s of sessoesExistentes) {
      const sock = await connect(`${SESSIONS_DIR}/${s}`, null, onReady);
      if (sock) socks.push(sock);
    }
  }

  return socks;
}

module.exports = { iniciar, connect };
