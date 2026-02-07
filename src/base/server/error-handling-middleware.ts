import { createMiddleware } from '@tanstack/react-start';
import { OuterError } from '../utils/outer-error';
import { UserReportableError } from '../utils/user-reportable-error';

/**
 * Global middleware for error handling. It supports OuterError and detects
 * UserReportableError, in which case it reports it with 422 HTTP error code
 * and payload with schema userReportableErrorsSchema
 */
export const errorHandlingMiddleware = createMiddleware().server(async ({ request, next }) => {
  try {
    const result = await next();
    return result;
  } catch (error) {
    console.error(`[${request.url}]:`, error);

    // Collect user reportable errors. Notice that there can be non-reportable errors
    // yet they would be ignored at this moment
    const userReportableErrors: Array<{ errorCode: string; message: string }> = [];
    let currentError = error;
    while (true) {
      if (currentError instanceof UserReportableError) {
        userReportableErrors.push({
          errorCode: currentError.errorCode,
          message: currentError.message,
        });
      }

      if (currentError instanceof OuterError) {
        currentError = currentError.innerError;
        continue;
      }

      break;
    }

    // If there are any user reportable errors then retuen a response to the client
    if (userReportableErrors.length > 0) {
      return Response.json(
        {
          userReportableErrors,
        },
        {
          status: 422, // Unprocessable Entity
        }
      );
    }

    // Not user reportable
    throw error;
  }
});
