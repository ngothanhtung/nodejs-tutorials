var _ = require('lodash');
var fs = require('fs');
var express = require('express');
var router = express.Router();

const fileName = './data/categories.json';
const data = fs.readFileSync(fileName, { encoding: 'utf-8', flag: 'r' });
let categories = JSON.parse(data);

// TODO:
// Validation: GET/ID, CREATE, UPDATE, DELETE
// Authorization: CREATE, UPDATE, DELETE

// 🔶 API: List all categories
router.get('/', (req, res, next) => {
  try {
    res.json(categories);
    return;
  } catch (error) {
    res.status(500).json(error);
    return;
  }
});

// 🔶 API: Get a category
router.get('/:id', function (req, res, next) {
  req.he;
  try {
    const { id } = req.params;

    const category = categories.find((category) => {
      return category.id.toString() === id;
    });

    if (category) {
      res.json(category);
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
    // Kiểm tra name và description phải có trong body
    if (!name || !description) {
      res.sendStatus(400);
      return;
    }

    const max = _.maxBy(categories, 'id');
    categories.push({ id: max.id + 1, name, description });

    // Save to file
    fs.writeFileSync(fileName, JSON.stringify(categories), function (err) {
      if (err) throw err;
      console.log('Saved!');
    });

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
    const { name, description } = req.body;

    if (!id) {
      res.sendStatus(400);
      return;
    }

    let found = categories.find((category) => {
      return category.id.toString() === id;
    });

    if (found) {
      if (name) {
        found.name = name;
      }

      if (description) {
        found.description = description;
      }

      // Save to file
      fs.writeFileSync(fileName, JSON.stringify(categories), function (err) {
        if (err) throw err;
        console.log('Saved!');
      });

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

      // Save to file
      fs.writeFileSync(fileName, JSON.stringify(categories), function (err) {
        if (err) throw err;
        console.log('Saved!');
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
