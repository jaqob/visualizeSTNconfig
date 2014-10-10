   "use strict";
    /* Example of data
     var tempData = [
     [{v:'Mike', f:'Mike<div style="color:red; font-style:italic">President</div>'}, ''],
     [{v:'Jim', f:'Jim<div style="color:red; font-style:italic">Vice President<div>'}, 'Mike'],
     ['Alice', 'Mike'],
     ['Bob', 'Jim'],
     ['Carol', 'Bob'],
     ['Carol', 'Jim']
     ];
     */


    var dataId = 0;
    var drawData = [];
    google.load("visualization", "1", {packages: ["orgchart"]});


    function onNewConfig() {
        drawData = [];
        var inData = $("#myTextArea").val().trim();
        var xmlDoc;

        try {
            // Is it XML?
            xmlDoc = $.parseXML(inData);
        }
        catch (e) {
        }

        if (jQuery.isXMLDoc(xmlDoc)) {
            myXMLParserv2($(inData), "");
        }
        else {
            myManualParser(inData);
        }

 console.log("drawData");
        console.log(drawData);
        drawChart();
    }

    function drawChart() {
        var data = new google.visualization.DataTable();
        data.addColumn('string', 'Name');
        data.addColumn('string', 'Manager');
        //data.addColumn('string', 'ToolTip');
        data.addRows(drawData);
        var chart = new google.visualization.OrgChart(document.getElementById('chart_div'));
        chart.draw(data, {allowHtml: true, size: 'small'});
    }

    /*
     function myXMLParser(xml, parent)
     {
     $(xml).children().each(function(){
     if($(this).context.textContent)
     {
     if($(this).context.childElementCount === 0)
     {
     var name = $(this).context.tagName;
     var value = $(this).context.textContent;
     drawData.forEach(function(entry) {
     //   console.log("* " + entry[0] + " " + parent) ;
     //   console.log(entry[0]);
     if(entry[0] === parent)
     {
     entry[0].f = entry[0].f + name + ': <div style="font-style:italic;display:inline">' + value + "</div><br>";
     }
     });
     }
     else
     {
     var name = {v:(dataId++).toString(), f:'<div style="font-weight:bold;">' + $(this).context.tagName + " " + $(this).attr('instanceid') + "</div>"};
     drawData[drawData.length] = [name, parent, ""];
     myXMLParser($(this), name);

     }
     }
     });
     }
     */

    function myXMLParserv2(xml, parent) {
        if ($(xml)[0].textContent) {
            if ($(xml)[0].childElementCount === 0) {
                var name = $(xml)[0].tagName;
                var value = $(xml)[0].textContent;
                drawData.forEach(function (entry) {
                    if (entry[0] === parent) {
                        entry[0].f = entry[0].f + getLeafString(name + "=", value);
                    }
                });
            }
            else {
                var tagname = $(xml)[0].tagName;
                //Handle the <config> in the STN config
                if (tagname !== undefined) {
                    var attribute = $(xml).attr('instanceid');
                    if (attribute === undefined) {
                        attribute = "";
                    }
                    var name2 = getNodeString((dataId++).toString(), tagname + " " + attribute);
                    drawData[drawData.length] = [name2, parent]
                }
                $(xml).children().each(function () {
                    myXMLParserv2($(this), name2);
                });
            }
        }
    }

    function myManualParser(config) {
        var parent = "";
			console.log("config");
			console.log(config);
		try
		{
        var lines = config.split('\n');
		}
		catch (e) {
		console.log("Error");
		console.log(config);
		console.log(e);
        }
        for (var i = 0; i < lines.length; i++) {
		if (lines[i] === "")
		{continue;}
			var found = false;
			console.log("lines");
            var parts = lines[i].trim().split(' ');
            //parts[0] = path
            //parts[1] = attribute name
            //parts[2] = attribute value
            var paths = parts[0].split(/[\s,;]+/);;
			paths = $.grep(paths,function(n){ return(n) });; 
            //paths[paths.lenght-1] = node
            //paths[paths.lenght-2] = parent
            //console.log("paths.lenght: " + paths.length);
			//console.log("paths length " + paths.length);
			//console.log(paths);
			//console.log("parts.length " + parts.length);
			//console.log(parts);
            if (parts.length == 1) {
			//console.log("1");
                if (paths.length == 1) {
                    parent = "";
                }
                else {
					
                    parent = paths[paths.length - 2].toUpperCase();
					//console.log("parent");
					//console.log(parent);
					
                }
				//console.log("ACTION: 1 " + paths[paths.length - 1].toUpperCase() + " " + parent);
                drawData[drawData.length] = [getNodeString(paths[paths.length - 1].toUpperCase(), paths[paths.length - 1].toUpperCase()), parent];
					if(paths.length > 2)
					{
					//console.log("paths.splice(0,´paths.length-1).join()");
					var temptemp = paths.splice(0,paths.length-1).join();
					//console.log(temptemp);
					myManualParser(temptemp);
					}
            }
            else {
			//console.log("2");
                drawData.forEach(function (entry) {
				//console.log("3");
                    if (entry[0].v === paths[paths.length - 1].toUpperCase()) {
					//console.log("4");
					found = true;
                        entry[0].f = entry[0].f + getLeafString(parts[1], parts[2]);
                    }
                });
				//console.log("Found: " + found);
				if(found === false)
				{		
				myManualParser(parts[0]);
				myManualParser(lines[i]);
				}
            }
        }
    }

    function getNodeString(id, node) {
        return {v: id, f: '<div style="font-weight:bold;">' + node.toUpperCase() + '</div>'};

    }

    function getLeafString(attributeName, attributeValue) {
	console.log(attributeName + " " + attributeValue);
        return  '<div style="font-style:italic;display:inline">' + attributeName + '' + attributeValue + "</div><br>"
    }
