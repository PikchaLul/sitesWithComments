const express = require('express');
const router = express.Router();
const moment = require('moment');

moment.locale('ru');

const Comment = require('../models/comment');


router.post('/searchToText', async (req, res) => {
    const dbcomments = await Comment.find({});

    const comments = [];
    dbcomments.forEach((comment)=>{
        if(comment.body.indexOf(req.body.text) !== -1){
            comments.push(comment);
        }
    });

    res.json({
        ok: true,
        comments: comments,
        moments: comments.map(comment => {
            return moment(comment.createdAt).fromNow();
        })
    });
});

router.post('/searchToDate', async (req, res) => {
    const dbcomments = await Comment.find({});

    const comments = [];
    dbcomments.forEach((comment)=>{
        let commentTime = comment.createdAt.getTime();
        let createDateStartTime = new Date(req.body.createDateStart);
        let createDateEndTime = new Date(req.body.createDateEnd);
        if(commentTime >= createDateStartTime.getTime() && commentTime < createDateEndTime){
            comments.push(comment);
        }
    });

    res.json({
        ok: true,
        comments: comments,
        moments: comments.map(comment => {
            return moment(comment.createdAt).fromNow();
        })
    });
});

router.post('/cancel', async (req, res) => {
    const comments = await Comment.find({});

    res.json({
        ok: true,
        comments: comments,
        moments: comments.map(comment => {
            return moment(comment.createdAt).fromNow();
        })
    });
});

module.exports = router;