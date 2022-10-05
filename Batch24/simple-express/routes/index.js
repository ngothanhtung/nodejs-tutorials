var express = require('express');
var router = express.Router();

const movies = [
  { id: 1, name: 'Spiderman', year: 2001 },
  { id: 2, name: 'Titanic', year: 1999 },
  { id: 3, name: 'Batman', year: 1996 },
];

const users = [
  { id: 1, name: 'tungnt', email: 'tungnt@softech.vn' },
  { id: 2, name: 'peter', email: 'peter@gmail.com' },
  { id: 3, name: 'john', email: 'john@outlook.com' },
];

/* GET home page. */
router.get('/', (req, res, next) => {
  res.json({ message: 'Hello Express with Node' });
});

router.get('/movies', (req, res, next) => {
  res.json(movies);
});

// Get all users
router.get('/users', (req, res, next) => {
  res.json(users);
});

// Get user by id (param: id)
router.get('/users/id/:id', (req, res, next) => {
  // Get request information (params)
  const { id, age } = req.params;
  console.log('id:', id);

  const user = users.find((x) => {
    return x.id == id;
  });

  if (user) {
    // response: send to client
    res.json(user);
    return;
  }
  // send status without body
  // res.sendStatus(410);

  // send status within body
  res.status(410).json({ message: 'Không tìm thấy userid mà chú truyền lên' });
});

// Create an user
// Method: POST
router.post('/users', (req, res, next) => {
  // Get request information (body)
  const data = req.body;
  console.log('body:', data);

  users.push(data);

  // response: send to client
  res.status(201).json({ ok: true, user: data });
});

router.get('/users/search', (req, res, next) => {
  // Get request information (querystring)
  const query = req.query;
  console.log('query:', query);

  // response: send to client
  res.json({ ok: true, message: 'GET METHOD WITH QUERY STRING' });
});

// download
router.get('/download', (req, res, next) => {
  res.download('public/images/nature.jpeg');
});

// download
router.get('/render', (req, res, next) => {
  res.render('avatar', { name: 'Aptech' });
});

// Update data of object
// Method: PATCH
router.patch('/users/:id', (req, res, next) => {
  const { id } = req.params;
  const data = req.body;

  console.log('id:', id);
  console.log('data:', data);
  res.json({ ok: true });
});

// Delete object
// Method: DELETE
router.delete('/users/:id', (req, res, next) => {
  const { id } = req.params;

  console.log('id:', id);

  res.json({ ok: true, message: 'DELETE METHOD' });
});

module.exports = router;
