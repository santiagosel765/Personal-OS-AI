import { Global, Module } from '@nestjs/common';
import { CurrentUserService } from './current-user';

@Global()
@Module({
  providers: [CurrentUserService],
  exports: [CurrentUserService],
})
export class CommonModule {}
