/**
 * Telegram/AI Service — Enhanced knowledge base for CloudeStorage support
 * Handles keyword matching with smarter, more contextual AI responses
 */

const SUPPORT_EMAIL = process.env.SUPPORT_EMAIL || 'support@rorycloud.com';

class TelegramService {
  /**
   * Main entry: send message and get AI response
   */
  static async sendMessage(userMessage) {
    try {
      const aiResponse = await this.getAIResponse(userMessage);
      return aiResponse;
    } catch (error) {
      console.warn('AI service error:', error.message);
      return {
        success: false,
        message: `Scusa, il sistema di supporto è momentaneamente non disponibile. Contatta il nostro team: ${SUPPORT_EMAIL}`,
        supportEmail: SUPPORT_EMAIL,
        isAI: true,
      };
    }
  }

  /**
   * Advanced contextual AI Response Generator
   * Covers all topics relevant to the CloudeStorage platform
   */
  static async getAIResponse(userMessage) {
    const msg = userMessage.toLowerCase().trim();
    const words = msg.split(/\s+/);

    // ─────────────────────────────────────────────────────────────────
    // GREETINGS
    // ─────────────────────────────────────────────────────────────────
    if (this.match(msg, ['ciao', 'buongiorno', 'salve', 'hey', 'hello', 'hi', 'buonasera'])) {
      return this.ok('Ciao! 👋 Sono il sistema AI di supporto di **CloudeStorage**. Posso aiutarti con caricamento file, condivisione, account, sicurezza e tutte le funzionalità della piattaforma. Come posso aiutarti oggi?');
    }

    if (this.match(msg, ['grazie', 'thanks', 'perfetto', 'ottimo', 'ok grazie', 'capito'])) {
      return this.ok('Prego! 😊 Se hai altre domande non esitare a scrivermi. Sono sempre qui per aiutarti.');
    }

    if (this.match(msg, ['cosa sei', 'chi sei', 'cosa fai', "cos'è", 'come funzioni', 'what are you'])) {
      return this.ok('Sono il sistema di **supporto AI** integrato in CloudeStorage. Sono trained per rispondere a domande su: upload di file, gestione storage, condivisione link, sicurezza, account e funzionalità della piattaforma. Non sono connesso a internet esterno.');
    }

    // ─────────────────────────────────────────────────────────────────
    // UPLOAD
    // ─────────────────────────────────────────────────────────────────
    if (this.match(msg, ['upload', 'caric', 'caricar', 'come carico', 'trascinare', 'drag', 'drop'])) {
      return this.ok('**Come caricare un file:**\n\n1. Vai alla sezione **Upload** dal menu in alto\n2. Trascina il file nell\'area di drop oppure clicca per sfogliare\n3. Attendi il completamento dell\'upload\n\n📋 **Formati supportati:** JPG, PNG, GIF, PDF, DOC, DOCX, TXT, ZIP\n💾 **Dimensione massima:** 50MB per file');
    }

    // ─────────────────────────────────────────────────────────────────
    // DOWNLOAD
    // ─────────────────────────────────────────────────────────────────
    if (this.match(msg, ['download', 'scaric', 'scaricare', 'come scarico'])) {
      return this.ok('**Come scaricare un file:**\n\n1. Vai alla sezione **Files** dal menu\n2. Trova il file che vuoi scaricare\n3. Clicca l\'icona di download accanto al file\n\nPuoi scaricare anche file condivisi tramite link, a patto di essere registrato.');
    }

    // ─────────────────────────────────────────────────────────────────
    // CONDIVISIONE / SHARING
    // ─────────────────────────────────────────────────────────────────
    if (this.match(msg, ['condivid', 'share', 'link condivision', 'inviare file', 'mandare file', 'condivisione'])) {
      return this.ok('**Come condividere un file:**\n\n1. Vai a **Files** e seleziona il file\n2. Clicca il pulsante **Share** / Condividi\n3. Copia il link univoco generato\n4. Invia il link al destinatario\n\n⚠️ Il destinatario deve essere **registrato** per scaricare il file. I link rimangono attivi finché non li elimini.');
    }

    if (this.match(msg, ['link scad', 'link attivo', 'per quanto', 'quanto dura'])) {
      return this.ok('I **link di condivisione** rimangono attivi indefinitamente finché non li elimini manualmente dalla sezione Files. Puoi revocare l\'accesso in qualsiasi momento.');
    }

    // ─────────────────────────────────────────────────────────────────
    // STORAGE / SPAZIO
    // ─────────────────────────────────────────────────────────────────
    if (this.match(msg, ['spazio', 'storage', 'quota', 'limite', 'gb', 'mb', 'quant', 'quanto spazio', 'archiviazione'])) {
      return this.ok('**Quota di archiviazione:**\n\n💾 Ogni account ha **500MB** di spazio disponibile\n📊 Puoi vedere lo spazio utilizzato nella sezione **Files** con la barra di progresso\n\nSe raggiungi il limite, dovrai eliminare alcuni file prima di poterne caricare altri nuovi.');
    }

    // ─────────────────────────────────────────────────────────────────
    // FORMATI FILE
    // ─────────────────────────────────────────────────────────────────
    if (this.match(msg, ['quali file', 'formato', 'formati', 'tipo file', 'estension', 'pdf', 'immagini', 'zip', 'docx'])) {
      return this.ok('**Formati file supportati:**\n\n🖼️ **Immagini:** JPG, PNG, GIF\n📄 **Documenti:** PDF, DOC, DOCX, TXT\n📦 **Archivi:** ZIP\n\n**Limite:** max 50MB per file singolo. Per file più grandi considera di comprimerli in ZIP.');
    }

    // ─────────────────────────────────────────────────────────────────
    // SICUREZZA / ENCRYPTION
    // ─────────────────────────────────────────────────────────────────
    if (this.match(msg, ['sicurezza', 'sicuro', 'crittografi', 'encrypt', 'privacy', 'protezion', 'safe', 'secure', 'https', 'aes'])) {
      return this.ok('**Sicurezza della piattaforma:**\n\n🔐 **Crittografia file:** AES-256 — solo tu puoi accedere ai tuoi file\n🌐 **Connessione:** HTTPS obbligatorio su tutte le comunicazioni\n🛡️ **Protezione attacchi:** Rate limiting e protezione DDoS\n🔒 **Sessioni:** Session management sicuro con JWT token\n🧱 **CORS:** Accesso limitato solo ai domini autorizzati\n\nI tuoi dati sono protetti da standard enterprise.');
    }

    // ─────────────────────────────────────────────────────────────────
    // PASSWORD
    // ─────────────────────────────────────────────────────────────────
    if (this.match(msg, ['password', 'cambiare password', 'reset password', 'dimenticato password', 'password dimenticata'])) {
      return this.ok('**Requisiti password:**\n\n✅ Almeno 8 caratteri\n✅ Almeno 1 lettera maiuscola\n✅ Almeno 1 lettera minuscola\n✅ Almeno 1 numero\n✅ Almeno 1 carattere speciale (!@#$%^&*)\n\nPer il **reset password** contatta il supporto: **404@404.com**. Il sistema di reset self-service è in arrivo nelle prossime versioni.');
    }

    // ─────────────────────────────────────────────────────────────────
    // ACCOUNT / LOGIN / REGISTER
    // ─────────────────────────────────────────────────────────────────
    if (this.match(msg, ['account', 'registrar', 'register', 'creare account', 'nuovo utente', 'sign up', 'iscriver'])) {
      return this.ok('**Come creare un account:**\n\n1. Clicca **Register** nella pagina di login\n2. Inserisci il tuo indirizzo email\n3. Crea una password sicura (8+ caratteri, maiuscole, numeri, simboli)\n4. Conferma la password\n5. Clicca **Registrati**\n\nDopo la registrazione hai subito accesso a **500MB** di spazio gratuito.');
    }

    if (this.match(msg, ['login', 'accedere', 'non riesco', 'non riesce', 'errore login', 'credenziali', 'accesso negato'])) {
      return this.ok('**Problemi di login? Prova questi passi:**\n\n1. ✔️ Controlla che l\'email sia scritta correttamente\n2. 🔑 Verifica di usare la password giusta (case-sensitive)\n3. 🍪 Assicurati che i cookie siano abilitati nel browser\n4. 🔄 Prova a riaggiornare la pagina\n5. 🌐 Prova con un browser diverso\n\nSe il problema persiste, contatta: **404@404.com**');
    }

    if (this.match(msg, ['logout', 'uscire', 'disconnettersi', 'esci', 'disconnect'])) {
      return this.ok('Per **uscire dall\'account**, clicca sul menu in alto a destra e seleziona **Logout**. La sessione verrà terminata in modo sicuro e potrai effettuare un nuovo accesso.');
    }

    // ─────────────────────────────────────────────────────────────────
    // NOTE / ANNOTAZIONI
    // ─────────────────────────────────────────────────────────────────
    if (this.match(msg, ['note', 'nota', 'annotazion', 'commento', 'descrizione file'])) {
      return this.ok('Puoi aggiungere **note personalizzate** a ogni file che carichi. È utile per aggiungere descrizioni, promemoria o tag.\n\n📝 Clicca sull\'icona nota accanto a ogni file nella sezione **Files** per aggiungere o modificare una nota.');
    }

    // ─────────────────────────────────────────────────────────────────
    // ELIMINAZIONE FILE
    // ─────────────────────────────────────────────────────────────────
    if (this.match(msg, ['elimin', 'cancellar', 'cancella file', 'elimina file', 'delete', 'rimovere'])) {
      return this.ok('**Come eliminare un file:**\n\n1. Vai alla sezione **Files**\n2. Individua il file da eliminare\n3. Clicca l\'icona 🗑️ accanto al file\n4. Conferma l\'eliminazione\n\n⚠️ L\'eliminazione è **permanente** e lo spazio viene liberato immediatamente. I link di condivisione associati smettono di funzionare.');
    }

    // ─────────────────────────────────────────────────────────────────
    // ADMIN
    // ─────────────────────────────────────────────────────────────────
    if (this.match(msg, ['admin', 'pannello admin', 'admin panel', 'amministrator', 'gestione utenti'])) {
      return this.ok('Il **pannello Admin** è accessibile solo a utenti autorizzati tramite credenziali speciali.\n\nDal pannello admin è possibile:\n• 👥 Visualizzare e gestire tutti gli utenti\n• 📊 Monitorare le statistiche del sistema\n• 📋 Consultare i log delle attività\n• ✅ Attivare/disattivare account utente\n\nPer accedere vai a `/admin-login`.');
    }

    // ─────────────────────────────────────────────────────────────────
    // SUPPORTO / HELP GENERALE
    // ─────────────────────────────────────────────────────────────────
    if (this.match(msg, ['aiuto', 'help', 'assistenza', 'supporto', 'problema', 'non funziona', 'bug', 'errore'])) {
      return this.ok('**Supporto CloudeStorage disponibile:**\n\n🤖 **AI Chat** (questo sistema) — risposta immediata 24/7\n📧 **Email diretta:** 404@404.com — per problemi complessi\n\nSono in grado di aiutarti con:\n• Upload e gestione file\n• Condivisione link\n• Problemi di account e login\n• Sicurezza e privacy\n• Funzionalità del sito\n\nDescrivimi il problema e troveremo insieme la soluzione!');
    }

    if (this.match(msg, ['feature', 'funzionalità', 'novità', 'aggiornament', 'wip', 'prossim'])) {
      return this.ok('Stiamo continuamente lavorando per migliorare **CloudeStorage**! 🚀\n\nVisita la sezione **Settings → Work in Progress** per scoprire le funzionalità in sviluppo.\n\nAlcune in arrivo:\n• 🔔 Notifiche in tempo reale\n• 🗂️ Organizzazione con cartelle\n• 📱 App mobile\n• 🔗 Integrazione con altri servizi cloud');
    }

    // ─────────────────────────────────────────────────────────────────
    // FALLBACK INTELLIGENTE
    // ─────────────────────────────────────────────────────────────────
    return {
      success: false,
      message: `Non ho trovato una risposta precisa per "${userMessage.substring(0, 60)}${userMessage.length > 60 ? '...' : ''}".\n\nPosso aiutarti con:\n• **Upload/Download** file\n• **Condivisione** link\n• **Sicurezza** e crittografia\n• **Account** e login\n• **Storage** e quota\n• **Funzionalità** della piattaforma\n\nRiformula la domanda oppure contatta il nostro team: **${SUPPORT_EMAIL}** 📧`,
      supportEmail: SUPPORT_EMAIL,
      isAI: true,
    };
  }

  /**
   * Helper: check if any keyword matches the message
   */
  static match(msg, keywords) {
    return keywords.some(k => msg.includes(k));
  }

  /**
   * Helper: success response
   */
  static ok(message) {
    return { success: true, message, isAI: true };
  }

  /**
   * Get bot info
   */
  static getBotInfo() {
    return {
      name: 'CloudeStorage AI Support',
      supportEmail: SUPPORT_EMAIL,
      description: 'Sistema AI di supporto per CloudeStorage — disponibile 24/7',
      version: '2.0',
    };
  }
}

module.exports = TelegramService;
