import { Module } from '@nestjs/common';
import { PollService } from './poll.service';
import { PollController } from './poll.controller';
import { redisModule } from 'src/modules.config';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PollRepository } from './poll.repository';
import { JwtModule, JwtModuleOptions } from '@nestjs/jwt';
import { PollsGateway } from './poll.gateway';

@Module({
  imports: [
    redisModule,
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService): JwtModuleOptions => ({
        secret: config.get('JWT_SECRET'),
        signOptions: {
          expiresIn: config.get('JWT_EXPIRES_IN'),
        },
      }),
    }),
  ],
  controllers: [PollController],
  providers: [PollService, ConfigService, PollRepository, PollsGateway],
})
export class PollModule {}
