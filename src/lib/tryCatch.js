module.exports = trycatch => {
	return (req, res, next) => { 
		trycatch(req,res,next).catch(next);
	}
}