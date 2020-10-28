// interface minMax {
//   min: number;
//   max: number;
// }

// interface Fields {
//   id: string;
//   constrain: minMax;
// }

// type Validator = {
//   [key: string]: {
//     new: Fields[];
//     update: Fields[];
//     login?: Fields[];
//   };
// };

// export const globalInfo: Validator = {
//   users: {
//     new: [
//       { id: 'nick', constrain: { min: 3, max: 38 } },
//       { id: 'email', constrain: { min: 6, max: 63 } },
//       { id: 'password', constrain: { min: 6, max: 65 } },
//     ],
//     update: [{ id: 'nick', constrain: { min: 3, max: 38 } }],
//     login: [{ id: 'nick', constrain: { min: 3, max: 38 } }],
//   },
//   customers: {
//     new: [
//       { id: 'nick', constrain: { min: 3, max: 38 } },
//       { id: 'email', constrain: { min: 6, max: 63 } },
//       { id: 'password', constrain: { min: 6, max: 65 } },
//     ],
//     update: [{ id: 'nick', constrain: { min: 3, max: 38 } }],
//   },
//   cars: {
//     new: [
//       { id: 'nick', constrain: { min: 3, max: 38 } },
//       { id: 'email', constrain: { min: 6, max: 63 } },
//       { id: 'password', constrain: { min: 6, max: 65 } },
//     ],
//     update: [{ id: 'nick', constrain: { min: 3, max: 38 } }],
//   },
// };
