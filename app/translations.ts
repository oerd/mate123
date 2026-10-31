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
  teacherSettings: string;
  sortResultsDescription: string;
  randomizeResults: string;
  autoSaved: string;
  saveFailed: string;
  shareSettings: string;
  shareSettingsTooltip: string;
  copied: string;
  shared: string;
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
  skip: string;
  next: string;
  setDone: string;
  keepGoing: string;
  progressLabel: string;
  streakLabel: string;
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
    backToGame: 'Back to practice',
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
    teacherSettings: 'Teacher Settings',
    sortResultsDescription: 'Sort answer options from smallest to largest',
    randomizeResults: 'Randomize answer options',
    autoSaved: 'Saved automatically',
    saveFailed: 'Save failed',
    shareSettings: 'Share Settings',
    shareSettingsTooltip: 'Share or copy the settings link',
    copied: 'Copied!',
    shared: 'Shared!',
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
    whichSignFits: 'Which sign fits?',
    skip: 'Skip',
    next: 'Next',
    setDone: 'You did {n}!',
    keepGoing: 'Keep going',
    progressLabel: '{n} of {total} solved',
    streakLabel: '{n} in a row'
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
    backToGame: 'Zurück zum Üben',
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
    teacherSettings: 'Lehrereinstellungen',
    sortResultsDescription: 'Antwortoptionen von klein nach groß sortieren',
    randomizeResults: 'Antwortoptionen zufällig anordnen',
    autoSaved: 'Automatisch gespeichert',
    saveFailed: 'Speichern fehlgeschlagen',
    shareSettings: 'Einstellungen teilen',
    shareSettingsTooltip: 'Einstellungs-Link teilen oder kopieren',
    copied: 'Kopiert!',
    shared: 'Geteilt!',
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
    whichSignFits: 'Welches Zeichen passt?',
    skip: 'Überspringen',
    next: 'Weiter',
    setDone: 'Du hast {n} geschafft!',
    keepGoing: 'Weiter so',
    progressLabel: '{n} von {total} gelöst',
    streakLabel: '{n} in Folge'
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
    backToGame: 'Torna agli esercizi',
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
    teacherSettings: 'Impostazioni Insegnante',
    sortResultsDescription: 'Ordina le opzioni di risposta dal più piccolo al più grande',
    randomizeResults: 'Ordine casuale delle opzioni di risposta',
    autoSaved: 'Salvato automaticamente',
    saveFailed: 'Salvataggio non riuscito',
    shareSettings: 'Condividi Impostazioni',
    shareSettingsTooltip: 'Condividi o copia il link delle impostazioni',
    copied: 'Copiato!',
    shared: 'Condiviso!',
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
    whichSignFits: 'Quale segno ci va?',
    skip: 'Salta',
    next: 'Avanti',
    setDone: 'Ne hai fatti {n}!',
    keepGoing: 'Continua',
    progressLabel: '{n} su {total} risolti',
    streakLabel: '{n} di fila'
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
    backToGame: 'Retour à l\'exercice',
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
    teacherSettings: 'Paramètres Enseignant',
    sortResultsDescription: 'Trier les options de réponse du plus petit au plus grand',
    randomizeResults: 'Mélanger les options de réponse',
    autoSaved: 'Enregistré automatiquement',
    saveFailed: 'Échec de l\'enregistrement',
    shareSettings: 'Partager les Paramètres',
    shareSettingsTooltip: 'Partager ou copier le lien des paramètres',
    copied: 'Copié!',
    shared: 'Partagé!',
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
    whichSignFits: 'Quel signe convient ?',
    skip: 'Passer',
    next: 'Suivant',
    setDone: 'Tu en as fait {n} !',
    keepGoing: 'Continuer',
    progressLabel: '{n} sur {total} résolus',
    streakLabel: "{n} d'affilée"
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
    backToGame: 'Kthehu te ushtrimet',
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
    teacherSettings: 'Opsionet e mësuesit',
    sortResultsDescription: 'Rendit përgjigjet nga më e vogla te më e madhja',
    randomizeResults: 'Përziej përgjigjet rastësisht',
    autoSaved: 'U ruajt automatikisht',
    saveFailed: 'Ruajtja dështoi',
    shareSettings: 'Ndaj cilësimet',
    shareSettingsTooltip: 'Ndaj ose kopjo lidhjen e cilësimeve',
    copied: 'U kopjua!',
    shared: 'U nda!',
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
    whichSignFits: 'Cila shenjë përshtatet?',
    skip: 'Kalo',
    next: 'Tjetra',
    setDone: 'Bëre {n}!',
    keepGoing: 'Vazhdo',
    progressLabel: '{n} nga {total} të zgjidhura',
    streakLabel: '{n} radhazi'
  }
};

export type { Language, Translations };