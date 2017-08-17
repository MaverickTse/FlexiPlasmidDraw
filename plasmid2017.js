// JavaScript Document
//Shortcut for creating svg element
function newSVG(name) {
	return (document.createElementNS("http://www.w3.org/2000/svg", name));
}

//Random ID text generator (with quotes)
function getID() {
	var tmp = Math.round(Math.random() * 100000);
	var str = "OBJ" + tmp;
	return str;
}
//Estimate SVG text render length
function svg_estimate(txt, fontsize, family, weight, style) {
	var svgns = "http://www.w3.org/2000/svg";
	var svg = document.createElementNS(svgns, "svg");
	var gnode = document.createElementNS(svgns, "g");
	var tnode = document.createElementNS(svgns, "text");
	var tmsg = document.createTextNode(txt);
	tnode.setAttribute("font-size", fontsize);
	tnode.setAttribute("font-family", family);
	tnode.setAttribute("font-weight", weight);
	tnode.setAttribute("font-style", style);
	tnode.setAttribute("x", 50);
	tnode.setAttribute("y", 50);
	tnode.appendChild(tmsg);
	gnode.appendChild(tnode);
	svg.appendChild(gnode);
	document.body.appendChild(svg);
	var dim = tnode.getBBox();
	svg.remove();
	return dim;
}
//Replace some special characters in user's input text to avoid breaking the SVG code
function escapeHTML(text) {
	var replacements = {
		"<": "&lt;",
		">": "&gt;",
		"&": "&amp;",
		"\"": "&quot;"
	};
	return text.replace(/[<>&"]/g, function (character) {
		return replacements[character];
	});
}
//if the string is a number, return true; returen false otherwise.
function isNum(txtValue) {
	return !isNaN(txtValue);
}

//read the value of an input and convert to number if necessary
function readField(ObjID) {
	var theObj = document.getElementById(ObjID);
	var tmp;
	if (theObj.type == "checkbox") {
		tmp = theObj.checked;
	} else {
		tmp = theObj.value;
	}
	return tmp;
}
//Check if x>=i and x<=f
function rangecheck(x, i, f) {
	var tmpobj = {};
	tmpobj.isempty = true;
	tmpobj.out = false;
	if (x != null) {
		tmpobj.isempty = false;
		if (x < i || x > f) {
			tmpobj.out = true;
		} else {
			tmpobj.out = false;
		}
	} else {
		tmpobj.isempty = true;
	}
	return tmpobj;
}
//Read the general settings and return as an object
function readUserInput() {
	var settings = {};
	//Plasmid Section
	settings.plasmidname = readField("txtPlasmidName");
	settings.plasmidnameon = readField("bolShowPlasmidName");
	settings.plasmidsize = parseInt(readField("txtPlasmidSize"));
	settings.plasmidsizeon = readField("bolShowPlasmidSize");
	settings.plasmidradius = parseInt(readField("txtRadius"));
	settings.bbwidth = parseInt(readField("txtBackBoneWidth"));
	settings.bbcolor = readField("colBackbone");
	settings.bbon = readField("bolShowBackBone");
	//Feature Section (General)
	settings.fwidth = parseInt(readField("txtFeatureWidth"));
	settings.fstrokewidth = parseInt(readField("txtFeatureStrokeWidth"));
	settings.fstrokecolor = readField("colFeatureStroke");
	settings.farrowlength = parseInt(readField("txtArrowHeadLength"));
	settings.farrowwidth = parseInt(readField("txtArrowHeadWidth"));
	//Text section
	settings.txton = readField("bolShowText");
	settings.txtfamily = readField("optFontFamily");
	settings.txtsize = parseInt(readField("txtFontSize"));
	settings.txtcolor = readField("colFont");
	settings.txtbold = readField("bolTextBold");
	settings.txtloc = readField("optTextLocation");
	//Canvas section
	settings.cw = parseInt(readField("txtCanvasWidth"));
	settings.ch = parseInt(readField("txtCanvasHeight"));
	settings.error = 0;
	settings.errmsg = "";
	//Calculated properties
	settings.ox = settings.cw / 2;
	settings.oy = settings.ch / 2;
	settings.ri = settings.plasmidradius - settings.fwidth / 2;
	settings.ro = settings.plasmidradius + settings.fwidth / 2;
	settings.rim = settings.plasmidradius - settings.fwidth / 2 - settings.farrowwidth;
	settings.rom = settings.plasmidradius + settings.fwidth / 2 + settings.farrowwidth;
	return settings;
}
//read a feature and return as object
function readFList(Findex) {
	var padded_idx = ("00"+Findex).slice(-2);
	var f0 = "visible" + padded_idx;
	var f1 = "txtFeatureName" + padded_idx;
	var f2 = "bolItalic" + padded_idx;
	var f3 = "txtFeatureStart" + padded_idx;
	var f4 = "txtFeatureEnd" + padded_idx;
	var f5 = "bolArrowOn" + padded_idx;
	var f6 = "colFeature" + padded_idx;

	var FObj = {};
	FObj.visible = readField(f0);
	//FObj.name = readField(f1);
	FObj.name = escapeHTML(readField(f1));
	//FObj.name = escapeHTML(FObj.name);
	FObj.italic = readField(f2);
	FObj.start = parseInt(readField(f3));
	FObj.end = parseInt(readField(f4));
	FObj.arrowon = readField(f5);
	FObj.color = readField(f6);
	FObj.error = 0;
	FObj.errmsg = "";
	return FObj;
}


//Clean up all data and return error message or data object array
function Cleanup(FeatureNo) {
	var ObjGlobal = readUserInput();
	var FArray = [];
	FArray[0] = ObjGlobal;
	
	for (var i = 1; i <= FeatureNo; i++) {
		FArray[i] = readFList(i - 1);
	}
	return FArray;
}
//Draw plasmid backbone base on general settings
function DrawCircle(SArray) {
	var cmd = [];
	cmd[0] = '<circle cx="' + SArray[0].ox + '" cy="' + SArray[0].oy + '" r="' + SArray[0].plasmidradius +
		'" style="fill:none;stroke:' + SArray[0].bbcolor + ';stroke-width:' + SArray[0].bbwidth + '"/>\n';
	cmd[1] = newSVG("circle");
	cmd[1].setAttribute("cx", SArray[0].ox);
	cmd[1].setAttribute("cy", SArray[0].oy);
	cmd[1].setAttribute("r", SArray[0].plasmidradius);
	var stylePara = "fill:none;stroke:" + SArray[0].bbcolor + ";stroke-width:" + SArray[0].bbwidth;
	cmd[1].setAttribute("style", stylePara);
	return cmd;
}
//Draw box, n is feature no. 1-N
function DrawBox(SArray, n) {
	var p1x;
	var p1y;
	var p2x;
	var p2y;
	var p3x;
	var p3y;
	var p4x;
	var p4y;
	var S = SArray[0].plasmidsize;
	var fillcolor = SArray[n].color;
	//var fillred = Math.round(SArray[n].red / 100 * 255);
	//var fillgreen = Math.round(SArray[n].green / 100 * 255);
	//var fillblue = Math.round(SArray[n].blue / 100 * 255);
	var stcolor = SArray[0].fstrokecolor;
	//var stred = Math.round(SArray[0].fstrokered / 100 * 255);
	//var stgreen = Math.round(SArray[0].fstrokegreen / 100 * 255);
	//var stblue = Math.round(SArray[0].fstrokeblue / 100 * 255);
	var Cx = SArray[0].ox;
	var Cy = SArray[0].oy;

	//Direction: sense=0, antisense=1
	var sense = 0;
	if (SArray[n].end < SArray[n].start) sense = 1;
	//sweep: <=half: 0, >half: 1
	var sweep = 0;
	if (Math.abs(SArray[n].end - SArray[n].start) / S > 0.5) sweep = 1;

	var Cmd = [];
	Cmd[1] = newSVG("path");
	p1x = Cx + SArray[0].ro * Math.sin(SArray[n].start / S * Math.PI * 2);
	p1y = Cy - SArray[0].ro * Math.cos(SArray[n].start / S * Math.PI * 2);
	p2x = Cx + SArray[0].ro * Math.sin(SArray[n].end / S * 2 * Math.PI);
	p2y = Cy - SArray[0].ro * Math.cos(SArray[n].end / S * 2 * Math.PI);
	p3x = Cx + SArray[0].ri * Math.sin(SArray[n].end / S * 2 * Math.PI);
	p3y = Cy - SArray[0].ri * Math.cos(SArray[n].end / S * 2 * Math.PI);
	p4x = Cx + SArray[0].ri * Math.sin(SArray[n].start / S * 2 * Math.PI);
	p4y = Cy - SArray[0].ri * Math.cos(SArray[n].start / S * 2 * Math.PI);
	var Para = "";
	Para += 'M' + p1x + "," + p1y + " A" + SArray[0].ro + "," + SArray[0].ro + " 0 ";
	Cmd[0] += '<path d="M' + p1x + "," + p1y + " A" + SArray[0].ro + "," + SArray[0].ro + " 0 ";
	if (sweep) {
		Cmd[0] += "1,";
		Para += "1,";
	} else {
		Cmd[0] += "0,";
		Para += "0,";
	};
	if (sense) {
		Cmd[0] += "0 ";
		Para += "0 ";
	} else {
		Cmd[0] += "1 ";
		Para += "1 ";
	};
	Cmd[0] += p2x + "," + p2y;
	Para += p2x + "," + p2y;
	Cmd[0] += " L" + p3x + "," + p3y;
	Para += " L" + p3x + "," + p3y;
	Cmd[0] += " A" + SArray[0].ri + "," + SArray[0].ri + " 0 ";
	Para += " A" + SArray[0].ri + "," + SArray[0].ri + " 0 ";
	if (sweep) {
		Cmd[0] += "1,";
		Para += "1,";
	} else {
		Cmd[0] += "0,";
		Para += "0,";
	};
	if (sense) {
		Cmd[0] += "1 ";
		Para += "1 ";
	} else {
		Cmd[0] += "0 ";
		Para += "0 ";
	};
	Cmd[0] += p4x + "," + p4y;
	Para += p4x + "," + p4y + " z";
	Cmd[1].setAttribute("d", Para);
	Cmd[0] += ' z" ' + 'fill=' + fillcolor + ' stroke-width="' + SArray[0].fstrokewidth + '"  stroke="' + stcolor + '"/> \n';
	Para = fillcolor;
	Cmd[1].setAttribute("fill", Para);
	Cmd[1].setAttribute("stroke-width", SArray[0].fstrokewidth);
	Para = stcolor;
	Cmd[1].setAttribute("stroke", Para);
	return (Cmd);
}
//Draw arrow
function DrawArrow(SArray, n) {
	var Cmd = [];
	Cmd[1] = newSVG("path");
	var Para = "";
	var p1x = 0;
	var p1y = 0;
	var p2x = 0;
	var p2y = 0;
	var p3x = 0;
	var p3y = 0;
	var p4x;
	var p4y;
	var p5x;
	var p5y;
	var p6x;
	var p6y;
	var p7x;
	var p7y;
	var Cx = SArray[0].ox;
	var Cy = SArray[0].oy;
	var Fi = SArray[n].start;
	var Fe = SArray[n].end;
	var Ro = SArray[0].ro;
	var Ri = SArray[0].ri;
	var Rom = SArray[0].rom;
	var Rim = SArray[0].rim;
	var R = SArray[0].plasmidradius;
	var S = SArray[0].plasmidsize;
	var AOA = SArray[0].farrowlength / 180 * Math.PI;
	var fillcolor = SArray[n].color;
	//var fillred = Math.round(SArray[n].red / 100 * 255);
	//var fillgreen = Math.round(SArray[n].green / 100 * 255);
	//var fillblue = Math.round(SArray[n].blue / 100 * 255);
	var stcolor = SArray[0].color;
	//var stred = Math.round(SArray[0].fstrokered / 100 * 255);
	//var stgreen = Math.round(SArray[0].fstrokegreen / 100 * 255);
	//var stblue = Math.round(SArray[0].fstrokeblue / 100 * 255);
	//Direction: sense=0, antisense=1
	var sense = 0;
	if (Fe < Fi) sense = 1;
	//sweep: <=half: 0, >half: 1
	var sweep = 0;
	if (Math.abs(SArray[n].end - SArray[n].start) / S > 0.5) sweep = 1;

	//arrow direction modifier (1=clockwise, -1=anticlockwise)
	var ArrowMod = 1;
	if (sense) {
		ArrowMod = -1;
	};
	//ABC
	p1x = Cx + Ro * Math.sin(Fi / S * 2 * (Math.PI));
	p1y = Cy - Ro * Math.cos(Fi / S * (Math.PI) * 2);
	p2x = Cx + Ro * Math.sin(Fe / S * 2 * Math.PI - AOA * ArrowMod);
	p2y = Cy - Ro * Math.cos(Fe / S * 2 * Math.PI - AOA * ArrowMod);
	p3x = Cx + Rom * Math.sin(Fe / S * 2 * Math.PI - AOA * ArrowMod);
	p3y = Cy - Rom * Math.cos(Fe / S * 2 * Math.PI - AOA * ArrowMod);
	//tip (D)
	p4x = Cx + R * Math.sin(Fe / S * 2 * Math.PI);
	p4y = Cy - R * Math.cos(Fe / S * 2 * Math.PI);
	//EFG
	p5x = Cx + Rim * Math.sin(Fe / S * 2 * Math.PI - AOA * ArrowMod);
	p5y = Cy - Rim * Math.cos(Fe / S * 2 * Math.PI - AOA * ArrowMod);
	p6x = Cx + Ri * Math.sin(Fe / S * 2 * Math.PI - AOA * ArrowMod);
	p6y = Cy - Ri * Math.cos(Fe / S * 2 * Math.PI - AOA * ArrowMod);
	p7x = Cx + Ri * Math.sin(Fi / S * 2 * Math.PI);
	p7y = Cy - Ri * Math.cos(Fi / S * 2 * Math.PI);
	//output command
	Cmd[0] = '<path d="M' + p1x + "," + p1y + " A" + Ro + "," + Ro + " 0 ";
	Para = "M" + p1x + "," + p1y + " A" + Ro + "," + Ro + " 0 ";

	if (sweep) {
		Cmd[0] += "1,";
		Para += "1,";
	} else {
		Cmd[0] += "0,";
		Para += "0,";
	};
	if (sense) {
		Cmd[0] += "0 ";
		Para += "0 ";
	} else {
		Cmd[0] += "1 ";
		Para += "1 ";
	};
	Cmd[0] += p2x + "," + p2y + " L" + p3x + "," + p3y + " L" + p4x + "," + p4y + " L" + p5x + "," + p5y + " L" + p6x + "," + p6y;
	Cmd[0] += " A" + Ri + "," + Ri + " 0 ";
	Para += p2x + "," + p2y + " L" + p3x + "," + p3y + " L" + p4x + "," + p4y + " L" + p5x + "," + p5y + " L" + p6x + "," + p6y;
	Para += " A" + Ri + "," + Ri + " 0 ";
	if (sweep) {
		Cmd[0] += "1,";
		Para += "1,";
	} else {
		Cmd[0] += "0,";
		Para += "0,";
	};
	if (sense) {
		Cmd[0] += "1 ";
		Para += "1 ";
	} else {
		Cmd[0] += "0 ";
		Para += "0 ";
	};
	Cmd[0] += p7x + "," + p7y + ' z"';
	Para += p7x + "," + p7y + " z";
	Cmd[1].setAttribute("d", Para);
	Cmd[0] += ' fill="' + fillcolor + '"' + ' stroke-width="' + SArray[0].fstrokewidth + '" stroke="' + stcolor + '"/> \n';
	Para = fillcolor;
	Cmd[1].setAttribute("fill", Para);
	Para = stcolor;
	Cmd[1].setAttribute("stroke", Para);
	Cmd[1].setAttribute("stroke-width", SArray[0].fstrokewidth);
	return (Cmd);

}
//Draw plasmid name
function ShowPlasmidName(SArray) {
	var Ox = SArray[0].ox;
	var Oy = SArray[0].oy;
	var R = SArray[0].plasmidradius;
	var TSize = SArray[0].txtsize;
	var PName = SArray[0].plasmidname;
	var fontw = "normal";
	if (SArray[0].txtbold) {
		fontw = "bold";
	}
	var fontfamily = [];
	fontfamily[0] = "Arial";
	fontfamily[1] = "Times";
	fontfamily[2] = "Courier";
	fontfamily[3] = "Yu Gothic";
	var fontfill = SArray[0].txtcolor;
	var Cmd = [];
	Cmd[1] = newSVG("text");

	//Draw plasmid name
	Cmd[0] = '<text x="' + Ox + '" y="' + Oy + '" text-anchor="middle" font-size="' + (TSize + 4) + 'px" font-family="' + fontfamily[SArray[0].txtfamily] + '"  font-weight="' + fontw + '" fill="' + fontfill + '">' + PName + "</text>\n";
	Cmd[1].setAttribute("x", Ox);
	Cmd[1].setAttribute("y", Oy);
	Cmd[1].setAttribute("text-anchor", "middle");
	Cmd[1].setAttribute("font-size", ((TSize + 4) + "px"));
	Cmd[1].setAttribute("font-family", fontfamily[SArray[0].txtfamily]);
	Cmd[1].setAttribute("font-weight", fontw);
	Cmd[1].setAttribute("fill", fontfill);
	Cmd[1].appendChild(document.createTextNode(PName));

	return (Cmd);
}
//Draw plasmid size
function DrawPlasmidSize(SArray) {
	var Ox = SArray[0].ox;
	var Oy = SArray[0].oy;
	var TSize = SArray[0].txtsize;
	var S = SArray[0].plasmidsize;
	var fontw = "normal";
	if (SArray[0].txtbold) {
		fontw = "bold";
	}
	var fontfamily = [];
	fontfamily[0] = "Arial";
	fontfamily[1] = "Times";
	fontfamily[2] = "Courier";
	fontfamily[3] = "Yu Gothic";
	var fontfill = SArray[0].txtcolor;
	var Cmd = [];
	Cmd[0] = '<text x="' + Ox + '" y="' + (Oy + TSize * 1.5) + '" text-anchor="middle" font-size="' + (TSize + 2) + 'px" font-family="' + fontfamily[SArray[0].txtfamily] + '"  font-weight="' + fontw + '" fill="' + fontfill + '">' + S + "bp</text>\n";
	Cmd[1] = newSVG("text");
	Cmd[1].setAttribute("x", Ox);
	Cmd[1].setAttribute("y", (Oy + TSize * 1.5));
	Cmd[1].setAttribute("text-anchor", "middle");
	Cmd[1].setAttribute("font-size", ((TSize + 2) + "px"));
	Cmd[1].setAttribute("font-family", fontfamily[SArray[0].txtfamily]);
	Cmd[1].setAttribute("font-weight", fontw);
	Cmd[1].setAttribute("fill", fontfill);
	Cmd[1].appendChild(document.createTextNode((S + "bp")));

	return (Cmd);
}

//Draw feature text
function ShowFeatureLabel(SArray, n) {
	var Ox = SArray[0].ox;
	var Oy = SArray[0].oy;
	var TSize = SArray[0].txtsize;
	var Ro = SArray[0].ro + TSize * 1.3;
	var Ri = SArray[0].ri - TSize * 1.3;
	var Theata = (SArray[n].start + SArray[n].end) * Math.PI / SArray[0].plasmidsize;
	var Tx = Ox + Ro * Math.sin(Theata);
	var Ty = Oy - Ro * Math.cos(Theata);

	var Txi = Ox + Ri * Math.sin(Theata);
	var Tyi = Oy - Ri * Math.cos(Theata);

	var fontw = "normal";
	if (SArray[0].txtbold) {
		fontw = "bold";
	}
	var fontfamily = [];
	fontfamily[0] = "Arial";
	fontfamily[1] = "Times";
	fontfamily[2] = "Courier";
	fontfamily[3] = "Yu Gothic";
	var fontfill = SArray[0].txtcolor;


	var Cmd = [];
	//Case outside text
	if (SArray[0].txtloc == 0) {
		Cmd[1] = newSVG("text");
		Cmd[1].setAttribute("x", Tx);
		Cmd[1].setAttribute("y", Ty);
		//alert("Outside text being excuted");
		Cmd[0] = '<text x="' + Tx + '" y="' + Ty + '" text-anchor="';
		if (Theata > 0 && Theata < Math.PI) {
			Cmd[0] += 'start"';
			Cmd[1].setAttribute("text-anchor", "start");
		} else if (Theata > Math.PI && Theata < Math.PI * 2) {
			Cmd[0] += 'end"';
			Cmd[1].setAttribute("text-anchor", "end");
		} else {
			Cmd[0] += 'middle"';
			Cmd[1].setAttribute("text-anchor", "middle");
		}
	}
	//Case inside text
	if (SArray[0].txtloc == 1) {
		Cmd[1] = newSVG("text");
		Cmd[1].setAttribute("x", Txi);
		Cmd[1].setAttribute("y", Tyi);

		Cmd[0] = '<text x="' + Txi + '" y="' + Tyi + '" text-anchor="';
		if (Theata > 0 && Theata < Math.PI) {
			Cmd[0] += 'end"';
			Cmd[1].setAttribute("text-anchor", "end");
		} else if (Theata > Math.PI && Theata < Math.PI * 2) {
			Cmd[0] += 'start"';
			Cmd[1].setAttribute("text-anchor", "start");
		} else {
			Cmd[0] += 'middle"';
			Cmd[1].setAttribute("text-anchor", "middle");
		}
	}
	//Closing text
	if (SArray[0].txtloc == 0 || SArray[0].txtloc == 1) {
		Cmd[0] += ' font-size="' + TSize + 'px" font-family="' + fontfamily[SArray[0].txtfamily] + '" font-weight="' + fontw + '" fill="' + fontfill + '" ';
		Cmd[1].setAttribute("font-size", (TSize + "px"));
		Cmd[1].setAttribute("font-family", fontfamily[SArray[0].txtfamily]);
		Cmd[1].setAttribute("font-weight", fontw);
		Cmd[1].setAttribute("fill", fontfill);
		if (SArray[n].italic) {
			Cmd[0] += ' font-style="italic">';
			Cmd[1].setAttribute("font-style", "italic");
		} else {
			Cmd[0] += ' font-style="normal">';
			Cmd[1].setAttribute("font-style", "normal");
		}
		Cmd[0] += SArray[n].name + "</text>\n";
		Cmd[1].appendChild(document.createTextNode(SArray[n].name));
	}
	//**************************************************************//
	//Curved text
	//**************************************************************//
	if (SArray[0].txtloc == 2 || SArray[0].txtloc == 3) {
		var fontstyle = "normal";
		if (SArray[n].italic) {
			fontstyle = "italic";
		}
		var txtrenderdim = svg_estimate(SArray[n].name, TSize, fontfamily[SArray[0].txtfamily], fontw, fontstyle);
		var midAng = ((SArray[n].start + SArray[n].end) * Math.PI) / SArray[0].plasmidsize;
		var Da = 0.5 * txtrenderdim.width / SArray[0].plasmidradius;
		var SAng = midAng - Da;
		var EAng = midAng + Da;
		//alert("midAng="+midAng+"\nDa="+Da+"\nSAng="+SAng+"\nEAng="+EAng);

		//use inner radius
		//var vOffset=(TSize*0.8)/2; // old estimation method
		var vOffset = 0;
		if (SArray[0].txtloc == 3) {
			vOffset = txtrenderdim.height / 4;
			Da = 0.5 * txtrenderdim.width / (SArray[0].plasmidradius - vOffset);
			SAng = midAng - Da;
			EAng = midAng + Da;
		}
		var baseRadius = SArray[0].plasmidradius - vOffset;
		var Xi = Ox + (baseRadius) * Math.sin(SAng);
		var Yi = Oy - (baseRadius) * Math.cos(SAng);
		var Xe = Ox + (baseRadius) * Math.sin(EAng);
		var Ye = Oy - (baseRadius) * Math.cos(EAng);

		//start from mid pt and use inner radius
		//Direction: sense=0, antisense=1
		var sense = 0;
		//if (SArray[n].end<SArray[n].start) sense=1;
		//sweep: <=half: 0, >half: 1
		var sweep = 0;
		if (Math.abs(SAng - EAng) > Math.PI) sweep = 1;
		var defsobj = newSVG("defs");
		var pathobj = newSVG("path");
		var txtpathobj = newSVG("textPath");
		var Para = "";
		var objid = getID();
		Cmd[1] = newSVG("text");
		Cmd[0] = '<defs>\n <path id="' + objid + '" d="M' + Xi + "," + Yi + " A " + baseRadius + "," + baseRadius + " 0 ";

		Para = "M" + Xi + "," + Yi + " A " + baseRadius + "," + baseRadius + " 0 ";
		if (sweep) {
			Cmd[0] += "1,";
			Para += "1,";
		} else {
			Cmd[0] += "0,";
			Para += "0,";
		};
		if (sense) {
			Cmd[0] += "0 ";
			Para += "0 ";
		} else {
			Cmd[0] += "1 ";
			Para += "1 ";
		};
		Cmd[0] += Xe + "," + Ye + '" />\n</defs>\n';
		Para += Xe + "," + Ye;
		pathobj.setAttribute("id", objid);
		pathobj.setAttribute("d", Para);
		pathobj.setAttribute("stroke", "0");
		defsobj.appendChild(pathobj);
		Cmd[2] = defsobj;
		if (SArray[0].txtloc == 3) {
			Cmd[0] += '<text text-anchor="start" font-size="' + TSize + 'px" font-family="' + fontfamily[SArray[0].txtfamily] + '" font-weight="' + fontw + '" fill="' + fontfill + '"';
		} else {
			Cmd[0] += '<text dominant-baseline="central" text-anchor="start" font-size="' + TSize + 'px" font-family="' + fontfamily[SArray[0].txtfamily] + '" font-weight="' + fontw + '" fill="' + fontfill + '"';
			Cmd[1].setAttribute("dominant-baseline", "central");
		}

		Cmd[1].setAttribute("font-size", (TSize + "px"));
		Cmd[1].setAttribute("font-family", fontfamily[SArray[0].txtfamily]);
		Cmd[1].setAttribute("font-weight", fontw);
		Cmd[1].setAttribute("fill", fontfill);
		Cmd[1].setAttribute("text-anchor", "start");



		if (SArray[n].italic) {
			Cmd[0] += ' font-style="italic">';
			Cmd[1].setAttribute("font-style", "italic");
		} else {
			Cmd[0] += ' font-style="normal">';
			Cmd[1].setAttribute("font-style", "normal");
		}

		Cmd[0] += '\n<textPath xlink:href="#' + objid + '">' + SArray[n].name + '</textPath>\n</text>\n';
		//txtpathobj.setAttribute("xlink:href",objid); // MUST require NS for XLink
		txtpathobj.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', "#" + objid);
		txtpathobj.appendChild(document.createTextNode(SArray[n].name));
		Cmd[1].appendChild(txtpathobj);

	}
	return (Cmd);

}

// SVG2PNG function
function SaveSVG() {
	var svg = document.getElementById("pic");
	//get svg source.
	var serializer = new XMLSerializer();
	var source = serializer.serializeToString(svg);

	//add name spaces.
	if (!source.match(/^<svg[^>]+xmlns="http\:\/\/www\.w3\.org\/2000\/svg"/)) {
		source = source.replace(/^<svg/, '<svg xmlns="http://www.w3.org/2000/svg"');
	}
	if (!source.match(/^<svg[^>]+"http\:\/\/www\.w3\.org\/1999\/xlink"/)) {
		source = source.replace(/^<svg/, '<svg xmlns:xlink="http://www.w3.org/1999/xlink"');
	}

	//add xml declaration
	source = '<?xml version="1.0" standalone="no"?>\r\n' + source;

	//convert svg source to URI data scheme.
	var url = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(source);

	var dl = document.createElement("a");
	dl.href = url;
	dl.download = "plasmid.svg";
	document.body.appendChild(dl);
	dl.click();
	document.body.removeChild(dl);

}

function SavePNG() {
	var svg = document.getElementById("pic");
	//get svg source.
	var serializer = new XMLSerializer();
	var source = serializer.serializeToString(svg);
	var canvas = document.createElement("canvas");
	canvas.width = 800;
	canvas.height = 600;
	document.body.appendChild(canvas);
	var dl = document.createElement("a");
	var img = new Image();
	img.src = "data:image/svg+xml; charset=utf8," + encodeURIComponent(source);
	img.onload = function () {
		canvas.width *= parseInt(document.getElementById("pngscale").value) / 100;
		canvas.height *= parseInt(document.getElementById("pngscale").value) / 100;
		var ctx = canvas.getContext("2d");
		ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
		dl.href = canvas.toDataURL("image/png");
		dl.download = "plasmid.png";
		document.body.appendChild(dl);
		dl.click();
		document.body.removeChild(dl);
		document.body.removeChild(canvas);
	}


}

function addFeature()
{
	var ftable = document.getElementById("tblFeatureTable").getElementsByTagName("tbody")[0];
	var current_feature_count = ftable.rows.length;
	var new_row = ftable.insertRow(-1);
	var cell1 = new_row.insertCell(0);
	var cell2 = new_row.insertCell(1);
	var cell3 = new_row.insertCell(2);
	var cell4 = new_row.insertCell(3);
	var cell5 = new_row.insertCell(4);
	var cell6 = new_row.insertCell(5);
	var cell7 = new_row.insertCell(6);
	
	var new_count = current_feature_count + 1;
	var padid_old = ("00"+current_feature_count).slice(-2);
	var paddedid = ("00"+new_count).slice(-2);
	var idtext = document.createTextNode(paddedid);
	var cb = document.createElement("input");
	cb.type = "checkbox";
	cb.id = "visible"+ padid_old;
	cell1.appendChild(idtext);
	cell1.appendChild(cb);

	var txtname = document.createElement("input");
	txtname.type = "text";
	txtname.id = "txtFeatureName"+padid_old;
	txtname.value = "";
	txtname.placeholder = "(Feature label)";
	cell2.appendChild(txtname);

	var cbstyle = document.createElement("input");
	cbstyle.type = "checkbox";
	cbstyle.id = "bolItalic"+padid_old;
	cell3.appendChild(cbstyle);

	var fstart = document.createElement("input");
	var fmax = document.getElementById("txtPlasmidSize").value;
	fstart.type = "number";
	fstart.min = 0;
	fstart.max = fmax;
	fstart.id = "txtFeatureStart"+padid_old;
	cell4.appendChild(fstart);

	var fend = document.createElement("input");
	fend.type = "number";
	fend.min = 0;
	fend.max = fmax;
	fend.id = "txtFeatureEnd"+padid_old;
	cell5.appendChild(fend);

	var cbarrow = document.createElement("input");
	cbarrow.type = "checkbox";
	cbarrow.checked = true;
	cbarrow.id = "bolArrowOn"+padid_old;
	cell6.appendChild(cbarrow);

	var colfill = document.createElement("input");
	colfill.type = "color";
	colfill.value = "#00CCFF";
	colfill.id = "colFeature"+padid_old;
	cell7.appendChild(colfill);
}

function delFeature()
{
	var ftable = document.getElementById("tblFeatureTable").getElementsByTagName("tbody")[0];
	var current_feature_count = ftable.rows.length;
	if(current_feature_count > 0)
		{
			ftable.deleteRow(-1);
		}
}

//Main Drawing function, mode 0 is draw new graph, mode 1 is append
function main(mode) {
	var code = "";
	var Result;
	var svgout = document.createElementNS("http://www.w3.org/2000/svg", "svg");
	var feature_count = document.getElementById("tblFeatureTable").getElementsByTagName("tbody")[0].rows.length;
	var Inobj = Cleanup(feature_count);
	var svgheader = '<?xml version="1.0" standalone="no"?> \n<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 2.0//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">\n<svg xmlns="http://www.w3.org/2000/svg" version="1.1" xmlns:xlink="http://www.w3.org/1999/xlink" width="' + Inobj[0].cw + 'px" height="' + Inobj[0].ch + 'px"> \n';
	if (Inobj != false) {
		var pretext = document.getElementById("SVGCode");
		var picobj = document.getElementById("pic");
		if (mode == 0) {
			code = svgheader;

			//var oldsvg=document.getElementById("pic");
			svgout.setAttribute("xmlns:xlink", "http://www.w3.org/1999/xlink");
			svgout.setAttribute("width", (Inobj[0].cw + "px"));
			svgout.setAttribute("height", (Inobj[0].ch + "px"));
			svgout.setAttribute("version", "1.1");
			svgout.setAttribute("style", "display:inline");
			svgout.setAttribute("id", "pic");
		} //mode 1 action
		else //mode 2 action
		{
			code = pretext.value;
			code = code.substring(0, (code.length - 6));
			var oldsvg = document.getElementById("pic");
			svgout = oldsvg;
		}

		if (Inobj[0].bbon) {
			Result = DrawCircle(Inobj);
			code += Result[0];
			svgout.appendChild(Result[1]);
		} //draw backbone
		for (var i = 1; i < Inobj.length; i++) //draw features
		{
			if (Inobj[i].visible) {
				if (Inobj[i].arrowon) {
					Result = DrawArrow(Inobj, i);
					code += Result[0];
					svgout.appendChild(Result[1]);
				} else {
					Result = DrawBox(Inobj, i);
					code += Result[0];
					svgout.appendChild(Result[1]);
				}
			}
		}
		if (Inobj[0].txton) {
			if (Inobj[0].plasmidnameon) {
				Result = ShowPlasmidName(Inobj);
				code += Result[0];
				svgout.appendChild(Result[1]);
			}
			if (Inobj[0].plasmidsizeon) {
				Result = DrawPlasmidSize(Inobj);
				code += Result[0];
				svgout.appendChild(Result[1]);
			}
			for (var j = 1; j < Inobj.length; j++) {
				if (Inobj[j].visible) {
					Result = ShowFeatureLabel(Inobj, j);
					code += Result[0];
					if (Result.length == 2) {
						svgout.appendChild(Result[1]);
					} else {
						svgout.appendChild(Result[2]);
						svgout.appendChild(Result[1]);

					}
				}
			}
		}
		code += "</svg>";
		pretext.value = code;
		picobj.parentNode.replaceChild(svgout, picobj);
		//alert(svgout.childNodes[5].nodeName+" has childs: "+svgout.childNodes[5].childNodes.length);
		//alert(svgout.childNodes[5].firstChild.nodeName);
		//alert("the ref link: "+svgout.childNodes[5].firstChild.getAttribute("xlink:href"));
		//alert(svgout.childNodes[5].firstChild.firstChild.nodeValue);


	}
}