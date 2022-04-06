import { BaseException } from './BaseException';
import { ErrorCode } from '../enums/ErrorEnum';

export class ResourceNotFoundException extends BaseException {
  constructor(message: string) {
    super(ErrorCode.RESOURCE_NOT_FOUND, message);
  }
}
