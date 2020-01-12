//foo_ base64('RGV2ZWxvcGVkIGJ5IE1pbiBMYXR0') _bar//
var query = firebase.database().ref("project/student").orderByKey();
const monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];
const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Tursday", "Friday", "Saturday"]


var d = new Date();                         //object
var yearx = d.getFullYear();                // 2019
var monthx = d.getMonth();                  //5 -> June
var i, j;                                  ////global loopers
var globalDataHolder = [];                  ////global data holder
var rollKeys = [];
var present_indexes = [];
var txt = new String;

var ulNames = document.getElementById('ul_names');
var ulButtons = document.getElementById("ul_buttons");

var modal_table_data = document.getElementById("modal_table_data");
var modal_table_header = document.getElementById("modal_table_header");
var modal = document.getElementById("myModal");
var loader = document.getElementById('loader');

// PART ONE
// Database is initiated from here.
query.once("value").then(createAttributes);
function createAttributes(obj) {
  rollKeys = Object.keys(obj.val());
  console.log(rollKeys);                      /*LOG roll numbers*/
  console.log("total user: " + rollKeys.length);
  obj.forEach(createButtonAndList);
  for (i = 1; i <= rollKeys.length; i++) {
    globalDataHolder[i - 1] = obj.val()[rollKeys[i - 1]];
    document.getElementsByTagName("button")[i].setAttribute("onClick", "clickedID(this.id,this.firstChild.nodeValue)");
    document.getElementsByTagName("button")[i].setAttribute("id", rollKeys[i - 1]);
  }
  globalDataHolder.forEach(createButtonAndListForTotal);
  //console.log(data_objects_holder)         ////CHECK
  //console.log(globalOnDayHolder)           ////CHECK
}

function createButtonAndList(item_object) {
  //item.key >> (roll) 1 by 1
  var btn = document.createElement('button');
  btn.className += "btn btn-outline-primary btn-block btn-rounded";
  var linkText = document.createTextNode(item_object.val().name);
  btn.style.margin = "10px 0px";
  btn.appendChild(linkText);
  ulButtons.appendChild(btn);
  var li = document.createElement('li');
  li.className += "list-group-item btn-outline-warning";
  var linkText = document.createTextNode(item_object.key);
  li.style.margin = "5px 0px";
  li.appendChild(linkText);
  ulNames.appendChild(li);
}

function createButtonAndListForTotal(obj) {
  var tbody = document.getElementById('maketabletotal');
  var tr = document.createElement('tr');

  var td = document.createElement('td');
  var td2 = document.createElement('td');
  var td3 = document.createElement('td');
  var td4 = document.createElement('td');

  var linkText = document.createTextNode(obj.name);
  var linkText2 = document.createTextNode(obj.roll);
  var linkText3 = document.createTextNode(obj.phone);
  var calculated = calculate(obj.attendance.counter);
  var linkText4 = document.createTextNode(calculated + " -- " + obj.attendance.counter + "/40");

  td.appendChild(linkText);
  td2.appendChild(linkText2);
  td3.appendChild(linkText3);
  td4.appendChild(linkText4);

  if (calculated < 75) {
    td.className += 'animated infinite pulse slow delay-2s text-danger font-weight-bolder'
    td2.className += 'animated rollIn fast delay-1s text-danger font-weight-bolder'
    td3.className += 'animated rollIn fast delay-1s text-danger font-weight-bolder'
    td4.className += 'animated rollIn fast delay-1s text-danger font-weight-bolder'
  } else {
    td.className += 'animated rollIn fast delay-1s text-success font-weight-bold'
    td2.className += 'animated rollIn fast delay-1s text-success font-weight-bold'
    td3.className += 'animated rollIn fast delay-1s text-success font-weight-bold'
    td4.className += 'animated rollIn fast delay-1s text-success font-weight-bold'
  }

  tr.appendChild(td);
  tr.appendChild(td2);
  tr.appendChild(td3);
  tr.appendChild(td4);

  tbody.appendChild(tr);
}

function calculate(arg) {
  return (arg / 40) * 100
}

checkDatabase();

function checkDatabase() {
  var loopskip = 0;

  query.on("value", function (snap) {
    if (loopskip > 0) {
      loader.hidden = false
      if (confirm("Database changes, reload?")) {
        location.reload()
      } else {
        document.getElementById('rf').hidden = false;
        document.getElementById('rf_detail').hidden = false;
      }
    } else {
      document.getElementById('rf_detail').hidden = true;
      document.getElementById('rf').hidden = true;
    }
    loopskip++;
    document.getElementById('rf').addEventListener('click', refreshThis, false);
  }, function (err) {
    console.log(err.code);
  });
}
///////////////////////////////////////////////////////////////////////////////////////////////

//PART TWO
//Reaction is initiated from here.
function clickedID(id, name) {

  document.getElementById('table1').hidden = false;
  document.getElementById('table2').hidden = false;
  document.getElementById('close').hidden = false;

  //console.log(id)                                 ////CHECK print roll number

  //var clickedData = globalDataHolder[rollKeys.indexOf(id)].attendance[monthNames[monthx]]  //Extracting

  //console.log(clickedData)                        ////CHECK Object 
  //console.log(typeof(clickedData))
  //
  greatTree(id)
  //createtable(Object.values(clickedData))
  make_modal_show(name)

  document.getElementById('name').innerHTML = name;
  document.getElementById('roll').innerHTML = id;
  document.getElementById('no').innerHTML = rollKeys.indexOf(id) + 1 + '.';
  document.getElementById('userPH').innerHTML = globalDataHolder[rollKeys.indexOf(id)].phone
  document.getElementById('userFirstRegister').innerHTML = globalDataHolder[rollKeys.indexOf(id)].register_date_detail
  document.getElementById('userLastScan').innerHTML = globalDataHolder[rollKeys.indexOf(id)].updated_date
}

function make_modal_show(username) {
  modal_table_header.className += 'text-center text-warning';
  modal_table_header.textContent = username + ' for ' + monthNames[monthx] + ' Attendance.'// << month
  modal.style.display = "block";
  var span = document.getElementsByClassName("close")[0];
  span.onclick = function () {
    modal.style.display = "none";
    //temp = document.getElementById('maketable')
    //document.getElementById('table2').removeChild(temp)
  }
}

function closer() {
  document.getElementById('table1').hidden = true;
  document.getElementById('table2').hidden = true;
  document.getElementById('close').hidden = true;
}

function refreshThis() {
  location.reload();
}

var data;
var tree = [];

function greatTree(id) {

  var childOne = new Array();
  var childTwo = new Array();
  var childThree = new Array();

  var clickedData = globalDataHolder[rollKeys.indexOf(id)]
  var name = clickedData.name
  data = clickedData.attendance[monthNames[monthx]]
  console.log(data)

  for (i = 0; i < Object.keys(data).length; i++) {
    for (j = 1; j < Object.values(data)[i].length; j++) {
      if(Object.values(data)[i][j] === undefined){
        childThree.push({ 'name': j + ' -- No Record' })
      }else{
        childThree.push({ 'name': j + ' -- ' + Object.values(data)[i][j] })
      }
      
    }
    childTwo.push({ 'name': Object.keys(data)[i], 'children': childThree })
    childThree = [];
  }

  childOne.push({ 'name': monthNames[monthx], 'children': childTwo })
  //childTwo = [];
  tree.push({ 'name': name, 'children': childOne })

  var t = new TreeView(tree, 'tree');
  //childOne = [];

  var expandAll = document.getElementById('expandAll');
  var collapseAll = document.getElementById('collapseAll');
  expandAll.onclick = function () { t.expandAll(); };
  collapseAll.onclick = function () { t.collapseAll(); };

}

window.onload = function () {
  if (!navigator.onLine) {
    console.log('Offline')
    alarm("Browser offline.")
  } else {
    console.log('Online')
  }
};


// function createtable(arg) {
//   var tbody = document.createElement('tbody')
//   tbody.setAttribute('id', 'maketable')

//   for (i = 0; i < arg.length; i++) {
//     //console.log(arg[i])
//     var tr = document.createElement('tr')                //<tr>

//     var td = document.createElement('td')                //<td>
//     if (arg[i]['AM'] == undefined) {
//       var linkText = document.createTextNode('No Record')
//     } else {
//       var linkText = document.createTextNode(arg[i]['AM'])
//     }
//     td.appendChild(linkText)                             //<td> TEXT

//     var td2 = document.createElement('td')                //<td>
//     if (arg[i]['PM'] == undefined) {
//       var linkText2 = document.createTextNode("No Record")
//     } else {
//       var linkText2 = document.createTextNode(arg[i]['PM'])
//     }
//     td2.appendChild(linkText2)                             //<td> TEXT

//     tr.appendChild(td)
//     tr.appendChild(td2)
//     tbody.appendChild(tr)
//   }
//   document.getElementById('table2').appendChild(tbody)
// }

// var tree1 = [
//   {
//     name: 'MEEC-1',
//     children: [
//       {
//         name: 'January',
//         children: [
//           {
//             name: '01',
//             children: [{
//               name: ['1 - 9:45  AM', '2 - 10:15 AM']
//             }
//             ]
//           },
//           {
//             name: '02',
//             children: [{
//               name: ['1 - 9:45  AM', '2 - 10:15 AM']
//             }]
//           }
//         ]
//       }
//     ]
//   }
// ];


/*          TESTED CODE //
var globalOnDayHolder = [];
var globalOnDayHolder_sliced = [];
var globalOffDayHolder = [];


// tree[0].name = 'MEEC-2'
// tree[0].children[0].name = 'February'
// tree[0].children[0].children[0].name = '01'
// tree[0].children[0].children[1].name = '02'
// tree[0].children[0].children[0].children[0].name = ["1 - 9:45  PM" + ' \n ' + "2 - 10:15 AM"]
// tree[0].children[0].children[1].children[0].name = ["1 - 9:45  PM" + ' \n ' + "2 - 10:15 AM"]
// tree.push({ 'name': "MEEC-3" })

function daysInMonth(month, year) {
    return new Date(year, month + 1, 0).getDate(); //month+1 is important -> June is 6
}

function isWeekday(year, month, day) {
    var day = new Date(year, month, day).getDay();
    return day != 0 && day != 6;
}

function getWeekdaysInMonth(month, year) {
    var days = daysInMonth(month, year);
    ////CHECK console.log("total days : " + days + " - " + monthNames[monthx] + " " + yearx)
    var oncount = 0;
    var offcount = 0;
    var weekDays = new String;
    var SatAndSun = new String;
    var br_hr = 1;
    for (var i = 1; i <= days; i++) {
        if (isWeekday(year, month, i)) {
            globalOnDayHolder[oncount] = i;
            oncount++;
            if (br_hr <= 4) {
                weekDays += dayNames[new Date(year, month, i).getDay()] + '-' + i + '<br>';
                br_hr++;
            } else {
                weekDays += dayNames[new Date(year, month, i).getDay()] + '-' + i + '<hr>';
                br_hr = 1;
            }


        } else {
            globalOffDayHolder[offcount] = i;
            offcount++;
            SatAndSun += dayNames[new Date(year, month, i).getDay()] + '-' + i + '<br>';
        }
    } //globalOnDayHolder = [3, 4, 5, 6, 7, 10, 11, 12, 13, 14, 17, 18, 19, 20, 21, 24, 25, 26, 27, 28, 29]
    var slicer = globalOnDayHolder.length / 5; //if days is 21 => slicer is 4.2
    var rounded = Math.round(slicer)    //now slicer = 4 will get error for 0.2 day , last one day if 4.5 rounded will be 5
    if (slicer - rounded < 0.5 && slicer - rounded != 0) {
        rounded++
    }
    console.log('slicer- ' + slicer)        ////CHECK
    console.log('rounded- ' + rounded)      ////CHECK
    var x = 0; var y = 5;
    for (i = 0; i < rounded; i++) {
        globalOnDayHolder_sliced[i] = globalOnDayHolder.slice(x, y)
        x += 5; y += 5;
    }
    var on_off = [];
    on_off[0] = SatAndSun;
    on_off[1] = weekDays;
    return on_off;

function fill_present_indexs(clickedData) {
    var keys = Object.keys(clickedData) //days int array
    var vals = Object.values(clickedData) //object array
    //console.log(keys)
    //console.log(vals)
    //keys.forEach(createtb)

    present_indexes = [];
    for (i = 0; i < keys.length; i++) {
        var length = Object.keys(vals[i]).length;
        if (length == 2) {
            present_indexes.push(keys[i] + "AM PM")
        } else {
            present_indexes.push(keys[i] + Object.keys(vals[i]))
        }
    }

    //console.log('present_indexes: ' + present_indexes)
    //console.log(typeof(present_indexes))
    //createtable(present_indexes)
}
if(splitter < 5){
                globalOnDayHolder[j][oncount] = i;
                oncount++;
                splitter++;
            }else{
                splitter = 0;
                j++;
            }
function time() {
    document.getElementById('time').innerHTML = d.toLocaleTimeString();
}
var call = setInterval(time, 1000);
var myJSON = JSON.stringify(attendance);
alert(myJSON)
for (var i in attendance) {
createRow(i, attendance[i]);
    dataAlert = { i: attendance }
 }
 alert(dataAlert)
var objects = {};
for (var x = 0; x < 100; x++) {
  objects[x] = {name: etc};
}
*/

//server "AAAA2xz4m8E:APA91bE1yj9mIZgSd12sclR5W_Q9TUwCZm3YuPiCXA_N4cECzgNZToTsVkpgZQYo8zIeXbWKXqD34u62GQFsZ7pKfepEecyzR11G8giyCeqc-6JXd6d6FdTOteDmFvbxC7Q5xraEvi-B"
//sender "941083892673"

//document.body.appendChild(ul);

/*///////////////////////////////////////////////////////
var day = document.getElementById('nav-home')          // DEPRECATED !!
var tableDay = document.createElement('table');        //
tableDay.style.width = '100%';                         //
tableDay.style.border = '2px solid grey';              //
day.appendChild(tableDay);                             //
createRow('Date', 'P/A')                               //
function createRow(date, PorA) {                       //
    var tr = tableDay.insertRow();
    tr.className += "rounded"
    createCell(date, tr);
    createCell(PorA, tr);
}
function createCell(forWhat, tr) {
    var td = tr.insertCell();
    var txt = document.createTextNode(forWhat)
    td.appendChild(txt);
    //txt.parentNode.removeChild(txt);
    td.style.border = '2px solid black';               //
    td.setAttribute('rowSpan', '1');                   //
    td.className += "text-center small";               //
}                                                      //

function findPresent(dataVal, dataKey) {
    keyword = 'Present'
    present_indexes = [];           ////Clear index records
    for (i = 0; i < dataVal.length; i++) {
        if (dataVal[i] == keyword) {
            present_indexes.push(dataKey[i]);
        } else {
            console.log('Absent ' + dataKey[i] + ' finding present.')
        }
    }
    // Deprecated
}


//function create_on_days(temp, templooper) {
//    // DEPRECATED
//    var p = document.createElement('p');
//    var linkText = document.createTextNode(temp)
//    p.appendChild(linkText);
//    p.setAttribute("id", "data_" + templooper)
//    document.getElementById(templooper).appendChild(p)
//}



function clickedUser(username) { //TODO match globalOnDayHolder and globalOffDayHolder
    query.once("value").then(function (snapshot) {
        snapshot.forEach(function (childsnapshot) {
            if (childsnapshot.val().name == username) {
                console.log(username)
                var attendance = childsnapshot.val().attendance['June']; // << month
                var keyLength = Object.keys(attendance).length;

                console.log('keylength - ' + keyLength)

                //var arr = [];
                //arr[0] = Object.keys(attendance)[0] + ' ' + Object.values(attendance)[0]
                //arr[1] = Object.keys(attendance)[1] + ' ' + Object.values(attendance)[1]
                //alert(arr[0] +  '\n' + arr[1])

                txt = "";               ////clear modal text;

                //var daysorter = [1, 2, 4, 3, 0]; //Monday ...

                for (i = 0; i < keyLength; i++) {
                    //txt += Object.keys(attendance)[daysorter[i]] + ' : ' + Object.values(attendance)[daysorter[i]] + ' <br /> ';
                    //arr[i] = Object.keys(attendance)[daysorter[i]] + ' : ' + Object.values(attendance)[daysorter[i]] + ' \n ';
                    txt += Object.keys(attendance)[i] + ' : ' + Object.values(attendance)[i] + ' <br /> ';


                }
                console.log(txt);       ////CHECK
                make_modal_show(txt, username);
            }
        })
    }).catch(function (e) {
        console.log(e);         ////CHECK
        modalmaker(e.message, username);
    })
}
*///////////////////////////////////////////////////////}
