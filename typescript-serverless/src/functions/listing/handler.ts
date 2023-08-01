import { functionHandler } from "@/libs/function";
import { getRepository } from "@/repositories/listings";
import { getRepository as pricingLogRepository } from "@/repositories/listing_price_log";
import { Listing, ListingWrite } from "@/types.generated";
import { EntityNotFound, NotFound } from "@/libs/errors";

export const getListings = functionHandler<Listing[]>(
  async (_event, context) => {
    const listings = await getRepository(context.postgres).getAllListings();

    return { statusCode: 200, response: listings };
  }
);

export const addListing = functionHandler<Listing, ListingWrite>(
  async (event, context) => {
    const listing = await getRepository(context.postgres).insertListing(
      event.body
    );

    return { statusCode: 201, response: listing };
  }
);

export const updateListing = functionHandler<Listing, ListingWrite>(
  async (event, context) => {
    try {
      let listing: Listing
      // Alternate and recommended method is to trap both the queries in the same transaction so that no changes are
      // saves when either of the operation fails

      try {
        listing = await getRepository(context.postgres).updateListing(
          parseInt(event.pathParameters.id),
          event.body
        );
      } catch (updateError) {
        console.log(updateError);
      }
      // Todo: Wrap it in a try-catch so that if updateListing fails do not add a log to the pricing table.
      // Do the same while listing creation also
      // You can also wrap the pricing log creation into try-catch and revert the update made to the listing
      const listingPriceLog = await pricingLogRepository(
        context.postgres
      ).insertListingPriceLog(
        parseInt(event.pathParameters.id),
        event.body.latest_price_eur
      );

      return { statusCode: 200, response: listing };
    } catch (e) {
      if (e instanceof EntityNotFound) {
        throw new NotFound(e.message);
      }

      throw e;
    }
  }
);
