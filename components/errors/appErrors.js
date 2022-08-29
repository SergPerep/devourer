export class AppError extends Error {
  constructor(name = "AppError", message = "Basic AppError") {
    super(message, name);
    this.name = name;
  }
}
