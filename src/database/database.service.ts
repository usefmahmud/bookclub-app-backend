import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';

@Injectable()
export class DatabaseService implements OnApplicationBootstrap {
  private readonly logger = new Logger(DatabaseService.name);

  constructor(@InjectConnection() private readonly connection: Connection) {}

  async onApplicationBootstrap() {
    try {
      if (this.connection.readyState === 1) {
        this.logger.log('Database is connected successfully');
        this.logger.log(`Connected to database: ${this.connection.name}`);
      } else {
        this.logger.warn('Database connection is not ready');
      }
    } catch (error: any) {
      this.logger.error('Failed to connect to the database', error.stack);
      throw error;
    }
  }
}
