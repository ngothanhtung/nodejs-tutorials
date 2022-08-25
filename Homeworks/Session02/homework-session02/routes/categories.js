var _ = require('lodash');
var express = require('express');
var router = express.Router();

let categories = [
  {
    id: 1,
    name: 'CPU',
    description: 'Các loại CPU cho máy tính',
  },
  {
    id: 9,
    name: 'HDD',
    description: 'Các loại đĩa cứng cho máy tính',
  },
  {
    id: 3,
    name: 'RAM',
    description: 'Các loại ram cho máy tính',
  },
];

// 🔶 API: List all categories
router.get('/', function (req, res, next) {
  try {
    res.json(categories);
    return;
  } catch (error) {
    // DEV MODE
    res.status(500).json(error);
    // PRODUCTION MODE
    // res.sendStatus(500);
    // res.status(500).json({message: 'Lỗi hệ thống', desc: ''});
    return;
  }
});

// 🔶 API: Get a category
router.get('/:id', function (req, res, next) {
  try {
    const { id } = req.params;
    if (id === undefined) {
      res.status(400).json({ message: 'id is required' });
      return;
    }
    const found = categories.find((category) => {
      return category.id.toString() === id;
    });

    if (found) {
      res.json(found);
      return;
    } else {
      res.sendStatus(410);
      return;
    }
  } catch (error) {
    res.status(500).json(error);
    return;
  }
});

// 🔶 API: Create a category
router.post('/', function (req, res, next) {
  try {
    const { name, description } = req.body;
    if (!name || !description) {
      res.sendStatus(400);
      return;
    }

    const max = _.maxBy(categories, 'id');
    categories.push({ id: max.id + 1, name, description });

    res.sendStatus(201);
    return;
  } catch (error) {
    res.status(500).json(error);
    return;
  }
});

// 🔶 API: Update a category
router.patch('/:id', function (req, res, next) {
  try {
    const { id } = req.params;

    if (!id) {
      res.sendStatus(400);
      return;
    }

    const { name, description } = req.body;
    if (!name || !description) {
      res.sendStatus(400);
      return;
    }

    let found = categories.find((category) => {
      return category.id.toString() === id;
    });

    if (found) {
      found.name = name;
      found.description = description;
      res.status(200).json(found);
      return;
    } else {
      res.sendStatus(410);
      return;
    }
  } catch (error) {
    // DEV MODE
    res.status(500).json(error);
    return;
  }
});

// 🔶 API: Delete a category
router.delete('/:id', function (req, res, next) {
  try {
    const { id } = req.params;

    if (!id) {
      res.sendStatus(400);
      return;
    }

    let found = categories.find((category) => {
      return category.id.toString() === id;
    });

    if (found) {
      _.remove(categories, (category) => {
        return category.id.toString() === id;
      });

      res.sendStatus(200);
      return;
    } else {
      res.sendStatus(410);
      return;
    }
  } catch (error) {
    res.status(500).json(error);
    return;
  }
});

module.exports = router;
