const express = require('express');
const conform = require('conform');
const router = express.Router();
const moment = require('moment');

moment.locale('ru');

const Comment = require('../models/comment');

const schema = {
    properties: {
        name: {
            type: 'string',
            required: true,
            maxLength: 15
        },
        theme: {
            type: 'string',
            required: true,
            maxLength: 40
        },
        body: {
            type: 'string',
            required: true,
            maxLength: 4096
        }
    }
};

// POST is add
router.post('/add', async (req, res) => {
    const name = req.body.name;
    const theme = req.body.theme;
    const body = req.body.body;

    const error = conform.validate(req.body, schema);

    if(error.valid){
        try{
            let comment = await Comment.create({
                name,
                theme,
                body
            });
            res.json({
                ok: true,
                comment: comment,
                moment: moment(comment.createdAt).fromNow()
            });
        } catch (error) {
            res.json({
                ok: false,
            });
        }
    }else
        res.json({
            ok: false,
            error:error
        });
});

module.exports = router;