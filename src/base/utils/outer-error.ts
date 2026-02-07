// https://stackoverflow.com/a/73719189

/**
 * Class for wrapping erros inside other errors to create a chain of failure
 */
export class OuterError extends Error {
  innerError: Error | undefined;

  constructor(
    message?: string,
    // biome-ignore lint/suspicious/noExplicitAny: When catching an error it is not typed Error by default. Allow any to aleviate this
    innerError?: any
  ) {
    super(message);
    this.innerError = innerError;
  }
}
