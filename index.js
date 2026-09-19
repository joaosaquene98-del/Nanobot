// src/index.js
const { iniciar } = require('./connect');
const { processarMensagem } = require('./mensagens');
const { handleGroupEvents } = require("./groupEvents");
const { carregarAlarmes, salvarAlarmes } = require('./utils');

async function startBot() {
  try {
    console.log('🚀 Iniciando NANOBOT...');

    const socks = await iniciar();

    for (const sock of socks) {

      // ======= MENSAGENS =======
      sock.ev.on('messages.upsert', async ({ messages }) => {
        if (!messages || !messages.length) return;
        const msg = messages[0];
        await processarMensagem(sock, msg);
      });

      // ======= EVENTOS DE GRUPO =======
      sock.ev.on("groups.update", async (update) => {
        await handleGroupEvents(sock, update);
      });

      sock.ev.on("group-participants.update", async (update) => {
        await handleGroupEvents(sock, update);
      });

      // ================= ALARME AUTOMÁTICO =================
      setInterval(async () => {
        try {
          const alarmes = carregarAlarmes();
          if (!alarmes || Object.keys(alarmes).length === 0) return;

          const agora = new Date(
            new Date().toLocaleString("en-US", { timeZone: "Africa/Maputo" })
          );

          const horaAtual =
            String(agora.getHours()).padStart(2, '0') + ':' +
            String(agora.getMinutes()).padStart(2, '0');

          for (const grupoId of Object.keys(alarmes)) {
            const alarme = alarmes[grupoId];
            if (!alarme || !alarme.ativo) continue;

            if (horaAtual === alarme.abrir && !alarme.aberto) {
              await sock.groupSettingUpdate(grupoId, 'not_announcement');

              alarme.aberto = true;
              alarme.fechado = false;
              salvarAlarmes(alarmes);

              await sock.sendMessage(grupoId, {
                text: `🔓 *Grupo aberto automaticamente* 🤖
⏰ Horário programado 🇲🇿`
              });
            }

            if (horaAtual === alarme.fechar && !alarme.fechado) {
              await sock.groupSettingUpdate(grupoId, 'announcement');

              alarme.fechado = true;
              alarme.aberto = false;
              salvarAlarmes(alarmes);

              await sock.sendMessage(grupoId, {
                text: `🔒 *Grupo fechado automaticamente* 🤖
⏰ Horário programado 🇲🇿`
              });
            }
          }
        } catch (err) {
          console.error('Erro no alarme automático:', err);
        }
      }, 60 * 1000);
    }

    console.log('✅ nanobot pronto e aguardando mensagens...');
  } catch (err) {
    console.error('❌ erro ao ligar nanobot:', err);
  }
}

// Inicia o bot
startBot();