import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import PostgresClient from "serverless-postgres";
import { postgres } from "@/libs/postgres";
import middy from "@middy/core";
import middyJsonBodyParser from "@middy/http-json-body-parser";
import { formatJSONResponse } from "./api-gateway";
import { APIError } from "@/types.generated";
import { NotFound } from "./errors";
import * as console from "console";

export type FunctionContext = {
  postgres: PostgresClient;
};

export type FunctionResult<T extends object> = {
  response: T;
  statusCode?: number;
};

export type FunctionHandler<
  ResponseBody extends object,
  RequestBody extends object = undefined
> = (
  event: ParsedEvent<RequestBody>,
  context: FunctionContext
) => Promise<FunctionResult<ResponseBody>>;

export type ParsedEvent<T> = Omit<APIGatewayProxyEvent, "body"> & { body: T };

function middify<T>(
  handler: (event: ParsedEvent<T>) => Promise<APIGatewayProxyResult>
) {
  return middy(handler).use(middyJsonBodyParser());
}

/**
 * Application specific function handler that builds a context and handles
 * database connection and disconnection.
 */
export function functionHandler<
  ResponseBody extends object,
  RequestBody extends object = undefined
>(handler: FunctionHandler<ResponseBody, RequestBody>) {
  return middify<RequestBody>(
    async (event: ParsedEvent<RequestBody>): Promise<APIGatewayProxyResult> => {
      await postgres.connect();
      let response: ResponseBody | APIError;
      let statusCode: number;
      try {
        const result = await handler(event, { postgres });
        response = result.response;
        statusCode = result.statusCode;
      } catch (e) {
        if (e instanceof NotFound) {
          response = { message: e.message };
          statusCode = 404;
        } else if (e instanceof Error) {
          response = { message: e.message };
          statusCode = 500;
          console.log(e);
        } else {
          throw e;
        }
      }

      await postgres.end();

      return formatJSONResponse(response, statusCode);
    }
  );
}
