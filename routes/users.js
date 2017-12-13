var express = require('express');
var router = express.Router();

/* GET users listing. */
router.post('/signIn', function(req, res, next) {
    console.log("后端接收到请求");
    res.send({status: true});
    // res.send('respond with a resource');
});

// module.exports = {
//     items: [
//         {name: 'chyingp', password: '123456'}
//     ]
// };

module.exports = router;
