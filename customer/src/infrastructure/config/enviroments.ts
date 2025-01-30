import jwksClient from "jwks-rsa";

export class Environment {
  public static readonly PORT: number = Number(process.env.PORT) || 3000;
  public static readonly COGNITO_CLIENT_ID: string = process.env.COGNITO_CLIENT_ID || "";
  public static readonly COGNITO_CLIENT_SECRET: string = process.env.COGNITO_CLIENT_SECRET || "";
  public static readonly COGNITO_USER_POOL_ID: string = process.env.COGNITO_USER_POOL_ID || "";
  public static readonly AWS_REGION: string = process.env.AWS_REGION || "us-east-1";
  public static readonly AWS_ACCESS_KEY_ID: string = process.env.AWS_ACCESS_KEY_ID || "test";
  public static readonly AWS_SECRET_ACCESS_KEY: string = process.env.AWS_SECRET_ACCESS_KEY || "test";
  public static readonly DYNAMODB_ENDPOINT: string = process.env.DYNAMODB_ENDPOINT || "http://dynamodb:8000";
  public static readonly COGNITO_ISSUER: string = process.env.COGNITO_ISSUER ||  "https://cognito-idp.YOUR_REGION.amazonaws.com/us-east-1_local_123456";
  public static readonly ENDPOINT_COGNITO: string = process.env.ENDPOINT_COGNITO || "http://localhost:4566";
}
