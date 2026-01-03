import { ApiError } from '../services/api';
import { HTTP_STATUS, ERROR_MESSAGES } from '../config/api';

export class ErrorHandler {
  static handleApiError(error: any): string {
    if (error instanceof ApiError) {
      switch (error.status) {
        case HTTP_STATUS.UNAUTHORIZED:
          return ERROR_MESSAGES.UNAUTHORIZED;
        case HTTP_STATUS.FORBIDDEN:
          return ERROR_MESSAGES.FORBIDDEN;
        case HTTP_STATUS.NOT_FOUND:
          return ERROR_MESSAGES.NOT_FOUND;
        case HTTP_STATUS.UNPROCESSABLE_ENTITY:
          return ERROR_MESSAGES.VALIDATION_ERROR;
        case HTTP_STATUS.INTERNAL_SERVER_ERROR:
          return ERROR_MESSAGES.SERVER_ERROR;
        case HTTP_STATUS.SERVICE_UNAVAILABLE:
          return ERROR_MESSAGES.SERVER_ERROR;
        default:
          return error.message || ERROR_MESSAGES.SERVER_ERROR;
      }
    }

    if (error.name === 'NetworkError' || error.message.includes('fetch')) {
      return ERROR_MESSAGES.NETWORK_ERROR;
    }

    if (error.name === 'TimeoutError') {
      return ERROR_MESSAGES.TIMEOUT;
    }

    return error.message || 'An unexpected error occurred';
  }

  static logError(error: any, context?: string) {
    console.error(`Error${context ? ` in ${context}` : ''}:`, {
      message: error.message,
      stack: error.stack,
      ...(error instanceof ApiError && {
        status: error.status,
        code: error.code,
      }),
    });
  }
}

export const handleError = ErrorHandler.handleApiError;
export const logError = ErrorHandler.logError;