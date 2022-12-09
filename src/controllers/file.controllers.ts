// import * as fileService from '../services/file.services';

// export const createFile = (req, res) => {
//   const fileData = req.body;
//   console.log("hit controller");
//   console.log(fileData);
//   console.log(req.files);
//   let file;
//   try {
//     // validate File
//     // save raw?
//     // create from data
//     file = fileService.createFile(fileData);
//   } catch (err) {
//     // Catch large errors, what are typical ones to look out for?
//   }

//   // Send the new File as a JSON response
//   res.json(file);
// };

// // Delete a File
// export const deleteFile = (req, res) => {
//   // Get the id of the File to delete from the request params
//   const id = req.params.id;

//   // Delete the File using the service
//   fileS.deleteFile(id);

//   // Send a success message as a JSON response
//   res.json({ message: 'File deleted successfully' });
// };