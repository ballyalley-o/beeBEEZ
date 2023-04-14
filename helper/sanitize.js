const { check, body } = require('express-validator');

const sanitizeInput = [
    body('name')
    .custom((value, err) => {
        if(err) {
            throw new Error('Name must be a string');
        }
        if (typeof value !== 'string') {
            throw new Error('Name must be a string');
        }
        return capitalizeFirstLetter(value);
    }),
    body('email')
    .normalizeEmail(),
    body('password')
    .trim(),
    body('confirmPassword')
    .trim()
];


const capitalizeFirstLetter = (string) => {
  return string.replace(/^\w/, (c) => c.toUpperCase());
};

// const sanitizeProducts = [
//     body('title')
//         .custom((value) => {
//             if (typeof value !== 'string') {
//                 throw new Error('Title must be a string');
//             }
//             return capitalizeFirstLetter(value);
//         })
//         .isLength({ min: 3 })
//         .withMessage('Title must be at least 3 characters long'),
//     body('price')
//         .isFloat()
//         .withMessage('Price must be a number'),
//     body('description')
//         .custom((value) => {
//             if (typeof value !== 'string') {
//                 throw new Error('Description must be a string');
//             }
//             return capitalizeFirstLetter(value);
//     })
//         .isLength({ min: 5, max: 400 })
//         .withMessage('Description must be between 5 and 400 characters long'),
//     body('imageUrl')
//         .isURL()
// ]

module.exports = {
    sanitizeInput,
    // sanitizeProducts
}