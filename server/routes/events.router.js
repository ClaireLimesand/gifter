const express = require('express');
const pool = require('../modules/pool');
const router = express.Router();
const {
    rejectUnauthenticated,
    } = require('../modules/authentication-middleware');

    // POST to add a new event 

    // SELECT * FROM "events"
    // WHERE "user_id"=$1
    // AND event_date > CURRENT_DATE
    // ORDER BY "event_date" ASC;

    router.get('/', rejectUnauthenticated, (req, res) => {
        console.log('in GET events server', req.user);
        
        const sqlQuery = `
        SELECT 
            "events"."event_name",
            TO_CHAR("event_date",'MM-DD-YYYY') AS "event_date", 
            "events"."event_id",
            "events"."freind_id",
            "friends"."name"
        FROM "events" 
            LEFT JOIN "friends"
            ON "events"."freind_id"="friends"."id"
        WHERE "events"."user_id"=$1
        AND event_date > CURRENT_DATE
            ORDER BY "event_date" ASC;
        `;
        const sqlValues = [req.user.id];
        pool.query(sqlQuery, sqlValues)
        .then((dbRes) => {
            console.log('dbrows', dbRes.rows)
            res.send(dbRes.rows);
        })
        .catch((dbErr) => {
            res.sendStatus(500);
        })
    });

    router.post('/', rejectUnauthenticated, (req, res) => {
        console.log('in POST events server', req.user.id);
        const newEvent = req.body;
        console.log('server newEvent', newEvent)
    
        const sqlQuery = `
        INSERT INTO "events" ("event_name", "event_date", "freind_id", "user_id")
        VALUES ($1, $2, $3, $4)
    `;
        const sqlValues = [
            newEvent.event,
            newEvent.date,
            newEvent.friend_id,
            req.user.id
        ]
        
        pool.query(sqlQuery, sqlValues)
            .then((dbRes) => {
                res.sendStatus(201);
            })
            .catch((dbErr) => {
                console.error('POST events error', dbErr);
                res.sendStatus(500);
            })
    });

    router.delete('/:id', rejectUnauthenticated, (req, res) => {
        console.log('in deleteEvent server', req.params.id)

        const sqlQuery = `
        DELETE FROM "events" 
            WHERE "event_id"=$1;
        `;

        const sqlValues = [
            req.params.id
        ]

        pool.query(sqlQuery, sqlValues)
            .then((dbRes) => {
                res.sendStatus(201);
            })
            .catch((dbErr) => {
                console.error('DELETE events error', dbErr);
                res.sendStatus(500);
            })
    });

    router.get('/:id', rejectUnauthenticated, (req, res) => {
        console.log('in GET friends server', req.user);
        
        const sqlQuery = `
            SELECT * FROM "events"
                WHERE "event_id"=$1
        `;
        const SqlValues = [
            req.params.id
        ];
        pool.query(sqlQuery, SqlValues)
        .then((dbRes) => {
            res.send(dbRes.rows[0]);
        })
        .catch((dbErr) => {
            res.sendStatus(500);
        })
    });

    router.put('/:id', (req, res) => {
        const sqlText = `
            UPDATE events
                SET 
                    event_name = $1,
                    event_date = $2
                WHERE event_id = $3;
        `;
        const sqlValues = [
            req.body.name,
            req.body.date,
            req.params.id
        ];

        pool.query(sqlText, sqlValues)
            .then((dbRes) => {
                res.sendStatus(200);
            })
            .catch((dbErr) => {
                console.log('PUT events error', dbErr);
                res.sendStatus(500);
            })
    });
    

    
    module.exports = router;