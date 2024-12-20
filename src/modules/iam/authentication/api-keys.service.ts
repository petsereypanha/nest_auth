import { Injectable } from '@nestjs/common';
import { GeneratedApiKeyPayload } from './payload/generated-api.payload';
import { HashingService } from '../hashing/hashing.service';
import { randomUUID } from 'crypto';

@Injectable()
export class ApiKeysService {
  constructor(private readonly hashingService: HashingService) {}
  async createApiHash(id: string): Promise<GeneratedApiKeyPayload> {
    const apiKey = await this.generateApiKey(id);
    const hashedKey = await this.hashingService.hash(apiKey);
    return { apiKey, hashedKey };
  }
  async validate(apiKey: string, hashedKey: string): Promise<boolean> {
    return this.hashingService.compare(apiKey, hashedKey);
  }
  extractIdFromApiKey(apiKey: string): string {
    const [id] = Buffer.from(apiKey, 'base64').toString('ascii').split(' ');
    return id;
  }

  async generateApiKey(id: string): Promise<string> {
    const apiKey = `${id} ${randomUUID()}`;
    return Buffer.from(apiKey).toString('base64');
  }
}
