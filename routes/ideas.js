const express=require('express');
const mongoose=require('mongoose');
const router=express.Router();
const {ensureAuthenticated}=require('../helpers/auth');

//load Idea model
 

//load idea model
require('../models/Idea');
const Idea=mongoose.model('ideas');  



//Add Idea Form

router.get('/add',ensureAuthenticated,(req,res)=>
{
	res.render('ideas/add');
});
// add edit form
router.get('/edit/:id',ensureAuthenticated, (req,res)=>
{
	Idea.findOne({
		_id:req.params.id
	})
	.then(idea=>{
		if(idea.user!=req.user.id){
			rq.flash('error_msg','Not Authorized');
			res.redirect('/ideas');
		}else{
				res.render('ideas/edit',{
		idea:idea
	});

		}

	});

});

//Add Index page
router.get('/',ensureAuthenticated,(req,res)=>{
	Idea.find({user: req.user.id})
	.sort({date:'desc'})
	.then(ideas=>{
     res.render('ideas/index',{
     	ideas:ideas
     });
	});
	
} )

// process form
router.post('/',ensureAuthenticated,(req,res)=>{
	let errors=[];
	if(!req.body.title)
	{
		errors.push({text:'Please add a title'});
	}
	if(!req.body.details)
	{
		errors.push({text:'Please add details'});
	}
	if(errors.length>0)
	{
		res.render('ideas/add',{
			errors: errors,
	 		title:req.body.title,
			details:req.body.details
		});
	}
	else
	{
		const newUser={
			title:req.body.title,
			details:req.body.details,
			user:req.user.id
		}
		new Idea(newUser)
		.save()
		.then(idea =>{
					req.flash('sucess_msg','video idea added');
			res.redirect('/ideas');
		})
	}
});
//update edit form
router.put('/:id',ensureAuthenticated,(req,res)=>{
  Idea.findOne({
	_id:req.params.id
})
.then(idea =>{
	//New values
	idea.title=req.body.title;
	idea.details=req.body.details
	
	idea.save()
	.then(idea=>{
				req.flash('sucess_msg','video idea updated');
		res.redirect('/ideas');  
	})
})
});
//delete Idea form
router.delete('/:id',ensureAuthenticated,(req,res)=>{
	//res.send('DELETE');
	Idea.remove({_id:req.params.id})
	.then(()=> {
		req.flash('sucess_msg','video idea removed');
		res.redirect('/ideas');
	});
});




module.exports=router;