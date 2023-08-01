import { functionHandler } from "@/libs/function";
import { getRepository } from "@/repositories/listing_price_log";
import { Price } from "@/types.generated";

export const getListingPrices = functionHandler<Price[]>(
  async (event, context) => {
    const listings = await getRepository(context.postgres).getListingPriceLog(
      parseInt(event.pathParameters.id)
    );

    return { statusCode: 200, response: listings };
  }
);
