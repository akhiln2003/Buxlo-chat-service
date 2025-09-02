
export interface IFetchDataFromS3UseCase {
  execute(keys: string[]): Promise<string[] | []>;
}
