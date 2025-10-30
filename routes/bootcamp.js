const express = require('express');

const router = express.Router();

router.get('/', (req, res) => {
    res.status(200).json({status: 'success',data:{message: 'get data'}});
})
router.post('/', (req, res) => {
    res.status(200).json({status: 'success',data:{message: 'post data'}});
})
router.put('/:id', (req, res) => {
    res.status(200).json({status: 'success',data:{id:`update ${req.params.id}`}});
})
router.delete('/:id', (req, res) => {
    res.status(200).json({status: 'success',data:{id:`delete ${req.params.id}`}});
})

module.exports = router;