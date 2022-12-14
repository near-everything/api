import { Pool } from "pg";
require('dotenv').config()

const mediaPool = new Pool({
  user: process.env.POSTGRES_USER,
  host: process.env.POSTGRES_HOSTNAME,
  database: process.env.POSTGRES_DATABASE,
  password: process.env.POSTGRES_PASSWORD,
  port: parseInt(process.env.POSTGRES_PORT),
  ssl:
    process.env.NODE_ENV === "production"
      ? {
          rejectUnauthorized: false,
          ca: process.env.CA_CERT,
        }
      : null,
});

export const uploadFile = async (url: string, thingId?: string) => {
  const client = await mediaPool.connect();
  try {
    await client.query("BEGIN");
    const {
      rows: [media],
    } = await client.query(
      `INSERT INTO everything.media(media_url) VALUES ($1)              RETURNING *`,
      [
        url,
      ]
    ); 
    // if thingId provided, create tag
    if (thingId) {
      const {
        rows: [tag]
      } = await client.query(
        `INSERT INTO everything.tag(thing_id, media_id) VALUES ($1, $2) RETURNING *`,
        [
          thingId,
          media.id
        ]
      )
    }
    await client.query("COMMIT");
  } catch (e) {
    // mutation failed, abort
    await client.query("ROLLBACK");
    throw e;
  } finally {
    // Release our savepoint so it doesn't conflict with other mutations
    client.release();
  }
};
