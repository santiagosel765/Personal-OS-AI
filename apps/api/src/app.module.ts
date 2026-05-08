import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { CommonModule } from './common/common.module';
import { HealthModule } from './health/health.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { AccountsModule } from './accounts/accounts.module';
import { DebtsModule } from './debts/debts.module';
import { CardsModule } from './cards/cards.module';
import { GoalsModule } from './goals/goals.module';
import { TransactionsModule } from './transactions/transactions.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env', '../../.env'],
    }),
    PrismaModule,
    CommonModule,
    HealthModule,
    DashboardModule,
    AccountsModule,
    DebtsModule,
    CardsModule,
    GoalsModule,
    TransactionsModule,
  ],
})
export class AppModule {}
