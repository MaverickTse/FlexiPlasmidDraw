// JavaScript Document
//Shortcut for creating svg element
function newSVG(name)
{
	return (document.createElementNS("http://www.w3.org/2000/svg",name));
}

//Random ID text generator (with quotes)
function getID()
{
	var tmp=Math.round(Math.random()*100000);
	var str="OBJ"+tmp;
	return str;
}

//Replace some special characters in user's input text to avoid breaking the SVG code
function escapeHTML(text) {
  var replacements = {"<": "&lt;", ">": "&gt;",
                      "&": "&amp;", "\"": "&quot;"};
  return text.replace(/[<>&"]/g, function(character) {
    return replacements[character];
  });
}
//if the string is a number, return true; returen false otherwise.
function isNum(txtValue)
{
return !isNaN(txtValue);
}
//Read the value of a text field without further processing
function readtxtField(ObjID)
{
var theObj=document.getElementById(ObjID);
return theObj.value;
}
//read the value of an input and convert to number if necessary
function readField(ObjID)
{
var theObj=document.getElementById(ObjID);
var tmp;
if (theObj.type=="checkbox") {tmp=theObj.checked;}
else if (isNum(theObj.value)) {tmp=parseInt(theObj.value);}
else {tmp=theObj.value;}
return tmp;
}
//Check if x>=i and x<=f
function rangecheck(x,i,f)
{
	var tmpobj={};
	tmpobj.isempty=true;
	tmpobj.out=false;
	if (x!=null)
	{
		tmpobj.isempty=false;
		if (x<i || x>f) {tmpobj.out=true;} else {tmpobj.out=false;}
	}
	else {tmpobj.isempty=true;}
	return tmpobj;
}
//Read the general settings and return as an object
function readUserInput()
{
var settings={};
//Plasmid Section
settings.plasmidname=readtxtField("txtPlasmidName");
settings.plasmidnameon=readField("bolShowPlasmidName");
settings.plasmidsize=readField("txtPlasmidSize");
settings.plasmidsizeon=readField("bolShowPlasmidSize");
settings.plasmidradius=readField("txtRadius");
settings.bbwidth=readField("txtBackBoneWidth");
settings.bbcolor=readField("optBackBoneColor");
settings.bbon=readField("bolShowBackBone");
//Feature Section (General)
settings.fwidth=readField("txtFeatureWidth");
settings.fstrokewidth=readField("txtFeatureStrokeWidth");
settings.fstrokered=readField("txtStrokeRed");
settings.fstrokegreen=readField("txtStrokeGreen");
settings.fstrokeblue=readField("txtStrokeBlue");
settings.farrowlength=readField("txtArrowHeadLength");
settings.farrowwidth=readField("txtArrowHeadWidth");
//Text section
settings.txton=readField("bolShowText");
settings.txtfamily=readField("optFontFamily");
settings.txtsize=readField("txtFontSize");
settings.txtcolor=readField("optFontColor");
settings.txtbold=readField("bolTextBold");
settings.txtloc=readField("optTextLocation");
//Canvas section
settings.cw=readField("txtCanvasWidth");
settings.ch=readField("txtCanvasHeight");
settings.error=0;
settings.errmsg="";
//Calculated properties
settings.ox=settings.cw/2;
settings.oy=settings.ch/2;
settings.ri=settings.plasmidradius-settings.fwidth/2;
settings.ro=settings.plasmidradius+settings.fwidth/2;
settings.rim=settings.plasmidradius-settings.fwidth/2-settings.farrowwidth;
settings.rom=settings.plasmidradius+settings.fwidth/2+settings.farrowwidth;
return settings;
}
//read a feature and return as object
function readFList(Findex)
{
var f0="visible"+Findex;
var f1="txtFeatureName"+Findex;
var f2="bolItalic"+Findex;
var f3="txtFeatureStart"+Findex;
var f4="txtFeatureEnd"+Findex;
var f5="bolArrowOn"+Findex;
var f6="txtFeatureRed"+Findex;
var f7="txtFeatureGreen"+Findex;
var f8="txtFeatureBlue"+Findex;
var FObj={};
FObj.visible=readField(f0);
FObj.name=readtxtField(f1); FObj.name=escapeHTML(FObj.name);
FObj.italic=readField(f2);
FObj.start=readField(f3);
FObj.end=readField(f4);
FObj.arrowon=readField(f5);
FObj.red=readField(f6);
FObj.green=readField(f7);
FObj.blue=readField(f8);
FObj.error=0;
FObj.errmsg="";
return FObj;
}
//Validate general settings
function validsettings(SObj)
{
SObj.error=0;
//Plasmid Section
if (isNum(SObj.plasmidsize)) {if (SObj.plasmidsize<=0) {SObj.errmsg+="Plasmid size must be a positive number!\n"; SObj.error=1;}}
else {SObj.errmsg+="Plasmid size must be a number!\n"; SObj.error=1;}

if (isNum(SObj.plasmidradius)) {if (SObj.plasmidradius<=0) {SObj.errmsg+="Plasmid radius must be a positive number!\n"; SObj.error=1;}}
else {SObj.errmsg+="Plasmid radius must be a number!\n";SObj.error=1;}

if (isNum(SObj.bbwidth)) {if (SObj.bbwidth<0) {SObj.errmsg+="Backbone width must be a non-negative value!"; SObj.error=1;}}
else {SObj.errmsg+="Backbone width must be a number!\n"; SObj.error=1;}

SObj.plasmidname=escapeHTML(SObj.plasmidname); //avoid introduction of xml,html or svg tags
//Feature Section (general)
if(isNum(SObj.fstrokered) && isNum(SObj.fstrokegreen) && isNum(SObj.fstrokeblue))
	{   
	var redobj=rangecheck(SObj.fstrokered,0,100);
	var greenobj=rangecheck(SObj.fstrokegreen,0,100);
	var blueobj=rangecheck(SObj.fstrokeblue,0,100);
	if (redobj.out) {SObj.errmsg+="Red color value out-of-range!Must be 0...100\n"; SObj.error=1;}
	if (greenobj.out) {SObj.errmsg+="Green color value out-of-range!Must be 0...100\n"; SObj.error=1;}
	if (blueobj.out) {SObj.errmsg+="Blue color value out-of-range!Must be 0...100\n"; SObj.error=1;}
	}
	else {SObj.errmsg+="Color codes must be numbers\n"; SObj.error=1;}
//Text Section
if (isNum(SObj.txtsize)) {if (SObj.txtsize<=0) {SObj.errmsg+="Text size must a positive number!\n"; SObj.error=1;}} 
else {SObj.errmsg+="Text size must be a number!\n"; SObj.error=1;}
//Canvas Section
if (isNum(SObj.cw) && isNum(SObj.ch))
	{
	if (SObj.cw<=0 || SObj.ch<=0) {SObj.errmsg+="Canvas dimensions must be positive numbers!\n"; SObj.error=1;}
	var maxR=SObj.plasmidradius*2+SObj.fwidth*2+SObj.farrowwidth*2;
	if (maxR>=SObj.cw || maxR>=SObj.ch) {SObj.errmsg+="Canvas too small or plasmid radius too large!\n"; SObj.error=1;}
	}
else {SObj.errmsg+="Canvas dimensions must be numbers!\n";}
return SObj;
}

function validFeature(Obj,pSize)
{
	Obj.error=0;
if (Obj.visible){
		
	if (isNum(Obj.start) && isNum(Obj.end))
	{
		var startobj=rangecheck(Obj.start,0,pSize);
		var endobj=rangecheck(Obj.end,0,pSize);
	if (startobj.out || endobj.out) {Obj.errmsg+="Feature co-ordinates out-of-range\n"; Obj.error=1;}
	}
	else {Obj.errmsg+="Feature co-ordinates must be numbers\n"; Obj.error=1;}
	
	if (isNum(Obj.red) && isNum(Obj.green) && isNum(Obj.blue))
	{
		var redobj=rangecheck(Obj.red,0,100);
		var blueobj=rangecheck(Obj.blue,0,100);
		var greenobj=rangecheck(Obj.green,0,100);
		if (redobj.out||blueobj.out||greenobj.out)
		{Obj.errmsg+="Feature color code out-of-range\n"; Obj.error=1;}
	}
	else {Obj.errmsg+="Color code must be numbers\n"; Obj.error=1;}
				}
	return Obj;
}
//Clean up all data and return error message or data object array
function Cleanup(FeatureNo)
{
  var errlog="";
  var ObjGlobal=readUserInput();
  var ObjGlobal=validsettings(ObjGlobal);
  var FArray=[];
  FArray[0]=ObjGlobal;
  var hasError=false;
  if (ObjGlobal.error) {errlog+="General settings error:\n"+ObjGlobal.errmsg; hasError=true;}  
  for (var i=1; i<=FeatureNo; i++)
  {
	  FArray[i]=validFeature(readFList(i-1), ObjGlobal.plasmidsize);
	  if (FArray[i].error) {errlog+="Feature "+i+" error: "+FArray[i].errmsg; hasError=true;}
  }
  
  if (hasError) {alert("The following errors are detected:\n"+errlog);return false;} else {return FArray;}
  
}
//Draw plasmid backbone base on general settings
function DrawCircle(SArray)
{
	var cmd=[];
	cmd[0]='<circle cx="'+SArray[0].ox+'" cy="'+SArray[0].oy+'" r="'+SArray[0].plasmidradius+
	'" style="fill:none;stroke:'+SArray[0].bbcolor+';stroke-width:'+SArray[0].bbwidth+'"/>\n';
	cmd[1]=newSVG("circle");
	cmd[1].setAttribute("cx",SArray[0].ox);
	cmd[1].setAttribute("cy",SArray[0].oy);
	cmd[1].setAttribute("r",SArray[0].plasmidradius);
	var stylePara="fill:none;stroke:"+SArray[0].bbcolor+";stroke-width:"+SArray[0].bbwidth;
	cmd[1].setAttribute("style",stylePara);
	return cmd;
}
//Draw box, n is feature no. 1-N
  function DrawBox(SArray,n)
     {
	   var p1x; var p1y;
	   var p2x; var p2y;
	   var p3x; var p3y;
	   var p4x; var p4y;
	   var S=SArray[0].plasmidsize;
	   var fillred=Math.round(SArray[n].red/100*255);
	   var fillgreen=Math.round(SArray[n].green/100*255);
	   var fillblue=Math.round(SArray[n].blue/100*255);
	   var stred=Math.round(SArray[0].fstrokered/100*255);
	   var stgreen=Math.round(SArray[0].fstrokegreen/100*255);
	   var stblue=Math.round(SArray[0].fstrokeblue/100*255);
	   var Cx=SArray[0].ox; var Cy=SArray[0].oy;
	   
	   //Direction: sense=0, antisense=1
	var sense=0;
	if (SArray[n].end<SArray[n].start) sense=1;
	//sweep: <=half: 0, >half: 1
	var sweep=0;
	if (Math.abs(SArray[n].end-SArray[n].start)/S>0.5) sweep=1;

	   var Cmd=[];
	   Cmd[1]=newSVG("path");
	   p1x=Cx+SArray[0].ro*Math.sin(SArray[n].start/S*Math.PI*2); p1y=Cy-SArray[0].ro*Math.cos(SArray[n].start/S*Math.PI*2);
	   p2x=Cx+SArray[0].ro*Math.sin(SArray[n].end/S*2*Math.PI); p2y=Cy-SArray[0].ro*Math.cos(SArray[n].end/S*2*Math.PI);
	   p3x=Cx+SArray[0].ri*Math.sin(SArray[n].end/S*2*Math.PI); p3y=Cy-SArray[0].ri*Math.cos(SArray[n].end/S*2*Math.PI);
	   p4x=Cx+SArray[0].ri*Math.sin(SArray[n].start/S*2*Math.PI); p4y=Cy-SArray[0].ri*Math.cos(SArray[n].start/S*2*Math.PI);
	   var Para="";
	   Para+='M'+p1x+","+p1y+" A"+SArray[0].ro+","+SArray[0].ro+" 0 ";
	   Cmd[0]+='<path d="M'+p1x+","+p1y+" A"+SArray[0].ro+","+SArray[0].ro+" 0 ";
	   if (sweep) {Cmd[0]+="1,";Para+="1,";} else {Cmd[0]+="0,";Para+="0,";};
   	   if (sense) {Cmd[0]+="0 ";Para+="0 ";} else {Cmd[0]+="1 ";Para+="1 ";};
	   Cmd[0]+=p2x+","+p2y; Para+=p2x+","+p2y;
	   Cmd[0]+=" L"+p3x+","+p3y; Para+=" L"+p3x+","+p3y;
	   Cmd[0]+=" A"+SArray[0].ri+","+SArray[0].ri+" 0 "; Para+=" A"+SArray[0].ri+","+SArray[0].ri+" 0 "; 
	   if (sweep) {Cmd[0]+="1,";Para+="1,";} else {Cmd[0]+="0,";Para+="0,";};
	   if (sense) {Cmd[0]+="1 ";Para+="1 ";} else {Cmd[0]+="0 ";Para+="0 ";};
	   Cmd[0]+=p4x+","+p4y; Para+=p4x+","+p4y+" z"; Cmd[1].setAttribute("d",Para);
	   Cmd[0]+=' z" '+'fill="rgb('+fillred+","+fillgreen+","+fillblue+')"'+' stroke-width="'+SArray[0].fstrokewidth+'"  stroke="rgb('+stred+","+stgreen+","+stblue+')"/> \n';
	   Para="rgb("+fillred+","+fillgreen+","+fillblue+")";
	   Cmd[1].setAttribute("fill",Para);
	   Cmd[1].setAttribute("stroke-width",SArray[0].fstrokewidth);
	   Para="rgb("+stred+","+stgreen+","+stblue+")";
	   Cmd[1].setAttribute("stroke",Para);
	   return (Cmd);
     }
//Draw arrow
  function DrawArrow(SArray, n)
  {
    var Cmd=[];
	Cmd[1]=newSVG("path");
	var Para="";
	var p1x=0; var p1y=0;
	var p2x=0; var p2y=0;
	var p3x=0; var p3y=0;
	var p4x; var p4y;
	var p5x; var p5y;
	var p6x; var p6y;
	var p7x; var p7y;
	var Cx=SArray[0].ox; var Cy=SArray[0].oy;
	var Fi=SArray[n].start; var Fe=SArray[n].end;
	var Ro=SArray[0].ro; var Ri=SArray[0].ri;
	var Rom=SArray[0].rom; var Rim=SArray[0].rim;
	var R=SArray[0].plasmidradius;
	var S=SArray[0].plasmidsize;
	var AOA=SArray[0].farrowlength/180*Math.PI;
	var fillred=Math.round(SArray[n].red/100*255);
	var fillgreen=Math.round(SArray[n].green/100*255);
	var fillblue=Math.round(SArray[n].blue/100*255);
	var stred=Math.round(SArray[0].fstrokered/100*255);
	var stgreen=Math.round(SArray[0].fstrokegreen/100*255);
	var stblue=Math.round(SArray[0].fstrokeblue/100*255);
   //Direction: sense=0, antisense=1
	var sense=0;
	if (Fe<Fi) sense=1;
	//sweep: <=half: 0, >half: 1
	var sweep=0;
	if (Math.abs(SArray[n].end-SArray[n].start)/S>0.5) sweep=1;

	//arrow direction modifier (1=clockwise, -1=anticlockwise)
	var ArrowMod=1;
	if (sense) {ArrowMod=-1;};
	//ABC
	p1x=Cx+Ro*Math.sin(Fi/S*2*(Math.PI)); p1y=Cy-Ro*Math.cos(Fi/S*(Math.PI)*2);
	p2x=Cx+Ro*Math.sin(Fe/S*2*Math.PI-AOA*ArrowMod); p2y=Cy-Ro*Math.cos(Fe/S*2*Math.PI-AOA*ArrowMod);
	p3x=Cx+Rom*Math.sin(Fe/S*2*Math.PI-AOA*ArrowMod); p3y=Cy-Rom*Math.cos(Fe/S*2*Math.PI-AOA*ArrowMod);
	//tip (D)
	p4x=Cx+R*Math.sin(Fe/S*2*Math.PI); p4y=Cy-R*Math.cos(Fe/S*2*Math.PI);
	//EFG
	p5x=Cx+Rim*Math.sin(Fe/S*2*Math.PI-AOA*ArrowMod); p5y=Cy-Rim*Math.cos(Fe/S*2*Math.PI-AOA*ArrowMod);
	p6x=Cx+Ri*Math.sin(Fe/S*2*Math.PI-AOA*ArrowMod); p6y=Cy-Ri*Math.cos(Fe/S*2*Math.PI-AOA*ArrowMod);
	p7x=Cx+Ri*Math.sin(Fi/S*2*Math.PI); p7y=Cy-Ri*Math.cos(Fi/S*2*Math.PI);
	//output command
	Cmd[0]='<path d="M'+p1x+","+p1y+" A"+Ro+","+Ro+" 0 "; Para="M"+p1x+","+p1y+" A"+Ro+","+Ro+" 0 ";
	
	if (sweep) {Cmd[0]+="1,";Para+="1,";} else {Cmd[0]+="0,";Para+="0,";};
	if (sense) {Cmd[0]+="0 ";Para+="0 ";} else {Cmd[0]+="1 ";Para+="1 ";};
	Cmd[0]+=p2x+","+p2y+" L"+p3x+","+p3y+" L"+p4x+","+p4y+" L"+p5x+","+p5y+" L"+p6x+","+p6y;
	Cmd[0]+=" A"+Ri+","+Ri+" 0 ";
	Para+=p2x+","+p2y+" L"+p3x+","+p3y+" L"+p4x+","+p4y+" L"+p5x+","+p5y+" L"+p6x+","+p6y;
	Para+=" A"+Ri+","+Ri+" 0 ";
	if (sweep) {Cmd[0]+="1,";Para+="1,";} else {Cmd[0]+="0,";Para+="0,";};
	if (sense) {Cmd[0]+="1 ";Para+="1 ";} else {Cmd[0]+="0 ";Para+="0 ";};
	Cmd[0]+=p7x+","+p7y+' z"'; 
	Para+=p7x+","+p7y+" z";
	Cmd[1].setAttribute("d",Para);
	Cmd[0]+=' fill="rgb('+fillred+","+fillgreen+","+fillblue+')"'+' stroke-width="'+SArray[0].fstrokewidth+'" stroke="rgb('+stred+","+stgreen+","+stblue+')"/> \n';
	Para="rgb("+fillred+","+fillgreen+","+fillblue+")";
	Cmd[1].setAttribute("fill",Para);
	Para="rgb("+stred+","+stgreen+","+stblue+")";
	Cmd[1].setAttribute("stroke",Para);
	Cmd[1].setAttribute("stroke-width",SArray[0].fstrokewidth);
	return (Cmd);

  }
//Draw plasmid name
function ShowPlasmidName(SArray)
{
var Ox=SArray[0].ox;
var Oy=SArray[0].oy;
var R=SArray[0].plasmidradius;
var TSize=SArray[0].txtsize;
var PName=SArray[0].plasmidname;
var fontw="normal";
if (SArray[0].txtbold) {fontw="bold";}
var fontfamily=[];
fontfamily[0]="Arial";fontfamily[1]="Times";fontfamily[2]="Courier";
var fontfill=SArray[0].txtcolor;
var Cmd=[];
Cmd[1]=newSVG("text");

//Draw plasmid name
Cmd[0]='<text x="'+Ox+'" y="'+Oy+'" text-anchor="middle" font-size="'+(TSize+4)+'px" font-family="'+fontfamily[SArray[0].txtfamily]+'"  font-weight="'+fontw+'" fill="'+fontfill+'">'+PName+"</text>\n";
Cmd[1].setAttribute("x",Ox); Cmd[1].setAttribute("y",Oy);
Cmd[1].setAttribute("text-anchor","middle");
Cmd[1].setAttribute("font-size",((TSize+4)+"px"));
Cmd[1].setAttribute("font-family",fontfamily[SArray[0].txtfamily]);
Cmd[1].setAttribute("font-weight",fontw);
Cmd[1].setAttribute("fill",fontfill);
Cmd[1].appendChild(document.createTextNode(PName));

return (Cmd);
}
//Draw plasmid size
function DrawPlasmidSize(SArray)
{
	var Ox=SArray[0].ox;
	var Oy=SArray[0].oy;
	var TSize=SArray[0].txtsize;
	var S=SArray[0].plasmidsize;
	var fontw="normal";
	if (SArray[0].txtbold) {fontw="bold";}
	var fontfamily=[];
	fontfamily[0]="Arial";fontfamily[1]="Times";fontfamily[2]="Courier";
	var fontfill=SArray[0].txtcolor;
	var Cmd=[];
    Cmd[0]='<text x="'+Ox+'" y="'+(Oy+TSize*1.5)+'" text-anchor="middle" font-size="'+(TSize+2)+'px" font-family="'+fontfamily[SArray[0].txtfamily]+'"  font-weight="'+fontw+'" fill="'+fontfill+'">'+S+"bp</text>\n";
	Cmd[1]=newSVG("text");
	Cmd[1].setAttribute("x",Ox); Cmd[1].setAttribute("y",(Oy+TSize*1.5));
	Cmd[1].setAttribute("text-anchor","middle");
	Cmd[1].setAttribute("font-size",((TSize+2)+"px"));
	Cmd[1].setAttribute("font-family",fontfamily[SArray[0].txtfamily]);
	Cmd[1].setAttribute("font-weight",fontw);
	Cmd[1].setAttribute("fill",fontfill);
	Cmd[1].appendChild(document.createTextNode((S+"bp")));
	
return (Cmd);
}

//Draw feature text
function ShowFeatureLabel(SArray,n)
{
var Ox=SArray[0].ox;
var Oy=SArray[0].oy;
var TSize=SArray[0].txtsize;
var Ro=SArray[0].ro+TSize*1.3;
var Ri=SArray[0].ri-TSize*1.3;
var Theata=(SArray[n].start+SArray[n].end)*Math.PI/SArray[0].plasmidsize;
var Tx=Ox+Ro*Math.sin(Theata);
var Ty=Oy-Ro*Math.cos(Theata);

var Txi=Ox+Ri*Math.sin(Theata);
var Tyi=Oy-Ri*Math.cos(Theata);

var fontw="normal";
if (SArray[0].txtbold) {fontw="bold";}
var fontfamily=[];
fontfamily[0]="Arial";fontfamily[1]="Times";fontfamily[2]="Courier";
var fontfill=SArray[0].txtcolor;


var Cmd=[];
//Case outside text
if (SArray[0].txtloc==0) 
{
	Cmd[1]=newSVG("text");
	Cmd[1].setAttribute("x",Tx);
	Cmd[1].setAttribute("y",Ty);
	//alert("Outside text being excuted");
Cmd[0]='<text x="'+Tx+'" y="'+Ty+'" text-anchor="';
if (Theata>0 && Theata<Math.PI) 
{Cmd[0]+='start"'; Cmd[1].setAttribute("text-anchor","start");}
else if (Theata>Math.PI && Theata<Math.PI*2) {Cmd[0]+='end"'; Cmd[1].setAttribute("text-anchor","end");}
else {Cmd[0]+='middle"';Cmd[1].setAttribute("text-anchor","middle");}
}
//Case inside text
if (SArray[0].txtloc==1)
{
	Cmd[1]=newSVG("text");
	Cmd[1].setAttribute("x",Txi);
	Cmd[1].setAttribute("y",Tyi);
	
Cmd[0]='<text x="'+Txi+'" y="'+Tyi+'" text-anchor="';
if (Theata>0 && Theata<Math.PI) 
{Cmd[0]+='end"';Cmd[1].setAttribute("text-anchor","end");}
else if (Theata>Math.PI && Theata<Math.PI*2) {Cmd[0]+='start"';Cmd[1].setAttribute("text-anchor","start");}
else {Cmd[0]+='middle"';Cmd[1].setAttribute("text-anchor","middle");}
}
//Closing text
if (SArray[0].txtloc==0 || SArray[0].txtloc==1)
{
Cmd[0]+=' font-size="'+TSize+'px" font-family="'+fontfamily[SArray[0].txtfamily]+'" font-weight="'+fontw+'" fill="'+fontfill+'" ';
Cmd[1].setAttribute("font-size",(TSize+"px"));
Cmd[1].setAttribute("font-family",fontfamily[SArray[0].txtfamily]);
Cmd[1].setAttribute("font-weight",fontw);
Cmd[1].setAttribute("fill",fontfill);
if (SArray[n].italic){ Cmd[0]+=' font-style="italic">'; Cmd[1].setAttribute("font-style","italic");}
else
{Cmd[0]+=' font-style="normal">'; Cmd[1].setAttribute("font-style","normal");}
Cmd[0]+=SArray[n].name+"</text>\n";
Cmd[1].appendChild(document.createTextNode(SArray[n].name));
}
//**************************************************************//
//Curved text
//**************************************************************//
if (SArray[0].txtloc==2)
{
var midAng=((SArray[n].start+SArray[n].end)*Math.PI)/SArray[0].plasmidsize;
var Da=1.2*0.5*SArray[n].name.length*Math.asin(0.5*TSize/SArray[0].plasmidradius);
var SAng=midAng-Da;
var EAng=midAng+Da;
	//alert("midAng="+midAng+"\nDa="+Da+"\nSAng="+SAng+"\nEAng="+EAng);
	/*
var Xi=Ox+SArray[0].plasmidradius*Math.sin(SAng);
var Yi=Oy-SArray[0].plasmidradius*Math.cos(SAng);
var Xe=Ox+SArray[0].plasmidradius*Math.sin(EAng);
var Ye=Oy-SArray[0].plasmidradius*Math.cos(EAng);
*/
//use inner radius
var vOffset=(TSize*0.8)/2;
var baseRadius=SArray[0].plasmidradius-vOffset;
var Xi=Ox+(baseRadius)*Math.sin(SAng);
var Yi=Oy-(baseRadius)*Math.cos(SAng);
var Xe=Ox+(baseRadius)*Math.sin(EAng);
var Ye=Oy-(baseRadius)*Math.cos(EAng);

//start from mid pt and use inner radius
/*
var Xi=Ox+SArray[0].ri*Math.sin(midAng/SArray[0].plasmidsize*Math.PI*2);
var Yi=Oy-SArray[0].ri*Math.cos(midAng/SArray[0].plasmidsize*Math.PI*2);
var Xe=Ox+SArray[0].ri*Math.sin(SArray[n].end/SArray[0].plasmidsize*Math.PI*2);
var Ye=Oy-SArray[0].ri*Math.cos(SArray[n].end/SArray[0].plasmidsize*Math.PI*2);
*/
	   //Direction: sense=0, antisense=1
	var sense=0;
	//if (SArray[n].end<SArray[n].start) sense=1;
	//sweep: <=half: 0, >half: 1
	var sweep=0;
	if (Math.abs(SAng-EAng)>Math.PI) sweep=1;
var defsobj=newSVG("defs");
var pathobj=newSVG("path");
var txtpathobj=newSVG("textPath");
var Para="";
var objid=getID();
Cmd[1]=newSVG("text");
Cmd[0]='<defs>\n <path id="'+objid+'" d="M'+Xi+","+Yi+"A"+baseRadius+","+baseRadius+" 0 ";

Para="M"+Xi+","+Yi+" A "+baseRadius+","+baseRadius+" 0 ";
	   if (sweep) {Cmd[0]+="1,";Para+="1,";} else {Cmd[0]+="0,";Para+="0,";};
   	   if (sense) {Cmd[0]+="0 ";Para+="0 ";} else {Cmd[0]+="1 ";Para+="1 ";};
	   Cmd[0]+=Xe+","+Ye+'" />\n</defs>\n';
	   Para+=Xe+","+Ye;
	   pathobj.setAttribute("id",objid);
	   pathobj.setAttribute("d",Para);
	   pathobj.setAttribute("stroke","0");
	   defsobj.appendChild(pathobj);
	   Cmd[2]=defsobj;
Cmd[0]+='<text text-anchor="start" font-size="'+TSize+'px" font-family="'+fontfamily[SArray[0].txtfamily]+'" font-weight="'+fontw+'" fill="'+fontfill+'"';
Cmd[1].setAttribute("font-size",(TSize+"px"));
Cmd[1].setAttribute("font-family",fontfamily[SArray[0].txtfamily]);
Cmd[1].setAttribute("font-weight",fontw);
Cmd[1].setAttribute("fill",fontfill);
Cmd[1].setAttribute("text-anchor","start");


if (SArray[n].italic){ Cmd[0]+=' font-style="italic">';Cmd[1].setAttribute("font-style","italic");}
else
{Cmd[0]+=' font-style="normal">';Cmd[1].setAttribute("font-style","normal");}

Cmd[0]+='\n<textPath xlink:href="#'+objid+'">'+SArray[n].name+'</textPath>\n</text>\n';
//txtpathobj.setAttribute("xlink:href",objid);
txtpathobj.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', "#"+objid);
txtpathobj.appendChild(document.createTextNode(SArray[n].name));
Cmd[1].appendChild(txtpathobj);

}
return (Cmd);

}
//Preview function
/*
function preview(code)
{
var svgNode=document.createElement("svg");
svgNode.setAttribute("xmlns","http://www.w3.org/2000/svg","version","1.1","xmlns:xlink","http://www.w3.org/1999/xlink","width","400px","height","400px");
var sqNode=document.createElement("circle");
sqNode.setAttribute("cx","200","cy","200","r","50","style","fill:red");
svgNode.appendChild(sqNode);
var preNode=document.getElementById("PreviewArea");
preNode.appendChild(svgNode);

}
*/
//Main Drawing function, mode 0 is draw new graph, mode 1 is append
function main(mode)
{
	var code="";
	var Result;
	var svgout=document.createElementNS("http://www.w3.org/2000/svg","svg");
	
	
	
		Inobj=Cleanup(10);
		var svgheader='<?xml version="1.0" standalone="no"?> \n<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">\n<svg xmlns="http://www.w3.org/2000/svg" version="1.1" xmlns:xlink="http://www.w3.org/1999/xlink" width="'+Inobj[0].cw+'px" height="'+Inobj[0].ch+'px"> \n';
		if (Inobj != false)
		{
			var pretext=document.getElementById("SVGCode");
			var picobj=document.getElementById("pic");
			if (mode==0) 
			{
				code=svgheader;
				
				//var oldsvg=document.getElementById("pic");
				svgout.setAttribute("xmlns:xlink","http://www.w3.org/1999/xlink");
				svgout.setAttribute("width",(Inobj[0].cw+"px"));
				svgout.setAttribute("height",(Inobj[0].ch+"px"));
				svgout.setAttribute("version","1.1");
				svgout.setAttribute("style","display:inline");
				svgout.setAttribute("id","pic");
			} //mode 1 action
			else //mode 2 action
			{				
				code=pretext.value;
				code=code.substring(0,(code.length-6));
				var oldsvg=document.getElementById("pic");
				svgout=oldsvg;
			}
			
			if (Inobj[0].bbon) 
				{
					Result=DrawCircle(Inobj);
					code+=Result[0];
					svgout.appendChild(Result[1]);
				} //draw backbone
			for (var i=1;i<Inobj.length;i++) //draw features
			{
				if (Inobj[i].visible) 
				{if (Inobj[i].arrowon) 
					{
						Result=DrawArrow(Inobj,i);
						code+=Result[0];
						svgout.appendChild(Result[1]);
					} 
					else 
					{
						Result=DrawBox(Inobj,i);
						code+=Result[0];
						svgout.appendChild(Result[1]);
					}
				}
			}
			if (Inobj[0].txton)
			{
				if(Inobj[0].plasmidnameon) 
				{
					Result=ShowPlasmidName(Inobj);
					code+=Result[0];
					svgout.appendChild(Result[1]);
				}
				if(Inobj[0].plasmidsizeon) 
				{
					Result=DrawPlasmidSize(Inobj);
					code+=Result[0];
					svgout.appendChild(Result[1]);
				}
				for (var j=1;j<Inobj.length;j++)
				{
					if(Inobj[j].visible) 
					{
						Result=ShowFeatureLabel(Inobj,j);
						code+=Result[0];
						if (Result.length==2) {svgout.appendChild(Result[1]);}
						else
						{
							svgout.appendChild(Result[2]);
							svgout.appendChild(Result[1]); 
							
						}
					}
				}
			}
			code+="</svg>";
			pretext.value=code;
			picobj.parentNode.replaceChild(svgout,picobj);
			//alert(svgout.childNodes[5].nodeName+" has childs: "+svgout.childNodes[5].childNodes.length);
			//alert(svgout.childNodes[5].firstChild.nodeName);
			//alert("the ref link: "+svgout.childNodes[5].firstChild.getAttribute("xlink:href"));
			//alert(svgout.childNodes[5].firstChild.firstChild.nodeValue);
			
			
		}
}
	
//Temporary test function
/*
function testme()
{
  var FeatureNo=10;
  var outStr="";
  var ObjGlobal=readUserInput();
  var ObjGlobal=validsettings(ObjGlobal);
  var FArray=[];
  for (var i=0; i<FeatureNo; i++)
  {
	  FArray[i]=validFeature(readFList(i), ObjGlobal.plasmidsize);
	  if (FArray[i].error) {alert("Feature "+i+" error:\n"+FArray[i].errmsg);} else {alert("Feature "+i+" is fine");}
  }
  if (ObjGlobal.error) {alert("General settings error:\n"+ObjGlobal.errmsg);} else {alert("Global setting is fine");}
  
  
}
*/
