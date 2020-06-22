const exp=require("express"),
app=exp(),
bp=require("body-parser"),
https=require("https"),
date=require(__dirname+"/date.js"),
mongoose=require("mongoose");

app.set("view engine","ejs");
app.use(bp.urlencoded({extended:true}));
app.use(exp.static("public"));
mongoose.connect("mongodb://localhost:27017/todolistDB",{ useNewUrlParser: true , useUnifiedTopology: true, useFindAndModify: false });

const itemSchema={
	name:String
},
today="Today",
Item=mongoose.model("Item",itemSchema),

item1=new Item({name:"Get Up"}),
item2=new Item({name:"Look at this list"}),
item3=new Item({name:"Get Ready to work"}),
defaultItems=[item1,item2,item3],
listSchema=
{
	name:String,
	items:[itemSchema]
},
List=mongoose.model("List",listSchema);

app.get("/",function(req,res)
{

	Item.find({},function(err,items) 
	{
		if(items.length===0)
		{
			Item.insertMany(defaultItems,function (err) {
				if(err)
				{
					console.log(err);
				} 
			});
			res.redirect("/");
		}
		else
		{res.render("list",{listTitle:today,newListItems:items});}
		
	})
	
});

app.get("/:pageName",function(req,res) {
    const pname=req.params.pageName;
	List.findOne({name:pname},function(err,foundList) {
		if(!err)
		{
			if(!foundList)
			{
				const list = new List({name:pname,items:defaultItems});
				list.save();
				console.log("New list");
				res.redirect("/"+pname);
			}
			else
			{
				res.render("list",{listTitle:foundList.name,newListItems:foundList.items});
				console.log("Old list");
			}
		}
	});
});





app.post("/",function (req,res) 
{	
	const item = new Item({name:req.body.newItem});
	if(req.body.list===today)
	{
		item.save();
		res.redirect("/");
	}

	else
	{
		List.findOne({name:req.body.list},function(err,foundList) {
		if(!err)
		{
			foundList.items.push(item);
			foundList.save();
			console.log("redirecting");
			res.redirect("/"+foundList.name);
		}
	});
	}
	
});

app.post("/delete",function(req,res) {
	if(req.body.listName===today)
	{
		console.log("Simple");
		Item.findByIdAndDelete(req.body.checkStatus,function(err) {
			if(!err){
				console.log("Deleted");
				res.redirect("/");
			}});
	}

	else
	{
		console.log("Complex");
		List.findOneAndUpdate({name:req.body.listName},{$pull:{items:{_id:req.body.checkStatus}}},function(err,foundList){
			if(!err)
			{
				res.redirect("/"+req.body.listName);
			}
		});
		
	}
});

app.listen(3000,function(){console.log("server on port 3000");});