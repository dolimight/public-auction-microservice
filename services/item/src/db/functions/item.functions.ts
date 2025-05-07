import { and, asc, eq, gte } from "drizzle-orm";
import { db } from "..";
import {
  itemsTable,
  categoriesTable,
  subCategoriesTable,
  conditionsTable,
  ItemSelectSchema,
} from "../schema";
import { first } from "../../utils/db";

export async function getItemById(id: ItemSelectSchema["id"]) {
  return await db
    .select({
      id: itemsTable.id,
      title: itemsTable.title,
      image: itemsTable.image,
      shortDescription: itemsTable.shortDescription,
      longDescription: itemsTable.longDescription,
      startingBid: itemsTable.startingBid,
      buyNowPrice: itemsTable.buyNowPrice,
      bidIncrement: itemsTable.bidIncrement,
      startDate: itemsTable.startDate,
      endDate: itemsTable.endDate,
      sellerId: itemsTable.sellerId,
      category: categoriesTable,
      subCategory: subCategoriesTable,
      condition: conditionsTable,
    })
    .from(itemsTable)
    .innerJoin(categoriesTable, eq(itemsTable.categoryId, categoriesTable.id))
    .innerJoin(
      subCategoriesTable,
      eq(itemsTable.subCategoryId, subCategoriesTable.id)
    )
    .innerJoin(conditionsTable, eq(itemsTable.conditionId, conditionsTable.id))
    .where(eq(itemsTable.id, id))
    .then(first);
}

export async function getItems({
  cursor,
  limit,
}: {
  cursor: ItemSelectSchema["id"] | undefined;
  limit: number;
}) {
  return await db
    .select({
      id: itemsTable.id,
      title: itemsTable.title,
      image: itemsTable.image,
      shortDescription: itemsTable.shortDescription,
      longDescription: itemsTable.longDescription,
      startingBid: itemsTable.startingBid,
      buyNowPrice: itemsTable.buyNowPrice,
      bidIncrement: itemsTable.bidIncrement,
      startDate: itemsTable.startDate,
      endDate: itemsTable.endDate,
      sellerId: itemsTable.sellerId,
      category: categoriesTable,
      subCategory: subCategoriesTable,
      condition: conditionsTable,
    })
    .from(itemsTable)
    .innerJoin(categoriesTable, eq(itemsTable.categoryId, categoriesTable.id))
    .innerJoin(
      subCategoriesTable,
      eq(itemsTable.subCategoryId, subCategoriesTable.id)
    )
    .innerJoin(conditionsTable, eq(itemsTable.conditionId, conditionsTable.id))
    .where(and(cursor ? gte(itemsTable.id, cursor) : undefined))
    .orderBy(asc(itemsTable.id))
    .limit(limit);
}
