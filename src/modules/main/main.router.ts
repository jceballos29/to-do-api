import { Router } from 'express';
import { MainController } from './main.controller';

export class MainRouter {

  public router: Router;
  public controller: MainController;

  constructor() {
    this.router = Router();
    this.controller = new MainController();

    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.get('/info', (req, res) => this.controller.getApiInfo(req, res));
    this.router.get('/health', (req, res) => this.controller.getHealthCheck(req, res));
    this.router.get('/version-comparison', (req, res) => this.controller.getVersionComparison(req, res));
  }

  public getRouter(): Router {
    return this.router;
  }
}

const mainRouter = new MainRouter();
export default mainRouter.getRouter();