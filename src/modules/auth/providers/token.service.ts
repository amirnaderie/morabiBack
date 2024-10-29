import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class TokenService {
  constructor(private readonly jwtService: JwtService) {}

  decodeToken(token: string) {
    return this.jwtService.decode(token);
  }

  verifyToken(token: string) {
    return this.jwtService.verify(token);
  }

  signPayload(payload: any) {
    return this.jwtService.sign(payload);
  }
}
