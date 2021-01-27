exports.getLogin = (req,res)=> {
	res.status(200).render('login', {
        title: 'Adeel Please Login'
    });
}
