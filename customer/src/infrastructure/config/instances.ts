import { DynamoDb } from "./dynamoDb";
import { Server } from "./server";

export class Instances {

  constructor(private readonly server: Server, private readonly dynamoDb: DynamoDb) {}


  public initializeRepositories() {}

  public initializeUseCases() {}

  public initializeDelivers() {}

  public initializeDynamoDb() {
    
  }


}