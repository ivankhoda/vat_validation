export type ResponseData = {
  countryCode: string;
  vatNumber: number;
  requestDate: number | null;
  valid: boolean;
  name: string | null;
  address: string | null;
};

export type ValidationData = {
  countryCode: string;
  vatNumber: number;
};
