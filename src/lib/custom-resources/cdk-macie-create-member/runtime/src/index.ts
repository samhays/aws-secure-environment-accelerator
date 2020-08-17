import * as AWS from 'aws-sdk';
import {
  CloudFormationCustomResourceEvent,
  CloudFormationCustomResourceCreateEvent,
  CloudFormationCustomResourceUpdateEvent,
} from 'aws-lambda';
import { errorHandler } from '@aws-accelerator/custom-resource-runtime-cfn-response';

const macie = new AWS.Macie2();

export interface HandlerProperties {
  accountId: string;
  email: string;
}

export const handler = errorHandler(onEvent);

async function onEvent(event: CloudFormationCustomResourceEvent) {
  console.log(`Enable Macie admin...`);
  console.log(JSON.stringify(event, null, 2));

  // tslint:disable-next-line: switch-default
  switch (event.RequestType) {
    case 'Create':
      return onCreateOrUpdate(event);
    case 'Update':
      return onCreateOrUpdate(event);
    case 'Delete':
      return;
  }
}

function getPhysicalId(event: CloudFormationCustomResourceEvent): string {
  const properties = (event.ResourceProperties as unknown) as HandlerProperties;

  return `${properties.accountId}`;
}

async function onCreateOrUpdate(
  event: CloudFormationCustomResourceCreateEvent | CloudFormationCustomResourceUpdateEvent,
) {
  const properties = (event.ResourceProperties as unknown) as HandlerProperties;
  await createMember(properties);
  return {
    physicalResourceId: getPhysicalId(event),
    data: {},
  };
}

async function createMember(properties: HandlerProperties) {
  try {
    await macie
      .createMember({
        account: {
          accountId: properties.accountId,
          email: properties.email,
        },
      })
      .promise();
  } catch (error) {
    if (error.code === 'ValidationException') {
      console.log('Already a member');
    }
  }
}
