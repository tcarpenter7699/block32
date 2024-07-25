// imports here for express and pg
const express = require("express");
const router = express.Router();
const pg = require('pg');

const client = new pg.Client('postgres://localhost/flavors');
client.connect()

router.use(express.json())
// static routes here (you only need these for deployment)
router.get('/', async(req, res, next)=>{
    try{
        const response = await client.query(`SELECT * FROM flavors ORDER BY id ASC`);
        res.send(response.rows)
    }catch(err){
        next(err)
    }

})

// grab flavor by id
router.get('/:id', async(req, res, next)=>{
    try{
        const response = await client.query(`SELECT * FROM flavors WHERE id = $1`, [req.params.id]);
        res.send(response.rows[0])
    }catch(err){
        next(err)
    }
})

// add flavor
router.post('/', async(req, res, next)=>{
    try{
        const response = await client.query(`INSERT INTO flavors(name, is_favorite) VALUES($1, $2)`,
            [req.body.name, req.body.is_favorite]);
        res.send({
            name: req.body.name,
            is_favorite: req.body.is_favorite
        })
        console.log("req HERE", req.body)
    }catch(err){
        next(err)
    }
})

// delete flavor
router.delete("/:id", async(req,res,next)=>{
    try{
        const response = await client.query(`DELETE from flavors WHERE id = $1`, [Number(req.params.id)])
        res.send({
            id:req.params.id
        }).sendStatus(204)
    }catch(err){
        next(err)
    }

})

//  update flavor
router.put("/:id", async(req,res,next)=>{
    try{
       const response = await client.query(`UPDATE flavors SET name=$1, is_favorite=$2 WHERE id=$3 RETURNING *`,
           [req.body.name, Number(req.body.is_favorite), Number(req.params.id) ]);
       res.send(response.rows[0])
    }catch(err){
        next(err)
    }
})

module.exports = router;