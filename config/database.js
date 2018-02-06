if(process.env.NODE_ENV ==='production')
{
	module.exports ={mongoURI:'mongodb://gyan395:Gyantosh@ds125628.mlab.com:25628/vidjot-prod'}
}
else {
	module.exports = {mongoURI:'mongodb://localhost/vidjot-dev'}
}