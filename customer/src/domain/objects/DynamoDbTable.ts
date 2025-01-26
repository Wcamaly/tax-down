import { AttributeDefinition, BillingMode, KeySchemaElement } from "@aws-sdk/client-dynamodb";

export class DynamoDbTable {
  constructor(
    public readonly tableName: string,
    public readonly keySchema: KeySchemaElement[] | undefined,
    public readonly attributeDefinitions: AttributeDefinition[],
    public readonly billingMode: BillingMode
  ) {}
}
