// groupEvents.js
// Arquivo para processar eventos dos grupos com logs detalhados

const fs = require('fs');

const pathConcorrentes = './config/concorrentes.json';
const pathAnticoncorrencia = './config/anticoncorrencia.json';
const pathBemvindo = './config/bemvindo.json';
const pathPersonalizar = './config/personalizar.json';

function readJSON(path, fallback = {}) {
  try {
    return JSON.parse(fs.readFileSync(path, 'utf-8'));
  } catch {
    return fallback;
  }
}

async function handleGroupEvents(sock, update) {
  try {
    if (!update?.participants || !update?.action) return;

    const action = update.action;
    const participants = update.participants;
    const groupId = update.id;

    console.log('--------------------------------------------------');
    console.log(`📌 Evento de participante: ${action.toUpperCase()}`);
    console.log(`📂 Grupo ID: ${groupId}`);
    if (update.author) console.log(`✍️ Autor da ação: ${update.author}`);
    console.log('--------------------------------------------------');

    // --------- LEITURAS ---------
    const anticoncorrenciaData = readJSON(pathAnticoncorrencia);
    const bemvindoData = readJSON(pathBemvindo);
    const concorrentes = readJSON(pathConcorrentes);
    const mensagensPersonalizadas = readJSON(pathPersonalizar);

    const anticoncorrenciaStatus = anticoncorrenciaData[groupId] === 'on';
    const bemvindoStatus = bemvindoData[groupId] === 'on';

    for (const participant of participants) {
      const id = typeof participant === 'object' ? participant.id : participant;
      const isBot = id === sock.user?.id;
      const numero = id.split('@')[0];

      console.log(`➤ PARTICIPANTE ${action === 'add' ? 'ADICIONADO' : 'REMOVIDO'}: ${id}`);
      console.log(`   É o BOT?: ${isBot ? 'SIM' : 'NÃO'}`);

      // --------- ANTICONCORRÊNCIA ---------
      if (action === 'add' && anticoncorrenciaStatus && concorrentes[id]) {
        const texto =
          `🚫 Concorrente detectado 🚫\n\n` +
          `O número @${numero} está na nossa lista de concorrentes e será removido.`;

        await sock.sendMessage(groupId, {
          text: texto,
          mentions: [id]
        });

        console.log(`⚠️ Concorrente detectado: ${id}. Removendo...`);

        await sock.groupParticipantsUpdate(groupId, [id], 'remove')
          .catch(err => console.error('❌ Erro ao remover concorrente:', err));

        continue;
      }

      // --------- BOAS-VINDAS ---------
      if (action === 'add' && bemvindoStatus && !isBot) {

        let foto = null;
        try {
          foto = await sock.profilePictureUrl(id, 'image');
        } catch {}

        // mensagem personalizada ou padrão
        let mensagem =
          mensagensPersonalizadas[groupId] ||
          '👋 Seja bem-vindo(a) ao grupo, @user!\n\nEsperamos que aproveite 🚀';
          
        mensagem = mensagem.replace(/@user/gi, `@${numero}`);

        if (foto) {
          await sock.sendMessage(groupId, {
            image: { url: foto },
            caption: mensagem,
            mentions: [id]
          });
        } else {
          await sock.sendMessage(groupId, {
            text: mensagem,
            mentions: [id]
          });
        }

        console.log(`🎉 Boas-vindas enviadas para @${numero}`);
      }
    }

    // --------- LOG QUANDO BOT É ADICIONADO ---------
    if (action === 'add' && participants.some(p => (typeof p === 'object' ? p.id : p) === sock.user?.id)) {
      const metadata = await sock.groupMetadata(groupId).catch(() => null);
      if (metadata) {
        console.log('🤖 FUI ADICIONADO A UM GRUPO!');
        console.log(`   Nome: ${metadata.subject}`);
        console.log(`   ID: ${metadata.id}`);
        console.log(`   Total de participantes: ${metadata.participants.length}`);
        console.log('--------------------------------------------------');
      }
    }

  } catch (error) {
    console.error('❌ Erro ao processar evento de grupo:', error);
  }
}

module.exports = { handleGroupEvents };