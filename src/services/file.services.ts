
export const uploadFile = async (data: object) => {
  // const pgClient = getAuthPgPool(app);
  // try {
  //   await pgClient.query("SAVEPOINT graphql_mutation");
  //   // create the File
  //   const FileId = await createFile(pgClient, creatorId, privacySetting);
  //   // create characteristics
  //   await Promise.all(
  //     charArr.map(async (char) => {
  //       // create the option (regular text)
  //       await createCharacteristic(pgClient, FileId, char);
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
  // // create the File in db
  // // create the characteristics
  // // create the medias (these can be two different threads or done by workers, ya?)
  // console.log("hit service");

  // Return the new File id
  return null;
};

// Delete a File
export const deleteFile = (id: string) => {
  
};