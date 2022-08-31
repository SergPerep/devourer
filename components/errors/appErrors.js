export class AppError extends Error {
  constructor(message = "Basic AppError", name = "AppError") {
    super(message, name);
    this.name = name;
  }
}
