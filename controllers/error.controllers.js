const handle400s = ((err, request, response, next) => {
    if (err.code === '23502' || err.code === '22P02') {
        response.status(400).send({msg: 'Bad request'});
    } else if ( err.code === '23503' ){
        response.status(404).send({msg: 'Not Found'});
    } 
    else {
        next(err);
    }
})

const handleCustomErrors = ((err, request, response, next) => {
    if (err.status && err.msg) {
        response.status(err.status).send({msg: err.msg})
    } else {
        next(err);
    }
  });

module.exports = { handle400s, handleCustomErrors };