import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

// It will now automatically be available everywhere in the app, no need to import it everywhere
@Global()
@Module({ providers: [PrismaService], exports: [PrismaService] })
export class PrismaModule {}
