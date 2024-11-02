export interface ITracking {
  id?: string;
  name?: string;
  code: string;
  updatedAt: string;
  packageType: string;
  location: string;
  destination: string;
  status: string;
  delivered: boolean;
}
