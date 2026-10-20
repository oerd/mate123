type Language = 'en' | 'de' | 'it' | 'fr' | 'sq';

interface Translations {
  title: string;
  checkAnswer: string;
  correct: string;
  tryAgain: string;
  newProblem: string;
  settings: string;
  languageSettings: string;
  selectLanguage: string;
  english: string;
  german: string;
  italian: string;
  french: string;
  albanian: string;
  backToGame: string;
  themeSettings: string;
  lightTheme: string;
  darkTheme: string;
  systemTheme: string;
  usingSystemTheme: string;
  addition: string;
  subtraction: string;
  multiplication: string;
  division: string;
  operandSettings: string;
  firstOperandRange: string;
  secondOperandRange: string;
  min: string;
  max: string;
  operationSettings: string;
  selectOperations: string;
  resultOptions: string;
  numberOfResults: string;
  saveSettings: string;
  teacherSettings: string;
  sortResults: string;
  sortResultsDescription: string;
  shareSettings: string;
  shareSettingsTooltip: string;
  copied: string;
  loadedFromUrl: string;
  answerLabel: string;
  rounding: string;
  comparison: string;
  roundingSettings: string;
  roundToNearest: string;
  roundToNearestTask: string;
  roundingAnswers: string;
  roundingAnswersTwo: string;
  roundingAnswersFour: string;
  showNumberLine: string;
  comparisonSettings: string;
  compareWhat: string;
  compareNumbers: string;
  compareSums: string;
  whichSignFits: string;
}

export const translations: Record<Language, Translations> = {
  en: {
    title: 'Math Practice',
    checkAnswer: 'Check Answer',
    correct: 'Correct! 🎉',
    tryAgain: 'Try again! 🤔',
    newProblem: 'New Problem',
    settings: 'Settings',
    languageSettings: 'Language Settings',
    selectLanguage: 'Select Language',
    english: 'English',
    german: 'German',
    italian: 'Italian',
    french: 'French',
    albanian: 'Albanian',
    backToGame: 'Back to Game',
    themeSettings: 'Theme Settings',
    lightTheme: 'Light',
    darkTheme: 'Dark',
    systemTheme: 'System',
    usingSystemTheme: 'Currently using',
    addition: 'Addition',
    subtraction: 'Subtraction',
    multiplication: 'Multiplication',
    division: 'Division',
    operandSettings: 'Operand Range',
    firstOperandRange: 'First Operand',
    secondOperandRange: 'Second Operand',
    min: 'Min',
    max: 'Max',
    operationSettings: 'Operations',
    selectOperations: 'Select Operations',
    resultOptions: 'Answers',
    numberOfResults: 'Number of Answers',
    saveSettings: 'Save Settings',
    teacherSettings: 'Teacher Settings',
    sortResults: 'Sort Answers',
    sortResultsDescription: 'Sort answer options from smallest to largest',
    shareSettings: 'Share Settings',
    shareSettingsTooltip: 'Copy settings URL to clipboard',
    copied: 'Copied!',
    loadedFromUrl: 'Settings loaded from shared link',
    answerLabel: 'Your answer',
    rounding: 'Rounding',
    comparison: 'Comparison',
    roundingSettings: 'Rounding',
    roundToNearest: 'Round to the nearest',
    roundToNearestTask: 'Round to the nearest {n}',
    roundingAnswers: 'Answers to choose from',
    roundingAnswersTwo: '2 · the two neighbours',
    roundingAnswersFour: '4 · with distractors',
    showNumberLine: 'Show the number line',
    comparisonSettings: 'Comparison',
    compareWhat: 'Compare',
    compareNumbers: 'Numbers',
    compareSums: 'Sums',
    whichSignFits: 'Which sign fits?'
  },
  de: {
    title: 'Mathe-Übung',
    checkAnswer: 'Antwort prüfen',
    correct: 'Richtig! 🎉',
    tryAgain: 'Versuche es nochmal! 🤔',
    newProblem: 'Neue Aufgabe',
    settings: 'Einstellungen',
    languageSettings: 'Spracheinstellungen',
    selectLanguage: 'Sprache auswählen',
    english: 'Englisch',
    german: 'Deutsch',
    italian: 'Italienisch',
    french: 'Französisch',
    albanian: 'Albanisch',
    backToGame: 'Zurück zum Spiel',
    themeSettings: 'Theme-Einstellungen',
    lightTheme: 'Hell',
    darkTheme: 'Dunkel',
    systemTheme: 'System',
    usingSystemTheme: 'Aktuell verwendet',
    addition: 'Addition',
    subtraction: 'Subtraktion',
    multiplication: 'Multiplikation',
    division: 'Division',
    operandSettings: 'Operanden-Bereichseinstellungen',
    firstOperandRange: 'Bereich des ersten Operanden',
    secondOperandRange: 'Bereich des zweiten Operanden',
    min: 'Min',
    max: 'Max',
    operationSettings: 'Operationseinstellungen',
    selectOperations: 'Operationen auswählen',
    resultOptions: 'Ergebnisoptionen',
    numberOfResults: 'Anzahl der Ergebnisse',
    saveSettings: 'Einstellungen speichern',
    teacherSettings: 'Lehrereinstellungen',
    sortResults: 'Ergebnisse sortieren',
    sortResultsDescription: 'Antwortoptionen von klein nach groß sortieren',
    shareSettings: 'Einstellungen teilen',
    shareSettingsTooltip: 'Einstellungs-URL in die Zwischenablage kopieren',
    copied: 'Kopiert!',
    loadedFromUrl: 'Einstellungen aus geteiltem Link geladen',
    answerLabel: 'Deine Antwort',
    rounding: 'Runden',
    comparison: 'Vergleichen',
    roundingSettings: 'Runden',
    roundToNearest: 'Runden auf',
    roundToNearestTask: 'Runde auf {n}er',
    roundingAnswers: 'Antworten zur Auswahl',
    roundingAnswersTwo: '2 · die beiden Nachbarn',
    roundingAnswersFour: '4 · mit Ablenkern',
    showNumberLine: 'Zahlenstrahl anzeigen',
    comparisonSettings: 'Vergleichen',
    compareWhat: 'Vergleiche',
    compareNumbers: 'Zahlen',
    compareSums: 'Summen',
    whichSignFits: 'Welches Zeichen passt?'
  },
  it: {
    title: 'Esercizi di Matematica',
    checkAnswer: 'Verifica Risposta',
    correct: 'Corretto! 🎉',
    tryAgain: 'Riprova! 🤔',
    newProblem: 'Nuovo Problema',
    settings: 'Impostazioni',
    languageSettings: 'Impostazioni Lingua',
    selectLanguage: 'Seleziona Lingua',
    english: 'Inglese',
    german: 'Tedesco',
    italian: 'Italiano',
    french: 'Francese',
    albanian: 'Albanese',
    backToGame: 'Torna al Gioco',
    themeSettings: 'Impostazioni Tema',
    lightTheme: 'Chiaro',
    darkTheme: 'Scuro',
    systemTheme: 'Sistema',
    usingSystemTheme: 'Attualmente in uso',
    addition: 'Addizione',
    subtraction: 'Sottrazione',
    multiplication: 'Moltiplicazione',
    division: 'Divisione',
    operandSettings: 'Impostazioni Intervallo Operandi',
    firstOperandRange: 'Intervallo Primo Operando',
    secondOperandRange: 'Intervallo Secondo Operando',
    min: 'Min',
    max: 'Max',
    operationSettings: 'Impostazioni Operazioni',
    selectOperations: 'Seleziona Operazioni',
    resultOptions: 'Opzioni Risultato',
    numberOfResults: 'Numero di Risultati',
    saveSettings: 'Salva Impostazioni',
    teacherSettings: 'Impostazioni Insegnante',
    sortResults: 'Ordina Risultati',
    sortResultsDescription: 'Ordina le opzioni di risposta dal più piccolo al più grande',
    shareSettings: 'Condividi Impostazioni',
    shareSettingsTooltip: 'Copia URL delle impostazioni negli appunti',
    copied: 'Copiato!',
    loadedFromUrl: 'Impostazioni caricate da link condiviso',
    answerLabel: 'La tua risposta',
    rounding: 'Arrotondamento',
    comparison: 'Confronto',
    roundingSettings: 'Arrotondamento',
    roundToNearest: 'Arrotonda alle',
    roundToNearestTask: 'Arrotonda alle {n}',
    roundingAnswers: 'Risposte tra cui scegliere',
    roundingAnswersTwo: '2 · i due vicini',
    roundingAnswersFour: '4 · con distrattori',
    showNumberLine: 'Mostra la linea dei numeri',
    comparisonSettings: 'Confronto',
    compareWhat: 'Confronta',
    compareNumbers: 'Numeri',
    compareSums: 'Somme',
    whichSignFits: 'Quale segno ci va?'
  },
  fr: {
    title: 'Exercices de Mathématiques',
    checkAnswer: 'Vérifier la Réponse',
    correct: 'Correct! 🎉',
    tryAgain: 'Essaie encore! 🤔',
    newProblem: 'Nouveau Problème',
    settings: 'Paramètres',
    languageSettings: 'Paramètres de Langue',
    selectLanguage: 'Sélectionner la Langue',
    english: 'Anglais',
    german: 'Allemand',
    italian: 'Italien',
    french: 'Français',
    albanian: 'Albanais',
    backToGame: 'Retour au Jeu',
    themeSettings: 'Paramètres de Thème',
    lightTheme: 'Clair',
    darkTheme: 'Sombre',
    systemTheme: 'Système',
    usingSystemTheme: 'Actuellement utilisé',
    addition: 'Addition',
    subtraction: 'Soustraction',
    multiplication: 'Multiplication',
    division: 'Division',
    operandSettings: 'Paramètres de Plage d\'Opérandes',
    firstOperandRange: 'Plage du Premier Opérande',
    secondOperandRange: 'Plage du Deuxième Opérande',
    min: 'Min',
    max: 'Max',
    operationSettings: 'Paramètres d\'Opération',
    selectOperations: 'Sélectionner les Opérations',
    resultOptions: 'Options de Résultat',
    numberOfResults: 'Nombre de Résultats',
    saveSettings: 'Enregistrer les Paramètres',
    teacherSettings: 'Paramètres Enseignant',
    sortResults: 'Trier les Résultats',
    sortResultsDescription: 'Trier les options de réponse du plus petit au plus grand',
    shareSettings: 'Partager les Paramètres',
    shareSettingsTooltip: 'Copier l\'URL des paramètres dans le presse-papiers',
    copied: 'Copié!',
    loadedFromUrl: 'Paramètres chargés depuis un lien partagé',
    answerLabel: 'Ta réponse',
    rounding: 'Arrondi',
    comparison: 'Comparaison',
    roundingSettings: 'Arrondi',
    roundToNearest: 'Arrondir à',
    roundToNearestTask: 'Arrondis à la {n} près',
    roundingAnswers: 'Réponses proposées',
    roundingAnswersTwo: '2 · les deux voisins',
    roundingAnswersFour: '4 · avec distracteurs',
    showNumberLine: 'Afficher la droite numérique',
    comparisonSettings: 'Comparaison',
    compareWhat: 'Comparer',
    compareNumbers: 'Nombres',
    compareSums: 'Sommes',
    whichSignFits: 'Quel signe convient ?'
  },
  sq: {
    title: 'Praktikë Matematike',
    checkAnswer: 'Kontrollo përgjigjen',
    correct: 'Saktë! 🎉',
    tryAgain: 'Provo përsëri! 🤔',
    newProblem: 'Problem i ri',
    settings: 'Cilësimet',
    languageSettings: 'Opsionet e gjuhës',
    selectLanguage: 'Zgjidh gjuhën',
    english: 'Anglisht',
    german: 'Gjermanisht',
    italian: 'Italisht',
    french: 'Frëngjisht',
    albanian: 'Shqip',
    backToGame: 'Kthehu te loja',
    themeSettings: 'Opsionet e temës',
    lightTheme: 'E çelur',
    darkTheme: 'E errët',
    systemTheme: 'Sistem',
    usingSystemTheme: 'Aktualisht duke përdorur',
    addition: 'Mbledhje',
    subtraction: 'Zbritje',
    multiplication: 'Shumëzim',
    division: 'Pjesëtim',
    operandSettings: 'Diapazoni i operandëve',
    firstOperandRange: 'Operandi i parë',
    secondOperandRange: 'Operandi i dytë',
    min: 'Min',
    max: 'Maks',
    operationSettings: 'Veprimet',
    selectOperations: 'Zgjidh veprimet',
    resultOptions: 'Përgjigjet',
    numberOfResults: 'Numri i përgjigjeve',
    saveSettings: 'Ruaj cilësimet',
    teacherSettings: 'Opsionet e mësuesit',
    sortResults: 'Rendit përgjigjet',
    sortResultsDescription: 'Rendit përgjigjet nga më e vogla te më e madhja',
    shareSettings: 'Ndaj cilësimet',
    shareSettingsTooltip: 'Kopjo URL-në e cilësimeve',
    copied: 'U kopjua!',
    loadedFromUrl: 'Cilësimet u ngarkuan nga lidhja e ndarë',
    answerLabel: 'Përgjigja jote',
    rounding: 'Rrumbullakim',
    comparison: 'Krahasim',
    roundingSettings: 'Rrumbullakimi',
    roundToNearest: 'Rrumbullako në',
    roundToNearestTask: 'Rrumbullako në {n}-shen më të afërt',
    roundingAnswers: 'Përgjigjet për të zgjedhur',
    roundingAnswersTwo: '2 · dy fqinjët',
    roundingAnswersFour: '4 · me shpërqendrues',
    showNumberLine: 'Shfaq boshtin numerik',
    comparisonSettings: 'Krahasimi',
    compareWhat: 'Krahaso',
    compareNumbers: 'Numra',
    compareSums: 'Shuma',
    whichSignFits: 'Cila shenjë përshtatet?'
  }
};

export type { Language, Translations };