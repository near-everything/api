
const things = [];

// Create a new Thing
export const createThing = async (data: object) => {
  // const pgClient = getAuthPgPool(app);
  // try {
  //   await pgClient.query("SAVEPOINT graphql_mutation");
  //   // create the thing
  //   const thingId = await createThing(pgClient, creatorId, privacySetting);
  //   // create characteristics
  //   await Promise.all(
  //     charArr.map(async (char) => {
  //       // create the option (regular text)
  //       await createCharacteristic(pgClient, thingId, char);
  //     })
  //   );
  //   // create media
  // } catch (e) {
  //   // mutation failed, abort
  //   await pgClient.query("ROLLBACK TO SAVEPOINT graphql_mutation");
  //   throw e;
  // } finally {
  //   // Release our savepoint so it doesn't conflict with other mutations
  //   await pgClient.query("RELEASE SAVEPOINT graphql_mutation");
  // }
  // // create the thing in db
  // // create the characteristics
  // // create the medias (these can be two different threads or done by workers, ya?)
  // console.log("hit service");

  // Return the new Thing id
  return null;
};

// Delete a Thing
export const deleteThing = (id: string) => {
  // Find the index of the Thing with the specified id
  const index = things.findIndex(thing => thing.id === id);

  // If the Thing doesn't exist, return
  if (index === -1) return;

  // Remove the Thing from the collection
  things.splice(index, 1);
};