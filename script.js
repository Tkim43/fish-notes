/* information about jsdocs:
* param: http://usejsdoc.org/tags-param.html#examples
* returns: http://usejsdoc.org/tags-returns.html
*
/**
 * Listen for the document to load and initialize the application
 */
$(document).ready(initializeApp);
 /**
 * Define all global variables here.
 */
/***********************
 * student_array - global array to hold student objects
 * @type {Array}
 * example of student_array after input:
 * student_array = [
 *  { name: 'Jake', course: 'Math', grade: 85 },
 *  { name: 'Jill', course: 'Comp Sci', grade: 85 }
 * ];
 */
var student_array = [];
var student =0;
 /***************************************************************************************************
 * initializeApp
 * @params {undefined} none
 * @returns: {undefined} none
 * initializes the application, including adding click handlers and pulling in any data from the server, in later versions
 */
function initializeApp(){
    addClickHandlersToElements();
    // activate load function on load?
    serverClick();
 }
 /***************************************************************************************************
 * addClickHandlerstoElements
 * @params {undefined}
 * @returns  {undefined}
 *
 */
function addClickHandlersToElements(){
    $('#add').click(handleAddClicked);
    $('#cancel').click(handleCancelClick);
    $('#server').click(handleServerClick);
    $('#server').click(serverClick);
}
 function handleServerClick(){
    serverClick();
    sendServer();
}
// we want to create a student to send to the server
// CREATE
// failure: function lets you know what type of error it is
function sendServer(names , courses, grades){
    var ajaxOption ={
        url: 'http://s-apis.learningfuze.com/sgt/create',
        success: sendServerInfo,
        dataType: 'json',
        method: 'POST',
        data: {api_key:'b9MruEd8S6', name: names, course: courses, grade: grades } // the thing you are sending to the server
    };
    function sendServerInfo(data){
       // console.log(data);
        updateStudentList(student_array);
        clearAddStudentFormInputs();
    }
    $.ajax(ajaxOption);
}
 // sending information to the server to get the whole object
// GET
function serverClick(){
    var ajaxOptions ={
        url: 'http://s-apis.learningfuze.com/sgt/get',
        success: getServerInfo,
        dataType: 'json',
        method: 'POST',
        data: {api_key:'b9MruEd8S6'} // the thing you are sending to the server
    };
    function getServerInfo(responseData){
        student_array = responseData.data;
        updateStudentList(student_array);
        clearAddStudentFormInputs();
    }
    console.log(student_array);
    $.ajax(ajaxOptions);
}
 /***************************************************************************************************
 * handleAddClicked - Event Handler when user clicks the add button
 * @param {object} event  The event object from the click
 * @return:
 none
 */
function handleAddClicked(){
    addStudent();
}
/************************************§§§§§***************************************************************
 * handleCancelClicked - Event Handler when user clicks the cancel button, should clear out student form
 * @param: {undefined} none
 * @returns: {undefined} none
 * @calls: clearAddStudentFormInputs
 */
function handleCancelClick(){
    clearAddStudentFormInputs();
}
/***************************************************************************************************
 * addStudent - creates a student objects based on input fields in the form and adds the object to global student array
 * @param {undefined} none
 * @return undefined
 * @calls clearAddStudentFormInputs, updateStudentList
 */
function addStudent(){
    // add values into an object in student_array
    debugger;
    console.log("added student");
    var name =  $('#studentName').val();
    console.log(name);
    var course = $('#course').val();
    console.log(course);
    var grade = $('#studentGrade').val();
    // if(!isNaN(grade)){
    //     student_array.push({name: name, course: course, grade: grade});
    //     updateStudentList(student_array);
    //     clearAddStudentFormInputs();
    // }
    // else{
    //     student_array.push({name: name, course: course, grade: "Error"});
    //     updateStudentList(student_array);
    //     clearAddStudentFormInputs();
    // }
    sendServer(name, course, grade);
    // adds the three elements into the array
 }
/***************************************************************************************************
 * clearAddStudentForm - clears out the form values based on inputIds variable
 */
function clearAddStudentFormInputs(){
    // when you type something in it clears the input area
    $('#studentName').val('');
    $('#course').val('');
    $('#studentGrade').val('');
}
/***************************************************************************************************
 * renderStudentOnDom - take in a student object, create html elements from the values and then append the elements
 * into the .student_list tbody
 * @param {object} studentObj a single student object with course, name, and grade inside
 */
function renderStudentOnDom(studentObj){
    // create tr with td's operation td has a delete button
    var studList = $('<tr>');
    $('tbody').append(studList);
    // sending td's
    var lineName = $('<td>').text(studentObj.name);
    studList.append(lineName);
    var lineCourse = $('<td>').text(studentObj.course);
    studList.append(lineCourse);
    var lineGrade = $('<td>').text(studentObj.grade);
    studList.append(lineGrade);
    var lineOpp = $('<td>').addClass('operations');
    studList.append(lineOpp);
    var button = $('<button>', {
        text: 'delete',
        'class': 'btn btn-danger btn-sm',
        on : {
            click: function(){
                 // removes any jquery element
                studList.remove();
                // student_array is inside and studentObj is a parameter you can replace
                // that one item with the object
                var id = studentObj.id;
                deleteFun(id);
                var index =student_array.indexOf(studentObj);
                student_array.splice(index, 1);
                if(student_array.length === 0 ){
                    renderGradeAverage(0);
                }
            }
        }
    });
    lineOpp.append(button);
}
 /***************************************************************************************************
 * updateStudentList - centralized function to update the average and call student list update
 * @param students {array} the array of student objects
 * @returns {undefined} none
 * @calls renderStudentOnDom, calculateGradeAverage, renderGradeAverage
 */
function updateStudentList(studentArray){
    // console.log("called update");
    // deleting before we loop through and update
    $('tbody').text('');
    for(var i = 0; i < student_array.length; i++){
        renderStudentOnDom(studentArray[i]);
    }
    calculateGradeAverage();
    renderGradeAverage();
}
/***************************************************************************************************
 * calculateGradeAverage - loop through the global student array and calculate average grade and return that value
 * @param: {array} students  the array of student objects
 * @returns {number}
 */
function calculateGradeAverage(){
    var total = 0;
    student = 0;
    for(var i =0; i < student_array.length; i++){
        total += parseInt(student_array[i].grade);
        student++;
    }
    var avg = total/student;
    avg = parseInt(avg);
    renderGradeAverage(avg);
}
/***************************************************************************************************
 * renderGradeAverage - updates the on-page grade average
 * @param: {number} average    the grade average
 * @returns {undefined} none
 */
function renderGradeAverage(average){
    $('.avgGrade').text(average);
}
 function deleteFun(id){
     var ajax ={
        url: 'http://s-apis.learningfuze.com/sgt/delete',
        success: deleteStuff,
        dataType: 'json',
        method: 'POST',
        data: {api_key:'b9MruEd8S6', student_id: id} // the thing you are sending to the server
    };
    function deleteStuff(datas){
        console.log(datas);
        // updateStudentList(student_array);
        // clearAddStudentFormInputs();
    }
    $.ajax(ajax);
} 