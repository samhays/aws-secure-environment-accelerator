import { PhaseInput } from './shared';
import * as customResourceRoles from '../deployments/iam';

/**
 * This is the main entry point to deploy phase -1.
 *
 * The following resources are deployed in phase -1:
 *   - Creating required roles for macie custom resources
 *   - Creating required roles for guardDuty custom resources
 *   - Creating required roles for securityHub custom resources
 *   - Creating required roles for IamCreateRole custom resource
 */
export async function deploy({ acceleratorConfig, accountStacks, accounts }: PhaseInput) {
  // creates roles for macie custom resources
  await customResourceRoles.createMacieRoles({
    accountStacks,
    config: acceleratorConfig,
  });

  // creates roles for guardDuty custom resources
  await customResourceRoles.createGuardDutyRoles({
    accountStacks,
    config: acceleratorConfig,
  });

  // creates roles for securityHub custom resources
  await customResourceRoles.createSecurityHubRoles({
    accountStacks,
    accounts,
  });

  // Creates roles for IamCreateRole custom resource
  await customResourceRoles.createIamRole({
    accountStacks,
    accounts,
  });

  // Creates roles for IamCreateRole custom resource
  await customResourceRoles.createSSMDocumentRoles({
    accountStacks,
    accounts,
    config: acceleratorConfig,
  });

  await customResourceRoles.createLogGroupRole({
    accountStacks,
    accounts,
  });
}
