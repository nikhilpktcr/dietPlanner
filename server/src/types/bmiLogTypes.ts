export interface TCreateBmiLogBody {
  weightCm: number;
  heightCm: number;
}

export interface TUpdateBmiLogBody {
  weightCm?: number;
  heightCm?: number;
  bmi?: number;
  category: string;
}

export interface TGetAllBmiLogsQueryParams {
  page?: number;
  limit?: number;
  searchCategory?: string;
}
