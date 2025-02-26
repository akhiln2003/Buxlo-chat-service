import { Application } from "express";
import { Iserver } from "../../domain/interfaces/Iserver";
import express from "express";
import cookieParser from "cookie-parser";
import { createServer } from "http";

export class ExpressWebServer implements Iserver {
  private app: Application;
  private server: any;

  constructor() {
    this.app = express();
    this.app.use(cookieParser());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(express.json());

    this.server = createServer(this.app);
  }
  registerMiddleware(middleware: any): void {
    this.app.use(middleware);
  }
  registerRoutes(path: string, router: any): void {
    this.app.use(path, router);
  }

  registerErrorHandler(middleware: any): void {
    this.app.use(middleware);
  }
  async start(port: number): Promise<void> {
    return new Promise((res) => {
      this.server.listen(port, () => {
        console.log(`App listening on port ===> http://localhost:${port}/`);
        res();
      });
    });
  }

  async close(): Promise<void> {
    if (this.server) {
      return new Promise((resolve, reject) => {
        this.server.close((err: any) => {
          if (err) {
            console.error("Error closing", err);
            return reject(err);
          }
          console.log("Server closed");
          resolve();
        });
      });
    }
  }
}
