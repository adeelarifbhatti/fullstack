const tryCatch = require('./../lib/tryCatch');
const catchError = require('./../lib/appErrors');

exports.deleteOne = Model => tryCatch(async (req,res,next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);
    if(!doc){
        return next(new catchError('no Document was found', 404));
    }
    res.status(204).json({
    status: 'success',
    data: {
        data: null
    }
    });
});