import { EResponse, IResponseCommon } from '../interface.common';

export function ReturnCommon(payload: IResponseCommon): IResponseCommon {
  return {
    status: EResponse.SUCCESS,
    statusCode: payload.statusCode,
    data: payload.data,
    message: payload.message && typeof payload.message === 'string' ? [payload.message] : payload.message,
  };
}

export function toFixed(s: number, n: number = 2) {
  return Number(s.toFixed(n));
}

export function pagination(page: number, limit: number, totalDocs: number) {
  const totalPages = Math.ceil(totalDocs / limit);
  const nextPage = page < totalPages ? page + 1 : null;
  const previousPage = page > 1 ? page - 1 : null;
  return {
    previousPage,
    totalPages,
    nextPage,
    currentPage: page,
    totalDocs,
  };
}
