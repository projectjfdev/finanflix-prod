const TRADING_PRO_FIRST_ROLE = process.env.DISCORD_ROLE_TRADING_PRO || '';
const TRADING_PRO_SECOND_ROLE = process.env.DISCORD_ROLE_TRADING_PRO_SEGUNDO_ROL || '';
const TRADING_PRO_VENCIDO = process.env.DISCORD_ROLE_TRADING_PRO_VENCIDO || '';

const data = {
  userId: 123,
  tradingPro: {
    rolId: process.env.DISCORD_ROLE_TRADING_PRO, // segundo mes process.env.DISCORD_ROLE_TRADING_PRO_SEGUNDO_ROL | tercer mes process.env.DISCORD_ROLE_TRADING_PRO_VENCIDO
    status: 'por reclamar',
    orderDate: new Date('2023-03-05'),
    rolNumberDate: 3, // 1 = primer rol, 2 = segundo rol, 3 = tercer rol
  },
  DeFiAvanzado: {
    rolId: process.env.DISCORD_ROLE_DEFI_AVANZADO,
    status: 'por reclamar',
    name: 'DeFi Avanzado',
    orderDate: new Date('2025-10-10'),
  },
  analisisFundamental: {
    rolId: process.env.DISCORD_ROLE_ANALISIS_FUNDAMENTAL,
    status: 'por reclamar',
    name: 'Análisis fundamental | Curso avanzado',
    orderDate: new Date('2025-10-10'),
  },
  tradingAvanzado: {
    rolId: process.env.DISCORD_ROLE_TRADING_AVANZADO,
    status: 'por reclamar',
    name: 'Trading avanzado',
    orderDate: new Date('2025-10-10'),
  },
  analisisTecnico: {
    rolId: process.env.DISCORD_ROLE_ANALISIS_TECNICO,
    status: 'expired',
    name: 'Análisis Técnico de 0 a 100',
    orderDate: new Date('2025-10-10'),
  },
  nftsRevolution: {
    rolId: process.env.DISCORD_ROLE_NFTS_REVOLUTION,
    status: 'por reclamar',
    name: 'NFTs Revolution',
    orderDate: new Date('2025-10-10'),
  },
  solidity: {
    rolId: process.env.DISCORD_ROLE_SOLIDITY,
    status: 'por reclamar',
    name: 'Solidity',
    orderDate: new Date('2025-10-10'),
  },
  finanzasPersonales: {
    rolId: process.env.DISCORD_ROLE_FINANZAS_PERSONALES,
    status: 'por reclamar',
    name: 'Finanzas Personales',
    orderDate: new Date('2025-10-10'),
  },
  bolsaArgentina: {
    rol: {
      rolId: process.env.DISCORD_ROLE_BOLSA_ARGENTINA,
      status: 'expired',
      orderDate: new Date('2025-10-10'),
    },
    name: 'Bolsa argentina',
  },
  startZero: {
    rolId: process.env.DISCORD_ROLE_STARTZERO,
    status: 'expired',
    name: 'StartZero',
    orderDate: new Date('2025-10-10'),
  },
  hedgeValue: {
    rolId: process.env.DISCORD_ROLE_HEDGE_VALUE,
    status: 'por reclamar',
    name: 'Hedge Value',
    orderDate: new Date('2025-10-10'),
  },
  tradingProCurso: {
    rolId: process.env.DISCORD_ROLE_TRADING_PRO,
    status: 'por reclamar',
    name: 'Trading Pro',
    orderDate: new Date('2025-10-10'),
  },
  rolesPorReclamar: 2,
  sub: {
    type: 'Suscripcion basic - mensual',
    rol: {
      id: process.env.DISCORD_ROLE_BASIC_MENSUAL,
      status: 'reclamado',
      orderDate: new Date('2025-10-10'),
    },
    rolVencido: {
      id: process.env.DISCORD_ROLE_BASIC_MENSUAL_VENCIDO,
      status: 'no habilado para reclamar',
      orderDate: new Date('2025-10-10'),
    },
  },
  quantityOfExpiredCourses: 3,
  quantityOfClaimedCourses: 2,
};

[
  'DeFi Avanzado',
  'Análisis fundamental | Curso avanzado',
  'Trading avanzado',
  'Análisis Técnico de 0 a 100',
  'NFTs Revolution',
  'Solidity ',
  'Finanzas Personales',
  'Bolsa argentina',
  'StartZero ',
  'Hedge Value',
  'Trading Pro',
];

enum DiscordRoles {
  'notClaimable' = 'no habilado para reclamar',
  'claimed' = 'reclamado',
  'expired' = 'vencido',
  'pending' = 'pendiente para reclamar',
  'notClaimed' = 'no reclamado', // default
}

/*
1 - Los roles vencidos de los cursos que pertenecen a la subs basic pasan a activos luego de que se avtiva la suscripcion
2 - Logica de trading pro
3 - Suscripcion basica: Si tenes tres cursos completos tenes un rol y si no tenes el rol default.
Si vuelvo a activar la subs basica cuando yo ya habia reclamado el rol de los tres cursos completos se activa el rol de los tres cursos completos
*/

const mongoose = require('mongoose');

const statusEnum = ['notClaimable', 'claimed', 'expired', 'pending', 'notClaimed'];

const userSchema = new mongoose.Schema(
  {
    userId: {
      type: Number,
      required: true,
    },
    tradingPro: {
      rolId: {
        type: String,
        default: process.env.DISCORD_ROLE_TRADING_PRO,
      },
      status: {
        type: String,
        enum: statusEnum,
        default: 'por reclamar',
      },
      orderDate: {
        type: Date,
        required: true,
      },
      rolNumberDate: {
        type: Number,
        enum: [1, 2, 3],
        required: true,
      },
    },
    DeFiAvanzado: {
      rolId: {
        type: String,
        default: process.env.DISCORD_ROLE_DEFI_AVANZADO,
      },
      status: {
        type: String,
        enum: statusEnum,
        default: 'por reclamar',
      },
      name: {
        type: String,
        default: 'DeFi Avanzado',
      },
      orderDate: {
        type: Date,
        required: true,
      },
    },
    analisisFundamental: {
      rolId: {
        type: String,
        default: process.env.DISCORD_ROLE_ANALISIS_FUNDAMENTAL,
      },
      status: {
        type: String,
        enum: statusEnum,
        default: 'por reclamar',
      },
      name: {
        type: String,
        default: 'Análisis fundamental | Curso avanzado',
      },
      orderDate: {
        type: Date,
        required: true,
      },
    },
    tradingAvanzado: {
      rolId: {
        type: String,
        default: process.env.DISCORD_ROLE_TRADING_AVANZADO,
      },
      status: {
        type: String,
        enum: statusEnum,
        default: 'por reclamar',
      },
      name: {
        type: String,
        default: 'Trading avanzado',
      },
      orderDate: {
        type: Date,
        required: true,
      },
    },
    analisisTecnico: {
      rolId: {
        type: String,
        default: process.env.DISCORD_ROLE_ANALISIS_TECNICO,
      },
      status: {
        type: String,
        enum: statusEnum,
        default: 'expired',
      },
      name: {
        type: String,
        default: 'Análisis Técnico de 0 a 100',
      },
      orderDate: {
        type: Date,
        required: true,
      },
    },
    nftsRevolution: {
      rolId: {
        type: String,
        default: process.env.DISCORD_ROLE_NFTS_REVOLUTION,
      },
      status: {
        type: String,
        enum: statusEnum,
        default: 'por reclamar',
      },
      name: {
        type: String,
        default: 'NFTs Revolution',
      },
      orderDate: {
        type: Date,
        required: true,
      },
    },
    solidity: {
      rolId: {
        type: String,
        default: process.env.DISCORD_ROLE_SOLIDITY,
      },
      status: {
        type: String,
        enum: statusEnum,
        default: 'por reclamar',
      },
      name: {
        type: String,
        default: 'Solidity',
      },
      orderDate: {
        type: Date,
        required: true,
      },
    },
    finanzasPersonales: {
      rolId: {
        type: String,
        default: process.env.DISCORD_ROLE_FINANZAS_PERSONALES,
      },
      status: {
        type: String,
        enum: statusEnum,
        default: 'por reclamar',
      },
      name: {
        type: String,
        default: 'Finanzas Personales',
      },
      orderDate: {
        type: Date,
        required: true,
      },
    },
    bolsaArgentina: {
      rol: {
        rolId: {
          type: String,
          default: process.env.DISCORD_ROLE_BOLSA_ARGENTINA,
        },
        status: {
          type: String,
          enum: statusEnum,
          default: 'expired',
        },
        orderDate: {
          type: Date,
          required: true,
        },
      },
      name: {
        type: String,
        default: 'Bolsa argentina',
      },
    },
    startZero: {
      rolId: {
        type: String,
        default: process.env.DISCORD_ROLE_STARTZERO,
      },
      status: {
        type: String,
        enum: statusEnum,
        default: 'expired',
      },
      name: {
        type: String,
        default: 'StartZero',
      },
      orderDate: {
        type: Date,
        required: true,
      },
    },
    hedgeValue: {
      rolId: {
        type: String,
        default: process.env.DISCORD_ROLE_HEDGE_VALUE,
      },
      status: {
        type: String,
        enum: statusEnum,
        default: 'por reclamar',
      },
      name: {
        type: String,
        default: 'Hedge Value',
      },
      orderDate: {
        type: Date,
        required: true,
      },
    },
    tradingProCurso: {
      rolId: {
        type: String,
        default: process.env.DISCORD_ROLE_TRADING_PRO,
      },
      status: {
        type: String,
        enum: statusEnum,
        default: 'por reclamar',
      },
      name: {
        type: String,
        default: 'Trading Pro',
      },
      orderDate: {
        type: Date,
        required: true,
      },
    },
    rolesPorReclamar: {
      type: Number,
      default: 0,
    },
    sub: {
      type: {
        type: String,
        default: 'Suscripcion basic - mensual',
      },
      rol: {
        id: {
          type: String,
          default: process.env.DISCORD_ROLE_BASIC_MENSUAL,
        },
        status: {
          type: String,
          enum: statusEnum,
          default: 'reclamado',
        },
        orderDate: {
          type: Date,
          required: true,
        },
      },
      rolVencido: {
        id: {
          type: String,
          default: process.env.DISCORD_ROLE_BASIC_MENSUAL_VENCIDO,
        },
        status: {
          type: String,
          enum: statusEnum,
          default: 'no habilado para reclamar',
        },
        orderDate: {
          type: Date,
          required: true,
        },
      },
    },
    quantityOfExpiredCourses: {
      type: Number,
      default: 0,
    },
    quantityOfClaimedCourses: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('UserTraining', userSchema);
