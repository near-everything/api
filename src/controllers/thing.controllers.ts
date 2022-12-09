import * as thingService from '../services/thing.services';

// Create a new Thing
export const createThing = (req, res) => {
  // Get the data for the new Thing from the request body
  const thingData = req.body;
  console.log("hit controller");
  console.log(thingData);
  console.log(req.files);
  let thing;
  try {
    // validate thing
    // save raw?
    // create from data
    thing = thingService.createThing(thingData);
  } catch (err) {
    // Catch large errors, what are typical ones to look out for?
  }

  // Send the new Thing as a JSON response
  res.json(thing);
};

// Delete a Thing
export const deleteThing = (req, res) => {
  // Get the id of the Thing to delete from the request params
  const id = req.params.id;

  // Delete the Thing using the service
  thingService.deleteThing(id);

  // Send a success message as a JSON response
  res.json({ message: 'Thing deleted successfully' });
};