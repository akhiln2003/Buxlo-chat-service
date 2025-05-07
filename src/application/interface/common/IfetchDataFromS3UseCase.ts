
export interface IfetchDataFromS3UseCase {
  execute(keys: string[]): Promise<string[] | []>;
}
