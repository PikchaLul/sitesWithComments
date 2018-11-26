const express = require('express');
const router = express.Router();
const moment = require('moment');

moment.locale('ru');

const Comment = require('../models/comment');

function getCompareFunctionForDate(req){
    return req.body.upperDate ?
        (a, b) => -(a.createdAt - b.createdAt)
        : (a, b) => a.createdAt - b.createdAt;
}

function getCompareFunctionForLenText(req){
    return req.body.upperLen ?
        (a, b) => a.body.length - b.body.length
        : (a, b) =>-(a.body.length - b.body.length);
}


// POST is add
router.post('/sortToDate', async (req, res) => {
    try{
        const comments = await Comment.find({});

        if(req.body.upperDate !== req.body.lowerDate){
            comments.sort(getCompareFunctionForDate(req));

            res.json({
                ok: true,
                comments: comments,
                moments: comments.map(comment => {
                    return moment(comment.createdAt).fromNow();
                })
            });
        }else{
            res.json({
                ok: false,
                error: 'Неправильно заполнены checkbox'
            });
        }
    }catch (error) {
        res.json({
            ok: false
        });
    }
});

router.post('/sortToLenText', async (req, res) => {
    try{
        const comments = await Comment.find({});

        if(req.body.upperLen !== req.body.lowerLen){
            comments.sort(getCompareFunctionForLenText(req));

            res.json({
                ok: true,
                comments: comments,
                moments: comments.map(comment => {
                    return moment(comment.createdAt).fromNow();
                })
            });
        }else{
            res.json({
                ok: false,
                error: 'Неправильно заполнены checkbox'
            });
        }
    }catch (error) {
        console.log('Ошибка');
        res.json({
            ok: false
        });
    }
});

router.post('/sortCombine', async (req, res) => {
    try{
        if(req.body.upperDate !== req.body.lowerDate && req.body.upperLen !== req.body.lowerLen){
            let comments = await Comment.find({});

            comments.sort(getCompareFunctionForDate(req));

            const arr = comments.reduce((spCom, comment) => {
                if (spCom.length === 0) {
                    spCom.push([]);
                    spCom[spCom.length - 1].push(comment);
                } else if (moment(spCom[spCom.length - 1][0].createdAt).fromNow()
                    !== moment(comment.createdAt).fromNow()) {
                    spCom.push([]);
                    spCom[spCom.length - 1].push(comment);
                } else
                    spCom[spCom.length - 1].push(comment);
                return spCom;
            }, []);

            arr.forEach(item =>{
                item.sort(getCompareFunctionForLenText(req));
            });

            comments = [];

            arr.forEach(item =>{
                item.forEach(it =>{
                    comments.push(it);
                });
            });

            res.json({
                ok: true,
                comments: comments,
                moments: comments.map(comment => {
                    return moment(comment.createdAt).fromNow();
                })
            });
        }else{
            res.json({
                ok: false,
                error: 'Неправильно заполнены checkbox'
            });
        }
    }catch (error) {
        console.log(error);
        res.json({
            ok: false
        });
    }
});

module.exports = router;