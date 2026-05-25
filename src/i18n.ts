export type Locale = 'en' | 'es' | 'fr' | 'pt';

export const locales: Locale[] = ['en', 'es', 'fr', 'pt'];

export const localeLabels: Record<Locale, string> = {
  en: 'English',
  es: 'Español',
  fr: 'Français',
  pt: 'Português',
};

export const normalizeLocale = (locale: string): Locale | null => {
  const code = locale.toLowerCase().split(/[-_]/)[0];
  if (locales.includes(code as Locale)) {
    return code as Locale;
  }
  return null;
};

export const detectBrowserLocale = (): Locale => {
  if (typeof navigator === 'undefined') return 'en';
  const candidates = navigator.languages?.length ? navigator.languages : [navigator.language];
  for (const candidate of candidates) {
    const locale = normalizeLocale(candidate);
    if (locale) return locale;
  }
  return 'en';
};

export const getSavedLocale = (): Locale | null => {
  if (typeof window === 'undefined') return null;
  const saved = window.localStorage.getItem('sudoku-lang');
  return saved && locales.includes(saved as Locale) ? (saved as Locale) : null;
};

export const getInitialLocale = (): Locale => {
  const saved = getSavedLocale();
  if (saved) return saved;
  return detectBrowserLocale();
};

export const saveLocale = (locale: Locale) => {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem('sudoku-lang', locale);
};

export const translations = {
  en: {
    languageLabel: 'Language',
    appTitle: 'Sudoku Premium',
    heroTagline: 'Enjoy classic Sudoku offline on mobile and desktop',
    continueGame: 'Continue Game',
    newGame: 'New Game',
    statistics: 'Statistics',
    selectDifficulty: 'Select Difficulty',
    select: 'Select',
    back: 'Back',
    gameOverTitle: 'Game Over 😢',
    gameOverMessage: (maxMistakes: number) => `You made ${maxMistakes} mistakes. Try again!`,
    retry: 'Retry',
    mainMenu: 'Main Menu',
    generalStats: 'General Statistics',
    played: 'Games',
    victories: 'Wins',
    bestTimes: 'Best Times',
    returnMenu: 'Return to Menu',
    resetStats: 'Reset Stats',
    restartStats: 'Reset statistics',
    difficultyLabels: {
      easy: 'Easy',
      medium: 'Medium',
      hard: 'Hard',
      expert: 'Expert',
    },
    header: {
      backToMenu: 'Back to menu',
      elapsedTime: 'Elapsed time',
      mistakes: 'Mistakes',
      restartGame: 'Restart game',
      achievements: 'Achievements',
      changeTheme: 'Change theme',
    },
    keypad: {
      undo: 'Undo',
      undoTitle: 'Undo move',
      erase: 'Erase',
      eraseTitle: 'Erase cell',
      notes: 'Notes',
      notesTitle: 'Toggle notes mode',
      notesOn: 'Notes ON',
      notesOff: 'Notes OFF',
      hint: 'Hint',
      hintTitle: 'Request hint',
    },
    pwa: {
      offlineReady: 'The app is ready to work offline! 📶',
      updateAvailable: 'New content is available, please refresh to see the changes. ✨',
      update: 'Update',
      close: 'Close',
    },
    victory: {
      title: 'Victory! 🎉',
      message: 'You solved the Sudoku correctly!',
      playAgain: 'Play again',
    },
  },
  es: {
    languageLabel: 'Idioma',
    appTitle: 'Sudoku Premium',
    heroTagline: 'Disfruta del Sudoku clásico sin conexión en tu dispositivo',
    continueGame: 'Continuar Partida',
    newGame: 'Nueva Partida',
    statistics: 'Estadísticas',
    selectDifficulty: 'Seleccionar Dificultad',
    select: 'Seleccionar',
    back: 'Volver',
    gameOverTitle: 'Fin del Juego 😢',
    gameOverMessage: (maxMistakes: number) => `Has cometido ${maxMistakes} errores. ¡Vuelve a intentarlo!`,
    retry: 'Reintentar',
    mainMenu: 'Menú Principal',
    generalStats: 'Estadísticas Generales',
    played: 'Partidas',
    victories: 'Victorias',
    bestTimes: 'Mejores Tiempos',
    returnMenu: 'Volver al Menú',
    resetStats: 'Reiniciar Estadísticas',
    restartStats: 'Reiniciar estadísticas',
    difficultyLabels: {
      easy: 'Fácil',
      medium: 'Medio',
      hard: 'Difícil',
      expert: 'Experto',
    },
    header: {
      backToMenu: 'Volver al menú',
      elapsedTime: 'Tiempo transcurrido',
      mistakes: 'Errores cometidos',
      restartGame: 'Reiniciar juego',
      achievements: 'Logros',
      changeTheme: 'Cambiar tema',
    },
    keypad: {
      undo: 'Deshacer',
      undoTitle: 'Deshacer jugada',
      erase: 'Borrar',
      eraseTitle: 'Borrar celda',
      notes: 'Notas',
      notesTitle: 'Modo notas',
      notesOn: 'Notas ON',
      notesOff: 'Notas OFF',
      hint: 'Pista',
      hintTitle: 'Pedir pista',
    },
    pwa: {
      offlineReady: '¡La aplicación está lista para funcionar sin conexión! 📶',
      updateAvailable: 'Hay contenido nuevo disponible, por favor actualiza para ver los cambios. ✨',
      update: 'Actualizar',
      close: 'Cerrar',
    },
    victory: {
      title: '¡Victoria! 🎉',
      message: '¡Has resuelto el Sudoku correctamente!',
      playAgain: 'Jugar de nuevo',
    },
  },
  fr: {
    languageLabel: 'Langue',
    appTitle: 'Sudoku Premium',
    heroTagline: 'Profitez du Sudoku classique hors ligne sur mobile et bureau',
    continueGame: 'Reprendre la partie',
    newGame: 'Nouvelle partie',
    statistics: 'Statistiques',
    selectDifficulty: 'Choisir la difficulté',
    select: 'Sélectionner',
    back: 'Retour',
    gameOverTitle: 'Fin du jeu 😢',
    gameOverMessage: (maxMistakes: number) => `Vous avez fait ${maxMistakes} erreurs. Réessayez !`,
    retry: 'Réessayer',
    mainMenu: 'Menu principal',
    generalStats: 'Statistiques générales',
    played: 'Parties',
    victories: 'Victoires',
    bestTimes: 'Meilleurs temps',
    returnMenu: 'Retour au menu',
    resetStats: 'Réinitialiser les statistiques',
    restartStats: 'Réinitialiser les statistiques',
    difficultyLabels: {
      easy: 'Facile',
      medium: 'Moyen',
      hard: 'Difficile',
      expert: 'Expert',
    },
    header: {
      backToMenu: 'Retour au menu',
      elapsedTime: 'Temps écoulé',
      mistakes: 'Erreurs',
      restartGame: 'Recommencer',
      achievements: 'Réalisations',
      changeTheme: 'Changer de thème',
    },
    keypad: {
      undo: 'Annuler',
      undoTitle: 'Annuler le coup',
      erase: 'Effacer',
      eraseTitle: 'Effacer la case',
      notes: 'Notes',
      notesTitle: 'Mode notes',
      notesOn: 'Notes ON',
      notesOff: 'Notes OFF',
      hint: 'Indice',
      hintTitle: 'Demander un indice',
    },
    pwa: {
      offlineReady: 'L’application est prête à fonctionner hors ligne ! 📶',
      updateAvailable: 'Nouveaux contenus disponibles, veuillez actualiser pour voir les changements. ✨',
      update: 'Actualiser',
      close: 'Fermer',
    },
    victory: {
      title: 'Victoire ! 🎉',
      message: 'Vous avez résolu le Sudoku correctement !',
      playAgain: 'Rejouer',
    },
  },
  pt: {
    languageLabel: 'Idioma',
    appTitle: 'Sudoku Premium',
    heroTagline: 'Aproveite o Sudoku clássico offline no celular e no desktop',
    continueGame: 'Continuar Jogo',
    newGame: 'Novo Jogo',
    statistics: 'Estatísticas',
    selectDifficulty: 'Selecionar Dificuldade',
    select: 'Selecionar',
    back: 'Voltar',
    gameOverTitle: 'Fim de Jogo 😢',
    gameOverMessage: (maxMistakes: number) => `Você cometeu ${maxMistakes} erros. Tente novamente!`,
    retry: 'Tentar novamente',
    mainMenu: 'Menu Principal',
    generalStats: 'Estatísticas Gerais',
    played: 'Partidas',
    victories: 'Vitórias',
    bestTimes: 'Melhores tempos',
    returnMenu: 'Voltar ao menu',
    resetStats: 'Redefinir estatísticas',
    restartStats: 'Redefinir estatísticas',
    difficultyLabels: {
      easy: 'Fácil',
      medium: 'Médio',
      hard: 'Difícil',
      expert: 'Especialista',
    },
    header: {
      backToMenu: 'Voltar ao menu',
      elapsedTime: 'Tempo decorrido',
      mistakes: 'Erros',
      restartGame: 'Reiniciar jogo',
      achievements: 'Conquistas',
      changeTheme: 'Mudar tema',
    },
    keypad: {
      undo: 'Desfazer',
      undoTitle: 'Desfazer jogada',
      erase: 'Apagar',
      eraseTitle: 'Apagar célula',
      notes: 'Notas',
      notesTitle: 'Modo notas',
      notesOn: 'Notas ON',
      notesOff: 'Notas OFF',
      hint: 'Dica',
      hintTitle: 'Pedir dica',
    },
    pwa: {
      offlineReady: 'O aplicativo está pronto para funcionar offline! 📶',
      updateAvailable: 'Conteúdo novo disponível, atualize para ver as mudanças. ✨',
      update: 'Atualizar',
      close: 'Fechar',
    },
    victory: {
      title: 'Vitória! 🎉',
      message: 'Você resolveu o Sudoku corretamente!',
      playAgain: 'Jogar novamente',
    },
  },
};

export type Translations = typeof translations['en'];

export const getTranslations = (locale: Locale): Translations => {
  return translations[locale] ?? translations.en;
};
