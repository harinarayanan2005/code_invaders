/**
 * CODE INVADERS — Game Configuration & Word Pools
 */

const CONFIG = {
  // Wave ramp tuning
  WAVE_SCORE_STEP: 300,
  WAVE_SPEED_RAMP: 0.06,       // 6% faster per wave
  WAVE_SPAWN_DECAY: 0.07,      // 7% faster spawn per wave
  WAVE_SPAWN_MIN_MULT: 0.40,   // cap spawn speed-up at 40% of base

  // Special abilities
  EMP_MAX_CHARGE: 10,
  EMP_COMMAND: 'EMP',

  // Storage keys
  STORAGE_KEYS: {
    HIGH_SCORES: 'code_invaders_high_scores',
    MUTED: 'code_invaders_muted',
    CRT_OFF: 'code_invaders_crt_off'
  },

  // Token accent color palette
  TOKEN_COLORS: [
    'var(--syn-1)', // Mint (#7ee6c4)
    'var(--syn-2)', // Cyan (#6de8ff)
    'var(--syn-3)', // Violet (#c9a6ff)
    'var(--syn-4)', // Amber (#ffc857)
    'var(--syn-5)', // Pink (#ff8fb3)
    'var(--syn-6)'  // Blue (#8fb2ff)
  ],

  // Difficulty Mode Specifications
  MODES: {
    easy: {
      label: 'TRAINING',
      subtext: 'Basic syntax & language primitives. Gentle pace for warming up.',
      speed: [56, 82],       // px / sec
      spawn: [1450, 2050],   // ms
      words: [
        'CODE', 'JAVA', 'BYTE', 'LOOP', 'DATA', 'ARRAY', 'LOGIC', 'TOKEN', 'STACK', 'QUEUE',
        'CACHE', 'VALUE', 'INPUT', 'DEBUG', 'ERROR', 'CLASS', 'EVENT', 'LAYER', 'MEMORY', 'LOGIN',
        'PANEL', 'MODULE', 'OBJECT', 'STRING', 'INDEX', 'FIELD', 'LABEL', 'MODEL', 'QUERY', 'TABLE',
        'ROUTE', 'STYLE', 'THEME', 'ICON', 'MENU', 'LIST', 'TREE', 'GRAPH', 'NODE', 'EDGE',
        'HASH', 'HEAP', 'BOOL', 'CHAR', 'FLOAT', 'NULL', 'VOID', 'TRUE', 'FALSE', 'RETURN'
      ]
    },
    normal: {
      label: 'INVASION',
      subtext: 'Core architecture & tooling. Standard defense.',
      speed: [76, 112],
      spawn: [1000, 1500],
      words: [
        'PYTHON', 'DATABASE', 'FUNCTION', 'SERVER', 'NETWORK', 'VARIABLE', 'FRAMEWORK', 'COMPILER',
        'INTERFACE', 'PROTOCOL', 'PIPELINE', 'CONTAINER', 'ENDPOINT', 'GATEWAY', 'CLUSTER', 'RUNTIME',
        'SCHEMA', 'THREADPOOL', 'PROCESSOR', 'SUBSYSTEM', 'BACKEND', 'FRONTEND', 'JAVASCRIPT', 'REPOSITORY',
        'DIRECTORY', 'PERMISSION', 'VALIDATION', 'EXPRESSION', 'STATEMENT', 'CONDITION', 'ITERATION', 'RECURSION'
      ]
    },
    hard: {
      label: 'CORE BREACH',
      subtext: 'High-order concepts & distributed systems. Extreme pace.',
      speed: [98, 145],
      spawn: [720, 1120],
      words: [
        'ALGORITHM', 'DEPLOYMENT', 'AUTHENTICATION', 'ENCRYPTION', 'MICROSERVICE', 'VIRTUALIZATION', 'ORCHESTRATION', 'INFRASTRUCTURE',
        'CONCURRENCY', 'POLYMORPHISM', 'ABSTRACTION', 'INHERITANCE', 'SERIALIZATION', 'AUTHORIZATION', 'CONFIGURATION', 'REPLICATION',
        'PERSISTENCE', 'OBFUSCATION', 'SYNCHRONIZATION', 'IDEMPOTENCY', 'DESERIALIZATION', 'TOKENIZATION', 'NORMALIZATION'
      ]
    }
  }
};

