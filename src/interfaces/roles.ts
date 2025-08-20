import { Types } from 'mongoose';

export type StatusType = 'claimed' | 'notClaimed' | 'expired' | 'no habilado para reclamar';

export interface SimpleRol {
  rolId: string;
  status: StatusType;
  orderDate: Date;
}

export interface RolWithName extends SimpleRol {
  name: string;
}

export interface SubRol {
  id: string;
  status: StatusType;
  orderDate: Date;
}

export interface Sub {
  type: string;
  rol: SubRol;
  rolVencido: SubRol;
}

export interface BolsaArgentina {
  rol: SimpleRol;
  name: string;
}

export interface IRolDocument {
  _id?: Types.ObjectId;
  userId: Types.ObjectId;
  discordId: string;
  tradingPro: SimpleRol & { rolNumberDate: 1 | 2 | 3 };
  DeFiAvanzado: RolWithName;
  analisisFundamental: RolWithName;
  tradingAvanzado: RolWithName;
  analisisTecnico: RolWithName;
  nftsRevolution: RolWithName;
  solidity: RolWithName;
  finanzasPersonales: RolWithName;
  bolsaArgentina: BolsaArgentina;
  startZero: RolWithName;
  hedgeValue: RolWithName;
  tradingProCurso: RolWithName;

  sub: Sub;

  quantityOfExpiredCourses: number;
  quantityOfClaimedCourses: number;

  createdAt?: Date;
  updatedAt?: Date;
}
