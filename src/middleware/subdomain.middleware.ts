import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { URL } from 'url';
import { RealmService } from 'src/modules/realm/providers/realm.service';

@Injectable()
export class SubdomainMiddleware implements NestMiddleware {
  constructor(private readonly realmService: RealmService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const referer = req.headers.referer;
    if (!referer) {
      req.subdomainId = null;
      return next();
    }

    const url = new URL(referer);
    const hostname = url.hostname;

    const subdomain =
      hostname === 'localhost'
        ? 'panel'
        : this.getSubdomainFromHostname(hostname);
    if (subdomain) {
      const subdomainId: number =
        await this.realmService.getRealmIdByName(subdomain);
      req.subdomainId = subdomainId;
    } else {
      req.subdomainId = null;
    }

    next();
  }

  private getSubdomainFromHostname(hostname: string): string | null {
    const parts = hostname.split('.');
    if (parts.length > 3) return null;
    if (parts.length > 2) {
      return parts.slice(0, -2).join('.');
    }
    return null;
  }
}

// Extend Express Request interface to include subdomainId
declare global {
  namespace Express {
    interface Request {
      subdomainId?: number | null;
    }
  }
}
