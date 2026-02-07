export class UserReportableError extends Error {
  errorCode: string;

  constructor(errorCode: string, message?: string) {
    super(message);

    this.errorCode = errorCode;
  }
}
