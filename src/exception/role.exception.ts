import { ForbiddenException } from '@nestjs/common';

export class forbiddenRoleException extends ForbiddenException {
  constructor(role: string) {
    super(`you don't have the required role ${role}`);
  }
}
