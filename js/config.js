/**
 * CODE INVADERS — Game Configuration & Word Pools
 */

const CONFIG = {
  // Wave ramp tuning
  WAVE_SCORE_STEP: 300,
  WAVE_SPEED_RAMP: 0.04,       // 4% faster per wave
  WAVE_SPAWN_DECAY: 0.05,      // 5% faster spawn per wave
  WAVE_SPAWN_MIN_MULT: 0.45,   // cap spawn speed-up at 45% of base

  // Special abilities
  EMP_MAX_CHARGE: 10,
  EMP_COMMAND: 'EMP',

  // Power-Up Tokens
  POWERUPS: {
    FREEZE: { command: 'FREEZE', label: 'TIME FREEZE', duration: 5000, color: '#6de8ff' },
    REPAIR: { command: 'REPAIR', label: 'CORE REPAIR', color: '#35ffa0' },
    BOMB:   { command: 'BOMB',   label: 'FULL SCREEN BOMB', color: '#ffc857' }
  },

  // Storage keys
  STORAGE_KEYS: {
    HIGH_SCORES: 'code_invaders_high_scores',
    MUTED: 'code_invaders_muted',
    MUSIC_MUTED: 'code_invaders_music_muted',
    MUSIC_VOLUME: 'code_invaders_music_volume',
    CRT_OFF: 'code_invaders_crt_off',
    THEME: 'code_invaders_theme',
    PLAYER_PROFILES: 'code_invaders_player_profiles',
    ACTIVE_PLAYER: 'code_invaders_active_player',
    WORD_PACK: 'code_invaders_word_pack',
    CUSTOM_PACKS: 'code_invaders_custom_packs',
    ACHIEVEMENTS: 'code_invaders_achievements'
  },

  // Language Word Packs (with tiered difficulties + combined master pools)
  WORD_PACKS: {
    jsts: {
      name: 'JS / TS',
      label: 'JAVASCRIPT / TYPESCRIPT',
      easy: [
        'VAR', 'LET', 'CONST', 'IF', 'ELSE', 'FOR', 'MAP', 'SET', 'POP', 'PUSH',
        'THIS', 'NULL', 'TRUE', 'TYPE', 'ENUM', 'VOID', 'BIND', 'CALL', 'EVAL', 'JSON',
        'NODE', 'NPM', 'YARN', 'PNPM', 'TSX', 'DOM', 'FETCH', 'BLOB', 'FILE', 'KEY'
      ],
      normal: [
        'FUNCTION', 'PROMISE', 'ASYNC', 'AWAIT', 'CALLBACK', 'IMPORT', 'EXPORT', 'CLASS',
        'INTERFACE', 'MODULE', 'PACKAGE', 'FILTER', 'REDUCE', 'SUPER', 'EXTENDS', 'SYMBOL',
        'BIGINT', 'CLOSURE', 'SPREAD', 'OBJECT', 'ARRAY', 'STRING', 'NUMBER', 'BOOLEAN',
        'UNKNOWN', 'NEVER', 'READONLY', 'GENERIC', 'FACTORY', 'HANDLER', 'LISTENER', 'DISPATCH'
      ],
      hard: [
        'DESTRUCTURING', 'EVENT_LOOP', 'MICROTASK', 'PROTOTYPE', 'POLYFILL', 'TRANSPILER',
        'IMMUTABLE', 'INTERSECTION', 'DISCRIMINATED', 'TYPE_GUARD', 'DECORATORS', 'MEMOIZATION',
        'CONCURRENCY', 'EVENT_EMITTER', 'PROMISE_ALL', 'DYNAMIC_IMPORT', 'ASYNCHRONOUS', 'INTERPOLATION'
      ],
      words: [
        'VAR', 'LET', 'CONST', 'IF', 'ELSE', 'FOR', 'MAP', 'SET', 'POP', 'PUSH',
        'THIS', 'NULL', 'TRUE', 'TYPE', 'ENUM', 'VOID', 'BIND', 'CALL', 'EVAL', 'JSON',
        'NODE', 'NPM', 'YARN', 'PNPM', 'TSX', 'DOM', 'FETCH', 'BLOB', 'FILE', 'KEY',
        'FUNCTION', 'PROMISE', 'ASYNC', 'AWAIT', 'CALLBACK', 'IMPORT', 'EXPORT', 'CLASS',
        'INTERFACE', 'MODULE', 'PACKAGE', 'FILTER', 'REDUCE', 'SUPER', 'EXTENDS', 'SYMBOL',
        'BIGINT', 'CLOSURE', 'SPREAD', 'OBJECT', 'ARRAY', 'STRING', 'NUMBER', 'BOOLEAN',
        'UNKNOWN', 'NEVER', 'READONLY', 'GENERIC', 'FACTORY', 'HANDLER', 'LISTENER', 'DISPATCH',
        'DESTRUCTURING', 'EVENT_LOOP', 'MICROTASK', 'PROTOTYPE', 'POLYFILL', 'TRANSPILER',
        'IMMUTABLE', 'INTERSECTION', 'DISCRIMINATED', 'TYPE_GUARD', 'DECORATORS', 'MEMOIZATION',
        'CONCURRENCY', 'EVENT_EMITTER', 'PROMISE_ALL', 'DYNAMIC_IMPORT', 'ASYNCHRONOUS', 'INTERPOLATION'
      ]
    },
    python: {
      name: 'PYTHON',
      label: 'PYTHON SYNTAX',
      easy: [
        'DEF', 'FOR', 'IF', 'ELIF', 'ELSE', 'TRY', 'PASS', 'WITH', 'AS', 'IN',
        'IS', 'NOT', 'AND', 'OR', 'SELF', 'INIT', 'ZIP', 'DICT', 'LIST', 'SET',
        'INT', 'STR', 'BOOL', 'NONE', 'TRUE', 'PIP', 'VENV', 'PYC', 'ARGS', 'MATH'
      ],
      normal: [
        'IMPORT', 'LAMBDA', 'YIELD', 'RETURN', 'EXCEPT', 'FINALLY', 'GLOBAL', 'ASSERT',
        'TUPLE', 'DUNDER', 'ASYNCIO', 'PANDAS', 'NUMPY', 'DJANGO', 'FLASK', 'FASTAPI',
        'PYTEST', 'DOCSTRING', 'SLICING', 'ITERATOR', 'BUILTIN', 'PACKAGE', 'MODULE',
        'DATACLASS', 'SCRAPY', 'TORCH', 'PYTORCH', 'SELENIUM', 'REQUESTS', 'JUPYTER'
      ],
      hard: [
        'DECORATOR', 'LIST_COMP', 'DICT_COMP', 'GENERATOR', 'ENUMERATE', 'COROUTINE',
        'CONTEXT_MGR', 'METACLASS', 'INHERITANCE', 'POLYMORPHISM', 'SERIALIZATION', 'PICKLE_LOAD',
        'CONCURRENCY', 'MULTIPROCESS', 'EVENT_LOOP', 'TYPE_HINTING', 'ABSTRACT_BASE', 'MAGIC_METHOD'
      ],
      words: [
        'DEF', 'FOR', 'IF', 'ELIF', 'ELSE', 'TRY', 'PASS', 'WITH', 'AS', 'IN',
        'IS', 'NOT', 'AND', 'OR', 'SELF', 'INIT', 'ZIP', 'DICT', 'LIST', 'SET',
        'INT', 'STR', 'BOOL', 'NONE', 'TRUE', 'PIP', 'VENV', 'PYC', 'ARGS', 'MATH',
        'IMPORT', 'LAMBDA', 'YIELD', 'RETURN', 'EXCEPT', 'FINALLY', 'GLOBAL', 'ASSERT',
        'TUPLE', 'DUNDER', 'ASYNCIO', 'PANDAS', 'NUMPY', 'DJANGO', 'FLASK', 'FASTAPI',
        'PYTEST', 'DOCSTRING', 'SLICING', 'ITERATOR', 'BUILTIN', 'PACKAGE', 'MODULE',
        'DATACLASS', 'SCRAPY', 'TORCH', 'PYTORCH', 'SELENIUM', 'REQUESTS', 'JUPYTER',
        'DECORATOR', 'LIST_COMP', 'DICT_COMP', 'GENERATOR', 'ENUMERATE', 'COROUTINE',
        'CONTEXT_MGR', 'METACLASS', 'INHERITANCE', 'POLYMORPHISM', 'SERIALIZATION', 'PICKLE_LOAD',
        'CONCURRENCY', 'MULTIPROCESS', 'EVENT_LOOP', 'TYPE_HINTING', 'ABSTRACT_BASE', 'MAGIC_METHOD'
      ]
    },
    react: {
      name: 'REACT',
      label: 'REACT & JSX',
      easy: [
        'JSX', 'DOM', 'PROP', 'REF', 'KEY', 'NODE', 'HOOK', 'VIEW', 'TAG', 'APP',
        'ROOT', 'MEMO', 'LAZY', 'DIV', 'SPAN', 'SLOT', 'STATE', 'SHOW', 'HIDE', 'FORM'
      ],
      normal: [
        'PROPS', 'FRAGMENT', 'PROVIDER', 'PORTAL', 'REDUCER', 'COMPONENT', 'HOOKS',
        'ROUTER', 'DISPATCH', 'ACTION', 'STORE', 'RENDER', 'CONTEXT', 'CHILDREN',
        'ELEMENT', 'EFFECT', 'MEMOIZE', 'FALLBACK', 'SUSPENSE', 'PAYLOAD', 'MUTATION', 'VIRTUAL'
      ],
      hard: [
        'USE_STATE', 'USE_EFFECT', 'USE_CONTEXT', 'USE_REF', 'USE_MEMO', 'USE_CALLBACK',
        'USE_REDUCER', 'USE_LAYOUT', 'USE_TRANSITION', 'USE_ID', 'USE_DEFERRED', 'STRICT_MODE',
        'HYDRATION', 'SERVER_SIDE', 'RECONCILIATION', 'ERROR_BOUNDARY', 'PURE_COMPONENT', 'FORWARD_REF'
      ],
      words: [
        'JSX', 'DOM', 'PROP', 'REF', 'KEY', 'NODE', 'HOOK', 'VIEW', 'TAG', 'APP',
        'ROOT', 'MEMO', 'LAZY', 'DIV', 'SPAN', 'SLOT', 'STATE', 'SHOW', 'HIDE', 'FORM',
        'PROPS', 'FRAGMENT', 'PROVIDER', 'PORTAL', 'REDUCER', 'COMPONENT', 'HOOKS',
        'ROUTER', 'DISPATCH', 'ACTION', 'STORE', 'RENDER', 'CONTEXT', 'CHILDREN',
        'ELEMENT', 'EFFECT', 'MEMOIZE', 'FALLBACK', 'SUSPENSE', 'PAYLOAD', 'MUTATION', 'VIRTUAL',
        'USE_STATE', 'USE_EFFECT', 'USE_CONTEXT', 'USE_REF', 'USE_MEMO', 'USE_CALLBACK',
        'USE_REDUCER', 'USE_LAYOUT', 'USE_TRANSITION', 'USE_ID', 'USE_DEFERRED', 'STRICT_MODE',
        'HYDRATION', 'SERVER_SIDE', 'RECONCILIATION', 'ERROR_BOUNDARY', 'PURE_COMPONENT', 'FORWARD_REF'
      ]
    },
    rust: {
      name: 'RUST',
      label: 'RUST SYSTEMS',
      easy: [
        'MUT', 'LET', 'FN', 'PUB', 'MOD', 'USE', 'FOR', 'IF', 'IN', 'AS',
        'LOOP', 'VEC', 'BOX', 'RC', 'ARC', 'REF', 'STR', 'U32', 'I32', 'F64',
        'BOOL', 'CHAR', 'CRATE', 'CARGO', 'ENUM', 'TRAIT', 'IMPL'
      ],
      normal: [
        'STRUCT', 'MATCH', 'OPTION', 'RESULT', 'UNWRAP', 'BORROW', 'MACRO', 'VECTOR',
        'PANIC', 'TOKIO', 'MUTEX', 'CLOSURE', 'SHADOW', 'STATIC', 'EXTERN', 'UNSAFE',
        'PATTERN', 'STRING', 'ITERATOR', 'CHANNEL', 'SENDER', 'RECEIVER', 'FUTURES', 'ACTIX'
      ],
      hard: [
        'LIFETIME', 'OWNERSHIP', 'REF_CELL', 'PRIMITIVE', 'DEREFERENCE', 'SMART_POINTER',
        'BORROW_CHECK', 'CONCURRENCY', 'MULTITHREAD', 'ASYNCHRONOUS', 'SERIALIZE', 'DESERIALIZE',
        'ZERO_COST', 'PATTERN_MATCH', 'ASSOCIATED', 'TURBOFISH', 'RAII_GUARD', 'TYPE_INFERENCE'
      ],
      words: [
        'MUT', 'LET', 'FN', 'PUB', 'MOD', 'USE', 'FOR', 'IF', 'IN', 'AS',
        'LOOP', 'VEC', 'BOX', 'RC', 'ARC', 'REF', 'STR', 'U32', 'I32', 'F64',
        'BOOL', 'CHAR', 'CRATE', 'CARGO', 'ENUM', 'TRAIT', 'IMPL',
        'STRUCT', 'MATCH', 'OPTION', 'RESULT', 'UNWRAP', 'BORROW', 'MACRO', 'VECTOR',
        'PANIC', 'TOKIO', 'MUTEX', 'CLOSURE', 'SHADOW', 'STATIC', 'EXTERN', 'UNSAFE',
        'PATTERN', 'STRING', 'ITERATOR', 'CHANNEL', 'SENDER', 'RECEIVER', 'FUTURES', 'ACTIX',
        'LIFETIME', 'OWNERSHIP', 'REF_CELL', 'PRIMITIVE', 'DEREFERENCE', 'SMART_POINTER',
        'BORROW_CHECK', 'CONCURRENCY', 'MULTITHREAD', 'ASYNCHRONOUS', 'SERIALIZE', 'DESERIALIZE',
        'ZERO_COST', 'PATTERN_MATCH', 'ASSOCIATED', 'TURBOFISH', 'RAII_GUARD', 'TYPE_INFERENCE'
      ]
    },
    sql: {
      name: 'SQL',
      label: 'SQL DATABASE',
      easy: [
        'SELECT', 'FROM', 'WHERE', 'JOIN', 'INTO', 'DROP', 'VIEW', 'LIKE', 'AND',
        'OR', 'NOT', 'IN', 'IS', 'NULL', 'AS', 'ON', 'SET', 'KEY', 'ROW', 'COL',
        'SUM', 'AVG', 'MAX', 'MIN', 'COUNT', 'UNION', 'LIMIT'
      ],
      normal: [
        'INSERT', 'UPDATE', 'DELETE', 'HAVING', 'INDEX', 'CASCADE', 'COMMIT', 'SCHEMA',
        'QUERY', 'FILTER', 'OFFSET', 'VALUES', 'TABLE', 'RECORD', 'COLUMN', 'FOREIGN',
        'PRIMARY', 'UNIQUE', 'CURSOR', 'STORED', 'TRIGGER', 'LOCKING', 'BACKUP', 'EXPLAIN'
      ],
      hard: [
        'TRANSACTION', 'PRIMARY_KEY', 'FOREIGN_KEY', 'GROUP_BY', 'ORDER_BY', 'INNER_JOIN',
        'OUTER_JOIN', 'CROSS_JOIN', 'ROLLBACK', 'AUTO_COMMIT', 'DENORMALIZE', 'NORMALIZATION',
        'SHARDING', 'REPLICATION', 'ACID_COMPLIANT', 'STORED_PROC', 'CONSTRAINTS', 'SUBQUERIES'
      ],
      words: [
        'SELECT', 'FROM', 'WHERE', 'JOIN', 'INTO', 'DROP', 'VIEW', 'LIKE', 'AND',
        'OR', 'NOT', 'IN', 'IS', 'NULL', 'AS', 'ON', 'SET', 'KEY', 'ROW', 'COL',
        'SUM', 'AVG', 'MAX', 'MIN', 'COUNT', 'UNION', 'LIMIT',
        'INSERT', 'UPDATE', 'DELETE', 'HAVING', 'INDEX', 'CASCADE', 'COMMIT', 'SCHEMA',
        'QUERY', 'FILTER', 'OFFSET', 'VALUES', 'TABLE', 'RECORD', 'COLUMN', 'FOREIGN',
        'PRIMARY', 'UNIQUE', 'CURSOR', 'STORED', 'TRIGGER', 'LOCKING', 'BACKUP', 'EXPLAIN',
        'TRANSACTION', 'PRIMARY_KEY', 'FOREIGN_KEY', 'GROUP_BY', 'ORDER_BY', 'INNER_JOIN',
        'OUTER_JOIN', 'CROSS_JOIN', 'ROLLBACK', 'AUTO_COMMIT', 'DENORMALIZE', 'NORMALIZATION',
        'SHARDING', 'REPLICATION', 'ACID_COMPLIANT', 'STORED_PROC', 'CONSTRAINTS', 'SUBQUERIES'
      ]
    },
    css: {
      name: 'CSS / WEB',
      label: 'CSS & STYLING',
      easy: [
        'VAR', 'CALC', 'GRID', 'FLEX', 'WRAP', 'TOP', 'LEFT', 'AUTO', 'NONE', 'FONT',
        'TEXT', 'HIDE', 'SHOW', 'LINE', 'SPAN', 'ICON', 'FILL', 'CLIP', 'EM', 'REM',
        'VH', 'VW', 'PX', 'RGB', 'RGBA', 'HEX', 'HSL'
      ],
      normal: [
        'FLEXBOX', 'MEDIA', 'Z_INDEX', 'VIEWPORT', 'DISPLAY', 'POSITION', 'OVERFLOW',
        'OPACITY', 'MARGIN', 'PADDING', 'BORDER', 'RADIUS', 'SHADOW', 'FILTER', 'CURSOR',
        'ALIGN', 'JUSTIFY', 'COLUMNS', 'INHERIT', 'INITIAL', 'STATIC', 'STICKY', 'ABSOLUTE', 'RELATIVE'
      ],
      hard: [
        'TRANSITION', 'ANIMATION', 'KEYFRAMES', 'BOX_SIZING', 'CONTAINER', 'BACKDROP_FILTER',
        'FONT_FAMILY', 'PSEUDO_CLASS', 'PSEUDO_ELEMENT', 'MEDIA_QUERY', 'WILL_CHANGE', 'ASPECT_RATIO',
        'PERSPECTIVE', 'TRANSFORMATION', 'FLEX_DIRECTION', 'CSS_VARIABLES', 'CONTAINMENT', 'MASK_IMAGE'
      ],
      words: [
        'VAR', 'CALC', 'GRID', 'FLEX', 'WRAP', 'TOP', 'LEFT', 'AUTO', 'NONE', 'FONT',
        'TEXT', 'HIDE', 'SHOW', 'LINE', 'SPAN', 'ICON', 'FILL', 'CLIP', 'EM', 'REM',
        'VH', 'VW', 'PX', 'RGB', 'RGBA', 'HEX', 'HSL',
        'FLEXBOX', 'MEDIA', 'Z_INDEX', 'VIEWPORT', 'DISPLAY', 'POSITION', 'OVERFLOW',
        'OPACITY', 'MARGIN', 'PADDING', 'BORDER', 'RADIUS', 'SHADOW', 'FILTER', 'CURSOR',
        'ALIGN', 'JUSTIFY', 'COLUMNS', 'INHERIT', 'INITIAL', 'STATIC', 'STICKY', 'ABSOLUTE', 'RELATIVE',
        'TRANSITION', 'ANIMATION', 'KEYFRAMES', 'BOX_SIZING', 'CONTAINER', 'BACKDROP_FILTER',
        'FONT_FAMILY', 'PSEUDO_CLASS', 'PSEUDO_ELEMENT', 'MEDIA_QUERY', 'WILL_CHANGE', 'ASPECT_RATIO',
        'PERSPECTIVE', 'TRANSFORMATION', 'FLEX_DIRECTION', 'CSS_VARIABLES', 'CONTAINMENT', 'MASK_IMAGE'
      ]
    }
  },

  // Achievement Trophies
  ACHIEVEMENTS: {
    SPEED_DEMON: {
      id: 'SPEED_DEMON',
      title: 'SPEED DEMON',
      desc: 'Achieve 60+ WPM typing speed during a mission.',
      icon: '🏆'
    },
    PRECISION_MASTER: {
      id: 'PRECISION_MASTER',
      title: 'PRECISION MASTER',
      desc: 'Complete a mission with 100% accuracy (min. 15 purges).',
      icon: '🎯'
    },
    NUKE_SPECIALIST: {
      id: 'NUKE_SPECIALIST',
      title: 'NUKE SPECIALIST',
      desc: 'Trigger the EMP Blast 3 or more times in a single run.',
      icon: '💣'
    },
    UNTOUCHABLE: {
      id: 'UNTOUCHABLE',
      title: 'UNTOUCHABLE CORE',
      desc: 'Survive to Wave 5 with zero Core damage taken.',
      icon: '🛡️'
    },
    COMBO_KING: {
      id: 'COMBO_KING',
      title: 'COMBO KING',
      desc: 'Build an unbroken 15x Combo streak.',
      icon: '⚡'
    },
    BOSS_SLAYER: {
      id: 'BOSS_SLAYER',
      title: 'TITAN SLAYER',
      desc: 'Defeat a massive Boss entity during wave defense.',
      icon: '👾'
    },
    SURVIVOR: {
      id: 'SURVIVOR',
      title: 'CHRONO SURVIVOR',
      desc: 'Survive over 90 seconds in Time Attack Survival Mode.',
      icon: '⏱️'
    },
    CUSTOM_HACKER: {
      id: 'CUSTOM_HACKER',
      title: 'CUSTOM ARCHITECT',
      desc: 'Compile and deploy your own Custom Code Pack.',
      icon: '🛠️'
    }
  },

  // Boss Encounters (spawned on wave milestones)
  BOSSES: [
    {
      id: 'MONOLITH',
      name: 'LEGACY MONOLITH',
      subtitle: 'TITAN CODE ARCHITECTURE',
      icon: '👾',
      wave: 5,
      phases: [
        { name: 'DEPRECATED_DEPENDENCIES', text: 'SPAGHETTI_CODE' },
        { name: 'CIRCULAR_DEPENDENCY', text: 'TIGHT_COUPLING' },
        { name: 'GLOBAL_STATE_LEAK', text: 'UNMAINTAINABLE' },
        { name: 'MONOLITHIC_CORE', text: 'DECOMMISSION_CORE' }
      ],
      color: '#ff4d6d'
    },
    {
      id: 'MERGE_CONFLICT',
      name: 'MERGE CONFLICT',
      subtitle: 'BRANCH DESYNCHRONIZATION',
      icon: '⚔️',
      wave: 10,
      phases: [
        { name: 'HEAD_DETACHED', text: 'CONFLICTING_COMMITS' },
        { name: 'FORCE_PUSH_HAZARD', text: 'REBASE_ABORT' },
        { name: 'RESOLVE_ALL_HUNKS', text: 'ACCEPT_THEIRS' },
        { name: 'FAST_FORWARD_LOCK', text: 'SQUASH_AND_MERGE' }
      ],
      color: '#ffc857'
    },
    {
      id: 'MEMORY_LEAK',
      name: 'MEMORY LEAK',
      subtitle: 'HEAP EXHAUSTION ANOMALY',
      icon: '💀',
      wave: 15,
      phases: [
        { name: 'ORPHANED_LISTENER', text: 'DANGLING_POINTER' },
        { name: 'UNBOUND_CLOSURE', text: 'HEAP_OVERFLOW' },
        { name: 'BUFFER_CORRUPTION', text: 'GARBAGE_COLLECTOR' },
        { name: 'OUT_OF_MEMORY', text: 'SEGMENTATION_FAULT' }
      ],
      color: '#6de8ff'
    }
  ],

  // Cyberpunk Operator Avatars
  AVATARS: ['👤', '🤖', '⚡', '🛡️', '👾', '💀', '🔮', '⚔️', '🛸', '💎'],

  // Relatable Preset Operator Handles
  PRESET_HANDLES: [
    'CYBER_PHANTOM',
    'BYTE_NINJA',
    'NEON_DEFENDER',
    'NULL_POINTER',
    'SYNTAX_DEVIL',
    'CORE_STRIKER',
    'BINARY_GHOST',
    'MATRIX_OPERATOR',
    'STACK_OVERFLOW',
    'QUANTUM_HACKER',
    'ZERO_DAY',
    'GLITCH_HUNTER',
    'KERNEL_PANIC',
    'CODE_WARRIOR',
    'BIT_COMMANDER'
  ],

  // Visual Theme Presets
  THEMES: {
    cyberpunk: {
      name: 'CYBERPUNK',
      label: 'NEON CYBERPUNK',
      rainColor: '#6de8ff'
    },
    matrix: {
      name: 'MATRIX',
      label: 'MATRIX GREEN',
      rainColor: '#00ff66'
    },
    amber: {
      name: 'AMBER',
      label: 'RETRO AMBER',
      rainColor: '#ffb000'
    },
    blood: {
      name: 'BLOOD',
      label: 'BLOOD HACK',
      rainColor: '#ff2a4b'
    }
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

  // Difficulty Mode Specifications & Restructured Word Pools
  MODES: {
    easy: {
      label: 'TRAINING',
      subtext: 'Basic syntax & 3-5 letter primitives. Gentle pace for warming up.',
      speed: [42, 65],       // px / sec
      spawn: [1600, 2200],   // ms
      maxActiveWords: 3,
      words: [
        'VAR', 'LET', 'CONST', 'IF', 'ELSE', 'FOR', 'WHILE', 'TRY', 'CATCH', 'THROW',
        'INT', 'CHAR', 'BOOL', 'FLOAT', 'LONG', 'SHORT', 'BYTE', 'MATH', 'FUNC', 'MAP',
        'SET', 'POP', 'PUSH', 'SHIFT', 'SLICE', 'JOIN', 'LOG', 'ENUM', 'VOID', 'NULL',
        'TRUE', 'FALSE', 'LOOP', 'NODE', 'TREE', 'DATA', 'CODE', 'VIEW', 'FILE', 'PATH',
        'PORT', 'HOST', 'PING', 'POST', 'GET', 'PUT', 'LINK', 'KEY', 'PAIR', 'ITEM',
        'HEAD', 'TAIL', 'INIT', 'MAIN', 'SPAN', 'TEXT', 'DOM', 'CSS', 'HTML', 'JSON'
      ]
    },
    normal: {
      label: 'INVASION',
      subtext: 'Core architecture & tooling. Standard defense.',
      speed: [55, 82],
      spawn: [1200, 1700],
      maxActiveWords: 4,
      words: [
        'DATABASE', 'FUNCTION', 'CALLBACK', 'PROMISE', 'ASYNC', 'AWAIT', 'SERVER', 'CLIENT',
        'NETWORK', 'ROUTER', 'PAYLOAD', 'ENDPOINT', 'GATEWAY', 'CLUSTER', 'RUNTIME', 'SCHEMA',
        'CONTAINER', 'DOCKER', 'BRANCH', 'COMMIT', 'MERGE', 'REBASE', 'COMPILER', 'PIPELINE',
        'EXPRESS', 'PYTHON', 'JAVASCRIPT', 'TYPESCRIPT', 'REPOSITORY', 'DIRECTORY', 'VALIDATION',
        'ITERATION', 'RECURSION', 'ARGUMENT', 'VARIABLE', 'TERMINAL', 'INTERFACE', 'PROTOCOL',
        'PROCESSOR', 'SUBSYSTEM', 'BACKEND', 'FRONTEND', 'MIDDLEWARE', 'CONTROLLER', 'RESPONSE'
      ]
    },
    hard: {
      label: 'CORE BREACH',
      subtext: 'High-order concepts & distributed systems. Extreme pace.',
      speed: [68, 102],
      spawn: [900, 1350],
      maxActiveWords: 5,
      words: [
        'MICROSERVICES', 'AUTHENTICATION', 'AUTHORIZATION', 'ORCHESTRATION', 'VIRTUALIZATION', 'INFRASTRUCTURE',
        'MULTITHREADING', 'POLYMORPHISM', 'SERIALIZATION', 'DESERIALIZATION', 'IDEMPOTENCY', 'SYNCHRONIZATION',
        'CRYPTOGRAPHY', 'KUBERNETES', 'LOAD_BALANCER', 'EVENT_DRIVEN', 'FAULT_TOLERANT', 'ASYNCHRONOUS',
        'OBSERVABILITY', 'IMMUTABILITY', 'TOKENIZATION', 'OBFUSCATION', 'CONCURRENCY', 'PERSISTENCE',
        'NORMALIZATION', 'REPLICATION', 'CONTAINERIZATION', 'DECISION_TREE', 'REINFORCEMENT'
      ]
    },
    survival: {
      label: 'TIME ATTACK',
      subtext: 'Adrenaline rush. 60s countdown — destroy words for +2s, mistakes cost -1s.',
      speed: [58, 88],
      spawn: [1100, 1600],
      maxActiveWords: 4,
      initialTime: 60,
      killBonusTime: 2.0,
      missPenaltyTime: 1.0,
      comboBonusTime: 0.5,
      words: [
        'FAST', 'RUSH', 'SURVIVE', 'SPEED', 'CLOCK', 'TIMEOUT', 'KILL', 'RAPID', 'SPRINT',
        'OVERCLOCK', 'BOOST', 'ACCELERATE', 'TIMER', 'COUNTDOWN', 'URGENT', 'CRITICAL',
        'BURST', 'STREAM', 'VECTOR', 'PACKET', 'SOCKET', 'THREAD', 'PIPELINE', 'TRIGGER',
        'DYNAMIC', 'FLASH', 'LIGHTNING', 'HYPERDRIVE', 'OVERRIDE', 'BANDWIDTH', 'FREQUENCY'
      ]
    },
    zen: {
      label: 'ZEN PRACTICE',
      subtext: 'Endless practice mode. Infinite core integrity, zero pressure.',
      speed: [48, 70],
      spawn: [1400, 2000],
      maxActiveWords: 4,
      words: [
        'VAR', 'LET', 'CONST', 'IF', 'FOR', 'TRY', 'CATCH', 'MATH', 'FUNC', 'MAP', 'SET', 'POP',
        'PUSH', 'LOG', 'NULL', 'TRUE', 'FALSE', 'DATA', 'CODE', 'NODE', 'TREE', 'DATABASE',
        'FUNCTION', 'PROMISE', 'ASYNC', 'SERVER', 'CLIENT', 'NETWORK', 'CONTAINER', 'DOCKER',
        'GIT', 'COMMIT', 'PYTHON', 'JAVASCRIPT', 'TYPESCRIPT', 'MICROSERVICES', 'AUTHENTICATION',
        'ENCRYPTION', 'ORCHESTRATION', 'KUBERNETES', 'POLYMORPHISM', 'SYNCHRONIZATION'
      ]
    }
  }
};
