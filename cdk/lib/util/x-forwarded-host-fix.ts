import { CloudFrontFunctionsEvent } from "aws-lambda";

export const handler = (event: CloudFrontFunctionsEvent) => {
  const request = event.request;
  request.headers['x-forwarded-host'] = request.headers['host'];
  return request;
};