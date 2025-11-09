export type Language = "en" | "tr" | "it"

export const translations = {
  en: {
    // Auth
    login: "Log In",
    signup: "Sign Up",
    email: "Email",
    username: "Username",
    password: "Password",
    confirmPassword: "Confirm Password",
    forgotPassword: "Forgot Password?",
    noAccount: "Don't have an account?",
    haveAccount: "Already have an account?",
    welcomeBack: "Welcome Back to Octo-Focus",
    joinOcto: "Join Octo-Focus",

    // Onboarding
    getToKnowYou:
      "To help you better, we need to learn a few things about you. With your answers, we'll personalize your study plan.",
    startOnboarding: "Start",
    whatDistracts: "What distracts you the most?",
    whatHelps: "What helps you regain focus when you get distracted?",
    back: "Back",
    next: "Next",
    finish: "Finish",

    // Distractions
    noise: "Noise",
    notifications: "Notifications",
    messyWorkspace: "Messy Workspace",
    stress: "Stress",
    socialMedia: "Social Media",
    poorLighting: "Poor Lighting",

    // Focus Helpers
    breathing: "Breathing Exercises",
    stretching: "Stretching",
    walk: "Quick Walk",
    water: "Hydration",

    // Home
    totalSeashells: "Total Seashells",
    weeklyProgress: "Weekly Progress",
    timeToFocus: "Time to Focus",
    menu: "Menu",
    settings: "Settings",
    calendar: "Calendar",
    premium: "Premium",
    logout: "Log Out",

    // Focus Selection
    focusTime: "Focus Time",
    chooseMode: "Choose Your Focus Mode",
    custom: "Custom",
    noBreak: "No Break",

    // Session
    breakTime: "Break Time",
    pause: "Pause",
    start: "Start",
    distractions: "Distractions",
    seashellsEarned: "Seashells Earned",

    // Motivation
    motivation1: "You are working great, keep up!",
    motivation2: "Every focused minute counts. Let's make today productive!",
    motivation3: "Your consistency is impressive. Time to focus!",
    motivation4: "Ready to crush your goals? Let's get started!",
    motivation5: "Small steps lead to big achievements. You've got this!",

    // Days of the week
    monday: "Monday",
    tuesday: "Tuesday",
    wednesday: "Wednesday",
    thursday: "Thursday",
    friday: "Friday",
    saturday: "Saturday",
    sunday: "Sunday",

    // Short days
    mon: "mon",
    tue: "tue",
    wed: "wed",
    thu: "thu",
    fri: "fri",
    sat: "sat",
    sun: "sun",

    // Months
    january: "January",
    february: "February",
    march: "March",
    april: "April",
    may: "May",
    june: "June",
    july: "July",
    august: "August",
    september: "September",
    october: "October",
    november: "November",
    december: "December",

    week: "week",

    // AI fatigue detection translations
    tired: "Tired",
    pomodoroIsBest: "Pomodoro is the best option for you",
    workDuration: "Work Duration",
    breakDuration: "Break Duration",
    minutes: "minutes",
    startSession: "Start Session",
    cameraError: "Could not access camera. Please allow camera permissions.",
    aiFatigueDetection: "AI Fatigue Detection",
    analyzingFatigue: "Analyzing your fatigue level...",
    startCamera: "Start Camera",
    analyzeFatigueLevel: "Analyze Fatigue Level",
    analyzing: "Analyzing...",
    howItWorks: "How it works:",
    aiAnalyzesFacial: "AI analyzes your facial expressions and eye patterns",
    detectsFatigue: "Detects your current fatigue level percentage",
    suggestsOptimal: "Suggests optimal work and break durations",
    maintainProductivity: "Helps you maintain peak productivity",
    aiPoweredPersonalization: "AI-Powered Personalization",
    letAiAnalyze: "Let AI analyze your fatigue level and suggest the perfect Pomodoro timing for you",
    startAiDetection: "Start AI Detection",

    // New translations
    language: "Language",
    focusLevel: "Focus Level",
    distracted: "distracted",
    perfectFocus: "Perfect focus! You stayed completely on track!",
    greatJob: "Great job! You maintained excellent focus!",
    goodEffort: "Good effort! Keep working on your focus!",
    completedSession: "You completed the session! Every step counts!",
    sessionComplete: "Session Complete!",
    keepItUp: "Keep it up!",
    consistencyMessage:
      "Consistency is key to building better focus habits. Your progress is being tracked in your calendar and weekly stats.",
    startAnother: "Start Another Session",
    backToHome: "Back to Home",
    min: "min",

    // AI monitoring and "Start focused!"
    aiMonitoringActive: "AI Monitoring Active",
    watchingForDistractions: "Watching for distractions",
    startFocused: "Start focused!",
    concentration: "Concentration",
  },
  tr: {
    // Auth
    login: "Giriş Yap",
    signup: "Kayıt Ol",
    email: "E-posta",
    username: "Kullanıcı Adı",
    password: "Şifre",
    confirmPassword: "Şifreyi Onayla",
    forgotPassword: "Şifremi Unuttum?",
    noAccount: "Hesabınız yok mu?",
    haveAccount: "Zaten hesabınız var mı?",
    welcomeBack: "Octo-Focus'a Tekrar Hoş Geldiniz",
    joinOcto: "Octo-Focus'a Katıl",

    // Onboarding
    getToKnowYou:
      "Size daha iyi yardımcı olmak için birkaç şey öğrenmemiz gerekiyor. Cevaplarınızla çalışma planınızı kişiselleştireceğiz.",
    startOnboarding: "Başla",
    whatDistracts: "Sizi en çok ne dikkat dağıtıyor?",
    whatHelps: "Dikkatin dağıldığında odaklanmana ne yardımcı olur?",
    back: "Geri",
    next: "İleri",
    finish: "Bitir",

    // Distractions
    noise: "Gürültü",
    notifications: "Bildirimler",
    messyWorkspace: "Dağınık Çalışma Alanı",
    stress: "Stres",
    socialMedia: "Sosyal Medya",
    poorLighting: "Yetersiz Aydınlatma",

    // Focus Helpers
    breathing: "Nefes Egzersizleri",
    stretching: "Esneme",
    walk: "Kısa Yürüyüş",
    water: "Su İçme",

    // Home
    totalSeashells: "Toplam Deniz Kabukları",
    weeklyProgress: "Haftalık İlerleme",
    timeToFocus: "Odaklanma Zamanı",
    menu: "Menü",
    settings: "Ayarlar",
    calendar: "Takvim",
    premium: "Premium",
    logout: "Çıkış Yap",

    // Focus Selection
    focusTime: "Odaklanma Zamanı",
    chooseMode: "Odaklanma Modunu Seç",
    custom: "Özel",
    noBreak: "Molasız",

    // Session
    breakTime: "Mola Zamanı",
    pause: "Duraklat",
    start: "Başlat",
    distractions: "Dikkat Dağılmaları",
    seashellsEarned: "Kazanılan Deniz Kabukları",

    // Motivation
    motivation1: "Harika çalışıyorsun, böyle devam!",
    motivation2: "Her odaklanma dakikası önemli. Bugünü verimli geçirelim!",
    motivation3: "Tutarlılığın etkileyici. Odaklanma zamanı!",
    motivation4: "Hedeflerini parçalamaya hazır mısın? Hadi başlayalım!",
    motivation5: "Küçük adımlar büyük başarılara götürür. Yaparsın!",

    // Days of the week
    monday: "Pazartesi",
    tuesday: "Salı",
    wednesday: "Çarşamba",
    thursday: "Perşembe",
    friday: "Cuma",
    saturday: "Cumartesi",
    sunday: "Pazar",

    // Short days
    mon: "pzt",
    tue: "sal",
    wed: "çar",
    thu: "per",
    fri: "cum",
    sat: "cmt",
    sun: "paz",

    // Months
    january: "Ocak",
    february: "Şubat",
    march: "Mart",
    april: "Nisan",
    may: "Mayıs",
    june: "Haziran",
    july: "Temmuz",
    august: "Ağustos",
    september: "Eylül",
    october: "Ekim",
    november: "Kasım",
    december: "Aralık",

    week: "hafta",

    // AI fatigue detection translations
    tired: "Yorgun",
    pomodoroIsBest: "Pomodoro senin için en iyi seçenek",
    workDuration: "Çalışma Süresi",
    breakDuration: "Mola Süresi",
    minutes: "dakika",
    startSession: "Oturumu Başlat",
    cameraError: "Kameraya erişilemiyor. Lütfen kamera izinlerini verin.",
    aiFatigueDetection: "Yapay Zeka Yorgunluk Tespiti",
    analyzingFatigue: "Yorgunluk seviyeniz analiz ediliyor...",
    startCamera: "Kamerayı Başlat",
    analyzeFatigueLevel: "Yorgunluk Seviyesini Analiz Et",
    analyzing: "Analiz ediliyor...",
    howItWorks: "Nasıl çalışır:",
    aiAnalyzesFacial: "Yapay zeka yüz ifadelerinizi ve göz hareketlerinizi analiz eder",
    detectsFatigue: "Mevcut yorgunluk seviyesi yüzdenizi tespit eder",
    suggestsOptimal: "Optimal çalışma ve mola sürelerini önerir",
    maintainProductivity: "En yüksek verimliliği korumanıza yardımcı olur",
    aiPoweredPersonalization: "Yapay Zeka Destekli Kişiselleştirme",
    letAiAnalyze:
      "Yapay zekanın yorgunluk seviyenizi analiz etmesine ve sizin için mükemmel Pomodoro zamanlamasını önermesine izin verin",
    startAiDetection: "Yapay Zeka Tespitini Başlat",

    // New translations
    language: "Dil",
    focusLevel: "Odaklanma Seviyesi",
    distracted: "dağınık",
    perfectFocus: "Mükemmel odaklanma! Tamamen yolunda kaldın!",
    greatJob: "Harika iş! Mükemmel odaklanmayı korudun!",
    goodEffort: "İyi çaba! Odaklanmana devam et!",
    completedSession: "Oturumu tamamladın! Her adım önemli!",
    sessionComplete: "Oturum Tamamlandı!",
    keepItUp: "Böyle devam!",
    consistencyMessage:
      "Tutarlılık, daha iyi odaklanma alışkanlıkları oluşturmanın anahtarıdır. İlerlemeniz takviminizde ve haftalık istatistiklerinizde takip ediliyor.",
    startAnother: "Başka Bir Oturum Başlat",
    backToHome: "Ana Sayfaya Dön",
    min: "dk",

    // AI monitoring and "Start focused!"
    aiMonitoringActive: "Yapay Zeka İzleme Aktif",
    watchingForDistractions: "Dikkat dağınıklığı izleniyor",
    startFocused: "Odaklanarak başla!",
    concentration: "Konsantrasyon",
  },
  it: {
    // Auth
    login: "Accedi",
    signup: "Registrati",
    email: "Email",
    username: "Nome utente",
    password: "Password",
    confirmPassword: "Conferma Password",
    forgotPassword: "Password dimenticata?",
    noAccount: "Non hai un account?",
    haveAccount: "Hai già un account?",
    welcomeBack: "Bentornato su Octo-Focus",
    joinOcto: "Unisciti a Octo-Focus",

    // Onboarding
    getToKnowYou:
      "Per aiutarti meglio, dobbiamo imparare alcune cose su di te. Con le tue risposte, personalizzeremo il tuo piano di studio.",
    startOnboarding: "Inizia",
    whatDistracts: "Cosa ti distrae di più?",
    whatHelps: "Cosa ti aiuta a ritrovare la concentrazione quando ti distrai?",
    back: "Indietro",
    next: "Avanti",
    finish: "Fine",

    // Distractions
    noise: "Rumore",
    notifications: "Notifiche",
    messyWorkspace: "Spazio di lavoro disordinato",
    stress: "Stress",
    socialMedia: "Social Media",
    poorLighting: "Illuminazione scarsa",

    // Focus Helpers
    breathing: "Esercizi di respirazione",
    stretching: "Stretching",
    walk: "Breve camminata",
    water: "Idratazione",

    // Home
    totalSeashells: "Conchiglie Totali",
    weeklyProgress: "Progresso Settimanale",
    timeToFocus: "Tempo di Concentrazione",
    menu: "Menu",
    settings: "Impostazioni",
    calendar: "Calendario",
    premium: "Premium",
    logout: "Esci",

    // Focus Selection
    focusTime: "Tempo di Concentrazione",
    chooseMode: "Scegli la tua modalità di concentrazione",
    custom: "Personalizzato",
    noBreak: "Senza Pausa",

    // Session
    breakTime: "Tempo di Pausa",
    pause: "Pausa",
    start: "Inizia",
    distractions: "Distrazioni",
    seashellsEarned: "Conchiglie Guadagnate",

    // Motivation
    motivation1: "Stai lavorando benissimo, continua così!",
    motivation2: "Ogni minuto di concentrazione conta. Rendiamo produttiva questa giornata!",
    motivation3: "La tua costanza è impressionante. È ora di concentrarsi!",
    motivation4: "Pronto a raggiungere i tuoi obiettivi? Iniziamo!",
    motivation5: "Piccoli passi portano a grandi risultati. Ce la puoi fare!",

    // Days of the week
    monday: "Lunedì",
    tuesday: "Martedì",
    wednesday: "Mercoledì",
    thursday: "Giovedì",
    friday: "Venerdì",
    saturday: "Sabato",
    sunday: "Domenica",

    // Short days
    mon: "lun",
    tue: "mar",
    wed: "mer",
    thu: "gio",
    fri: "ven",
    sat: "sab",
    sun: "dom",

    // Months
    january: "Gennaio",
    february: "Febbraio",
    march: "Marzo",
    april: "Aprile",
    may: "Maggio",
    june: "Giugno",
    july: "Luglio",
    august: "Agosto",
    september: "Settembre",
    october: "Ottobre",
    november: "Novembre",
    december: "Dicembre",

    week: "settimana",

    // AI fatigue detection translations
    tired: "Stanco",
    pomodoroIsBest: "Pomodoro è l'opzione migliore per te",
    workDuration: "Durata del Lavoro",
    breakDuration: "Durata della Pausa",
    minutes: "minuti",
    startSession: "Inizia Sessione",
    cameraError: "Impossibile accedere alla fotocamera. Si prega di consentire i permessi della fotocamera.",
    aiFatigueDetection: "Rilevamento della Stanchezza AI",
    analyzingFatigue: "Analisi del tuo livello di stanchezza...",
    startCamera: "Avvia Fotocamera",
    analyzeFatigueLevel: "Analizza Livello di Stanchezza",
    analyzing: "Analisi in corso...",
    howItWorks: "Come funziona:",
    aiAnalyzesFacial: "L'IA analizza le tue espressioni facciali e i movimenti degli occhi",
    detectsFatigue: "Rileva la percentuale del tuo livello di stanchezza attuale",
    suggestsOptimal: "Suggerisce durate ottimali di lavoro e pausa",
    maintainProductivity: "Ti aiuta a mantenere la massima produttività",
    aiPoweredPersonalization: "Personalizzazione Basata sull'IA",
    letAiAnalyze:
      "Lascia che l'IA analizzi il tuo livello di stanchezza e suggerisca la tempistica Pomodoro perfetta per te",
    startAiDetection: "Avvia Rilevamento AI",

    // New translations
    language: "Lingua",
    focusLevel: "Livello di Concentrazione",
    distracted: "distratto",
    perfectFocus: "Concentrazione perfetta! Sei rimasto completamente concentrato!",
    greatJob: "Ottimo lavoro! Hai mantenuto un'eccellente concentrazione!",
    goodEffort: "Buon sforzo! Continua a lavorare sulla tua concentrazione!",
    completedSession: "Hai completato la sessione! Ogni passo conta!",
    sessionComplete: "Sessione Completata!",
    keepItUp: "Continua così!",
    consistencyMessage:
      "La costanza è la chiave per costruire migliori abitudini di concentrazione. I tuoi progressi vengono monitorati nel calendario e nelle statistiche settimanali.",
    startAnother: "Inizia Un'Altra Sessione",
    backToHome: "Torna alla Home",
    min: "min",

    // AI monitoring and "Start focused!"
    aiMonitoringActive: "Monitoraggio IA Attivo",
    watchingForDistractions: "Monitoraggio delle distrazioni",
    startFocused: "Inizia concentrato!",
    concentration: "Concentrazione",
  },
}

export function useTranslation(lang: Language) {
  return translations[lang] || translations.en
}
