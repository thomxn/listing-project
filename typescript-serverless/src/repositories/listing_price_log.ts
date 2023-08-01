import PostgresClient from "serverless-postgres";
import { Price, PriceWrite } from "@/types.generated";
import { extractVariables } from "@/libs/postgres";
// import { extractVariables } from "@/libs/postgres";
// import { EntityNotFound } from "@/libs/errors";

// Declaring the table name here for consistency and to save us from typo while writing queries since we are using raw queries
const listingPriceLogTable = "listing_price_log";

type ListingPriceLogTableRow = {
  id?: number;
  listing_id: number;
  price_eur: number;
  created_date: Date;
};

function tableRowToListingPriceLog(row: ListingPriceLogTableRow): Price {
  return {
    price_eur: row.price_eur,
    created_date: row.created_date.toISOString(),
  };
}

function listingPriceToTableRow(
  listingId: number,
  price_eur: number,
  createdDate: Date
): ListingPriceLogTableRow {
  return {
    price_eur,
    listing_id: listingId,
    created_date: createdDate,
  };
}

export function getRepository(postgres: PostgresClient) {
  return {
    async getListingPriceLog(listingId: number): Promise<Price[]> {
      const queryString = `SELECT * FROM ${listingPriceLogTable} WHERE listing_id = $1 ORDER BY id ASC`;
      const queryValues = [listingId];

      const result = await postgres.query(queryString, queryValues);

      return result.rows.map(tableRowToListingPriceLog);
    },

    async insertListingPriceLog(
      listingId: number,
      price_eur: number
    ): Promise<Price> {
      const tableRow = listingPriceToTableRow(listingId, price_eur, new Date());

      const {
        columns,
        variables,
        values: queryValues,
      } = extractVariables(tableRow);

      const queryString = `
        INSERT INTO ${listingPriceLogTable} (${columns.join(",")})
        VALUES(${variables})
        RETURNING *
      `;
      const result = await postgres.query(queryString, queryValues);

      return tableRowToListingPriceLog(result.rows[0]);
    },
  };
}
