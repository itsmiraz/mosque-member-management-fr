export type TPayment = {
  year: number;
  month: number;     
  paidAt: Date;
};

export type TMember = {
  _id: string;
  name: string;
  name_in_bengali: string;
  memberId: string;
  phone?: string;
  fee:number,
  address?: string;
  joinedDate?: Date;
  status: 'active' | 'inactive';
  payments: TPayment[];
  meatTaken: {
    [year: string]: boolean;
  };
};
