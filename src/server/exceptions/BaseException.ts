import { HttpException, HttpStatus } from '@nestjs/common';
import { ErrorCode } from '../enums/ErrorEnum';

export class BaseException extends HttpException {
  constructor(code: ErrorCode, message: string) {
    super({ code, message }, HttpStatus.OK);
  }
}
