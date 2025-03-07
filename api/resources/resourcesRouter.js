const express = require('express');
const router = express.Router();
const Resources = require('./resourcesModel');
const { adminRequired } = require('../middleware/permissionsRequired');

//get all resources

router.get('/', (req, res) => {
  Resources.findAll()
    .then((resources) => {
      res.status(200).json(resources);
    })
    .catch((err) => {
      res.status(500).json({ error: err.message });
    });
});

// get a resource by its id

router.get('/:resource_id', (req, res) => {
  const id = req.params.resource_id;
  Resources.findByResourceId(id)
    .then((resource) => {
      if (resource) {
        res.status(200).json(resource);
      } else {
        res.status(404).json({ error: 'Resource not found, check the ID' });
      }
    })
    .catch((err) => {
      res.status(500).json({ error: err.message });
    });
});

// add a resource to the resources database

router.post(
  '/',

  validNewResource,
  adminRequired,
  (req, res, next) => {
    const resource = req.body;
    Resources.Create(resource)
      .then(() => {
        res.status(201).json({ message: 'success', resource });
      })
      .catch(next);
  }
);

//update a resource

router.put(
  '/:resource_id',

  validNewResource,
  adminRequired,
  (req, res, next) => {
    const id = req.params.resource_id;
    const changes = req.body;
    Resources.Update(id, changes)
      .then((change) => {
        if (change) {
          Resources.findByResourceId(id).then((success) => {
            res.status(200).json({
              message: `Resource '${success.resource_id}' updated`,
              success,
            });
          });
        }
      })
      .catch(next);
  }
);

//delete a resource

router.delete(
  '/:resource_id',

  adminRequired,
  (req, res, next) => {
    const id = req.params.resource_id;
    Resources.Delete(id)
      .then((resources) => {
        if (resources) {
          res.status(200).json({
            message: 'Resource deleted',
          });
        }
      })
      .catch(next);
  }
);

///////////////////////////MIDDLEWARE///////////////////////////////

// validate a new resource

function validNewResource(req, res, next) {
  const resource = req.body;
  if (!resource) {
    res.status(400).json({
      message: 'missing resource Data',
    });
  } else if (!resource.resource_name) {
    res.status(400).json({
      message: 'missing resource_name field',
    });
  } else if (!resource.category) {
    res.status(400).json({
      message: 'missing category field',
    });
  } else if (!resource.condition) {
    res.status(400).json({
      message: 'missing condition field',
    });
  } else {
    next();
  }
}
module.exports = router;
