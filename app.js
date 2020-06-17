const exp=require("express"),
	app=exp(),
	bp=require("body-parser"),
	https=require("https"),
	date=require(__dirname+"/date.js")

app.set("view engine","ejs");
app.use(bp.urlencoded({extended:true}));
app.use(exp.static("public"));

let items=[];	
let workItems=[];

app.get("/",function(req,res)
{
	let day=date.getDate();
	res.render("list",{listTitle:day,newListItems:items});
});
app.get("/work",function(req,res)
{ 
	res.render("list",{listTitle:"Work",newListItems:workItems});
});


app.post("/",function (req,res) 
{	
	if(req.body.list==="Work")
	{
		workItems.push(req.body.newItem);
		res.redirect("/work");	
	}

	else
	{
		items.push(req.body.newItem);
		res.redirect("/");	
	}
});

app.listen(3000,function(){console.log("server on port 3000");});