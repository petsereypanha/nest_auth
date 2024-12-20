import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { Prisma, PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  async onModuleInit() {
    await this.$connect();
    // this.$use(this.loggingMiddleware);
  }

  loggingMiddleware: Prisma.Middleware = async (params, next) => {
    console.log(
      `${params.action} ${params.model}.${JSON.stringify(params.args)}`,
    );
    const result = await next(params);
    console.log(result);
    return result;
  };

  async onModuleDestroy() {
    await this.$disconnect();
  }
}