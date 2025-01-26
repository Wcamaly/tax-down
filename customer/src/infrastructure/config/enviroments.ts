export class Environment {
  public static readonly PORT: number = Number(process.env.PORT) || 3000;
  public static readonly COGNITO_CLIENT_ID: string = process.env.COGNITO_CLIENT_ID || "";
  public static readonly COGNITO_CLIENT_SECRET: string = process.env.COGNITO_CLIENT_SECRET || "";
  public static readonly COGNITO_USER_POOL_ID: string = process.env.COGNITO_USER_POOL_ID || "";
  public static readonly AWS_REGION: string = process.env.AWS_REGION || "";
  public static readonly AWS_ACCESS_KEY_ID: string = process.env.AWS_ACCESS_KEY_ID || "";
  public static readonly AWS_SECRET_ACCESS_KEY: string = process.env.AWS_SECRET_ACCESS_KEY || "";
}
