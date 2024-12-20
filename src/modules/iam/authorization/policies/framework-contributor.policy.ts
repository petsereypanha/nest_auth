import { Policy } from './interfaces/policy.interface';
import { Injectable } from '@nestjs/common';
import { PolicyHandler } from './interfaces/policy-handler.interfac';
import { PolicyHandlersStorage } from './policy-handlers.storage';
import { ActiveUserData } from '../../interfaces/active-user-data.interface';

export class FrameworkContributorPolicy implements Policy {
  name = 'FrameworkContributor';
}

@Injectable()
export class FrameworkContributorPolicyHandler
  implements PolicyHandler<FrameworkContributorPolicy>
{
  constructor(private readonly policyHandlersStorage: PolicyHandlersStorage) {
    this.policyHandlersStorage.add(FrameworkContributorPolicy, this);
  }

  async handle(
    policy: FrameworkContributorPolicy,
    user: ActiveUserData,
  ): Promise<void> {
    const isContributor = user.email.endsWith('@nestjs.com');
    if (!isContributor) {
      throw new Error('User is not a contributor');
    }
  }
}
