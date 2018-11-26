const express = require('express');
const router = express.Router();
const moment = require('moment');

moment.locale('ru');

const Comment = require('../models/comment');

router.get('/',(req, res) => {
   Comment.find({}).then(comments =>{
       res.render('archive/index', {
           comments:comments,
           moment: moment
       });
   });
});

module.exports = router;