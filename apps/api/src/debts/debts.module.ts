import { Module } from '@nestjs/common';
import { DebtsController } from './debts.controller';

@Module({ controllers: [DebtsController] })
export class DebtsModule {}
